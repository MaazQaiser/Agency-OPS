"use client";

import type { VaOperationsRoleId } from "@/data/vaOperations";
import {
  ActivitySkeleton,
  AvatarListSkeleton,
  KpiSkeletonGrid,
} from "@/components/shared/loading";
import { DataStateView, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { cn } from "@/lib/cn";
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
  const flagship = role === "owner";

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className={cn("va-ops-overview", flagship && "va-ops-overview--flagship")}>
          <KpiSkeletonGrid count={5} />
          <ActivitySkeleton count={5} />
          <AvatarListSkeleton count={4} />
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
      <div className={cn("va-ops-overview", flagship && "va-ops-overview--flagship")}>
        <VaOpsTopStrips showPresence={!flagship} showTimeline={!flagship} />
        <VaOpsPanels
          role={role}
          flagship={flagship}
          showOperationalSnapshot
          priorityLimit={flagship ? undefined : 3}
          activityLimit={5}
        />
      </div>
    </DataStateView>
  );
}
