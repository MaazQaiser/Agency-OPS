import {
  clockStageOrder,
  clockStageStateClass,
  type ClockStageEntry,
  type ClockStageKey,
} from "@/data/submissionClock";
import { cn } from "@/lib/cn";

type SubmissionClockStepperProps = {
  stages: ClockStageEntry[];
  compact?: boolean;
};

export function SubmissionClockStepper({ stages, compact = false }: SubmissionClockStepperProps) {
  const stageMap = Object.fromEntries(stages.map((s) => [s.key, s])) as Record<ClockStageKey, ClockStageEntry>;

  return (
    <div className={cn("submission-clock-stepper", compact && "compact")} role="list" aria-label="Submission stage timeline">
      {clockStageOrder.map((key, index) => {
        const step = stageMap[key];
        const state = step?.state ?? "pending";
        const prevKey = index > 0 ? clockStageOrder[index - 1] : null;
        const prevReached = prevKey ? ["completed", "current", "delayed", "blocked"].includes(stageMap[prevKey]?.state ?? "") : false;

        return (
          <div key={key} className="submission-clock-step-wrap" role="listitem">
            {index > 0 && (
              <span className={cn("submission-clock-connector", prevReached && "completed")} aria-hidden="true" />
            )}
            <div className={cn("submission-clock-step", clockStageStateClass[state], step?.overdue && "overdue")}>
              <span className="submission-clock-dot" aria-hidden="true" />
              {!compact && (
                <>
                  <span className="submission-clock-label">{step?.label ?? key}</span>
                  {step?.timestamp && <span className="submission-clock-time">{step.timestamp}</span>}
                  {step?.timeSpent && step.timeSpent !== "-" && (
                    <span className="submission-clock-spent">{step.timeSpent}</span>
                  )}
                  {step?.owner && <span className="submission-clock-owner">{step.owner}</span>}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
