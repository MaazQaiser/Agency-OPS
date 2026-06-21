"use client";

import { useState } from "react";
import {
  brokerFeeLedger,
  brokerFeeStatusClass,
  carrierReleaseStatusClass,
  carrierReleases,
  dailyReconciliation,
  depositStatusClass,
  findLedgerEntryById,
  ledgerStatusClass,
  ledgerTypeClass,
  pendingDeposits,
  trustActivity,
  trustLastUpdated,
  trustLedgerEntries,
  trustReferenceHeader,
  trustReferenceKpis,
  type CarrierRelease,
  type TrustLedgerEntry,
} from "@/data/trustReference";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { cn } from "@/lib/cn";
import { EPayAccordion } from "./EPayAccordion";
import { EPayConfirmModal } from "./EPayConfirmModal";
import { TrustLedgerDrawer } from "./TrustLedgerDrawer";

type TrustReferenceTabProps = {
  onToast?: (message: string, variant?: "success" | "error") => void;
};

export function TrustReferenceTab({ onToast }: TrustReferenceTabProps) {
  const loading = useTabLoading();
  const [selectedEntry, setSelectedEntry] = useState<TrustLedgerEntry | null>(null);
  const [releaseTarget, setReleaseTarget] = useState<CarrierRelease | null>(null);

  const openLedger = (ledgerId: string) => {
    const match = findLedgerEntryById(ledgerId);
    if (match) setSelectedEntry(match);
  };

  useSyncBreadcrumbDetail(selectedEntry?.referenceNumber ?? null, {
    paramKey: "trust",
    paramValue: selectedEntry?.id,
    enabled: Boolean(selectedEntry),
  });

  if (loading) {
    return (
      <div className="va-ops-role-view epay-trust-reference">
        <KpiSkeletonGrid count={3} />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view epay-trust-reference">
      <RoleTabHeader
        title={trustReferenceHeader.title}
        subtitle={trustReferenceHeader.subtitle}
        quickActions={trustReferenceHeader.quickActions}
      />

      <div className="epay-trust-updated">{trustLastUpdated}</div>

      <section className="va-ops-kpi-strip" aria-label="Trust account KPI summary">
        <div className="commercial-hub-kpi-grid epay-trust-kpi-grid">
          {trustReferenceKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <div className="epay-trust-main">
        <section className="va-ops-panel" aria-label="Trust ledger activity">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Trust Ledger Activity</h3>
            <p className="va-ops-section-sub">Main money movement log — click a row for transaction details.</p>
          </div>
          <div className="commercial-hub-table-wrap epay-trust-ledger-wrap">
            <table className="commercial-hub-table epay-trust-ledger-table">
              <thead>
                <tr><th>Date</th><th>Reference #</th><th>Client</th><th>Type</th><th>Amount</th><th>Status</th><th>Balance After</th></tr>
              </thead>
              <tbody>
                {trustLedgerEntries.map((row) => (
                  <tr
                    key={row.id}
                    className="epay-trust-ledger-row"
                    tabIndex={0}
                    role="button"
                    onClick={() => setSelectedEntry(row)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedEntry(row);
                      }
                    }}
                  >
                    <td>{row.date}</td>
                    <td className="epay-trust-ref-cell">{row.referenceNumber}</td>
                    <td className="commercial-hub-client-cell">{row.client}</td>
                    <td><span className={cn("badge", ledgerTypeClass[row.type])}>{row.type}</span></td>
                    <td className="commercial-hub-premium">{row.amount}</td>
                    <td><span className={cn("badge", ledgerStatusClass[row.status])}>{row.status}</span></td>
                    <td>{row.balanceAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel" aria-label="Pending deposits">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Pending Deposits</h3>
            <p className="va-ops-section-sub">Incoming money visibility.</p>
          </div>
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr><th>Client</th><th>Amount</th><th>Method</th><th>ETA</th><th>Status</th><th aria-label="Action" /></tr>
              </thead>
              <tbody>
                {pendingDeposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td className="commercial-hub-client-cell">{deposit.client}</td>
                    <td className="commercial-hub-premium">{deposit.amount}</td>
                    <td>{deposit.paymentMethod}</td>
                    <td>{deposit.eta}</td>
                    <td><span className={cn("badge", depositStatusClass[deposit.status])}>{deposit.status}</span></td>
                    <td>
                      <button type="button" className="va-ops-action-btn" onClick={() => openLedger(deposit.ledgerId)}>
                        {deposit.cta}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="va-ops-panel" aria-label="Carrier payments due">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Carrier Releases</h3>
          <p className="va-ops-section-sub">Outgoing carrier payment queue.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr><th>Client</th><th>Carrier</th><th>Amount</th><th>Due</th><th>Status</th><th aria-label="Action" /></tr>
            </thead>
            <tbody>
              {carrierReleases.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td className="commercial-hub-carrier-name">{row.carrier}</td>
                  <td className="commercial-hub-premium">{row.amount}</td>
                  <td>{row.due}</td>
                  <td><span className={cn("badge", carrierReleaseStatusClass[row.status])}>{row.status}</span></td>
                  <td>
                    <button
                      type="button"
                      className="va-ops-action-btn"
                      onClick={() => {
                        if (row.cta === "Release Funds") setReleaseTarget(row);
                        else if (row.ledgerId) openLedger(row.ledgerId);
                      }}
                    >
                      {row.cta}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <EPayAccordion title="Broker Fee Holds" subtitle="Separate compliance tracking — broker fees held apart from premiums." className="epay-broker-fee-accordion">
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr><th>Client</th><th>Broker Fee</th><th>Status</th><th>Collected</th></tr>
            </thead>
            <tbody>
              {brokerFeeLedger.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td className="epay-broker-fee-highlight">{row.brokerFee}</td>
                  <td><span className={cn("badge", brokerFeeStatusClass[row.status])}>{row.status}</span></td>
                  <td>{row.collected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EPayAccordion>

      <section className="va-ops-panel epay-reconciliation-detail" aria-label="Daily reconciliation detail">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Daily Reconciliation Detail</h3>
          <p className="va-ops-section-sub">Full audit breakdown for today.</p>
        </div>
        <dl className="epay-reconciliation-grid">
          <div><dt>Deposits Cleared</dt><dd className="epay-summary-positive">{dailyReconciliation.depositsCleared}</dd></div>
          <div><dt>Carrier Payments Sent</dt><dd>{dailyReconciliation.carrierPaymentsSent}</dd></div>
          <div><dt>Broker Fees Recorded</dt><dd>{dailyReconciliation.brokerFeesRecorded}</dd></div>
          <div><dt>Pending Adjustments</dt><dd className="epay-summary-warning">{dailyReconciliation.pendingAdjustments}</dd></div>
          <div><dt>Difference</dt><dd>{dailyReconciliation.difference}</dd></div>
          <div><dt>Status</dt><dd><span className="badge badge-green">{dailyReconciliation.status}</span></dd></div>
        </dl>
      </section>

      <section className="va-ops-panel" aria-label="Trust activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Trust Activity</h3>
          <p className="va-ops-section-sub">Financial audit trail.</p>
        </div>
        <ol className="outreach-activity-timeline">
          {trustActivity.map((item) => (
            <li key={item.id} className="outreach-activity-item">
              <div className="outreach-activity-dot" aria-hidden="true" />
              <div className="outreach-activity-content">
                <div className="outreach-activity-message">{item.message}</div>
                <div className="outreach-activity-time">{item.timeAgo}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <EPayConfirmModal
        open={Boolean(releaseTarget)}
        title="Release Funds"
        message={releaseTarget ? `Release ${releaseTarget.amount} to ${releaseTarget.carrier} for ${releaseTarget.client}? This action cannot be undone.` : ""}
        confirmLabel="Release Funds"
        variant="warning"
        onClose={() => setReleaseTarget(null)}
        onConfirm={() => onToast?.(`Funds released to ${releaseTarget?.carrier}`, "success")}
      />

      <TrustLedgerDrawer entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}
