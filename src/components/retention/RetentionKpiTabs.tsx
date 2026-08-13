"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { KpiCard, KpiGrid } from "@/components/ui/KpiCard";
import { ExportMenu } from "@/components/export/ExportMenu";
import { ChartSkeleton, KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubErrorState } from "@/components/state";
import { RetentionComparisonChart } from "@/components/retention/RetentionComparisonChart";
import { RetentionDepartmentPanel } from "@/components/retention/RetentionDepartmentPanel";
import { RetentionHealthCard } from "@/components/retention/RetentionHealthCard";
import { useRetentionLocale } from "@/components/retention/RetentionLanguageProvider";
import { useHubDataState } from "@/hooks/useHubDataState";
import { findPercentKpi } from "@/lib/retentionScorecardView";
import { retentionHeader } from "@/data/retentionScorecard";
import type { RetentionKpi } from "@/types";

function supportingKpis(kpis: RetentionKpi[]): RetentionKpi[] {
  const primary = findPercentKpi(kpis);
  return kpis.filter((kpi) => kpi !== primary);
}

export function RetentionKpiTabs() {
  const { copy } = useRetentionLocale();
  const [activeTab, setActiveTab] = useState("valerie");
  const { status, retry, lastSyncedAt, isStale, retrying } = useHubDataState({
    load: () => true,
    isEmpty: () => false,
    deps: [copy.locale],
  });

  const activeKpis = activeTab === "tracie" ? copy.tracieKpis : copy.valerieKpis;
  const footnote = activeTab === "tracie" ? copy.tracieFootnote : copy.valerieFootnote;
  const combinedRetention = copy.combinedTable.rows[0];
  const primaryKpi =
    activeTab === "combined"
      ? {
          label: combinedRetention?.kpi ?? copy.valerieKpis[0]?.label ?? "Retention %",
          value: combinedRetention?.combined ?? "",
          sub: combinedRetention?.goal ?? "",
          color: undefined as string | undefined,
        }
      : findPercentKpi(activeKpis) ?? activeKpis[0];

  const comparisonPoints = useMemo(
    () => [
      {
        id: "valerie",
        label: copy.tabs[0]?.label ?? "Valerie",
        value: findPercentKpi(copy.valerieKpis)?.value ?? copy.valerieKpis[0]?.value ?? "",
        color: findPercentKpi(copy.valerieKpis)?.color ?? copy.valerieKpis[0]?.color,
      },
      {
        id: "tracie",
        label: copy.tabs[1]?.label ?? "Tracie",
        value: findPercentKpi(copy.tracieKpis)?.value ?? copy.tracieKpis[0]?.value ?? "",
        color: findPercentKpi(copy.tracieKpis)?.color ?? copy.tracieKpis[0]?.color,
      },
      {
        id: "combined",
        label: copy.tabs[2]?.label ?? "Combined",
        value: combinedRetention?.combined ?? "",
      },
    ],
    [copy, combinedRetention],
  );

  const departmentRows = useMemo(
    () => [
      {
        id: "valerie",
        name: copy.tabs[0]?.label ?? "Valerie",
        retention: copy.valerieKpis[0]?.value ?? "",
        color: copy.valerieKpis[0]?.color,
        goal: copy.valerieKpis[0]?.sub ?? "",
        pif: copy.valerieKpis[1]?.value ?? "",
        saves: copy.valerieKpis[2]?.value ?? "",
        signal: copy.valerieKpis[2]?.sub ?? "",
      },
      {
        id: "tracie",
        name: copy.tabs[1]?.label ?? "Tracie",
        retention: copy.tracieKpis[0]?.value ?? "",
        color: copy.tracieKpis[0]?.color,
        goal: copy.tracieKpis[0]?.sub ?? "",
        pif: copy.tracieKpis[1]?.value ?? "",
        saves: copy.tracieKpis[2]?.value ?? "",
        signal: copy.tracieKpis[2]?.sub ?? "",
      },
    ],
    [copy],
  );

  const updatedMeta = retentionHeader.meta.find((item) => item.label === "Updated");
  const freshness = updatedMeta ? `${updatedMeta.label} ${updatedMeta.value}` : undefined;

  return (
    <div className="retention-scorecard-block">
      <div className="retention-scorecard-toolbar export-table-header-export">
        <span className="retention-scorecard-toolbar-label sh-label">{copy.scorecardHeader}</span>
        <ExportMenu kind="retention-scorecard" />
      </div>

      <div className="tab-bar retention-scorecard-tabs" role="tablist" aria-label={copy.scorecardHeader}>
        {copy.tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab retention${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataStateView
        status={status}
        lastSyncedAt={lastSyncedAt}
        isStale={isStale}
        showFreshness={false}
        loading={
          <div className="retention-scorecard-loading">
            <KpiSkeletonGrid count={4} />
            <ChartSkeleton variant="bar" />
            <TableSkeleton rows={5} columns={6} />
          </div>
        }
        error={
          <HubErrorState
            preset="generic-fetch"
            onRetry={retry}
            retrying={retrying}
            lastSyncedAt={lastSyncedAt}
          />
        }
      >
        <div className="tab-content retention active" style={{ display: "block" }}>
          {primaryKpi && (
            <RetentionHealthCard
              kicker={copy.healthKicker}
              label={primaryKpi.label}
              value={primaryKpi.value}
              context={primaryKpi.sub}
              color={primaryKpi.color}
              statusOverride={activeTab === "combined" ? combinedRetention?.goal : undefined}
              freshness={freshness}
            />
          )}

          {activeTab !== "combined" && (
            <>
              <KpiGrid variant="retention">
                {supportingKpis(activeKpis).map((kpi) => (
                  <KpiCard
                    key={kpi.label}
                    label={kpi.label}
                    value={kpi.value}
                    sub={kpi.sub}
                    color={kpi.color}
                    variant="retention"
                  />
                ))}
              </KpiGrid>
              <p className="retention-kpi-footnote">{footnote}</p>
            </>
          )}

          <RetentionComparisonChart
            title={copy.trendTitle}
            subtitle={copy.trendSubtitle}
            points={comparisonPoints}
            goalValue={combinedRetention?.goal}
            goalLabel={combinedRetention?.goal}
          />

          <RetentionDepartmentPanel
            title={copy.attentionTitle}
            actionLabel={copy.attentionAction}
            headers={copy.attentionHeaders}
            rows={departmentRows}
            emptyTitle={copy.attentionEmptyTitle}
            emptyDescription={copy.attentionEmptyDescription}
            onView={setActiveTab}
          />

          {activeTab === "combined" && (
            <div className="retention-table-wrap">
              <DataTable variant="retention">
                <thead>
                  <tr>
                    {copy.combinedTable.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {copy.combinedTable.rows.map((row) => (
                    <tr key={row.kpi}>
                      <td>{row.kpi}</td>
                      <td style={row.valerieColor ? { color: `var(--${row.valerieColor})` } : undefined}>
                        {row.valerie}
                      </td>
                      <td style={row.tracieColor ? { color: `var(--${row.tracieColor})` } : undefined}>
                        {row.tracie}
                      </td>
                      <td>{row.combined}</td>
                      <td>{row.goal}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
          )}
        </div>
      </DataStateView>
    </div>
  );
}
