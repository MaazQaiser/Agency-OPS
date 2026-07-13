"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { DataStateView, HubErrorState, SectionDegradedState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { SubmissionDrawer } from "./SubmissionDrawer";
import { ExportMenu } from "@/components/export/ExportMenu";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { EoRiskBadge } from "@/components/commercial/EoRiskBadge";
import {
  eoRiskFromHubSubmission,
  sortByEoExposure,
  type EoExposureSort,
} from "@/lib/eoRiskScore";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { executiveTabKpis } from "@/lib/commercialHubTabKpis";
import {
  CommercialHubIntelGrid,
  CommercialHubIntelPanel,
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";
import { buildMarketSpreadMatrix } from "@/lib/marketSpreadMatrix";
import { PipelineStageBar } from "./PipelineStageBar";

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
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => ({
      kpis: commercialHubKpis,
      submissions: activeSubmissions,
    }),
    errorPreset: "agencyzoom-unavailable",
  });

  const carrierState = useHubDataState({
    load: () => carrierPerformance,
    delayMs: 520,
    simulateError: true,
    errorPreset: "agencyzoom-unavailable",
  });

  const [selectedSubmission, setSelectedSubmission] = useState<HubSubmission | null>(null);

  const highExposureQueue = useMemo(
    () => sortByEoExposure(activeSubmissions, eoRiskFromHubSubmission, "highest").slice(0, 4),
    [],
  );

  const sortedActiveSubmissions = useMemo(
    () => sortByEoExposure(activeSubmissions, eoRiskFromHubSubmission, "highest"),
    [],
  );

  const marketSpreadRows = useMemo(
    () => buildMarketSpreadMatrix(activeSubmissions),
    [],
  );

  if (status === "loading") {
    return (
      <CommercialHubTabShell className="commercial-hub-executive">
        <KpiSkeletonGrid count={4} />
        <ChartSkeleton />
        <TableSkeleton rows={6} columns={5} />
      </CommercialHubTabShell>
    );
  }

  if (status === "error") {
    return (
      <CommercialHubTabShell className="commercial-hub-executive">
        <HubErrorState
          preset="agencyzoom-unavailable"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      </CommercialHubTabShell>
    );
  }

  const header = commercialHubTabHeaders.executive;

  const navigateToAlert = (tab: CommercialHubTabId) => {
    const href = tab === "executive" ? routes.commercialHub : `${routes.commercialHub}?view=${tab}`;
    router.push(href, { scroll: false });
  };

  return (
    <CommercialHubTabShell className="commercial-hub-executive">
      <CommercialHubTabHeader
        title={header.title}
        subtitle={header.subtitle}
        strategic
        utilities={
          <>
            <span className="commercial-hub-last-updated">
              {isStale ? "Stale data warning · " : ""}
              Updated 4 mins ago
            </span>
            <ExportMenu kind="commercial-pipeline" compact />
          </>
        }
      />

      <CommercialHubKpiStrip kpis={executiveTabKpis()} columns={6} />

      <CommercialHubWorkspace
        ariaLabel="Active submissions"
        title="Active Submissions"
        subtitle="Main working pipeline: click a row for full details."
        strategicTitle
      >
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Producer</th>
                <th>VA</th>
                <th>Days Open</th>
                <th>E&O Risk</th>
                <th>Client</th>
                <th>Coverage</th>
                <th>Markets Submitted</th>
                <th>Quotes Received</th>
                <th>Premium</th>
                <th>Next Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedActiveSubmissions.map((row) => {
                const risk = eoRiskFromHubSubmission(row);
                return (
                <tr key={row.id} className="commercial-hub-table-row-clickable">
                  <td>
                    <span className={cn("badge", submissionStatusClass[row.status])}>{row.status}</span>
                  </td>
                  <td><UserChip name={row.producer} /></td>
                  <td>{row.va}</td>
                  <td>{row.daysOpen}</td>
                  <td>
                    <EoRiskBadge score={risk} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="commercial-hub-client-link"
                      onClick={() => setSelectedSubmission(row)}
                    >
                      {row.client}
                    </button>
                  </td>
                  <td>{row.coverage}</td>
                  <td>{row.marketsSubmitted}</td>
                  <td>{row.quotesReceived}</td>
                  <td className="commercial-hub-premium">{row.premium}</td>
                  <td className="commercial-hub-next-action">{row.nextAction}</td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </CommercialHubWorkspace>

      <CommercialHubWorkspace
        ariaLabel="Market spread matrix"
        title="Market Spread Matrix"
        subtitle="Carrier response visibility across active submissions."
        strategicTitle
      >
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table commercial-hub-market-spread-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Markets Submitted</th>
                <th>Responses Received</th>
                <th>Waiting</th>
                <th>Declined</th>
                <th>Best Quote</th>
              </tr>
            </thead>
            <tbody>
              {marketSpreadRows.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.marketsSubmitted}</td>
                  <td>{row.responsesReceived}</td>
                  <td>
                    <span className={cn("badge", row.waiting > 0 ? "badge-yellow" : "badge-gray")}>
                      {row.waiting}
                    </span>
                  </td>
                  <td>
                    <span className={cn("badge", row.declined > 0 ? "badge-red" : "badge-gray")}>
                      {row.declined}
                    </span>
                  </td>
                  <td className="commercial-hub-premium">{row.bestQuote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CommercialHubWorkspace>

      <CommercialHubIntelGrid>
        <CommercialHubIntelPanel
          title="Operational Alerts"
          subtitle="Submissions requiring immediate attention."
          className="commercial-hub-intel-tall"
        >
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
        </CommercialHubIntelPanel>

        <CommercialHubIntelPanel
          title="High Exposure Queue"
          subtitle="E&O risk intelligence: highest exposure submissions first."
          className="commercial-hub-intel-tall"
        >
          <ul className="eo-high-exposure-list">
            {highExposureQueue.map((row) => {
              const risk = eoRiskFromHubSubmission(row);
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    className={cn("eo-high-exposure-card", `eo-high-exposure-card--${risk.level}`)}
                    onClick={() => setSelectedSubmission(row)}
                  >
                    <div className="eo-high-exposure-card-top">
                      <span className="eo-high-exposure-client">{row.client}</span>
                      <EoRiskBadge score={risk} compact className="eo-high-exposure-badge" />
                    </div>
                    <p className="eo-high-exposure-meta">
                      {row.coverage} · {row.daysOpen} days open · {row.producer}
                    </p>
                    <p className="eo-high-exposure-action">{row.nextAction}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </CommercialHubIntelPanel>

        <CommercialHubIntelPanel title="Pipeline Stage Breakdown" subtitle="Volume and premium by stage.">
          <PipelineStageBar />
        </CommercialHubIntelPanel>

        <CommercialHubIntelPanel
          title="Carrier Performance Snapshot"
          subtitle="Strongest carriers by response and bind wins."
          actions={<ExportMenu kind="carrier-performance" compact />}
          className="commercial-hub-intel-tall"
        >
          {carrierState.status === "error" ? (
            <SectionDegradedState
              preset="agencyzoom-unavailable"
              onRetry={carrierState.retry}
              retrying={carrierState.retrying}
            />
          ) : carrierState.status === "loading" ? (
            <TableSkeleton rows={4} columns={5} />
          ) : (
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
          )}
        </CommercialHubIntelPanel>

        <CommercialHubIntelPanel title="Recent Quote Activity" subtitle="Track carrier movement across the pipeline." className="commercial-hub-intel-tall">
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
        </CommercialHubIntelPanel>
      </CommercialHubIntelGrid>

      <CommercialHubTabFooter
        title="Follow-Ups Due"
        subtitle="Broker discipline and carrier chase queue."
      >
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Assigned VA</th>
                <th>Due Date</th>
                <th>Client</th>
                <th>Carrier</th>
              </tr>
            </thead>
            <tbody>
              {followUpQueue.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className={cn("badge", followUpStatusClass[row.status])}>{row.statusLabel}</span>
                  </td>
                  <td>{row.assignedVa}</td>
                  <td>{row.dueDate}</td>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.carrier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CommercialHubTabFooter>

      <SubmissionDrawer submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} />
    </CommercialHubTabShell>
  );
}
