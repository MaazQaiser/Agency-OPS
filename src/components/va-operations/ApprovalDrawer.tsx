"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { SalesApproval } from "@/data/salesVA";
import { getNameInitials } from "@/lib/nameInitials";

type ApprovalDrawerProps = {
  approval: SalesApproval | null;
  onClose: () => void;
};

export function ApprovalDrawer({ approval, onClose }: ApprovalDrawerProps) {
  useEffect(() => {
    if (!approval) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [approval, onClose]);

  if (!approval) return null;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close approval drawer"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer va-ops-drawer-sales"
        role="dialog"
        aria-modal="true"
        aria-label={`${approval.title} approval review`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(approval.client)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{approval.title}</div>
              <div className="va-ops-drawer-role">
                {approval.client} · {approval.typeLabel}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Client</div>
            <p className="va-ops-drawer-text">{approval.client}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quote Details</div>
            <p className="va-ops-drawer-text">{approval.quoteDetails}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Carrier Comparison</div>
            <ul className="va-ops-carrier-compare">
              {approval.carrierComparison.map((row) => (
                <li key={row.carrier}>
                  <div className="va-ops-carrier-name">{row.carrier}</div>
                  <div className="va-ops-carrier-premium">{row.premium}</div>
                  <div className="va-ops-carrier-notes">{row.notes}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Broker Notes</div>
            <ul className="va-ops-drawer-list">
              {approval.brokerNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Draft Communication</div>
            <blockquote className="va-ops-draft-preview">{approval.draftCommunication}</blockquote>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Compliance Checklist</div>
            <ul className="va-ops-qual-checklist va-ops-qual-checklist-compact">
              {approval.complianceChecklist.map((item) => (
                <li key={item.id} className={item.checked ? "checked" : ""}>
                  <AppIcon name={item.checked ? "check" : "x"} size={14} strokeWidth={2.5} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quick Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Approve
              </button>
              <button type="button" className="va-ops-drawer-action-btn va-ops-action-danger">
                <AppIcon name="x" size={15} strokeWidth={2} />
                Reject
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="refresh" size={15} strokeWidth={2} />
                Request Revision
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="shield" size={15} strokeWidth={2} />
                Bind
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="plus" size={15} strokeWidth={2} />
                Add Note
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
