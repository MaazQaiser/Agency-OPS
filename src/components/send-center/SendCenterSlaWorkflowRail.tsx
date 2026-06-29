"use client";

import { cn } from "@/lib/cn";
import type { EscalationStatus } from "@/data/sendCenter";

const SLA_STAGES = [
  { id: "submitted", label: "Draft Submitted" },
  { id: "producer", label: "Producer Alert" },
  { id: "owner", label: "Owner Escalation" },
  { id: "final", label: "Final Approval" },
] as const;

export function escalationToStageIndex(status: EscalationStatus): number {
  if (status === "On Track") return 0;
  if (status === "Producer Alert") return 1;
  return 2;
}

type SendCenterSlaWorkflowRailProps = {
  className?: string;
};

export function SendCenterSlaWorkflowRail({ className }: SendCenterSlaWorkflowRailProps) {
  return (
    <section className={cn("send-center-sla-workflow-rail", className)} aria-label="SLA workflow stages">
      <ol className="send-center-sla-workflow-steps">
        {SLA_STAGES.map((stage, index) => (
          <li key={stage.id} className="send-center-sla-workflow-step">
            {index > 0 && <span className="send-center-sla-workflow-connector" aria-hidden="true" />}
            <span className="send-center-sla-workflow-node">
              <span className="send-center-sla-workflow-dot" />
              <span className="send-center-sla-workflow-label">{stage.label}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

type SendCenterSlaStageIndicatorProps = {
  status: EscalationStatus;
  waitingMinutes: number;
};

export function SendCenterSlaStageIndicator({ status, waitingMinutes }: SendCenterSlaStageIndicatorProps) {
  const stageIndex = escalationToStageIndex(status);
  const overdue = waitingMinutes >= 60;
  const blocked = status === "Owner Escalation";
  const escalationRisk = status === "Producer Alert";

  return (
    <div
      className={cn(
        "send-center-sla-stage-indicator",
        overdue && "send-center-sla-stage-indicator--overdue",
        blocked && "send-center-sla-stage-indicator--blocked",
        escalationRisk && "send-center-sla-stage-indicator--risk",
      )}
      aria-label={`SLA stage: ${SLA_STAGES[stageIndex]?.label ?? status}`}
    >
      {SLA_STAGES.map((stage, index) => (
        <span
          key={stage.id}
          className={cn(
            "send-center-sla-stage-segment",
            index <= stageIndex && "active",
            index === stageIndex && "current",
          )}
          title={stage.label}
        />
      ))}
      <span className="send-center-sla-stage-label">{SLA_STAGES[stageIndex]?.label}</span>
    </div>
  );
}
