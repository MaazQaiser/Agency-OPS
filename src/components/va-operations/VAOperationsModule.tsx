"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  vaOperationsRoles,
  vaOperationsTabs,
  type VaOperationsRoleId,
  type VaOperationsTabId,
} from "@/data/vaOperations";
import { getVisibleVaOpsTabs } from "@/data/rolePermissions";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { routes } from "@/lib/routes";
import { ActivityTab } from "./ActivityTab";
import { ApprovalsTab } from "./ApprovalsTab";
import { AutomationBuilderTab } from "./AutomationBuilderTab";
import { DNCLogTab } from "./DNCLogTab";
import { BilingualQueueTab } from "./BilingualQueueTab";
import { OverviewTab } from "./OverviewTab";
import { TabTransitionPanel } from "@/components/motion/TabTransitionPanel";
import { TasksTab } from "./TasksTab";
import { HubOperationalStrips } from "@/components/layout/HubOperationalStrips";
import { VAOperationsPageHeader } from "./VAOperationsPageHeader";
import { VaQuickActionsCluster } from "./VaQuickActionsCluster";

const validTabIds = new Set<string>(vaOperationsTabs.map((tab) => tab.id));
const validRoleIds = new Set<string>(vaOperationsRoles.map((role) => role.id));

function resolveTab(view: string | null): VaOperationsTabId {
  if (view && validTabIds.has(view)) return view as VaOperationsTabId;
  return "overview";
}

function resolveRole(role: string | null): VaOperationsRoleId {
  if (role && validRoleIds.has(role)) return role as VaOperationsRoleId;
  return "owner";
}

function buildHref(tabId: VaOperationsTabId, roleId: VaOperationsRoleId): string {
  const params = new URLSearchParams();
  if (tabId !== "overview") params.set("view", tabId);
  if (roleId !== "owner") params.set("role", roleId);
  const query = params.toString();
  return query ? `${routes.vaOperations}?${query}` : routes.vaOperations;
}

export function VAOperationsModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = usePermissions();
  const { canAccessVaOpsTab } = useEntitlements();
  const visibleTabs = getVisibleVaOpsTabs(role).filter((tab) => canAccessVaOpsTab(tab.id));
  const validVisibleIds = new Set(visibleTabs.map((t) => t.id));
  const activeTab = resolveTab(searchParams.get("view"));
  const safeActiveTab = validVisibleIds.has(activeTab) ? activeTab : (visibleTabs[0]?.id ?? "overview");
  const activeRole = resolveRole(searchParams.get("role"));
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const setActiveTab = useCallback(
    (tabId: VaOperationsTabId) => {
      router.push(buildHref(tabId, activeRole), { scroll: false });
    },
    [router, activeRole],
  );

  return (
    <>
      <VAOperationsPageHeader />

      <nav className="va-ops-tab-nav" aria-label="VA Operations workflows">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`va-ops-tab-btn${safeActiveTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <HubOperationalStrips />

      <div className="va-ops-tab-content">
        <TabTransitionPanel tabKey={`${safeActiveTab}-${activeRole}`}>
        {safeActiveTab === "overview" && <OverviewTab role={activeRole} />}
        {safeActiveTab === "tasks" && <TasksTab role={activeRole} />}
        {safeActiveTab === "activity" && <ActivityTab role={activeRole} />}
        {safeActiveTab === "approvals" && <ApprovalsTab role={activeRole} />}
        {safeActiveTab === "automations" && <AutomationBuilderTab />}
        {safeActiveTab === "dnc-log" && (
          <DNCLogTab role={activeRole} initialDncId={searchParams.get("dnc")} />
        )}
        {safeActiveTab === "bilingual-queue" && <BilingualQueueTab role={activeRole} />}
        </TabTransitionPanel>
      </div>

      <VaQuickActionsCluster
        open={quickActionsOpen}
        onToggle={() => setQuickActionsOpen((prev) => !prev)}
        onClose={() => setQuickActionsOpen(false)}
      />
    </>
  );
}
