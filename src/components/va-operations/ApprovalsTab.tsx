"use client";

import type { VaOperationsRoleId } from "@/data/vaOperations";
import { CardSkeletonGrid, KpiSkeletonGrid } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { VaOpsApprovalQueue, VaOpsKpiStrip, VaOpsWorkload } from "./VaOpsPanels";

type ApprovalsTabProps = {
  role: VaOperationsRoleId;
};

export function ApprovalsTab({ role }: ApprovalsTabProps) {
  const loading = useTabLoading();

  if (loading) {
    return (
      <div className="va-ops-approvals-view">
        <KpiSkeletonGrid count={4} />
        <CardSkeletonGrid count={4} />
      </div>
    );
  }

  return (
    <div className="va-ops-approvals-view">
      <VaOpsKpiStrip role={role} />
      <VaOpsApprovalQueue role={role} />
      <VaOpsWorkload role={role} />
    </div>
  );
}
