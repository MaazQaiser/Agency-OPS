"use client";

import { useMemo, useState } from "react";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import {
  approvalHubLabels,
  approvalLifecycleLabels,
  approvalPriorityLabels,
  approvalQueue,
  approvalTypeLabels,
  filterByRole,
  filterOperationalSnapshot,
  leadResponseTracker,
  liveActivity,
  priorityQueue,
  slaRiskLabels,
  vaOperationsKpis,
  workloadDistribution,
  type ActivityCategory,
  type ActivityEventType,
  type ActivityItem,
  type ApprovalDraft,
  type ApprovalLifecycleStage,
  type ApprovalPriority,
  type PriorityTask,
  type SlaRiskLevel,
  type SlaStatus,
  type TaskSource,
  type VaOperationsRoleId,
} from "@/data/vaOperations";
import { cn } from "@/lib/cn";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { VaTaskQueueRow } from "./VaTaskQueueRow";

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

const activityEventIcon: Record<ActivityEventType, AppIconName> = {
  call: "phone",
  upload: "upload",
  "sla-miss": "triangle-alert",
  send: "send",
  add: "plus",
  complete: "check",
};

const activityIconClass: Record<ActivityEventType, string> = {
  call: "va-ops-activity-icon-wrap--call",
  upload: "va-ops-activity-icon-wrap--upload",
  "sla-miss": "va-ops-activity-icon-wrap--sla-miss",
  send: "va-ops-activity-icon-wrap--send",
  add: "va-ops-activity-icon-wrap--default",
  complete: "va-ops-activity-icon-wrap--upload",
};

const leadTimerSuffix: Record<SlaStatus, string> = {
  within: "live",
  near: "near breach",
  breached: "breached",
};

const approvalLifecycleOrder: ApprovalLifecycleStage[] = ["draft", "review", "approved", "sent"];

function resolveApprovalCtaClass(draft: ApprovalDraft): string {
  if (/approve/i.test(draft.cta)) return "va-ops-action-btn--approve";
  if (draft.priority === "critical") return "va-ops-action-btn--critical-review";
  return "va-ops-action-btn--review";
}

function VaOpsPanelHeader({
  title,
  sub,
  freshness,
  source,
}: {
  title: string;
  sub: string;
  freshness?: string;
  source?: { label: string; type: "LIVE" | "CONFIG" | "SYNC" };
}) {
  return (
    <div className="va-ops-panel-header">
      <div className="va-ops-panel-header-main">
        <h2 className="va-ops-panel-title">{title}</h2>
        <p className="va-ops-section-sub">{sub}</p>
      </div>
      {(freshness || source) && (
        <div className="va-ops-panel-header-meta">
          {source && (
            <span className={cn("va-ops-data-source-badge", `va-ops-data-source-badge--${source.type.toLowerCase()}`)}>
              <span className="va-ops-data-source-badge-type">{source.type}</span>
              {source.label}
            </span>
          )}
          {freshness && <span className="va-ops-freshness">{freshness}</span>}
        </div>
      )}
    </div>
  );
}

function ApprovalLifecycleTracker({ stage }: { stage: ApprovalLifecycleStage }) {
  const currentIndex = approvalLifecycleOrder.indexOf(stage);

  return (
    <div className="va-ops-approval-lifecycle" aria-label={`Approval stage: ${approvalLifecycleLabels[stage]}`}>
      {approvalLifecycleOrder.map((step, index) => (
        <span key={step} className="va-ops-approval-lifecycle-step-wrap">
          {index > 0 && <span className="va-ops-approval-lifecycle-arrow" aria-hidden="true">→</span>}
          <span
            className={cn(
              "va-ops-approval-lifecycle-step",
              index < currentIndex && "is-complete",
              index === currentIndex && "is-current",
            )}
          >
            {approvalLifecycleLabels[step]}
          </span>
        </span>
      ))}
    </div>
  );
}

function ActivityFeedItem({ item }: { item: ActivityItem }) {
  return (
    <li
      className={cn("va-ops-activity-item", item.eventType === "sla-miss" && "va-ops-activity-item--sla-miss")}
    >
      <TeamAvatar
        userId={memberUserIds[item.actor]}
        name={item.actor}
        size="sm"
        showStatus={false}
        interactive
        openProfileOnClick
        className="va-ops-activity-avatar"
      />
      <span className={cn("va-ops-activity-icon-wrap", activityIconClass[item.eventType])}>
        <AppIcon name={activityEventIcon[item.eventType]} size={14} strokeWidth={2.25} />
      </span>
      <div className="va-ops-activity-body">
        <div className="va-ops-activity-text">{item.summary}</div>
        <div className="va-ops-activity-meta">
          <span className="va-ops-activity-source-tag">{item.source}</span>
          <time className="va-ops-activity-time">{item.time}</time>
        </div>
      </div>
    </li>
  );
}

