"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  activeSubmissions,
  carrierPerformance,
  commercialHubKpis,
  followUpQueue,
  operationalAlerts,
  pipelineStages,
  quoteActivity,
  type CommercialHubTabId,
  type HubSubmission,
  type HubSubmissionStatus,
} from "@/data/commercialHub";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { ChartSkeleton, KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { SubmissionDrawer } from "./SubmissionDrawer";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";

const submissionStatusClass: Record<HubSubmissionStatus, string> = {
  Quoted: "badge-green",
  Pending: "badge-yellow",
  Overdue: "badge-red",
  Negotiation: "badge-blue",
  "Ready to Bind": "badge-green",
};

const alertVariantClass = {
  red: "commercial-hub-alert-red",
  yellow: "commercial-hub-alert-yellow",
  blue: "commercial-hub-alert-blue",
} as const;

const followUpStatusClass = {
  "due-today": "badge-red",
  "due-tomorrow": "badge-yellow",
  overdue: "badge-red",
} as const;

const quoteVariantClass = {
  success: "va-ops-exec-success",
  declined: "va-ops-exec-failed",
  quoted: "va-ops-exec-triggered",
} as const;

export function ExecutiveDashboardTab() {
  const router = useRouter();
  const loading = useTabLoading();
  const [selectedSubmission, setSelectedSubmission] = useState<HubSubmission | null>(null);

  if (loading) {
    return (
      <div className="va-ops-role-view commercial-hub-executive">
        <KpiSkeletonGrid count={4} />
        <ChartSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  const navigateToAlert = (tab: CommercialHubTabId) => {
    const href = tab === "executive" ? routes.commercialHub : `${routes.commercialHub}?view=${tab}`;
    router.push(href, { scroll: false });
  };

  return (
    <div className="va-ops-role-view commercial-hub-executive">
      <div className="commercial-hub-dashboard-meta">
        <span className="commercial-hub-last-updated">Last updated 4 mins ago</span>
      </div>

      <section className="va-ops-kpi-strip" aria-label="Commercial hub KPI summary">
        <div className="commercial-hub-kpi-grid">
          {commercialHubKpis.map((kpi) => (
            <article
              key={kpi.label}
              className={cn("va-ops-kpi-card", kpi.color, `commercial-hub-kpi-${kpi.tier}`)}
            >
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <div className="commercial-hub-top-grid">
        <section className="va-ops-panel commercial-hub-funnel-panel" aria-label="Pipeline stage breakdown">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Pipeline Stage Breakdown</h3>
            <p className="va-ops-section-sub">Horizontal view of pipeline volume and premium by stage.</p>
          </div>
          <div className="commercial-hub-pipeline-horizontal">
            {pipelineStages.map((stage, index) => (
              <div key={stage.id} className="commercial-hub-pipeline-stage-h">
                <div className="commercial-hub-pipeline-stage-h-name">{stage.name}</div>
                <div className="commercial-hub-pipeline-stage-h-count">{stage.count}</div>
                <div className="commercial-hub-pipeline-stage-h-premium">{stage.premium}</div>
                {index < pipelineStages.length - 1 && (
                  <div className="commercial-hub-pipeline-stage-h-arrow" aria-hidden="true">→</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="commercial-hub-alerts-panel" aria-label="Operational alerts">
          <div className="commercial-hub-alerts-header">
            <h3 className="va-ops-section-title">Operational Alerts</h3>
            <p className="va-ops-section-sub">Submissions requiring immediate attention.</p>
          </div>
          <ul className="commercial-hub-alerts-list">
            {operationalAlerts.map((alert) => (
              <li key={alert.id}>
                <button
                  type="button"
                  className={cn(
                    "commercial-hub-alert-row commercial-hub-alert-btn",
                    alertVariantClass[alert.variant],
                  )}
                  onClick={() => navigateToAlert(alert.linkTab)}
                >
                  <div className="commercial-hub-alert-client">{alert.client}</div>
                  <div className="commercial-hub-alert-message">{alert.message}</div>
                  <span className="commercial-hub-alert-link-hint">Open →</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel commercial-hub-submissions-panel" aria-label="Active submissions">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Active Submissions</h3>
          <p className="va-ops-section-sub">Main working pipeline — click a row for full details.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Producer</th>
                <th>VA</th>
                <th>Coverage</th>
                <th>Markets Submitted</th>
                <th>Quotes Received</th>
                <th>Premium</th>
                <th>Days Open</th>
                <th>Status</th>
                <th>Next Action</th>
              </tr>
            </thead>
            <tbody>
              {activeSubmissions.map((row) => (
                <tr key={row.id} className="commercial-hub-table-row-clickable">
                  <td>
                    <button
                      type="button"
                      className="commercial-hub-client-link"
                      onClick={() => setSelectedSubmission(row)}
                    >
                      {row.client}
                    </button>
                  </td>
                  <td><UserChip name={row.producer} /></td>
                  <td>{row.va}</td>
                  <td>{row.coverage}</td>
                  <td>{row.marketsSubmitted}</td>
                  <td>{row.quotesReceived}</td>
                  <td className="commercial-hub-premium">{row.premium}</td>
                  <td>{row.daysOpen}</td>
                  <td>
                    <span className={cn("badge", submissionStatusClass[row.status])}>{row.status}</span>
                  </td>
                  <td className="commercial-hub-next-action">{row.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="commercial-hub-mid-grid">
        <section className="commercial-hub-carrier-panel" aria-label="Carrier performance snapshot">
          <div className="commercial-hub-mid-panel-header">
            <h3 className="va-ops-section-title">Carrier Performance Snapshot</h3>
            <p className="va-ops-section-sub">Strongest carriers by response and bind wins.</p>
          </div>
          <table className="commercial-hub-table commercial-hub-carrier-table">
            <thead>
              <tr>
                <th>Carrier</th>
                <th>Submissions</th>
                <th>Quotes Returned</th>
                <th>Avg Response Time</th>
                <th>Bind Wins</th>
              </tr>
            </thead>
            <tbody>
              {carrierPerformance.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-carrier-name">{row.carrier}</td>
                  <td>{row.submissions}</td>
                  <td>{row.quotesReturned}</td>
                  <td>{row.avgResponseTime}</td>
                  <td className="commercial-hub-bind-wins">{row.bindWins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="commercial-hub-quote-activity-panel" aria-label="Recent quote activity">
          <div className="commercial-hub-mid-panel-header">
            <h3 className="va-ops-section-title">Recent Quote Activity</h3>
            <p className="va-ops-section-sub">Track carrier movement across the pipeline.</p>
          </div>
          <ul className="va-ops-exec-history">
            {quoteActivity.map((item) => (
              <li
                key={item.id}
                className={cn("va-ops-exec-history-item", item.variant && quoteVariantClass[item.variant])}
              >
                <span className="va-ops-exec-dot" aria-hidden="true" />
                <div>
                  <div className="va-ops-exec-text">{item.text}</div>
                  <time className="va-ops-activity-time">{item.time}</time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel commercial-hub-follow-ups-panel" aria-label="Follow-ups due">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Follow-Ups Due</h3>
          <p className="va-ops-section-sub">Broker discipline and carrier chase queue.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Carrier</th>
                <th>Due Date</th>
                <th>Assigned VA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {followUpQueue.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.carrier}</td>
                  <td>{row.dueDate}</td>
                  <td>{row.assignedVa}</td>
                  <td>
                    <span className={cn("badge", followUpStatusClass[row.status])}>{row.statusLabel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SubmissionDrawer submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} />
    </div>
  );
}
