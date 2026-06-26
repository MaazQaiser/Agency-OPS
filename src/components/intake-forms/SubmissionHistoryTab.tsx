"use client";

import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  defaultHistoryFilters,
  failedSubmissionQueue,
  historyFilterOptions,
  historySubmissions,
  matchesHistoryFilters,
  routingActivity,
  submissionHistoryHeader,
  submissionHistoryKpis,
  submissionHistorySearchPlaceholder,
  submissionTimeline,
  type HistoryFilterState,
  type HistorySubmission,
  type HistorySubmissionStatus,
  type ValidationStatus,
} from "@/data/submissionHistory";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { cn } from "@/lib/cn";
import { SubmissionHistoryDrawer } from "./SubmissionHistoryDrawer";

const statusClass: Record<HistorySubmissionStatus, string> = {
  "Pending Review": "badge-amber",
  Routed: "badge-teal",
  Processing: "badge-blue",
  Failed: "badge-rose",
  Draft: "badge-violet",
  Completed: "badge-green",
};

const validationClass: Record<ValidationStatus, string> = {
  Complete: "badge-green",
  "Missing Docs": "badge-yellow",
  Incomplete: "badge-red",
  "Duplicate Found": "badge-yellow",
};

const routingSystemClass = {
  Success: "badge-green",
  Failed: "badge-red",
  Pending: "badge-yellow",
} as const;

const filterAriaLabels: Record<keyof HistoryFilterState, string> = {
  formType: "Form Type",
  submittedBy: "Submitted By",
  status: "Status",
  dateRange: "Date Range",
  routingStatus: "Routing Status",
};

export function SubmissionHistoryTab() {
  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => historySubmissions,
    errorPreset: "supabase-timeout",
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultHistoryFilters);
  const [selectedSubmission, setSelectedSubmission] = useState<HistorySubmission | null>(null);

  const filteredRows = useMemo(
    () => historySubmissions.filter((row) => matchesHistoryFilters(row, search, filters)),
    [search, filters],
  );

  const status = resolveDisplayStatus(loadStatus, filteredRows, (d) => d.length === 0);

  const openSubmission = (submission: HistorySubmission) => {
    setSelectedSubmission(submission);
  };

  const openById = (id: string) => {
    const submission = historySubmissions.find((s) => s.id === id);
    if (submission) setSelectedSubmission(submission);
  };

  const updateFilter = (key: keyof HistoryFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view intake-submission-history">
          <KpiSkeletonGrid count={4} />
          <TableSkeleton rows={6} />
        </div>
      }
      empty={<HubEmptyState preset="generic-list" />}
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
    <div className="va-ops-role-view intake-submission-history">
      <RoleTabHeader
        title={submissionHistoryHeader.title}
        subtitle={submissionHistoryHeader.subtitle}
        quickActions={submissionHistoryHeader.quickActions}
      />

      <section className="submission-history-kpi-strip" aria-label="Submission history KPI summary">
        <div className="commercial-hub-kpi-grid hub-kpi-grid submission-history-kpi-grid">
          {submissionHistoryKpis.map((kpi) => (
            <VaOpsKpiCard key={kpi.label} {...kpi} className="commercial-hub-kpi-uniform" sparkline={false} />
          ))}
        </div>
      </section>

      <div className="submission-history-filters">
        <label className="va-ops-search submission-history-search" aria-label="Search submissions">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input
            type="search"
            className="va-ops-search-input"
            placeholder={submissionHistorySearchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {(Object.keys(historyFilterOptions) as (keyof HistoryFilterState)[]).map((key) => (
          <label key={key} className="submission-history-filter">
            <select
              className="header-filter-select submission-history-select"
              aria-label={filterAriaLabels[key]}
              value={filters[key]}
              onChange={(e) => updateFilter(key, e.target.value)}
            >
              {historyFilterOptions[key].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <section className="va-ops-panel intake-history-primary" aria-label="Submission history log">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Submission Log</h3>
          <p className="va-ops-section-sub">
            {filteredRows.length} record{filteredRows.length === 1 ? "" : "s"} — click a row to view details.
          </p>
        </div>
        <div className="commercial-hub-table-wrap submission-history-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table submission-history-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Submitted By</th>
                <th>Submitted At</th>
                <th>Validation</th>
                <th>Client Name</th>
                <th>Form Type</th>
                <th>Completion</th>
                <th>Routed To</th>
                <th>Last Update</th>
                <th>Next Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="submission-history-row"
                  tabIndex={0}
                  role="button"
                  onClick={() => openSubmission(row)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openSubmission(row);
                    }
                  }}
                >
                  <td>
                    <span className={cn("badge", statusClass[row.status])}>{row.status}</span>
                  </td>
                  <td>{row.submittedBy}</td>
                  <td>{row.submittedAt}</td>
                  <td>
                    <span className={cn("badge", validationClass[row.validationStatus])}>
                      {row.validationStatus}
                    </span>
                  </td>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.formType}</td>
                  <td>{row.completionTime}</td>
                  <td>{row.routedTo}</td>
                  <td>{row.lastUpdate}</td>
                  <td className="commercial-hub-next-action">{row.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="va-ops-panel intake-history-secondary" aria-label="Failed submission queue">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Failed Submission Queue</h3>
          <p className="va-ops-section-sub">Operational recovery for routing failures.</p>
        </div>
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Failed At</th>
                <th>Submitted By</th>
                <th>Client</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {failedSubmissionQueue.map((row) => (
                <tr key={row.id}>
                  <td>{row.issue}</td>
                  <td>{row.failedAt}</td>
                  <td>{row.submittedBy}</td>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>
                    <button
                      type="button"
                      className={cn("va-ops-action-btn", row.cta.includes("Retry") ? "primary" : undefined)}
                      onClick={() => openById(row.submissionId)}
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

      <section className="va-ops-panel intake-history-tertiary" aria-label="Routing activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Routing Activity</h3>
          <p className="va-ops-section-sub">System-by-system post-submit routing status.</p>
        </div>
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>AgencyZoom</th>
                <th>Slack</th>
                <th>Monday</th>
              </tr>
            </thead>
            <tbody>
              {routingActivity.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  {row.systems.map((sys) => (
                    <td key={sys.system}>
                      <span className={cn("badge", routingSystemClass[sys.status])}>
                        {sys.status}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="va-ops-panel intake-history-low" aria-label="Recent submission activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Recent Submission Activity</h3>
          <p className="va-ops-section-sub">Team activity on intake submissions.</p>
        </div>
        <ol className="outreach-activity-timeline intake-history-timeline">
          {submissionTimeline.map((item) => (
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

      <SubmissionHistoryDrawer
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
    </DataStateView>
  );
}
