"use client";

import { cn } from "@/lib/cn";
import {
  readyToBindStateLabels,
  type ReadyToBindItem,
  type ReadyToBindState,
} from "@/data/submissionTracker";

const bindGates: ReadyToBindState[] = [
  "awaiting-producer-check",
  "awaiting-signed-app",
  "awaiting-payment",
  "ready-to-issue",
];

type BindReadinessGatesProps = {
  queue: ReadyToBindItem[];
};

export function BindReadinessGates({ queue }: BindReadinessGatesProps) {
  return (
    <ol className="commercial-bind-gates" aria-label="Bind readiness gates">
      {bindGates.map((gate) => {
        const count = queue.filter((item) => item.bindState === gate).length;
        const tone =
          gate === "ready-to-issue" ? "ready" : count > 0 ? "blocked" : "clear";

        return (
          <li key={gate} className={cn("commercial-bind-gate", `commercial-bind-gate--${tone}`)}>
            <span className="commercial-bind-gate-label">{readyToBindStateLabels[gate]}</span>
            <span className="commercial-bind-gate-count">{count}</span>
          </li>
        );
      })}
    </ol>
  );
}
