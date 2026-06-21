"use client";

import type { VaOperationsRoleId } from "@/data/vaOperations";
import {
  CardSkeletonGrid,
  KpiSkeletonGrid,
  TimelineSkeleton,
} from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { VaOpsPanels } from "./VaOpsPanels";

type OverviewTabProps = {
  role: VaOperationsRoleId;
};

export function OverviewTab({ role }: OverviewTabProps) {
  const loading = useTabLoading();

  if (loading) {
    return (
      <div className="va-ops-overview">
        <KpiSkeletonGrid count={5} />
        <CardSkeletonGrid count={3} />
        <TimelineSkeleton />
      </div>
    );
  }

  return (
    <div className="va-ops-overview">
      <VaOpsPanels
        role={role}
        showOperationalSnapshot
        contentStacked
        priorityLimit={3}
        activityLimit={5}
      />
    </div>
  );
}
