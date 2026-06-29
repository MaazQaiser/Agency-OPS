"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { VaOpsDrawerRoot } from "@/components/ui/VaOpsDrawerRoot";
import {
  folioDrawerApprovals,
  folioDrawerBinds,
  folioDrawerBlockedDocs,
  folioDrawerRiskAccounts,
  folioDrawerTeamLoad,
} from "@/data/folioOperationalData";
import type { FolioProgressMetrics } from "@/lib/folioProgress";
import { cn } from "@/lib/cn";

type FolioDrawerProps = {
  metrics: FolioProgressMetrics;
  open: boolean;
  onClose: () => void;
};

export function FolioDrawer({ metrics, open, onClose }: FolioDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <VaOpsDrawerRoot>
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close folio drawer" onClick={onClose} />
      <aside className="va-ops-drawer folio-drawer" role="dialog" aria-modal="true" aria-label="Folio leadership view">
        <div className="va-ops-drawer-header">
          <div>
            <div className="va-ops-drawer-name">Folio {metrics.folioNumber} Leadership View</div>
            <div className="va-ops-drawer-role">{metrics.dateRangeLabel} · {metrics.daysRemainingLabel}</div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="va-ops-drawer-body folio-drawer-body">
          <section className="folio-drawer-section">
            <h3 className="folio-drawer-section-title">Revenue Progress</h3>
            <dl className="folio-drawer-metrics">
              <div><dt>Written</dt><dd>{metrics.writtenLabel}</dd></div>
              <div><dt>Remaining</dt><dd>{metrics.remainingLabel}</dd></div>
              <div><dt>Pace</dt><dd>{Math.round(metrics.performancePacePct)}%</dd></div>
              <div><dt>Target</dt><dd>{metrics.targetLabel}</dd></div>
            </dl>
          </section>

          <section className="folio-drawer-section">
            <h3 className="folio-drawer-section-title">Pending Approvals</h3>
            <p className="folio-drawer-count">{folioDrawerApprovals.length} awaiting producer sign-off</p>
            <ul className="folio-drawer-list">
              {folioDrawerApprovals.map((item) => (
                <li key={item.id}>
                  <strong>{item.client}</strong> · {item.owner} · {item.overdueDays}d overdue
                </li>
              ))}
            </ul>
          </section>

          <section className="folio-drawer-section">
            <h3 className="folio-drawer-section-title">Pending Binds</h3>
            <p className="folio-drawer-count">
              {folioDrawerBinds.length} policies ·{" "}
              {folioDrawerBinds.reduce((sum, b) => sum + b.premium, 0).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}{" "}
              premium
            </p>
            <ul className="folio-drawer-list">
              {folioDrawerBinds.map((item) => (
                <li key={item.id}>
                  <strong>{item.client}</strong> · {item.carrier} ·{" "}
                  {item.premium.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                </li>
              ))}
            </ul>
          </section>

          <section className="folio-drawer-section">
            <h3 className="folio-drawer-section-title">Missing Docs</h3>
            <p className="folio-drawer-count">{folioDrawerBlockedDocs.length} accounts blocked</p>
            <ul className="folio-drawer-list">
              {folioDrawerBlockedDocs.map((item) => (
                <li key={item.id}>
                  <strong>{item.client}</strong> — {item.missing}
                </li>
              ))}
            </ul>
          </section>

          <section className="folio-drawer-section">
            <h3 className="folio-drawer-section-title">High Risk Accounts</h3>
            <ul className="folio-drawer-list">
              {folioDrawerRiskAccounts.map((item) => (
                <li key={item.id}>
                  <strong>{item.client}</strong> · E&O {item.exposure} · {item.issue}
                </li>
              ))}
            </ul>
          </section>

          <section className="folio-drawer-section">
            <h3 className="folio-drawer-section-title">Team Load</h3>
            <ul className="folio-drawer-team">
              {folioDrawerTeamLoad.map((member) => (
                <li key={member.id} className={cn("folio-drawer-team-row", `folio-drawer-team-row--${member.status}`)}>
                  <span>{member.name}</span>
                  <span>{member.load}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </VaOpsDrawerRoot>
  );
}
