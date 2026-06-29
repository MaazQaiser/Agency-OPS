"use client";

import { useCallback, useState } from "react";
import {
  analyticsHeader,
  analyticsTabs,
  type AnalyticsTabId,
  type AnalyticsTimeFilterId,
} from "@/data/analytics";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { cn } from "@/lib/cn";
import { HubOperationalStrips } from "@/components/layout/HubOperationalStrips";
import { AnalyticsTimeFilter } from "./AnalyticsTimeFilter";
import { OverviewTab } from "./OverviewTab";
import { ProductionTab } from "./ProductionTab";
import { RetentionTab } from "./RetentionTab";
import { VelocityTab } from "./VelocityTab";
import { CarrierMixTab } from "./CarrierMixTab";

export function AnalyticsModule() {
  const [activeTab, setActiveTab] = useState<AnalyticsTabId>("overview");
  const [timeFilter, setTimeFilter] = useState<AnalyticsTimeFilterId>("mtd");

  const handleTab = useCallback((id: AnalyticsTabId) => setActiveTab(id), []);

  return (
    <>
      <header className="va-ops-page-header analytics-page-header">
        <div className="va-ops-page-header-left">
          <div className="va-ops-page-title-block">
            <h1 className="va-ops-page-title">{analyticsHeader.title}</h1>
            <p className="va-ops-page-subtitle">{analyticsHeader.subtitle}</p>
          </div>
        </div>
        <div className="va-ops-page-header-toolbar analytics-header-toolbar">
          <AnalyticsTimeFilter value={timeFilter} onChange={setTimeFilter} />
          <HubHelpTrigger hubId="analytics" />
        </div>
      </header>

      <nav className="va-ops-tab-nav" aria-label="Analytics views">
        {analyticsTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn("va-ops-tab-btn", activeTab === tab.id && "active")}
            onClick={() => handleTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <HubOperationalStrips />

      <div className="va-ops-tab-content analytics-content">
        {activeTab === "overview" && <OverviewTab period={timeFilter} />}
        {activeTab === "production" && <ProductionTab period={timeFilter} />}
        {activeTab === "retention" && <RetentionTab period={timeFilter} />}
        {activeTab === "velocity" && <VelocityTab period={timeFilter} />}
        {activeTab === "carriers" && <CarrierMixTab period={timeFilter} />}
      </div>
    </>
  );
}
