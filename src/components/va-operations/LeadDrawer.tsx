"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { DialerLead } from "@/data/dialerVA";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";

type LeadDrawerProps = {
  lead: DialerLead | null;
  onClose: () => void;
};

const priorityLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
  useEffect(() => {
    if (!lead) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lead, onClose]);

  if (!lead) return null;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close lead drawer"
        onClick={onClose}
      />
      <aside className="va-ops-drawer" role="dialog" aria-modal="true" aria-label={`${lead.name} lead details`}>
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(lead.name)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{lead.name}</div>
              <div className="va-ops-drawer-role">{lead.type} · {lead.source}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Lead Details</div>
            <dl className="va-ops-lead-details">
              {lead.phone && (
                <div>
                  <dt>Phone</dt>
                  <dd>{lead.phone}</dd>
                </div>
              )}
              {lead.email && (
                <div>
                  <dt>Email</dt>
                  <dd>{lead.email}</dd>
                </div>
              )}
              <div>
                <dt>Priority</dt>
                <dd>
                  <span className={cn("badge", lead.priority === "high" ? "badge-red" : "badge-yellow")}>
                    {priorityLabels[lead.priority]}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Assigned VA</dt>
                <dd>{lead.assignedTo}</dd>
              </div>
              <div>
                <dt>Time Added</dt>
                <dd>{lead.timeAdded}</dd>
              </div>
            </dl>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Last Interaction</div>
            <p className="va-ops-drawer-text">{lead.lastInteraction}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Contact History</div>
            <ul className="va-ops-drawer-actions">
              {lead.contactHistory.map((entry) => (
                <li key={`${entry.action}-${entry.time}`}>
                  <span>{entry.action}</span>
                  <time>{entry.time}</time>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Notes</div>
            <ul className="va-ops-drawer-list">
              {lead.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quick Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="phone" size={15} strokeWidth={2} />
                Call
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="plus" size={15} strokeWidth={2} />
                Add Note
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="refresh" size={15} strokeWidth={2} />
                Reassign
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
