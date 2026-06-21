"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { pendingStatusClass } from "@/data/epayPolicy";
import { epayStatusClass } from "@/data/epayStatus";
import {
  collectionActivity,
  collectionSummary,
  defaultPaymentTrackerFilters,
  failedTransactions,
  findPaymentById,
  formatRemaining,
  getRemainingBalance,
  matchesPaymentFilters,
  overdueInvoices,
  paymentRecords,
  paymentTrackerFilterOptions,
  paymentTrackerHeader,
  paymentTrackerKpis,
  paymentTrackerPlaceholder,
  trackerStatusClass,
  type PaymentRecord,
  type TrackerFilterState,
} from "@/data/paymentTracker";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { cn } from "@/lib/cn";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { getClientLanguage } from "@/data/bilingualClient";
import { PaymentDrawer } from "./PaymentDrawer";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";

const filterLabels: Record<keyof TrackerFilterState, string> = {
  status: "Payment Status",
  dueDate: "Due Date",
  producer: "Producer",
  carrier: "Carrier",
  paymentMethod: "Payment Method",
};

const queueTypeClass = {
  Overdue: epayStatusClass.Overdue,
  "Needs follow-up": epayStatusClass.Pending,
  "High priority": epayStatusClass.Failed,
} as const;

type PaymentTrackerTabProps = {
  onToast?: (message: string, variant?: "success" | "error") => void;
  initialPaymentId?: string | null;
};

