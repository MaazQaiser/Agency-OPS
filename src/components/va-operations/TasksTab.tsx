"use client";

import type { VaOperationsRoleId } from "@/data/vaOperations";
import { useEntitlements } from "@/hooks/useEntitlements";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { AutomationBuilderTab } from "./AutomationBuilderTab";
import { DialerVATab } from "./DialerVATab";
import { PlaceholderTab } from "./PlaceholderTab";
import { ResearchVATab } from "./ResearchVATab";
import { SalesVATab } from "./SalesVATab";
import { VaOpsKpiStrip, VaOpsPriorityQueue } from "./VaOpsPanels";

type TasksTabProps = {
  role: VaOperationsRoleId;
};

export function TasksTab({ role }: TasksTabProps) {
  const { hasFeature } = useEntitlements();
  const showAutomations = hasFeature("custom-webhooks");
  const { status, retry, lastSyncedAt, isStale, retrying } = useHubDataState({
    load: () => true,
    isEmpty: () => false,
    errorPreset: "supabase-timeout",
  });

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-tasks-view">
          <KpiSkeletonGrid count={4} />
          <TableSkeleton rows={6} />
        </div>
      }
      empty={<HubEmptyState preset="va-operations-tasks" />}
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
      <div className="va-ops-tasks-view">
        <VaOpsKpiStrip role={role} />
        <VaOpsPriorityQueue role={role} expanded showFilters />

        {role === "dialer" && <DialerVATab embedded />}
        {role === "research" && <ResearchVATab embedded />}
        {role === "brokerage" && <PlaceholderTab tabId="brokerage" embedded />}
        {role === "retention" && <PlaceholderTab tabId="retention" embedded />}
        {role === "sales" && <SalesVATab embedded />}
        {role === "automation" && showAutomations && <AutomationBuilderTab embedded />}
      </div>
    </DataStateView>
  );
}
