"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import {
  alertSeverityClass,
  applySummaryFilter,
  computeSystemSummaryCards,
  defaultSystemHealthFilters,
  globalDependencyEdges,
  globalDependencyNodes,
  healthScoreClass,
  loadSystemHealthOverrides,
  matchesLogFilters,
  matchesSystemSearch,
  mergeSystemRecords,
  saveSystemHealthOverrides,
  seedSystemErrors,
  seedSystemHealthAlerts,
  seedSystemHealthRecords,
  systemFilterOptions,
  systemStatusClass,
  dateRangeFilterOptions,
  failureTypeFilterOptions,
  moduleFilterOptions,
  severityFilterOptions,
  type SystemHealthFilters,
  type SystemHealthRecord,
  type SystemHealthSummaryFilter,
  type SystemHealthOverrides,
} from "@/data/systemHealth";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useAuditLog } from "@/components/audit-log/AuditLogProvider";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { formatTimeLabel } from "@/lib/formatting";
import { toastMessages } from "@/lib/toastMessages";
import { CardSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { SystemHealthDependencyMap } from "./SystemHealthDependencyMap";
import { SystemHealthDrawer } from "./SystemHealthDrawer";

function HealthScoreBar({ score }: { score: number }) {
  return (
    <div className="system-health-score-bar compact" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
      <span className={cn("system-health-score-fill", healthScoreClass(score))} style={{ width: `${score}%` }} />
      <span className="system-health-score-label">{score}%</span>
    </div>
  );
}

export function SystemHealthModule() {
  const searchParams = useSearchParams();
  const { can, requirePermission } = usePermissions();
  const { open: openAuditLog, canView: canViewAuditLog } = useAuditLog();
  const toast = useToast();
  const hasAccess = can("access:system-health");
  const canManage = can("action:retry-systems");
  const [systems, setSystems] = useState<SystemHealthRecord[]>(seedSystemHealthRecords);
  const [search, setSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [filters, setFilters] = useState<SystemHealthFilters>(defaultSystemHealthFilters);
  const [summaryFilter, setSummaryFilter] = useState<SystemHealthSummaryFilter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SystemHealthRecord | null>(null);
  const [lastRefresh, setLastRefresh] = useState(() => new Date());
  const [refreshTimeLabel, setRefreshTimeLabel] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useSyncBreadcrumbDetail(selected?.name ?? null, {
    paramKey: "system",
    paramValue: selected?.id,
    enabled: Boolean(selected),
  });

  useEffect(() => {
    const systemId = searchParams.get("system");
    if (!systemId || loading) return;
    const match = systems.find((s) => s.id === systemId);
    if (match) setSelected(match);
  }, [searchParams, systems, loading]);

  const refreshData = useCallback(() => {
    const overrides = loadSystemHealthOverrides();
    setSystems(mergeSystemRecords(seedSystemHealthRecords, overrides));
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    refreshData();
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [refreshData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = window.setInterval(refreshData, 30_000);
    return () => window.clearInterval(interval);
  }, [autoRefresh, refreshData]);

  useEffect(() => {
    setRefreshTimeLabel(formatTimeLabel(lastRefresh));
  }, [lastRefresh]);

  const persistSystem = useCallback((updated: SystemHealthRecord) => {
    setSystems((prev) => {
      const next = prev.map((s) => (s.id === updated.id ? updated : s));
      const overrides: SystemHealthOverrides = loadSystemHealthOverrides();
      overrides[updated.id] = {
        status: updated.status,
        syncPaused: updated.syncPaused,
        healthScore: updated.healthScore,
        errorCount: updated.errorCount,
      };
      saveSystemHealthOverrides(overrides);
      return next;
    });
    setSelected(updated);
  }, []);

  const filteredSystems = useMemo(() => {
    let rows = systems.filter((r) => matchesSystemSearch(r, search));
    if (summaryFilter && summaryFilter !== "activeAlerts" && summaryFilter !== "lastFullSync") {
      rows = applySummaryFilter(rows, summaryFilter);
    }
    return rows.sort((a, b) => a.healthScore - b.healthScore);
  }, [systems, search, summaryFilter]);

  const filteredLogs = useMemo(
    () => seedSystemErrors.filter((e) => matchesLogFilters(e, filters, logSearch)),
    [filters, logSearch],
  );

  const summaryCards = useMemo(() => computeSystemSummaryCards(systems, seedSystemHealthAlerts), [systems]);
  const criticalAlerts = seedSystemHealthAlerts.filter((a) => a.severity === "Critical" || a.severity === "High").length;

  const handleAction = useCallback(
    (action: string, system: SystemHealthRecord) => {
      switch (action) {
        case "View Logs":
          setSelected(system);
          return;
        case "Retry Sync":
        case "Retry system": {
          if (!canManage) return;
          const updated = {
            ...system,
            status: "Healthy" as const,
            healthScore: Math.min(99, system.healthScore + 15),
            errorCount: Math.max(0, system.errorCount - 1),
            lastSync: "Just now",
          };
          persistSystem(updated);
          toast.success(toastMessages.systemHealth.syncRetried);
          break;
        }
        case "Test Connection":
          toast.success(`Connection test passed: ${system.name} (${system.responseTime})`);
          break;
        case "View Dependencies":
          setSelected(system);
          return;
        case "Pause sync": {
          if (!canManage) return;
          const pausing = !system.syncPaused;
          persistSystem({ ...system, syncPaused: pausing });
          toast.success(pausing ? `Sync paused: ${system.name}` : `Sync resumed: ${system.name}`);
          break;
        }
        case "Force full sync":
          if (!canManage) return;
          persistSystem({ ...system, status: "Healthy", lastSync: "Just now", healthScore: Math.min(100, system.healthScore + 10) });
          toast.success(`Full sync started: ${system.name}`);
          break;
        case "Clear queue":
          if (!canManage) return;
          persistSystem({ ...system, errorCount: 0 });
          toast.success(toastMessages.systemHealth.queueCleared);
          break;
        case "View audit logs":
          if (canViewAuditLog) {
            openAuditLog();
            toast.success(`Audit log opened: ${system.name}`);
          }
          break;
        case "Escalate incident":
          if (!canManage) return;
          toast.error(`Incident escalated: ${system.name}`);
          break;
        default:
          toast.success(`${action}: ${system.name}`);
      }
    },
    [canManage, canViewAuditLog, openAuditLog, persistSystem, toast],
  );

  useShortcutAction(
    "retry-system-test",
    () => {
      const target = selected ?? systems[0];
      if (target) handleAction("Test Connection", target);
    },
    hasAccess,
  );

  const updateFilter = (key: keyof SystemHealthFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (!hasAccess) {
    return (
      <div className="system-health-view">
        <section className="va-ops-panel commercial-hub-empty-state" role="alert">
          <div className="commercial-hub-empty-state-title">Access Restricted</div>
          <p className="commercial-hub-empty-state-desc">System Health Center is available to Owner and Admin roles only.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="system-health-view">
      <header className="system-health-page-header">
        <div>
          <h1 className="system-health-title">System Health Center</h1>
          <p className="system-health-subtitle">Infrastructure monitoring for all connected systems and operational services.</p>
        </div>
        <div className="system-health-header-actions">
          {criticalAlerts > 0 && (
            <span className="badge badge-red system-health-alert-badge">{criticalAlerts} critical</span>
          )}
          <span className="system-health-refresh-label">
            Last refresh: {refreshTimeLabel ?? "-"}
          </span>
          <button
            type="button"
            className={cn("va-ops-action-btn", autoRefresh && "active")}
            onClick={() => setAutoRefresh((v) => !v)}
          >
            Auto-refresh {autoRefresh ? "ON" : "OFF"}
          </button>
          <button type="button" className="va-ops-action-btn" onClick={refreshData}>
            <AppIcon name="refresh" size={14} strokeWidth={2} />
            Refresh
          </button>
        </div>
      </header>

      <section className="system-health-summary-strip" aria-label="System health summary">
        {summaryCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={cn("system-health-summary-card", summaryFilter === card.filterKey && "active")}
            onClick={() => setSummaryFilter((prev) => (prev === card.filterKey ? null : card.filterKey))}
          >
            <span className="system-health-summary-value">{card.value}</span>
            <span className="system-health-summary-label">{card.label}</span>
          </button>
        ))}
      </section>

      <section className="system-health-alerts-section" aria-label="Live alerts">
        <div className="system-health-section-header">
          <h2 className="va-ops-section-title">Live Alerts</h2>
          <p className="va-ops-section-sub">Active infrastructure incidents requiring attention.</p>
        </div>
        <ul className="system-health-alerts-list">
          {seedSystemHealthAlerts.map((alert) => (
            <li key={alert.id} className={cn("system-health-alert-item", alert.severity.toLowerCase())}>
              <div className="system-health-alert-header">
                <span className={cn("badge", alertSeverityClass[alert.severity])}>{alert.severity}</span>
                <time>{alert.timestamp}</time>
              </div>
              <strong>{alert.title}</strong>
              <p>{alert.detail}</p>
              <button
                type="button"
                className="system-health-alert-link"
                onClick={() => {
                  const sys = systems.find((s) => s.id === alert.systemId);
                  if (sys) setSelected(sys);
                }}
              >
                View system
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="va-ops-panel system-health-dep-panel" aria-label="Global dependency map">
        <div className="va-ops-panel-header">
          <h2 className="va-ops-section-title">Dependency Map</h2>
          <p className="va-ops-section-sub">Cross-module service relationships: broken paths highlighted.</p>
        </div>
        {loading ? (
          <CardSkeletonGrid count={4} label="Loading dependency map" />
        ) : (
        <SystemHealthDependencyMap nodes={globalDependencyNodes} edges={globalDependencyEdges} />
        )}
      </section>

      <section className="va-ops-panel" aria-label="System status">
        <div className="system-health-toolbar system-health-sticky-filters">
          <div className="send-center-search-wrap">
            <AppIcon name="search" size={16} strokeWidth={2} />
            <input
              type="search"
              placeholder="Search systems…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search systems"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} label="Loading system health" />
        ) : filteredSystems.length === 0 ? (
          <div className="commercial-hub-empty-state" role="status">
            <div className="commercial-hub-empty-state-title">No systems match</div>
            <p className="commercial-hub-empty-state-desc">Try adjusting your search or summary filters.</p>
          </div>
        ) : (
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table system-health-table">
              <thead>
                <tr>
                  <th>System Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Last Sync</th>
                  <th>Response Time</th>
                  <th>Error Count</th>
                  <th>Health Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSystems.map((row) => (
                  <tr key={row.id} className="commercial-hub-table-row-clickable" onClick={() => setSelected(row)}>
                    <td className="commercial-hub-client-cell">
                      <span className="system-health-name-cell">
                        {row.name}
                        {row.syncPaused && <span className="badge badge-yellow system-health-badge">Paused</span>}
                      </span>
                    </td>
                    <td>{row.type}</td>
                    <td><span className={cn("badge", systemStatusClass[row.status])}>{row.status}</span></td>
                    <td>{row.lastSync}</td>
                    <td>{row.responseTime}</td>
                    <td className={row.errorCount > 0 ? "system-health-error-count" : ""}>{row.errorCount}</td>
                    <td><HealthScoreBar score={row.healthScore} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="send-center-row-actions">
                        <button type="button" className="va-ops-action-btn" onClick={() => handleAction("View Logs", row)}>Logs</button>
                        <button type="button" className="va-ops-action-btn" onClick={() => handleAction("Retry Sync", row)}>Retry</button>
                        <button type="button" className="va-ops-action-btn" onClick={() => handleAction("Test Connection", row)}>Test</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="va-ops-panel" aria-label="System logs">
        <div className="va-ops-panel-header">
          <h2 className="va-ops-section-title">System Logs</h2>
          <p className="va-ops-section-sub">Searchable error and failure history across all services.</p>
        </div>
        <div className="system-health-toolbar system-health-sticky-filters">
          <div className="send-center-search-wrap">
            <AppIcon name="search" size={16} strokeWidth={2} />
            <input
              type="search"
              placeholder="Search logs…"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              aria-label="Search system logs"
            />
          </div>
          <div className="system-health-filter-row">
            {(
              [
                ["system", systemFilterOptions],
                ["severity", severityFilterOptions],
                ["dateRange", dateRangeFilterOptions],
                ["module", moduleFilterOptions],
                ["failureType", failureTypeFilterOptions],
              ] as const
            ).map(([key, options]) => (
              <select
                key={key}
                className="header-filter-select"
                value={filters[key]}
                onChange={(e) => updateFilter(key, e.target.value)}
                aria-label={`Filter by ${key}`}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ))}
          </div>
        </div>
        {filteredLogs.length === 0 ? (
          <div className="commercial-hub-empty-state" role="status">
            <div className="commercial-hub-empty-state-title">No log entries found</div>
            <p className="commercial-hub-empty-state-desc">Try adjusting your search or log filters.</p>
          </div>
        ) : (
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table system-health-log-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>System</th>
                  <th>Severity</th>
                  <th>Module</th>
                  <th>Failure Type</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((entry) => {
                  const sys = systems.find((s) => s.id === entry.systemId);
                  return (
                    <tr key={entry.id} className="commercial-hub-table-row-clickable" onClick={() => sys && setSelected(sys)}>
                      <td>{entry.timestamp}</td>
                      <td>{sys?.name ?? entry.systemId}</td>
                      <td><span className={cn("badge", alertSeverityClass[entry.severity])}>{entry.severity}</span></td>
                      <td>{entry.module}</td>
                      <td>{entry.failureType}</td>
                      <td className="system-health-log-message">{entry.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <SystemHealthDrawer
        system={selected}
        isOwner={canManage}
        onClose={() => setSelected(null)}
        onAction={handleAction}
      />
    </div>
  );
}