export function PaymentTrackerTab({ onToast, initialPaymentId }: PaymentTrackerTabProps) {
  const loading = useTabLoading();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultPaymentTrackerFilters);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRows = useMemo(
    () => paymentRecords.filter((row) => matchesPaymentFilters(row, search, filters)),
    [search, filters],
  );

  const updateFilter = (key: keyof TrackerFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openPayment = (paymentId: string) => {
    const match = findPaymentById(paymentId);
    if (match) setSelectedPayment(match);
  };

  useEffect(() => {
    if (initialPaymentId) openPayment(initialPaymentId);
  }, [initialPaymentId]);

  useSyncBreadcrumbDetail(selectedPayment?.invoiceNumber ?? null, {
    paramKey: "payment",
    paramValue: selectedPayment?.id,
    enabled: Boolean(selectedPayment),
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAction = (action: string, row: PaymentRecord, event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (action === "View Invoice") {
      setSelectedPayment(row);
      return;
    }
    if (action === "Retry Payment") {
      onToast?.(`Retry initiated for ${row.clientName}`, "success");
      return;
    }
    if (action === "Contact Client") {
      onToast?.(`Contact logged for ${row.clientName}`, "success");
      return;
    }
    if (action === "Send Reminder") {
      onToast?.(`Reminder sent to ${row.clientName}`, "success");
    }
  };

  if (loading) {
    return (
      <div className="va-ops-role-view epay-payment-tracker">
        <KpiSkeletonGrid count={4} />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view epay-payment-tracker">
      <RoleTabHeader title={paymentTrackerHeader.title} subtitle={paymentTrackerHeader.subtitle} quickActions={paymentTrackerHeader.quickActions} />

      <section className="va-ops-kpi-strip" aria-label="Payment tracker KPI summary">
        <div className="commercial-hub-kpi-grid epay-tracker-kpi-grid">
          {paymentTrackerKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <div className="epay-tracker-filters">
        <label className="va-ops-search epay-tracker-search" aria-label="Search payments">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input type="search" className="va-ops-search-input" placeholder={paymentTrackerPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <div className="epay-tracker-filter-row">
          {(Object.keys(paymentTrackerFilterOptions) as (keyof TrackerFilterState)[]).map((key) => (
            <label key={key} className="epay-tracker-filter">
              <span className="epay-tracker-filter-label">{filterLabels[key]}</span>
              <select className="header-filter-select epay-tracker-select" value={filters[key]} onChange={(e) => updateFilter(key, e.target.value)}>
                {paymentTrackerFilterOptions[key].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      <section className="va-ops-panel" aria-label="Payment records">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">All Payments</h3>
          <p className="va-ops-section-sub">
            {filteredRows.length} result{filteredRows.length === 1 ? "" : "s"} — expand a row for policy, carrier, and payment history.
          </p>
        </div>
        <div className="commercial-hub-table-wrap epay-tracker-table-wrap">
          <table className="commercial-hub-table epay-tracker-table">
            <thead>
              <tr>
                <th aria-label="Expand" />
                <th>Client Name</th>
                <th>Invoice Number</th>
                <th>Remaining Balance</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Next Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const expanded = expandedId === row.id;
                return (
                  <Fragment key={row.id}>
                    <tr
                      key={row.id}
                      className="epay-tracker-row"
                      tabIndex={0}
                      role="button"
                      onClick={() => toggleExpand(row.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleExpand(row.id);
                        }
                      }}
                    >
                      <td>
                        <AppIcon name="chevron-down" size={16} strokeWidth={2} className={cn("epay-row-expand-icon", expanded && "open")} />
                      </td>
                      <td className="commercial-hub-client-cell">
                        <span className="bilingual-client-cell">
                          {row.clientName}
                          <ClientLanguageBadges profile={getClientLanguage(row.clientName)} compact />
                        </span>
                      </td>
                      <td>{row.invoiceNumber}</td>
                      <td className={getRemainingBalance(row) > 0 ? "epay-balance-due" : ""}>{formatRemaining(row)}</td>
                      <td>{row.dueDate}</td>
                      <td><span className={cn("badge", trackerStatusClass[row.status])}>{row.status}</span></td>
                      <td>
                        <button type="button" className="va-ops-action-btn" onClick={(e) => handleAction(row.nextAction, row, e)}>
                          {row.nextAction}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr key={`${row.id}-detail`} className="epay-tracker-expand-row">
                        <td colSpan={7}>
                          <dl className="epay-tracker-expand-grid">
                            <div><dt>Policy Type</dt><dd>{row.policyType}</dd></div>
                            <div><dt>Producer</dt><dd><UserChip name={row.producer} /></dd></div>
                            <div><dt>Carrier</dt><dd>{row.carrier}</dd></div>
                            <div><dt>Payment Method</dt><dd>{row.paymentMethod}</dd></div>
                            <div><dt>Last Activity</dt><dd>{row.lastActivity}</dd></div>
                            <div className="epay-tracker-expand-full">
                              <dt>Payment History</dt>
                              <dd>
                                <ul className="epay-expand-history">
                                  {row.drawer.paymentHistory.map((item) => (
                                    <li key={item.id}>{item.action} — {item.date}{item.amount ? ` (${item.amount})` : ""}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>
                          </dl>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="epay-tracker-mid-grid">
        <section className="va-ops-panel" aria-label="Overdue invoices">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Overdue Invoices</h3>
            <p className="va-ops-section-sub">Action queue — overdue, follow-up, and high priority only.</p>
          </div>
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr><th>Client</th><th>Amount</th><th>Due</th><th>Queue</th><th aria-label="Action" /></tr>
              </thead>
              <tbody>
                {overdueInvoices.map((row) => (
                  <tr key={row.id} className="epay-tracker-row" tabIndex={0} role="button" onClick={() => openPayment(row.paymentId)}>
                    <td className="commercial-hub-client-cell">
                        <span className="bilingual-client-cell">
                          {row.clientName}
                          <ClientLanguageBadges profile={getClientLanguage(row.clientName)} compact />
                        </span>
                      </td>
                    <td className="commercial-hub-premium">{row.amount}</td>
                    <td>{row.due}</td>
                    <td><span className={cn("badge", queueTypeClass[row.queueType])}>{row.queueType}</span></td>
                    <td>
                      <button type="button" className="va-ops-action-btn" onClick={(e) => { e.stopPropagation(); onToast?.(`${row.cta} for ${row.clientName}`, "success"); }}>
                        {row.cta}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel" aria-label="Failed transactions">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Failed Transactions</h3>
            <p className="va-ops-section-sub">Recovery queue — retry or contact client.</p>
          </div>
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr><th>Client</th><th>Reason</th><th>Amount</th><th>Time</th><th aria-label="Action" /></tr>
              </thead>
              <tbody>
                {failedTransactions.map((row) => (
                  <tr key={row.id} className="epay-tracker-row" tabIndex={0} role="button" onClick={() => openPayment(row.paymentId)}>
                    <td className="commercial-hub-client-cell">
                        <span className="bilingual-client-cell">
                          {row.clientName}
                          <ClientLanguageBadges profile={getClientLanguage(row.clientName)} compact />
                        </span>
                      </td>
                    <td className="epay-failed-reason">{row.reason}</td>
                    <td className="commercial-hub-premium">{row.amount}</td>
                    <td>{row.time}</td>
                    <td>
                      <button
                        type="button"
                        className="va-ops-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (row.cta === "Retry Payment") onToast?.(`Retry initiated for ${row.clientName}`, "success");
                          else onToast?.(`Contact logged for ${row.clientName}`, "success");
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
      </div>

      <div className="epay-tracker-bottom-grid">
        <section className="va-ops-panel" aria-label="Recent payment activity">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Recent Payment Activity</h3>
            <p className="va-ops-section-sub">Live financial visibility.</p>
          </div>
          <ol className="outreach-activity-timeline">
            {collectionActivity.map((item) => (
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

        <section className="va-ops-panel epay-collection-summary-panel" aria-label="Collection summary">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Collection Summary</h3>
            <p className="va-ops-section-sub">Revenue tracking overview.</p>
          </div>
          <dl className="epay-collection-summary-grid">
            <div><dt>Collected Today</dt><dd className="epay-summary-positive">{collectionSummary.collectedToday}</dd></div>
            <div><dt>Collected This Week</dt><dd className="epay-summary-positive">{collectionSummary.collectedThisWeek}</dd></div>
            <div><dt>Pending Collection</dt><dd>{collectionSummary.pendingCollection}</dd></div>
            <div><dt>Overdue Amount</dt><dd className="epay-summary-warning">{collectionSummary.overdueAmount}</dd></div>
            <div className="epay-collection-summary-full"><dt>Failed Amount</dt><dd className="epay-summary-danger">{collectionSummary.failedAmount}</dd></div>
          </dl>
        </section>
      </div>

      <PaymentDrawer payment={selectedPayment} onClose={() => setSelectedPayment(null)} onToast={onToast} />
    </div>
  );
}
