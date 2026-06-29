"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import { commercialHubTabs, type CommercialHubTabId } from "@/data/commercialHub";
import { getVisibleCommercialHubTabs } from "@/data/rolePermissions";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { routes } from "@/lib/routes";
import { exportCommercialPipelinePdf } from "@/lib/export";
import { TabTransitionPanel } from "@/components/motion/TabTransitionPanel";
import { HubOperationalStrips } from "@/components/layout/HubOperationalStrips";
import { CommercialHubPageHeader } from "./CommercialHubPageHeader";
import { ExecutiveDashboardTab } from "./ExecutiveDashboardTab";
import { CoverageChecklistTab } from "./CoverageChecklistTab";
import { OutreachQueueTab } from "./OutreachQueueTab";
import { CarrierFollowUpTab } from "./CarrierFollowUpTab";
import { MissingDocsQueueTab } from "./MissingDocsQueueTab";
import { QuoteReviewTab } from "./QuoteReviewTab";
import { ReadyToBindTab } from "./ReadyToBindTab";
import { SubmissionTrackerTab } from "./SubmissionTrackerTab";
import { SubmissionClockTab } from "./SubmissionClockTab";
import { LeadVelocityTab } from "./LeadVelocityTab";
import { FarmersEdgeIntelligenceProvider } from "@/components/farmers-edge/FarmersEdgeIntelligenceProvider";

const validTabIds = new Set<string>(commercialHubTabs.map((tab) => tab.id));

function resolveTab(view: string | null): CommercialHubTabId {
  if (view && validTabIds.has(view)) return view as CommercialHubTabId;
  return "executive";
}

export function CommercialHubModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = usePermissions();
  const visibleTabs = getVisibleCommercialHubTabs(role);
  const validVisibleIds = new Set(visibleTabs.map((t) => t.id));
  const active = resolveTab(searchParams.get("view"));
  const safeActive = validVisibleIds.has(active) ? active : (visibleTabs[0]?.id ?? "submissions");
  const [addMarketOpen, setAddMarketOpen] = useState(false);

  const setActive = useCallback(
    (tabId: CommercialHubTabId) => {
      const href =
        tabId === "executive"
          ? routes.commercialHub
          : `${routes.commercialHub}?view=${tabId}`;
      router.push(href, { scroll: false });
    },
    [router],
  );

  const handleQuickAction = useCallback(
    (actionId: string) => {
      if (actionId === "new-submission") {
        router.push(routes.intakeForms, { scroll: false });
        return;
      }
      if (actionId === "add-market") {
        if (active !== "submissions") {
          setActive("submissions");
        }
        setAddMarketOpen(true);
        return;
      }
      if (actionId === "export-pipeline") {
        exportCommercialPipelinePdf();
      }
    },
    [active, router, setActive],
  );

  useShortcutAction("add-market", () => handleQuickAction("add-market"));

  return (
    <FarmersEdgeIntelligenceProvider>
      <CommercialHubPageHeader onQuickActionClick={handleQuickAction} />

      <nav className="va-ops-tab-nav" aria-label="Commercial Hub views">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`va-ops-tab-btn${safeActive === tab.id ? " active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <HubOperationalStrips />

      <div className="va-ops-tab-content">
        <TabTransitionPanel tabKey={safeActive}>
        {safeActive === "executive" && <ExecutiveDashboardTab />}
        {safeActive === "submissions" && (
          <SubmissionTrackerTab
            addMarketOpen={addMarketOpen}
            onAddMarketOpenChange={setAddMarketOpen}
            initialSubmissionId={searchParams.get("submission")}
          />
        )}
        {safeActive === "checklist" && <CoverageChecklistTab />}
        {safeActive === "missing-docs" && <MissingDocsQueueTab />}
        {safeActive === "follow-ups" && <CarrierFollowUpTab />}
        {safeActive === "quote-review" && <QuoteReviewTab />}
        {safeActive === "ready-to-bind" && <ReadyToBindTab />}
        {safeActive === "outreach" && <OutreachQueueTab />}
        {safeActive === "submission-clock" && <SubmissionClockTab />}
        {safeActive === "lead-velocity" && <LeadVelocityTab />}
        </TabTransitionPanel>
      </div>
    </FarmersEdgeIntelligenceProvider>
  );
}
