"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { vaOperationsTabs, type VaOperationsTabId } from "@/data/vaOperations";
import { routes } from "@/lib/routes";
import { AutomationBuilderTab } from "./AutomationBuilderTab";
import { DialerVATab } from "./DialerVATab";
import { OverviewTab } from "./OverviewTab";
import { PlaceholderTab } from "./PlaceholderTab";
import { ResearchVATab } from "./ResearchVATab";
import { SalesVATab } from "./SalesVATab";
import { VAOperationsPageHeader } from "./VAOperationsPageHeader";
import { AppIcon } from "@/components/ui/AppIcon";

const validTabIds = new Set<string>(vaOperationsTabs.map((tab) => tab.id));

function resolveTab(view: string | null): VaOperationsTabId {
  if (view && validTabIds.has(view)) return view as VaOperationsTabId;
  return "overview";
}

export function VAOperationsModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = resolveTab(searchParams.get("view"));

  const setActive = useCallback(
    (tabId: VaOperationsTabId) => {
      const href =
        tabId === "overview"
          ? routes.vaOperations
          : `${routes.vaOperations}?view=${tabId}`;
      router.push(href, { scroll: false });
    },
    [router],
  );

  return (
    <>
      <VAOperationsPageHeader />

      <nav className="va-ops-tab-nav" aria-label="VA Operations views">
        {vaOperationsTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`va-ops-tab-btn${active === tab.id ? " active" : ""}${"private" in tab && tab.private ? " private" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {"private" in tab && tab.private && (
              <AppIcon name="shield" size={12} strokeWidth={2.25} className="va-ops-tab-lock" />
            )}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="va-ops-tab-content">
        {active === "overview" && <OverviewTab />}
        {active === "dialer" && <DialerVATab />}
        {active === "research" && <ResearchVATab />}
        {active === "brokerage" && <PlaceholderTab tabId="brokerage" />}
        {active === "sales" && <SalesVATab />}
        {active === "automation" && <AutomationBuilderTab />}
      </div>
    </>
  );
}
