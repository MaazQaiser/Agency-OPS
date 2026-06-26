"use client";

import { useEffect, useState } from "react";
import { pipelineStages } from "@/data/commercialHub";

/**
 * Commercial Hub Signature Element — Animated Pipeline Stage Bar
 * Horizontal bar across top of pipeline view. Each segment proportional to count.
 * Segments expand left-to-right over 400ms on mount.
 */
export function PipelineStageBar() {
  const [animated, setAnimated] = useState(false);
  const total = pipelineStages.reduce((sum, s) => sum + s.count, 0);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="pipeline-stage-bar" role="img" aria-label="Pipeline stage breakdown">
      <div className="pipeline-stage-bar-track">
        {pipelineStages.map((stage, i) => {
          const pct = total > 0 ? (stage.count / total) * 100 : 0;
          return (
            <div
              key={stage.id}
              className="pipeline-stage-bar-segment"
              style={{
                width: animated ? `${pct}%` : "0%",
                transitionDelay: `${i * 50}ms`,
              }}
              aria-label={`${stage.name}: ${stage.count} submissions`}
            >
              <div className="pipeline-stage-bar-segment-inner">
                <span className="pipeline-stage-bar-name">{stage.name}</span>
                <span className="pipeline-stage-bar-count">{stage.count}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pipeline-stage-bar-labels">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="pipeline-stage-bar-label-item">
            <span className="pipeline-stage-bar-label">{stage.name}</span>
            <span className="pipeline-stage-bar-premium">{stage.premium}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
