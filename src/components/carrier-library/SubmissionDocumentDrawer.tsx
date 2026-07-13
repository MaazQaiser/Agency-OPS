"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { SubmissionDocument } from "@/data/submissionChecklist";

type SubmissionDocumentDrawerProps = {
  doc: SubmissionDocument | null;
  onClose: () => void;
};

export function SubmissionDocumentDrawer({ doc, onClose }: SubmissionDocumentDrawerProps) {
  useEffect(() => {
    if (!doc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.document.addEventListener("keydown", handleKeyDown);
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "";
    };
  }, [doc, onClose]);

  if (!doc) return null;

  const { drawer } = doc;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close document details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${doc.name} document details`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{doc.name}</div>
              <div className="va-ops-drawer-role">{doc.status}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Document Preview</div>
            <p className="va-ops-drawer-text">{drawer.preview}</p>
          </div>

          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            {drawer.requestedBy && (
              <div>
                <dt>Requested By</dt>
                <dd>{drawer.requestedBy}</dd>
              </div>
            )}
            {drawer.uploadedBy && (
              <div>
                <dt>Uploaded By</dt>
                <dd>{drawer.uploadedBy}</dd>
              </div>
            )}
          </dl>

          {drawer.uploadHistory.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Upload History</div>
              <ul className="submission-doc-history-list">
                {drawer.uploadHistory.map((entry) => (
                  <li key={entry.id}>
                    <strong>{entry.action}</strong>: {entry.by} · {entry.date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawer.versionHistory.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Version History</div>
              <ul className="va-ops-gap-list">
                {drawer.versionHistory.map((entry) => (
                  <li key={entry.id}>
                    {entry.version}: {entry.date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawer.internalNotes.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Internal Notes</div>
              <ul className="va-ops-gap-list">
                {drawer.internalNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="upload" size={15} strokeWidth={2} />
                Replace Document
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="download" size={15} strokeWidth={2} />
                Download
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Mark Verified
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="refresh" size={15} strokeWidth={2} />
                Request Again
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
