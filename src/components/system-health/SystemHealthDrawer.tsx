"use client";

import { useEffect } from "react";
import { DrawerSkeleton } from "@/components/shared/loading";
import { useDrawerLoading } from "@/hooks/useTabLoading";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  alertSeverityClass,
  getSystemErrors,
  getSystemRetries,
  healthScoreClass,
  systemStatusClass,
  type SystemHealthRecord,
} from "@/data/systemHealth";
import { cn } from "@/lib/cn";
import { InlineDependencyChain } from "./SystemHealthDependencyMap";

type SystemHealthDrawerProps = {
  system: SystemHealthRecord | null;
  isOwner: boolean;
  onClose: () => void;
  onAction: (action: string, system: SystemHealthRecord) => void;
};

export function SystemHealthDrawer({ system, isOwner, onClose, onAction }: SystemHealthDrawerProps) {
  const drawerLoading = useDrawerLoading(system);

  useEffect(() => {
    if (!system) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [system, onClose]);

  if (!system) return null;

  const errors = getSystemErrors(system.id);
  const retries = getSystemRetries(system.id);

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close system health" onClick={onClose} />
      <aside className="va-ops-drawer va-ops-drawer-wide system-health-drawer" role="dialog" aria-modal="true" aria-label={`System: ${system.name}`}>
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar system-health-drawer-icon" aria-hidden="true">
              <AppIcon name="refresh" size={18} strokeWidth={2} />
            </span>
            <div>
              <div className="va-ops-drawer-name">{system.name}</div>
              <div className="va-ops-drawer-role">{system.type} · {system.status}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          {drawerLoading ? (
            <DrawerSkeleton label="Loading system details" />
          ) : (
            <>
          <div className="system-health-drawer-badges">
            <span className={cn("badge", systemStatusClass[system.status])}>{system.status}</span>
            {system.syncPaused && <span className="badge badge-yellow">Sync Paused</span>}
            <span className={cn("badge", system.healthScore >= 90 ? "badge-green" : system.healthScore >= 70 ? "badge-yellow" : "badge-red")}>
              {system.healthScore}% Health
            </span>
          </div>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Service Summary</div>
            <dl className="va-ops-lead-details">
              <div><dt>Uptime</dt><dd>{system.uptimePercent}%</dd></div>
              <div><dt>Avg Latency</dt><dd>{system.avgLatency}</dd></div>
              <div><dt>Last Success</dt><dd>{system.lastSuccess}</dd></div>
              <div><dt>Last Failure</dt><dd>{system.lastFailure ?? "None"}</dd></div>
              <div><dt>Response Time</dt><dd>{system.responseTime}</dd></div>
              <div><dt>Error Count</dt><dd>{system.errorCount}</dd></div>
            </dl>
            <div className="system-health-score-bar-wrap">
              <div className="system-health-score-bar-head">
                <span>Health Score</span>
                <strong className={healthScoreClass(system.healthScore)}>{system.healthScore}%</strong>
              </div>
              <div className="system-health-score-bar" role="progressbar" aria-valuenow={system.healthScore} aria-valuemin={0} aria-valuemax={100}>
                <span className={cn("system-health-score-fill", healthScoreClass(system.healthScore))} style={{ width: `${system.healthScore}%` }} />
              </div>
            </div>
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Dependency Map</div>
            <InlineDependencyChain chain={system.dependencyChain} />
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Error Timeline</div>
            {errors.length === 0 ? (
              <p className="system-health-empty">No recent errors.</p>
            ) : (
              <ul className="system-health-timeline">
                {errors.map((entry) => (
                  <li key={entry.id} className={cn("system-health-timeline-item", entry.severity.toLowerCase())}>
                    <span className={cn("badge", alertSeverityClass[entry.severity])}>{entry.severity}</span>
                    <strong>{entry.message}</strong>
                    <span className="system-health-timeline-meta">{entry.timestamp} · {entry.module}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Retry History</div>
            {retries.length === 0 ? (
              <p className="system-health-empty">No retry attempts recorded.</p>
            ) : (
              <ul className="system-health-retry-list">
                {retries.map((retry) => (
                  <li key={retry.id}>
                    <span>{retry.timestamp}</span>
                    <span className={cn("badge", retry.result === "Success" ? "badge-green" : retry.result === "Failed" ? "badge-red" : "badge-yellow")}>
                      {retry.result}
                    </span>
                    <span>{retry.triggeredBy}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Connected Modules</div>
            <ul className="va-ops-drawer-list">
              {system.connectedModules.map((mod) => (
                <li key={mod}>{mod}</li>
              ))}
            </ul>
          </section>

          {isOwner && (
            <section className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Owner Actions</div>
              <div className="va-ops-drawer-quick-actions">
                <button type="button" className="va-ops-drawer-action-btn primary" onClick={() => onAction("Retry system", system)}>Retry system</button>
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Pause sync", system)}>
                  {system.syncPaused ? "Resume sync" : "Pause sync"}
                </button>
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Force full sync", system)}>Force full sync</button>
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Clear queue", system)}>Clear queue</button>
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("View audit logs", system)}>View audit logs</button>
                <button type="button" className="va-ops-drawer-action-btn send-center-action-danger" onClick={() => onAction("Escalate incident", system)}>Escalate incident</button>
              </div>
            </section>
          )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
