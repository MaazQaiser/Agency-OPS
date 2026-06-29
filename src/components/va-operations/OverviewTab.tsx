"use client";

import type { VaOperationsRoleId } from "@/data/vaOperations";
import {
  CardSkeletonGrid,
  KpiSkeletonGrid,
  TimelineSkeleton,
} from "@/components/shared/loading";
import { DataStateView, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { VaOpsPanels } from "./VaOpsPanels";
import { VaOpsTopStrips } from "./VaOpsTopStrips";

type OverviewTabProps = {
  role: VaOperationsRoleId;
};

export function OverviewTab({ role }: OverviewTabProps) {
  const { status, retry, lastSyncedAt, isStale, retrying } = useHubDataState({
    load: () => true,
    isEmpty: () => false,
    errorPreset: "generic-fetch",
  });

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-overview">
          <KpiSkeletonGrid count={5} />
          <CardSkeletonGrid count={3} />
          <TimelineSkeleton />
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
      <div className="va-ops-overview">
        <VaOpsTopStrips />
        <VaOpsPanels
          role={role}
          showOperationalSnapshot
          priorityLimit={3}
          activityLimit={5}
        />
      </div>
    </DataStateView>
  );
}
