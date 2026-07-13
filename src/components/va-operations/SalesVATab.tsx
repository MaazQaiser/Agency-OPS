"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  approvalQueue,
  bindQueue,
  decisionTimeline,
  highValuePipeline,
  producerPerformance,
  revenueForecast,
  salesKpis,
  salesVAHeader,
  type BindStatus,
  type SalesApproval,
} from "@/data/salesVA";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { PipelineHoverActions } from "@/components/motion/PipelineHoverActions";
import { cn } from "@/lib/cn";
import { ApprovalDrawer } from "./ApprovalDrawer";
import { RoleTabHeader } from "./RoleTabHeader";

const bindStatusClass: Record<BindStatus, string> = {
  approved: "badge-green",
  waiting: "badge-yellow",
};

const stageClass = {
  quoted: "badge-blue",
  negotiation: "badge-yellow",
  proposal: "badge-gray",
  bound: "badge-green",
} as const;

const decisionVariantClass = {
  approved: "va-ops-decision-approved",
  bound: "va-ops-decision-bound",
  rejected: "va-ops-decision-rejected",
  revision: "va-ops-decision-revision",
} as const;

export function SalesVATab({ embedded = false }: { embedded?: boolean } = {}) {
  const [selectedApproval, setSelectedApproval] = useState<SalesApproval | null>(null);

  return (
    <div className={cn("va-ops-role-view va-ops-sales", embedded && "embedded")}>
      {!embedded && (
        <div className="va-ops-sales-private-badge" aria-label="Private owner workspace">
          <AppIcon name="shield" size={14} strokeWidth={2.25} />
          <span>Eva Only · Private Decision Layer</span>
        </div>
      )}

      {!embedded && (
        <RoleTabHeader
          title={salesVAHeader.title}
          subtitle={salesVAHeader.subtitle}
          quickActions={salesVAHeader.quickActions}
        />
      )}

      {!embedded && (
        <section className="va-ops-kpi-strip" aria-label="Sales KPI summary">
          <div className="va-ops-kpi-grid">
            {salesKpis.map((kpi) => (
              <VaOpsKpiCard key={kpi.label} {...kpi} />
            ))}
          </div>
        </section>
      )}

      <div className="va-ops-content-grid">
        <section className="va-ops-panel va-ops-sales-approval-panel aos-card--action" aria-label="Approval queue">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Approval Queue</h3>
            <p className="va-ops-section-sub">
              Drafts and client-facing communications awaiting licensed review.
            </p>
          </div>
          <ul className="va-ops-approval-list">
            {approvalQueue.map((item) => (
              <li key={item.id} className="va-ops-approval-item">
                <button
                  type="button"
                  className="va-ops-approval-main va-ops-approval-clickable"
                  onClick={() => setSelectedApproval(item)}
                >
                  <div className="va-ops-approval-title">{item.title}</div>
                  <div className="va-ops-approval-meta">
                    <span>Prepared by: <strong>{item.preparedBy}</strong></span>
                    <span>Client: <strong>{item.client}</strong></span>
                    <span>Type: <strong>{item.typeLabel}</strong></span>
                    <span>Submitted: <strong>{item.submitted}</strong></span>
                  </div>
                </button>
                <button
                  type="button"
                  className="va-ops-action-btn"
                  onClick={() => setSelectedApproval(item)}
                >
                  {item.cta}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel va-ops-bind-panel" aria-label="Ready to bind">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Ready to Bind</h3>
            <p className="va-ops-section-sub">Final binding action on approved quotes.</p>
          </div>
          <ul className="va-ops-bind-list">
            {bindQueue.map((item) => (
              <li key={item.id} className="va-ops-bind-row">
                <div className="va-ops-bind-main">
                  <div className="va-ops-bind-client">{item.client}</div>
                  <div className="va-ops-bind-meta">
                    <span>Carrier: <strong>{item.carrier}</strong></span>
                    <span>Premium: <strong>{item.premium}</strong></span>
                    <span>Broker Fee: <strong>{item.brokerFee}</strong></span>
                  </div>
                </div>
                <div className="va-ops-bind-actions">
                  <span className={cn("badge", bindStatusClass[item.status])}>
                    {item.statusLabel}
                  </span>
                  <button
                    type="button"
                    className={cn(
                      "va-ops-action-btn",
                      item.status === "approved" && "va-ops-bind-cta",
                    )}
                  >
                    {item.cta}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel va-ops-producer-panel" aria-label="Producer performance">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Producer Performance</h3>
          <p className="va-ops-section-sub">Quick performance visibility for this folio.</p>
        </div>
        <div className="va-ops-producer-table-wrap">
          <table className="va-ops-producer-table">
            <thead>
              <tr>
                <th>Producer</th>
                <th>Quotes</th>
                <th>Binds</th>
                <th>Premium</th>
                <th>Close Rate</th>
              </tr>
            </thead>
            <tbody>
              {producerPerformance.map((row) => (
                <tr key={row.id}>
                  <td className="va-ops-producer-name">{row.name}</td>
                  <td>{row.quotes}</td>
                  <td>{row.binds}</td>
                  <td className="va-ops-producer-premium">{row.premium}</td>
                  <td className="va-ops-producer-rate">{row.closeRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="va-ops-panel va-ops-pipeline-panel" aria-label="High value pipeline">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">High Value Pipeline</h3>
          <p className="va-ops-section-sub">Largest premium opportunities in motion.</p>
        </div>
        <ul className="va-ops-pipeline-list">
          {highValuePipeline.map((item) => (
            <li key={item.id} className="va-ops-pipeline-row">
              <div className="va-ops-pipeline-main">
                <div className="va-ops-pipeline-client">{item.client}</div>
                <div className="va-ops-pipeline-meta">
                  <span>Coverage: <strong>{item.coverage}</strong></span>
                  <span>Est. Premium: <strong>{item.estimatedPremium}</strong></span>
                  <span>Assigned: <strong>{item.assigned}</strong></span>
                  <span>Next Step: <strong>{item.nextStep}</strong></span>
                </div>
              </div>
              <span className={cn("badge", stageClass[item.stage])}>{item.stageLabel}</span>
              <PipelineHoverActions />
            </li>
          ))}
        </ul>
      </section>

      <div className="va-ops-sales-bottom-grid">
        <section className="va-ops-panel va-ops-revenue-panel" aria-label="Revenue forecast">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Revenue Forecast</h3>
            <p className="va-ops-section-sub">Owner revenue planning snapshot.</p>
          </div>
          <dl className="va-ops-revenue-grid">
            <div>
              <dt>This Week</dt>
              <dd>{revenueForecast.thisWeek}</dd>
            </div>
            <div>
              <dt>This Month</dt>
              <dd>{revenueForecast.thisMonth}</dd>
            </div>
            <div>
              <dt>Pending Premium</dt>
              <dd>{revenueForecast.pendingPremium}</dd>
            </div>
            <div className="va-ops-revenue-highlight">
              <dt>Projected Commission</dt>
              <dd>{revenueForecast.projectedCommission}</dd>
            </div>
          </dl>
        </section>

        <section className="va-ops-panel va-ops-decisions-panel" aria-label="Recent decisions">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Recent Decisions</h3>
            <p className="va-ops-section-sub">Audit trail of owner actions.</p>
          </div>
          <ul className="va-ops-decision-timeline">
            {decisionTimeline.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "va-ops-decision-item",
                  item.variant && decisionVariantClass[item.variant],
                )}
              >
                <span className="va-ops-decision-dot" aria-hidden="true" />
                <div>
                  <div className="va-ops-decision-text">{item.text}</div>
                  <time className="va-ops-activity-time">{item.time}</time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ApprovalDrawer
        approval={selectedApproval}
        onClose={() => setSelectedApproval(null)}
      />
    </div>
  );
}
