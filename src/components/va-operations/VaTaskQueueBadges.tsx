import { cn } from "@/lib/cn";
import {
  dueDateRiskLabels,
  taskBlockerLabels,
  taskPriorityLabels,
  type DueDateRisk,
  type TaskBlockerState,
  type TaskPriorityLevel,
} from "@/data/vaOperations";

const taskPriorityClass: Record<TaskPriorityLevel, string> = {
  low: "badge-gray",
  medium: "badge-blue",
  high: "badge-yellow",
  critical: "badge-red",
};

const dueDateRiskClass: Record<DueDateRisk, string> = {
  "on-track": "va-task-due-risk--on-track",
  "due-soon": "va-task-due-risk--due-soon",
  "at-risk": "va-task-due-risk--at-risk",
  overdue: "va-task-due-risk--overdue",
};

const blockerClass: Record<TaskBlockerState, string> = {
  clear: "va-task-blocker--clear",
  "awaiting-client": "va-task-blocker--client",
  "awaiting-carrier": "va-task-blocker--carrier",
  "awaiting-docs": "va-task-blocker--docs",
  "awaiting-approval": "va-task-blocker--approval",
  "internal-handoff": "va-task-blocker--handoff",
};

type VaTaskPriorityBadgeProps = {
  priority: TaskPriorityLevel;
  className?: string;
};

export function VaTaskPriorityBadge({ priority, className }: VaTaskPriorityBadgeProps) {
  return (
    <span className={cn("badge va-task-priority-badge", taskPriorityClass[priority], className)}>
      {taskPriorityLabels[priority]}
    </span>
  );
}

type VaTaskDueRiskBadgeProps = {
  risk: DueDateRisk;
  due: string;
  className?: string;
};

export function VaTaskDueRiskBadge({ risk, due, className }: VaTaskDueRiskBadgeProps) {
  return (
    <div className={cn("va-task-due-cell", className)}>
      <span className="va-ops-priority-due">{due}</span>
      <span className={cn("va-task-due-risk", dueDateRiskClass[risk])}>
        {dueDateRiskLabels[risk]}
      </span>
    </div>
  );
}

type VaTaskBlockerBadgeProps = {
  blocker: TaskBlockerState;
  className?: string;
};

export function VaTaskBlockerBadge({ blocker, className }: VaTaskBlockerBadgeProps) {
  return (
    <span className={cn("va-task-blocker", blockerClass[blocker], className)}>
      {taskBlockerLabels[blocker]}
    </span>
  );
}
