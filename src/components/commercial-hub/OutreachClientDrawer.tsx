"use client";

import { useEffect } from "react";
import { VaOpsDrawerRoot } from "@/components/ui/VaOpsDrawerRoot";
import { AppIcon } from "@/components/ui/AppIcon";
import type { OutreachClientProfile } from "@/data/outreachQueue";
import { getNameInitials } from "@/lib/nameInitials";

type OutreachClientDrawerProps = {
  client: string | null;
  profile: OutreachClientProfile | null;
  onClose: () => void;
  onReviseProposal?: (client: string) => void;
};

export function OutreachClientDrawer({ client, profile, onClose, onReviseProposal }: OutreachClientDrawerProps) {
  useEffect(() => {
    if (!client || !profile) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [client, profile, onClose]);

  if (!client || !profile) return null;

  return (
    <VaOpsDrawerRoot>
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close client outreach drawer"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${client} outreach details`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(client)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{client}</div>
              <div className="va-ops-drawer-role">
                {profile.businessType} · {profile.coverage}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div><dt>Producer</dt><dd>{profile.producer}</dd></div>
            <div><dt>Assigned VA</dt><dd>{profile.assignedVa}</dd></div>
            <div><dt>Renewal Date</dt><dd>{profile.renewalDate}</dd></div>
            <div><dt>Coverage</dt><dd>{profile.coverage}</dd></div>
          </dl>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quote History</div>
            <ul className="outreach-drawer-quote-list">
              {profile.quoteHistory.map((quote) => (
                <li key={`${quote.carrier}-${quote.premium}`}>
                  <strong>{quote.carrier}</strong> — {quote.premium}
                  <span className="outreach-drawer-quote-status">{quote.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Renewal Data</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div><dt>Policy</dt><dd>{profile.renewalData.policy}</dd></div>
              <div><dt>Expires</dt><dd>{profile.renewalData.expires}</dd></div>
              <div><dt>Premium</dt><dd>{profile.renewalData.premium}</dd></div>
            </dl>
          </div>

          {profile.objections.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Objections</div>
              <ul className="va-ops-gap-list">
                {profile.objections.map((objection) => (
                  <li key={objection}>{objection}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Notes</div>
            <ul className="va-ops-gap-list">
              {profile.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Contact History</div>
            <ul className="outreach-contact-history">
              {profile.contactHistory.map((entry) => (
                <li key={`${entry.action}-${entry.date}`}>
                  <div className="outreach-contact-action">{entry.action}</div>
                  <div className="outreach-contact-meta">{entry.date} · {entry.by}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="phone" size={15} strokeWidth={2} />
                Call Client
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="send" size={15} strokeWidth={2} />
                Send Reminder
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="message-square" size={15} strokeWidth={2} />
                Log Objection
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="clipboard" size={15} strokeWidth={2} />
                Schedule Follow-Up
              </button>
              <button type="button" className="va-ops-drawer-action-btn" onClick={() => onReviseProposal?.(client)}>
                <AppIcon name="refresh" size={15} strokeWidth={2} />
                Revise Proposal
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="user-plus" size={15} strokeWidth={2} />
                Reassign
              </button>
            </div>
          </div>
        </div>
      </aside>
    </VaOpsDrawerRoot>
  );
}
