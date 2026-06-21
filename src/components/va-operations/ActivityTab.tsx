"use client";

import type { VaOperationsRoleId } from "@/data/vaOperations";
import { VaOpsActivityFeed, VaOpsKpiStrip, VaOpsLeadTracker } from "./VaOpsPanels";

type ActivityTabProps = {
  role: VaOperationsRoleId;
};

export function ActivityTab({ role }: ActivityTabProps) {
  return (
    <div className="va-ops-activity-view">
      <VaOpsKpiStrip role={role} />
      <VaOpsActivityFeed role={role} showFilters scrollable />
      <VaOpsLeadTracker role={role} />
    </div>
  );
}
