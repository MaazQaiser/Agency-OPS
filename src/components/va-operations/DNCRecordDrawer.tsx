"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  dncOverrideClass,
  dncStatusClass,
  dncTypeClass,
  type DncRecord,
} from "@/data/dncLog";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";

type DNCRecordDrawerProps = {
  record: DncRecord | null;
  canClearDnc: boolean;
  canApproveOverride: boolean;
  onClose: () => void;
  onAction: (action: string, record: DncRecord) => void;
};

export function DNCRecordDrawer({
  record,
  canClearDnc,
  canApproveOverride,
  onClose,
  onAction,
}: DNCRecordDrawerProps) {
  useEffect(() => {
    if (!record) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [record, onClose]);

  if (!record) return null;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close DNC details" onClick={onClose} />
      <aside className="va-ops-drawer va-ops-drawer-wide" role="dialog" aria-modal="true" aria-label={`DNC: ${record.leadName}`}>
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(record.leadName)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{record.leadName}</div>
              <div className="va-ops-drawer-role">{record.businessName}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="dnc-drawer-badges">
            <span className={cn("badge", dncTypeClass[record.dncType])}>{record.dncType}</span>
            <span className={cn("badge", dncStatusClass[record.status])}>{record.status}</span>
            <span className={cn("badge", dncOverrideClass[record.overrideStatus])}>{record.overrideStatus}</span>
            <span className="badge badge-red">DNC Protected</span>
          </div>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Lead Summary</div>
            <dl className="va-ops-lead-details">
              <div><dt>Phone</dt><dd>{record.phone}</dd></div>
              <div><dt>Email</dt><dd>{record.email}</dd></div>
              <div><dt>Marked by</dt><dd><UserChip name={record.markedBy} /></dd></div>
              <div><dt>Date added</dt><dd>{record.dateAdded}</dd></div>
            </dl>
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">DNC Reason</div>
            <p className="va-ops-drawer-text">{record.reason}</p>
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Communication History</div>
            {record.communicationHistory.length === 0 ? (
              <p className="dnc-drawer-empty">No communication events logged.</p>
            ) : (
              <ul className="dnc-comm-list">
                {record.communicationHistory.map((entry) => (
                  <li key={entry.id} className={cn("dnc-comm-item", entry.blocked && "blocked")}>
                    <div className="dnc-comm-header">
                      <span className="badge badge-gray">{entry.channel}</span>
                      {entry.blocked && <span className="badge badge-red">Blocked</span>}
                      <time>{entry.timestamp}</time>
                    </div>
                    <p>{entry.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Notes</div>
            {record.notes.length === 0 ? (
              <p className="dnc-drawer-empty">No notes yet.</p>
            ) : (
              <ul className="va-ops-drawer-list">
                {record.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Related Submissions</div>
            {record.relatedSubmissions.length === 0 ? (
              <p className="dnc-drawer-empty">No linked submissions.</p>
            ) : (
              <ul className="va-ops-gap-list">
                {record.relatedSubmissions.map((sub) => (
                  <li key={sub}>{sub}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Override Requests</div>
            {record.overrideRequests.length === 0 ? (
              <p className="dnc-drawer-empty">No override requests.</p>
            ) : (
              <ul className="dnc-override-list">
                {record.overrideRequests.map((req) => (
                  <li key={req.id} className="dnc-override-item">
                    <div className="dnc-override-header">
                      <UserChip name={req.requestedBy} />
                      <span className={cn("badge", dncOverrideClass[req.status])}>{req.status}</span>
                    </div>
                    <p>{req.reason}</p>
                    <time>{req.timestamp}</time>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Compliance Timeline</div>
            <ol className="dnc-timeline">
              {record.complianceTimeline.map((entry) => (
                <li key={entry.id} className="dnc-timeline-item">
                  <span className="dnc-timeline-dot" aria-hidden="true" />
                  <div>
                    <strong>{entry.label}</strong>
                    <p>{entry.detail}</p>
                    <span className="dnc-timeline-meta">{entry.actor} · {entry.timestamp}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Request Override", record)}>
                Request Override
              </button>
              <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Add Note", record)}>
                Add Note
              </button>
              <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Export Record", record)}>
                Export Record
              </button>
              {canApproveOverride && record.overrideStatus === "Pending Owner Approval" && (
                <>
                  <button type="button" className="va-ops-drawer-action-btn primary" onClick={() => onAction("Approve Override", record)}>
                    Approve Override
                  </button>
                  <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Deny Override", record)}>
                    Deny Override
                  </button>
                </>
              )}
              {canClearDnc && record.status !== "Cleared" && (
                <button type="button" className="va-ops-drawer-action-btn va-ops-action-danger" onClick={() => onAction("Clear DNC", record)}>
                  Clear DNC
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
