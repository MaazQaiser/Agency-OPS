"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { ResearchProspect } from "@/data/researchVA";
import { getNameInitials } from "@/lib/nameInitials";

type ProspectDrawerProps = {
  prospect: ResearchProspect | null;
  onClose: () => void;
};

const qualificationStatusLabel = {
  ready: "Ready",
  incomplete: "Incomplete",
} as const;

export function ProspectDrawer({ prospect, onClose }: ProspectDrawerProps) {
  useEffect(() => {
    if (!prospect) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [prospect, onClose]);

  if (!prospect) return null;

  const { intelligence, qualification } = prospect;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close prospect drawer"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${prospect.business} prospect profile`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(prospect.business)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{prospect.business}</div>
              <div className="va-ops-drawer-role">
                {prospect.industry} · {prospect.location}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Company Profile</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div><dt>Business</dt><dd>{intelligence.businessName}</dd></div>
              <div><dt>Owner</dt><dd>{intelligence.ownerName}</dd></div>
              <div><dt>Phone</dt><dd>{intelligence.phone}</dd></div>
              <div><dt>Email</dt><dd>{intelligence.email}</dd></div>
              <div><dt>Website</dt><dd>{intelligence.website}</dd></div>
              <div><dt>Source</dt><dd>{prospect.source}</dd></div>
            </dl>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Enrichment Data</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div><dt>Current Carrier</dt><dd>{intelligence.currentCarrier}</dd></div>
              <div><dt>Renewal Date</dt><dd>{intelligence.renewalDate}</dd></div>
              <div><dt>Est. Premium</dt><dd>{intelligence.estimatedPremium}</dd></div>
            </dl>
            <div className="va-ops-coverage-gaps">
              <div className="va-ops-drawer-section-label">Coverage Gaps</div>
              <ul className="va-ops-drawer-list">
                {intelligence.coverageGaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Notes</div>
            <ul className="va-ops-drawer-list">
              {intelligence.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Previous Attempts</div>
            <ul className="va-ops-drawer-actions">
              {prospect.previousAttempts.map((attempt) => (
                <li key={attempt}>
                  <span>{attempt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Recommended Next Action</div>
            <p className="va-ops-drawer-text">{prospect.recommendedAction}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">
              Qualification — {qualificationStatusLabel[qualification.status]}
            </div>
            <ul className="va-ops-qual-checklist va-ops-qual-checklist-compact">
              {qualification.items.map((item) => (
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
                <AppIcon name="send" size={15} strokeWidth={2} />
                Assign to Dialer
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="plus" size={15} strokeWidth={2} />
                Add Note
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Mark Qualified
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Archive
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
