"use client";

import { Tabs } from "@/components/ui/Tabs";
import { PipelineKpiTab } from "./PipelineKpiTab";
import { ProducerScorecardTab } from "./ProducerScorecardTab";
import { ROICalculatorTab } from "./ROICalculatorTab";
import { SpeedToLeadTab } from "./SpeedToLeadTab";
import { WeeklyRaceTab } from "./WeeklyRaceTab";
import { productionTabs } from "@/data/producerScorecard";

export function ProductionModule() {
  return (
    <Tabs tabs={productionTabs} defaultTab="scorecard">
      {(active) => (
        <div className="tab-content active">
          {active === "scorecard" && <ProducerScorecardTab />}
          {active === "speed" && <SpeedToLeadTab />}
          {active === "roi" && <ROICalculatorTab />}
          {active === "race" && <WeeklyRaceTab />}
          {active === "pipeline" && <PipelineKpiTab />}
        </div>
      )}
    </Tabs>
  );
}
