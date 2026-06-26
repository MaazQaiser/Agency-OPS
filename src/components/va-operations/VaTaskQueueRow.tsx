import { AppIcon } from "@/components/ui/AppIcon";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import {
  getTaskCta,
  priorityTypeLabels,
  taskSourceLabels,
  type PriorityTask,
  type PriorityTaskStatus,
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
  Sara: "sara",
  Kyle: "kyle",
  Hassan: "hassan",
  Valerie: "valerie-martinez",
  Tracie: "tracie-wong",
  Sarah: "sarah-chen",
  Arminda: "arminda-ops",
  Eva: "eva-chong",
  Hamad: "jaffer",
};

const systemAssigners = new Set(["Ricochet", "Automation", "System"]);

const taskStatusClass: Record<PriorityTaskStatus, string> = {
  urgent: "badge-yellow",
  pending: "badge-gray",
  critical: "badge-red",
};

type VaTaskQueueRowProps = {
  task: PriorityTask;
};

export function VaTaskQueueRow({ task }: VaTaskQueueRowProps) {
  const cta = getTaskCta(task.priorityType);
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
        <button
          type="button"
          className={cn("va-ops-task-cta", task.status === "critical" && "critical")}
        >
          {cta === "Call Client" && <AppIcon name="phone" size={14} strokeWidth={2.25} />}
          {cta}
        </button>
      </td>
    </tr>
  );
}
