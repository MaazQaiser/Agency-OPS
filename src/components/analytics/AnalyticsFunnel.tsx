"use client";

import type { PipelineStage } from "@/data/analytics";

export function AnalyticsFunnel({ stages }: { stages: PipelineStage[] }) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="analytics-funnel">
      {stages.map((stage, index) => {
        const widthPct = Math.max((stage.count / maxCount) * 100, 28);
        return (
          <div key={stage.id} className="analytics-funnel-stage">
            <div
              className="analytics-funnel-bar"
              style={{ width: `${widthPct}%` }}
            >
              <span className="analytics-funnel-label">{stage.label}</span>
              <span className="analytics-funnel-count">{stage.count}</span>
              <span className="analytics-funnel-premium">{stage.premium}</span>
            </div>
            {index < stages.length - 1 ? (
              <div className="analytics-funnel-connector" aria-hidden="true" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
