"use client";

import type { VaOperationsRoleId } from "@/data/vaOperations";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { VaOpsApprovalQueue, VaOpsKpiStrip, VaOpsWorkload } from "./VaOpsPanels";

type ApprovalsTabProps = {
  role: VaOperationsRoleId;
};

export function ApprovalsTab({ role }: ApprovalsTabProps) {
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
        <div className="va-ops-approvals-view">
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
      <div className="va-ops-approvals-view">
        <VaOpsKpiStrip role={role} />
        <VaOpsApprovalQueue role={role} />
        <VaOpsWorkload role={role} />
      </div>
    </DataStateView>
  );
}
