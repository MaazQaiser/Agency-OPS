"use client";

import { cn } from "@/lib/cn";
import type { SentProposalRecord } from "@/data/sendCenter";

const LIFECYCLE_STEPS = ["Opened", "Viewed", "Replied", "Follow-up", "Closed"] as const;

type LifecycleStep = (typeof LIFECYCLE_STEPS)[number];

function getLifecycleState(row: SentProposalRecord): Record<LifecycleStep, "completed" | "current" | "pending"> {
  const flags: boolean[] = [
    row.opened || row.openCount > 0,
    row.viewed,
    row.replied,
    row.replied && !row.accepted && !row.expired,
    row.accepted || row.expired,
  ];

  const states = {} as Record<LifecycleStep, "completed" | "current" | "pending">;
  for (let i = 0; i < LIFECYCLE_STEPS.length; i++) {
    const prevAllDone = flags.slice(0, i).every(Boolean);
    if (flags[i]) states[LIFECYCLE_STEPS[i]] = "completed";
    else if (prevAllDone) states[LIFECYCLE_STEPS[i]] = "current";
    else states[LIFECYCLE_STEPS[i]] = "pending";
  }
  return states;
}

export function SentProposalLifecycleStepper({ row }: { row: SentProposalRecord }) {
  const states = getLifecycleState(row);

  return (
    <div className="send-center-lifecycle-stepper" role="list" aria-label="Proposal lifecycle">
      {LIFECYCLE_STEPS.map((step, index) => (
        <div key={step} className="send-center-lifecycle-step-wrap" role="listitem">
          {index > 0 && (
            <span
              className={cn(
                "send-center-lifecycle-connector",
                states[step] !== "pending" && states[LIFECYCLE_STEPS[index - 1]] === "completed" && "completed",
              )}
              aria-hidden="true"
            />
          )}
          <div className={cn("send-center-lifecycle-step", states[step])}>
            <span className="send-center-lifecycle-dot" aria-hidden="true" />
            <span className="send-center-lifecycle-label">{step}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
