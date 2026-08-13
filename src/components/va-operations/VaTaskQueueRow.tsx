import { AppIcon } from "@/components/ui/AppIcon";
import {
  getTaskCta,
  taskSourceLabels,
  type PriorityTask,
  type PriorityTaskStatus,
  type TaskSource,
} from "@/data/vaOperations";
import { cn } from "@/lib/cn";
import {
  VaTaskBlockerBadge,
  VaTaskDueRiskBadge,
  VaTaskPriorityBadge,
} from "./VaTaskQueueBadges";
import { VaTaskAssignmentStack } from "./VaTaskAssignmentStack";

const memberUserIds: Record<string, string> = {
  Kat: "kat",
  Jaffer: "jaffer",
  Pedro: "pedro-va",
  JoJo: "jojo",
  Sarah: "sara",
  Kyle: "kyle",
  Hassan: "hassan",
  Valerie: "valerie-martinez",
  Tracie: "tracie-wong",
  "Sarah Chen": "sarah-chen",
  Arminda: "arminda-ops",
  Eva: "eva-chong",
  Hamad: "jaffer",
};

const systemAssigners = new Set(["Ricochet", "Automation", "System"]);

const taskStatusClass: Record<PriorityTaskStatus, string> = {
  urgent: "badge-red va-task-status--urgent",
  pending: "badge-blue va-task-status--pending",
  critical: "badge-red va-task-status--critical",
};

const sourceCtaClass: Record<TaskSource, string> = {
  commercial: "va-ops-task-cta--commercial",
  intake: "va-ops-task-cta--intake",
  "send-center": "va-ops-task-cta--send",
  retention: "va-ops-task-cta--retention",
};

function TaskCtaButton({ task }: { task: PriorityTask }) {
  const cta = getTaskCta(task.priorityType);

  return (
    <button
      type="button"
      className={cn(
        "va-ops-task-cta",
        sourceCtaClass[task.source],
        task.status === "critical" && "critical",
      )}
    >
      {cta === "Call Client" && <AppIcon name="phone" size={14} strokeWidth={2.25} />}
      {cta}
    </button>
  );
}

type VaTaskQueueRowProps = {
  task: PriorityTask;
};

export function VaTaskQueueRow({ task }: VaTaskQueueRowProps) {
  const assignerIsSystem = systemAssigners.has(task.assignedBy);

  return (
    <tr className={cn("va-ops-priority-row", task.status)}>
      <td>
        <span className="va-ops-priority-title">{task.title}</span>
      </td>
      <td>
        <VaTaskPriorityBadge priority={task.priority} />
      </td>
      <td>
        <span className="va-ops-source-badge">{taskSourceLabels[task.source]}</span>
      </td>
      <td>
        <VaTaskAssignmentStack
          ownerId={memberUserIds[task.assignedTo]}
          ownerName={task.assignedTo}
          assignerId={assignerIsSystem ? undefined : memberUserIds[task.assignedBy]}
          assignerName={task.assignedBy}
          assignerIsSystem={assignerIsSystem}
        />
      </td>
      <td>
        <VaTaskDueRiskBadge risk={task.dueDateRisk} due={task.due} />
      </td>
      <td>
        <VaTaskBlockerBadge blocker={task.blocker} />
      </td>
      <td>
        <span className={cn("badge", taskStatusClass[task.status])}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </td>
      <td>
        <TaskCtaButton task={task} />
      </td>
    </tr>
  );
}

export function VaTaskQueueCard({ task }: { task: PriorityTask }) {
  return (
    <li className={cn("va-ops-priority-card", `va-ops-priority-card--${task.status}`)}>
      <div className="va-ops-priority-card-head">
        <h3 className="va-ops-priority-title">{task.title}</h3>
        <div className="va-ops-priority-card-pills">
          <VaTaskPriorityBadge priority={task.priority} />
          <span className={cn("badge", taskStatusClass[task.status])}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="va-ops-priority-card-meta">
        <span className="va-ops-source-badge">{taskSourceLabels[task.source]}</span>
        <VaTaskDueRiskBadge risk={task.dueDateRisk} due={task.due} />
      </div>
      <div className="va-ops-priority-card-action">
        <TaskCtaButton task={task} />
      </div>
    </li>
  );
}
