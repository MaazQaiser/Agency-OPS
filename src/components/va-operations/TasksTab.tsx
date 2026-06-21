"use client";

import type { VaOperationsRoleId } from "@/data/vaOperations";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
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
  const loading = useTabLoading();

  if (loading) {
    return (
      <div className="va-ops-tasks-view">
        <KpiSkeletonGrid count={4} />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="va-ops-tasks-view">
      <VaOpsKpiStrip role={role} />
      <VaOpsPriorityQueue role={role} expanded showFilters />

      {role === "dialer" && <DialerVATab embedded />}
      {role === "research" && <ResearchVATab embedded />}
      {role === "brokerage" && <PlaceholderTab tabId="brokerage" embedded />}
      {role === "retention" && <PlaceholderTab tabId="retention" embedded />}
      {role === "sales" && <SalesVATab embedded />}
      {role === "automation" && <AutomationBuilderTab embedded />}
    </div>
  );
}
