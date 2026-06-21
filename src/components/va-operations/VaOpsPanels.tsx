"use client";

import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import {
  approvalHubLabels,
  approvalPriorityLabels,
  approvalQueue,
  approvalTypeLabels,
  filterByRole,
  filterOperationalSnapshot,
  getTaskCta,
  leadResponseTracker,
  liveActivity,
  priorityQueue,
  priorityTypeLabels,
  slaRiskLabels,
  taskSourceLabels,
  vaOperationsKpis,
  workloadDistribution,
  type ActivityCategory,
  type ApprovalDraft,
  type ApprovalPriority,
  type PriorityTask,
  type PriorityTaskStatus,
  type SlaRiskLevel,
  type SlaStatus,
  type TaskSource,
  type VaOperationsRoleId,
} from "@/data/vaOperations";
import { cn } from "@/lib/cn";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";

const memberUserIds: Record<string, string> = {
  Kat: "kat",
  Jaffer: "jaffer",
  Pedro: "pedro-va",
  JoJo: "jojo",
  Sara: "sara",
  Kyle: "kyle",
  Hassan: "hassan",
};

const taskStatusClass: Record<PriorityTaskStatus, string> = {
  urgent: "badge-yellow",
  pending: "badge-gray",
  critical: "badge-red",
};

const approvalPriorityClass: Record<ApprovalPriority, string> = {
  low: "badge-gray",
  medium: "badge-blue",
  high: "badge-yellow",
  critical: "badge-red",
};

const slaStatusLabels: Record<SlaStatus, string> = {
  within: "Within SLA",
  near: "Near Limit",
  breached: "SLA Breached",
};

const slaStatusClass: Record<SlaStatus, string> = {
  within: "badge-green",
  near: "badge-yellow",
  breached: "badge-red",
};

const slaRiskClass: Record<SlaRiskLevel, string> = {
  "on-track": "badge-green",
  "at-risk": "badge-yellow",
  critical: "badge-red",
};

const activityFilters: { id: "all" | ActivityCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "calls", label: "Calls" },
  { id: "commercial", label: "Commercial" },
  { id: "approvals", label: "Approvals" },
  { id: "retention", label: "Retention" },
];

type TaskFilter = "all" | TaskSource | "critical";

const taskFilters: { id: TaskFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commercial", label: "Commercial" },
  { id: "intake", label: "Intake" },
  { id: "send-center", label: "Send Center" },
  { id: "retention", label: "Retention" },
  { id: "critical", label: "Critical" },
];

type VaOpsPanelsProps = {
  role: VaOperationsRoleId;
  showOperationalSnapshot?: boolean;
  showKpis?: boolean;
  showPriorityQueue?: boolean;
  showActivity?: boolean;
  showLeadTracker?: boolean;
  showWorkload?: boolean;
  showApprovals?: boolean;
  priorityLimit?: number;
  activityLimit?: number;
  contentStacked?: boolean;
};

