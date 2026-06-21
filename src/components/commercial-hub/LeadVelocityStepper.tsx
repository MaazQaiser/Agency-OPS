import {
  velocityStageOrder,
  velocityStageStateClass,
  type VelocityStageEntry,
  type VelocityStageKey,
} from "@/data/leadVelocity";
import { cn } from "@/lib/cn";

type LeadVelocityStepperProps = {
  stages: VelocityStageEntry[];
  compact?: boolean;
};

export function LeadVelocityStepper({ stages, compact = false }: LeadVelocityStepperProps) {
  const stageMap = Object.fromEntries(stages.map((s) => [s.key, s])) as Record<VelocityStageKey, VelocityStageEntry>;

  return (
    <div className={cn("lead-velocity-stepper", compact && "compact")} role="list" aria-label="Lead velocity timeline">
      {velocityStageOrder.map((key, index) => {
        const step = stageMap[key];
        const state = step?.state ?? "pending";
        const prevKey = index > 0 ? velocityStageOrder[index - 1] : null;
        const prevReached = prevKey
          ? ["completed", "current", "lost"].includes(stageMap[prevKey]?.state ?? "")
          : false;

        return (
          <div key={key} className="lead-velocity-step-wrap" role="listitem">
            {index > 0 && (
              <span className={cn("lead-velocity-connector", prevReached && "completed")} aria-hidden="true" />
            )}
            <div
              className={cn(
                "lead-velocity-step",
                velocityStageStateClass[state],
                step?.isSlowest && "slowest",
              )}
            >
              <span className="lead-velocity-dot" aria-hidden="true" />
              {!compact && (
                <>
                  <span className="lead-velocity-label">{step?.label ?? key}</span>
                  {step?.timestamp && <span className="lead-velocity-time">{step.timestamp}</span>}
                  {step?.gapFromPrev && step.gapFromPrev !== "—" && (
                    <span className={cn("lead-velocity-gap", step.isSlowest && "slowest")}>{step.gapFromPrev}</span>
                  )}
                  {step?.owner && <span className="lead-velocity-owner">{step.owner}</span>}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