function WorkloadSegmentBar({
  openTasks,
  overdueCount,
  completedToday,
}: {
  openTasks: number;
  overdueCount: number;
  completedToday: number;
}) {
  const openNonOverdue = Math.max(0, openTasks - overdueCount);
  const total = openNonOverdue + overdueCount + completedToday || 1;
  const openPct = (openNonOverdue / total) * 100;
  const overduePct = (overdueCount / total) * 100;
  const completedPct = (completedToday / total) * 100;

  return (
    <div className="va-ops-workload-segments">
      <div className="va-ops-workload-segment-bar" aria-hidden="true">
        <span className="va-ops-workload-segment va-ops-workload-segment--open" style={{ width: `${openPct}%` }} />
        <span className="va-ops-workload-segment va-ops-workload-segment--overdue" style={{ width: `${overduePct}%` }} />
        <span className="va-ops-workload-segment va-ops-workload-segment--completed" style={{ width: `${completedPct}%` }} />
      </div>
      <div className="va-ops-workload-segment-legend">
        <span>
          <strong>{openNonOverdue}</strong> open
        </span>
        <span className="is-overdue">
          <strong>{overdueCount}</strong> overdue
        </span>
        <span className="is-completed">
          <strong>{completedToday}</strong> completed
        </span>
      </div>
    </div>
  );
}

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
          <VaOpsKpiCard key={kpi.label} {...kpi} />
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
        <h2 className="va-ops-panel-title">Operational Snapshot</h2>
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
            <th>Priority</th>
            <th>Source</th>
            <th>Assignment</th>
            <th>Due</th>
            <th>Blocker</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <VaTaskQueueRow key={task.id} task={task} />
          ))}
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
      <VaOpsPanelHeader
        title="Today's Priority Queue"
        sub={expanded ? "All tasks sorted by urgency and due time." : "Tasks sorted by urgency and due time."}
        freshness="Synced 1m ago"
        source={{ label: "Google Sheets", type: "SYNC" }}
      />
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
    <section className="va-ops-panel va-ops-activity-panel va-ops-panel--accent" aria-label="Live activity">
      <VaOpsPanelHeader
        title="Live Activity"
        sub="Recent actions happening across the team."
        freshness="Updated 2m ago"
        source={{ label: "RingCentral", type: "LIVE" }}
      />
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
          <ActivityFeedItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

export function VaOpsLeadTracker({ role }: { role: VaOperationsRoleId }) {
  const rows = filterByRole(leadResponseTracker, role);

  return (
    <section className="va-ops-panel va-ops-lead-panel va-ops-panel--accent" aria-label="Lead response tracker">
      <VaOpsPanelHeader
        title="Speed-to-Lead Monitor"
        sub="Monitor response times and SLA performance."
        freshness="Latency updated 30s ago"
        source={{ label: "AgencyZoom", type: "LIVE" }}
      />
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
                  <div className="va-ops-lead-member-cell">
                    <span className={cn("va-ops-lead-live-dot", `va-ops-lead-live-dot--${row.status}`)} aria-hidden="true" />
                    <TeamAvatar userId={memberUserIds[row.name]} name={row.name} size="sm" showStatus={false} />
                  </div>
                </td>
                <td>{row.source}</td>
                <td>
                  <span className={cn("va-ops-lead-timer-pill", `va-ops-lead-timer-pill--${row.status}`)}>
                    {row.responseTime}
                    <span className="va-ops-lead-timer-suffix">{leadTimerSuffix[row.status]}</span>
                  </span>
                </td>
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
    <section className="va-ops-panel va-ops-workload-panel va-ops-panel--accent" aria-label="Workload distribution">
      <VaOpsPanelHeader
        title="Workload Distribution"
        sub="Open tasks and completions by team member."
      />
      <div className="va-ops-workload-list">
        {rows.map((row) => (
          <div key={row.id} className="va-ops-workload-row">
            <div className="va-ops-workload-identity">
              <TeamAvatar userId={memberUserIds[row.name]} name={row.name} size="sm" showStatus={false} />
              <div>
                <span className="va-ops-workload-name">{row.name}</span>
                <span className="va-ops-workload-role">{row.role}</span>
              </div>
            </div>
            <WorkloadSegmentBar
              openTasks={row.openTasks}
              overdueCount={row.overdueCount}
              completedToday={row.completedToday}
            />
            <div className="va-ops-workload-side">
              <span className={cn("badge va-ops-workload-risk", slaRiskClass[row.slaRisk])}>
                {slaRiskLabels[row.slaRisk]}
              </span>
              {row.pendingApprovals > 0 && (
                <span className="va-ops-workload-approvals">
                  {row.pendingApprovals} pending approval{row.pendingApprovals > 1 ? "s" : ""}
                </span>
              )}
            </div>
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
        <ApprovalLifecycleTracker stage={draft.lifecycleStage} />
      </div>
      <button
        type="button"
        className={cn("va-ops-action-btn", resolveApprovalCtaClass(draft))}
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
    <section className="va-ops-panel va-ops-approval-panel va-ops-panel--accent" aria-label="Approval queue">
      <VaOpsPanelHeader
        title="Pending Decisions"
        sub="Approval queue across Commercial, Send Center, and Retention."
        freshness="Live sync active"
        source={{ label: "Supabase", type: "SYNC" }}
      />
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
}: VaOpsPanelsProps) {
  return (
    <>
      {showKpis && <VaOpsKpiStrip role={role} />}
      {showOperationalSnapshot && <VaOpsOperationalSnapshot role={role} />}
      {showPriorityQueue && <VaOpsPriorityQueue role={role} limit={priorityLimit} />}
      {showActivity && <VaOpsActivityFeed role={role} limit={activityLimit} />}
      {showApprovals && <VaOpsApprovalQueue role={role} />}
      {showWorkload && <VaOpsWorkload role={role} />}
      {showLeadTracker && <VaOpsLeadTracker role={role} />}
    </>
  );
}
