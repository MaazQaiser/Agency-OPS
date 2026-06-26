"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { getTeamMemberStatEntries, type TeamMember } from "@/data/vaOperations";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { teamMemberStatusToAvatar } from "@/lib/teamIdentity";
import { cn } from "@/lib/cn";

type TeamMemberDrawerProps = {
  member: TeamMember | null;
  onClose: () => void;
};

const statusLabels = {
  active: "Active",
  away: "Away",
  offline: "Offline",
} as const;

export function TeamMemberDrawer({ member, onClose }: TeamMemberDrawerProps) {
  useEffect(() => {
    if (!member) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [member, onClose]);

  if (!member) return null;

  const statEntries = getTeamMemberStatEntries(member);

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close activity drawer"
        onClick={onClose}
      />
      <aside className="va-ops-drawer" role="dialog" aria-modal="true" aria-label={`${member.name} activity`}>
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <TeamAvatar
              userId={member.id}
              name={member.name}
              size="lg"
              status={teamMemberStatusToAvatar(member.status)}
              preferVa={member.id === "pedro"}
            />
            <div>
              <div className="va-ops-drawer-name">{member.name}</div>
              <div className="va-ops-drawer-role">{member.role}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Current Status</div>
            <span className={cn("va-ops-status-pill", member.status)}>
              {statusLabels[member.status]}
            </span>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Today&apos;s Metrics</div>
            <div className="va-ops-drawer-metrics">
              {statEntries.map((stat) => (
                <div key={stat.label} className="va-ops-drawer-metric">
                  <span className="va-ops-drawer-metric-value">{stat.value}</span>
                  <span className="va-ops-drawer-metric-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Recent Notes</div>
            <ul className="va-ops-drawer-list">
              {member.recentNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Recent Actions</div>
            <ul className="va-ops-drawer-actions">
              {member.recentActions.map((action) => (
                <li key={`${action.text}-${action.time}`}>
                  <span>{action.text}</span>
                  <time>{action.time}</time>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quick Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="user-plus" size={15} strokeWidth={2} />
                Assign Task
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="plus" size={15} strokeWidth={2} />
                Add Note
              </button>
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="send" size={15} strokeWidth={2} />
                Ping VA
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