export function VaOpsKpiStrip({ role }: { role: VaOperationsRoleId }) {
  const kpis = role === "owner" ? vaOperationsKpis : vaOperationsKpis.filter((kpi) => {
    if (role === "dialer") return ["Leads Waiting", "SLA Breaches", "Tasks Due Today"].includes(kpi.label);
    if (role === "research") return ["Leads Waiting", "Tasks Due Today", "SLA Breaches"].includes(kpi.label);
    if (role === "brokerage" || role === "sales") return ["Tasks Due Today", "Pending Approvals", "SLA Breaches"].includes(kpi.label);
    if (role === "retention") return ["Tasks Due Today", "SLA Breaches", "Pending Approvals"].includes(kpi.label);
    if (role === "automation") return ["Tasks Due Today", "SLA Breaches"].includes(kpi.label);
    return true;
  });

  return (
    <section className="va-ops-kpi-strip" aria-label="KPI overview">
      <div className={cn("va-ops-kpi-grid", kpis.length === 5 && "cols-5", kpis.length === 3 && "cols-3")}>
        {kpis.map((kpi) => (
          <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
            <div className="va-ops-kpi-label">{kpi.label}</div>
            <div className="va-ops-kpi-value">{kpi.value}</div>
            <div className="va-ops-kpi-sub">{kpi.sub}</div>
            <div className="va-ops-kpi-helper">{kpi.helper}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function VaOpsOperationalSnapshot({ role }: { role: VaOperationsRoleId }) {
  const items = filterOperationalSnapshot(role);

  return (
    <section className="va-ops-snapshot-section" aria-label="Operational snapshot">
      <div className="va-ops-section-heading">
        <h2 className="va-ops-section-title">Operational Snapshot</h2>
        <p className="va-ops-section-sub">Agency-wide activity summary for today</p>
      </div>
      <div className={cn("va-ops-snapshot-grid", items.length < 5 && `cols-${items.length}`)}>
        {items.map((item) => (
          <article key={item.key} className="va-ops-snapshot-card">
            <div className="va-ops-snapshot-label">{item.label}</div>
            <div className="va-ops-snapshot-value">{item.value}</div>
            <div className="va-ops-snapshot-sub">{item.sub}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PriorityQueueTable({ tasks }: { tasks: PriorityTask[] }) {
  return (
    <div className="va-ops-priority-table-wrap">
      <table className="va-ops-priority-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Source</th>
            <th>Assigned to</th>
            <th>Due</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const cta = getTaskCta(task.priorityType);
            return (
              <tr key={task.id} className={cn("va-ops-priority-row", task.status)}>
                <td>
                  <span className="va-ops-priority-title">{task.title}</span>
                </td>
                <td>
                  <span className="va-ops-source-badge">{taskSourceLabels[task.source]}</span>
                </td>
                <td>
                  <UserChip userId={memberUserIds[task.assignedTo]} name={task.assignedTo} />
                </td>
                <td className="va-ops-priority-due">{task.due}</td>
                <td>{priorityTypeLabels[task.priorityType]}</td>
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
          })}
        </tbody>
      </table>
    </div>
  );
}

export function VaOpsPriorityQueue({
  role,
  limit,
  expanded = false,
  showFilters = false,
}: {
  role: VaOperationsRoleId;
  limit?: number;
  expanded?: boolean;
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState<TaskFilter>("all");

  const filtered = useMemo(() => {
    const byRole = filterByRole(priorityQueue, role);
    if (filter === "all") return byRole;
    if (filter === "critical") return byRole.filter((task) => task.status === "critical");
    return byRole.filter((task) => task.source === filter);
  }, [role, filter]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className="va-ops-panel va-ops-priority-panel" aria-label="Today's priority queue">
      <div className="va-ops-panel-header">
        <h2 className="va-ops-section-title">Today&apos;s Priority Queue</h2>
        <p className="va-ops-section-sub">
          {expanded ? "All tasks sorted by urgency and due time." : "Tasks sorted by urgency and due time."}
        </p>
      </div>
      {showFilters && (
        <div className="va-ops-filter-row" role="tablist" aria-label="Task filters">
          {taskFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={cn("va-ops-filter-btn", filter === item.id && "active")}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      <PriorityQueueTable tasks={visible} />
    </section>
  );
}

export function VaOpsActivityFeed({
  role,
  limit,
  showFilters = false,
  scrollable = false,
}: {
  role: VaOperationsRoleId;
  limit?: number;
  showFilters?: boolean;
  scrollable?: boolean;
}) {
  const [filter, setFilter] = useState<"all" | ActivityCategory>("all");
  const filtered = filterByRole(liveActivity, role).filter(
    (item) => filter === "all" || item.category === filter,
  );
  const visible = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className="va-ops-panel va-ops-activity-panel" aria-label="Live activity">
      <div className="va-ops-panel-header">
        <h2 className="va-ops-section-title">Live Activity</h2>
        <p className="va-ops-section-sub">Recent actions happening across the team.</p>
      </div>
      {showFilters && (
        <div className="va-ops-filter-row" role="tablist" aria-label="Activity filters">
          {activityFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={cn("va-ops-filter-btn", filter === item.id && "active")}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      <ul className={cn("va-ops-activity-feed", scrollable && "scrollable")}>
        {visible.map((item) => (
          <li key={item.id} className="va-ops-activity-item">
            <span className="va-ops-activity-dot" aria-hidden="true" />
            <div>
              <div className="va-ops-activity-text">{item.text}</div>
              <time className="va-ops-activity-time">{item.time}</time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function VaOpsLeadTracker({ role }: { role: VaOperationsRoleId }) {
  const rows = filterByRole(leadResponseTracker, role);

  return (
    <section className="va-ops-panel va-ops-lead-panel" aria-label="Lead response tracker">
      <div className="va-ops-panel-header">
        <h2 className="va-ops-section-title">Lead Response Tracker</h2>
        <p className="va-ops-section-sub">Monitor response times and SLA performance.</p>
      </div>
      <div className="va-ops-lead-table-wrap">
        <table className="va-ops-lead-table">
          <thead>
            <tr>
              <th>Team Member</th>
              <th>Source</th>
              <th>Response Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={cn("va-ops-lead-row", row.status)}>
                <td>
                  <UserChip userId={memberUserIds[row.name]} name={row.name} />
                </td>
                <td>{row.source}</td>
                <td className="va-ops-lead-time">{row.responseTime}</td>
                <td>
                  <span className={cn("badge", slaStatusClass[row.status])}>
                    {slaStatusLabels[row.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function VaOpsWorkload({ role }: { role: VaOperationsRoleId }) {
  const rows = filterByRole(workloadDistribution, role);

  return (
    <section className="va-ops-panel va-ops-workload-panel" aria-label="Workload distribution">
      <div className="va-ops-panel-header">
        <h2 className="va-ops-section-title">Workload Distribution</h2>
        <p className="va-ops-section-sub">Open tasks and completions by team member.</p>
      </div>
      <div className="va-ops-workload-list">
        {rows.map((row) => (
          <div key={row.id} className="va-ops-workload-row">
            <div className="va-ops-workload-identity">
              <UserChip userId={memberUserIds[row.name]} name={row.name} className="va-ops-workload-chip" />
              <span className="va-ops-workload-role">{row.role}</span>
            </div>
            <span className="va-ops-workload-stat">
              <strong>{row.openTasks}</strong> open
            </span>
            <span className="va-ops-workload-stat va-ops-workload-overdue">
              <strong>{row.overdueCount}</strong> overdue
            </span>
            <span className="va-ops-workload-divider">/</span>
            <span className="va-ops-workload-stat">
              <strong>{row.completedToday}</strong> completed
            </span>
            <span className={cn("badge va-ops-workload-risk", slaRiskClass[row.slaRisk])}>
              {slaRiskLabels[row.slaRisk]}
            </span>
            {row.pendingApprovals > 0 && (
              <span className="va-ops-workload-approvals">
                {row.pendingApprovals} pending approval{row.pendingApprovals > 1 ? "s" : ""}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ApprovalQueueItem({
  draft,
  onApprove,
}: {
  draft: ApprovalDraft;
  onApprove: (draft: ApprovalDraft) => void;
}) {
  const isApproveAction = /approve/i.test(draft.cta);

  return (
    <li className="va-ops-approval-item">
      <div className="va-ops-approval-main">
        <div className="va-ops-approval-title-row">
          <div className="va-ops-approval-badges">
            <span className="va-ops-source-badge">{approvalHubLabels[draft.hub]}</span>
            <span className={cn("badge", approvalPriorityClass[draft.priority])}>
              {approvalPriorityLabels[draft.priority]}
            </span>
          </div>
          <div className="va-ops-approval-title">{draft.title}</div>
        </div>
        <div className="va-ops-approval-meta">
          <span>Type: <strong>{approvalTypeLabels[draft.approvalType]}</strong></span>
          <span>Prepared by: <strong>{draft.preparedBy}</strong></span>
          <span>Client: <strong>{draft.client}</strong></span>
          <span>Submitted: <strong>{draft.submitted}</strong></span>
        </div>
      </div>
      <button
        type="button"
        className="va-ops-action-btn"
        onClick={() => {
          if (isApproveAction) onApprove(draft);
        }}
      >
        {draft.cta}
      </button>
    </li>
  );
}

export function VaOpsApprovalQueue({ role }: { role: VaOperationsRoleId }) {
  const toast = useToast();
  const [drafts, setDrafts] = useState(() => filterByRole(approvalQueue, role));

  const handleApprove = (draft: ApprovalDraft) => {
    setDrafts((prev) => prev.filter((item) => item.id !== draft.id));
    toast.success(toastMessages.vaOps.approvalCompleted);
  };

  return (
    <section className="va-ops-panel va-ops-approval-panel" aria-label="Approval queue">
      <div className="va-ops-panel-header">
        <h2 className="va-ops-section-title">Approval Queue</h2>
        <p className="va-ops-section-sub">Shared across Commercial, Send Center, and Retention.</p>
      </div>
      <ul className="va-ops-approval-list">
        {drafts.map((draft) => (
          <ApprovalQueueItem key={draft.id} draft={draft} onApprove={handleApprove} />
        ))}
      </ul>
    </section>
  );
}

export function VaOpsPanels({
  role,
  showOperationalSnapshot = false,
  showKpis = true,
  showPriorityQueue = true,
  showActivity = true,
  showLeadTracker = true,
  showWorkload = true,
  showApprovals = true,
  priorityLimit,
  activityLimit,
  contentStacked = false,
}: VaOpsPanelsProps) {
  return (
    <>
      {showKpis && <VaOpsKpiStrip role={role} />}
      {showOperationalSnapshot && <VaOpsOperationalSnapshot role={role} />}
      {(showPriorityQueue || showActivity) && (
        <div className={cn("va-ops-content-grid", contentStacked && "stacked")}>
          {showPriorityQueue && <VaOpsPriorityQueue role={role} limit={priorityLimit} />}
          {showActivity && <VaOpsActivityFeed role={role} limit={activityLimit} />}
        </div>
      )}
      {showLeadTracker && <VaOpsLeadTracker role={role} />}
      {showWorkload && <VaOpsWorkload role={role} />}
      {showApprovals && <VaOpsApprovalQueue role={role} />}
    </>
  );
}
