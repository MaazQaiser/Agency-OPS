"use client";

import { pipelineStages } from "@/data/commercialHub";

export function PipelineStageBar() {
  return (
    <div className="pipeline-stage-bar commercial-pipeline-stages" aria-label="Pipeline stage breakdown">
      <ol className="commercial-pipeline-stage-list">
        {pipelineStages.map((stage) => (
          <li key={stage.id} className="commercial-pipeline-stage-card">
            <span className="commercial-pipeline-stage-name">{stage.name}</span>
            <span className="commercial-pipeline-stage-count">{stage.count} submissions</span>
            <span className="commercial-pipeline-stage-premium">{stage.premium}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
