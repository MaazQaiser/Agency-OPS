"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  approvalQueue,
  leadResponseTracker,
  liveActivity,
  priorityQueue,
  teamMembers,
  vaOperationsKpis,
  workloadDistribution,
  type PriorityTaskStatus,
  type SlaStatus,
  type TeamMember,
  type TeamMemberStatus,
} from "@/data/vaOperations";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";
import { TeamMemberDrawer } from "./TeamMemberDrawer";

const statusLabels: Record<TeamMemberStatus, string> = {
  active: "Active",
  away: "Away",
  offline: "Offline",
};

const taskStatusClass: Record<PriorityTaskStatus, string> = {
  urgent: "badge-yellow",
  pending: "badge-gray",
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

export function OverviewTab() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="va-ops-overview">
      <section className="va-ops-kpi-strip" aria-label="KPI overview">
        <div className="va-ops-kpi-grid">
          {vaOperationsKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="va-ops-team-section" aria-label="Team members">
        <div className="va-ops-section-heading">
          <h2 className="va-ops-section-title">Team Members</h2>
          <p className="va-ops-section-sub">Live availability and daily performance</p>
        </div>
        <div className="va-ops-team-row">
          {teamMembers.map((member) => (
            <article key={member.id} className="va-ops-team-card">
              <div className="va-ops-team-card-header">
                <span className="va-ops-team-avatar" aria-hidden="true">
                  {getNameInitials(member.name)}
                </span>
                <div>
                  <div className="va-ops-team-name">{member.name}</div>
                  <div className="va-ops-team-role">{member.role}</div>
                </div>
              </div>

              <div className={cn("va-ops-status-pill", member.status)}>
                {statusLabels[member.status]}
              </div>

              <dl className="va-ops-team-stats">
                <div>
                  <dt>Calls made</dt>
                  <dd>{member.stats.calls}</dd>
                </div>
                <div>
                  <dt>Tasks completed</dt>
                  <dd>{member.stats.tasksCompleted}</dd>
                </div>
                <div>
                  <dt>Leads assigned</dt>
                  <dd>{member.stats.leadsAssigned}</dd>
                </div>
                <div>
                  <dt>Follow-ups due</dt>
                  <dd>{member.stats.followUpsDue}</dd>
                </div>
              </dl>

              <button
                type="button"
                className="va-ops-team-cta"
                onClick={() => setSelectedMember(member)}
              >
                View Activity
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="va-ops-content-grid">
        <section className="va-ops-panel va-ops-priority-panel" aria-label="Today's priority queue">
          <div className="va-ops-panel-header">
            <h2 className="va-ops-section-title">Today&apos;s Priority Queue</h2>
            <p className="va-ops-section-sub">Tasks sorted by urgency and due time.</p>
          </div>
          <ul className="va-ops-priority-list">
            {priorityQueue.map((task) => (
              <li key={task.id} className="va-ops-priority-item">
                <div className="va-ops-priority-main">
                  <div className="va-ops-priority-title">{task.title}</div>
                  <div className="va-ops-priority-meta">
                    <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                    <span>Due: <strong>{task.due}</strong></span>
                    <span>Type: <strong>{task.type}</strong></span>
                  </div>
                </div>
                <div className="va-ops-priority-actions">
                  <span className={cn("badge", taskStatusClass[task.status])}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  <button
                    type="button"
                    className={cn("va-ops-action-btn", task.status === "critical" && "critical")}
                  >
                    {task.cta === "Call Now" && <AppIcon name="phone" size={14} strokeWidth={2.25} />}
                    {task.cta}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel va-ops-activity-panel" aria-label="Live activity">
          <div className="va-ops-panel-header">
            <h2 className="va-ops-section-title">Live Activity</h2>
            <p className="va-ops-section-sub">Recent actions happening across the team.</p>
          </div>
          <ul className="va-ops-activity-feed">
            {liveActivity.map((item) => (
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
      </div>

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
              {leadResponseTracker.map((row) => (
                <tr key={row.id} className={cn("va-ops-lead-row", row.status)}>
                  <td>
                    <span className="va-ops-lead-name">{row.name}</span>
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

      <section className="va-ops-panel va-ops-workload-panel" aria-label="Workload distribution">
        <div className="va-ops-panel-header">
          <h2 className="va-ops-section-title">Workload Distribution</h2>
          <p className="va-ops-section-sub">Open tasks and completions by team member.</p>
        </div>
        <div className="va-ops-workload-list">
          {workloadDistribution.map((row) => (
            <div key={row.id} className="va-ops-workload-row">
              <span className="va-ops-workload-name">{row.name}</span>
              <span className="va-ops-workload-stat">
                <strong>{row.openTasks}</strong> open
              </span>
              <span className="va-ops-workload-divider">/</span>
              <span className="va-ops-workload-stat">
                <strong>{row.completedToday}</strong> completed
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

      <section className="va-ops-panel va-ops-approval-panel" aria-label="Awaiting producer approval">
        <div className="va-ops-panel-header">
          <h2 className="va-ops-section-title">Awaiting Producer Approval</h2>
          <p className="va-ops-section-sub">Drafts requiring E&amp;O review before send.</p>
        </div>
        <ul className="va-ops-approval-list">
          {approvalQueue.map((draft) => (
            <li key={draft.id} className="va-ops-approval-item">
              <div className="va-ops-approval-main">
                <div className="va-ops-approval-title">{draft.title}</div>
                <div className="va-ops-approval-meta">
                  <span>Prepared by: <strong>{draft.preparedBy}</strong></span>
                  <span>Client: <strong>{draft.client}</strong></span>
                  <span>Submitted: <strong>{draft.submitted}</strong></span>
                </div>
              </div>
              <button type="button" className="va-ops-action-btn">
                {draft.cta}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <TeamMemberDrawer member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
}
