"use client";

import { cn } from "@/lib/cn";
import type { TrustLedgerEntry } from "@/data/trustReference";
import { getTrustFlowStageIndex, TRUST_FLOW_STAGES } from "@/data/trustReference";

type TrustFlowRailProps = {
  className?: string;
};

export function TrustFlowRail({ className }: TrustFlowRailProps) {
  return (
    <section className={cn("epay-trust-flow-rail", className)} aria-label="Trust money flow">
      <ol className="epay-trust-flow-steps">
        {TRUST_FLOW_STAGES.map((stage, index) => (
          <li key={stage.id} className="epay-trust-flow-step">
            {index > 0 && <span className="epay-trust-flow-connector" aria-hidden="true" />}
            <span className="epay-trust-flow-node">
              <span className="epay-trust-flow-dot" />
              <span className="epay-trust-flow-label">{stage.label}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};

type TrustFlowStageIndicatorProps = {
  entry: TrustLedgerEntry;
};

export function TrustFlowStageIndicator({ entry }: TrustFlowStageIndicatorProps) {
  const stageIndex = getTrustFlowStageIndex(entry);
  const blocked = entry.status === "Failed";
  const pending = entry.status === "Pending" || entry.status === "Processing";

  return (
    <div
      className={cn(
        "epay-trust-flow-indicator",
        blocked && "epay-trust-flow-indicator--blocked",
        pending && "epay-trust-flow-indicator--pending",
      )}
      aria-label={`Trust flow: ${TRUST_FLOW_STAGES[stageIndex]?.label ?? entry.type}`}
    >
      {TRUST_FLOW_STAGES.map((stage, index) => (
        <span
          key={stage.id}
          className={cn(
            "epay-trust-flow-segment",
            index <= stageIndex && "active",
            index === stageIndex && "current",
          )}
          title={stage.label}
        />
      ))}
      <span className="epay-trust-flow-stage-label">{TRUST_FLOW_STAGES[stageIndex]?.label}</span>
    </div>
  );
}
