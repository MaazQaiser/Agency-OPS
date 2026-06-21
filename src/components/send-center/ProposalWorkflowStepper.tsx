import {
  getWorkflowStepState,
  workflowStepLabels,
  workflowStepOrder,
  type WorkflowStepKey,
} from "@/data/sendCenterProposals";
import { cn } from "@/lib/cn";

type ProposalWorkflowStepperProps = {
  progress: WorkflowStepKey[];
  timestamps?: Partial<Record<WorkflowStepKey, string>>;
  compact?: boolean;
};

export function ProposalWorkflowStepper({
  progress,
  timestamps,
  compact = false,
}: ProposalWorkflowStepperProps) {
  return (
    <div className={cn("send-center-workflow-stepper", compact && "compact")} role="list" aria-label="Proposal workflow">
      {workflowStepOrder.map((step, index) => {
        const state = getWorkflowStepState(progress, step);
        const prevStep = index > 0 ? workflowStepOrder[index - 1] : null;
        const prevReached = prevStep ? progress.includes(prevStep) : false;
        const timestamp = timestamps?.[step];

        return (
          <div key={step} className="send-center-workflow-step-wrap" role="listitem">
            {index > 0 && (
              <span
                className={cn("send-center-workflow-connector", prevReached && "completed")}
                aria-hidden="true"
              />
            )}
            <div
              className={cn(
                "send-center-workflow-step",
                state === "completed" && "completed",
                state === "current" && "current",
                state === "pending" && "pending",
              )}
            >
              <span className="send-center-workflow-dot" aria-hidden="true" />
              {!compact && (
                <>
                  <span className="send-center-workflow-label">{workflowStepLabels[step]}</span>
                  {timestamp !== undefined && (
                    <span className="send-center-workflow-time">{timestamp}</span>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
