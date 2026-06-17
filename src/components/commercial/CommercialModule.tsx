"use client";

import { useState } from "react";
import { AgingReportTab } from "./AgingReportTab";
import { DailyAccountabilityTab } from "./DailyAccountabilityTab";
import { ExecutiveTab } from "./ExecutiveTab";
import { PipelineTab } from "./PipelineTab";
import { SheetsSetupTab } from "./SheetsSetupTab";
import { VADashboardTab } from "./VADashboardTab";
import { commercialHeader, commercialTabs } from "@/data/retentionScorecard";

export function CommercialModule() {
  const [active, setActive] = useState("exec");

  return (
    <>
      <div className="top-bar commercial-module-bar">
        <div className="brand">{commercialHeader.brand} <span>{commercialHeader.brandSub}</span></div>
        <div className="nav-tabs" style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>
          {commercialTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn${active === tab.id ? " active" : ""}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-panel active">
        {active === "exec" && <ExecutiveTab />}
        {active === "va" && <VADashboardTab />}
        {active === "pipeline" && <PipelineTab />}
        {active === "aging" && <AgingReportTab />}
        {active === "daily" && <DailyAccountabilityTab />}
        {active === "formulas" && <SheetsSetupTab />}
      </div>
    </>
  );
}
