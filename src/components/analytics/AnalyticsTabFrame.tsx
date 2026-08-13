"use client";

import type { ReactNode } from "react";
import { ChartSkeleton, KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import type { AnalyticsTabId, AnalyticsTimeFilterId } from "@/data/analytics";
import { useHubDataState } from "@/hooks/useHubDataState";

type AnalyticsTabFrameProps = {
  period: AnalyticsTimeFilterId;
  tab: AnalyticsTabId;
  children: ReactNode;
};

export function AnalyticsTabFrame({ period, tab, children }: AnalyticsTabFrameProps) {
  const { status, retry, lastSyncedAt, isStale, retrying } = useHubDataState({
    load: () => true,
    isEmpty: () => false,
    deps: [period, tab],
  });

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      loading={
        <div className="analytics-tab-view">
          <KpiSkeletonGrid count={4} label="Loading analytics" />
          <ChartSkeleton variant={tab === "carriers" ? "bar" : "line"} />
          <TableSkeleton rows={6} columns={6} />
        </div>
      }
      empty={<HubEmptyState preset="analytics-data" />}
      error={
        <HubErrorState
          preset="generic-fetch"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
      {children}
    </DataStateView>
  );
}
