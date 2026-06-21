"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import type { HistorySubmission } from "@/data/submissionHistory";
import { crossModuleRoutes, navigateWithHandoff } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";

type SubmissionHistoryDrawerProps = {
  submission: HistorySubmission | null;
  onClose: () => void;
};

const routingStatusClass = {
  Success: "badge-green",
  Failed: "badge-red",
  Pending: "badge-yellow",
} as const;

export function SubmissionHistoryDrawer({ submission, onClose }: SubmissionHistoryDrawerProps) {
  const router = useRouter();
  useEffect(() => {
    if (!submission) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [submission, onClose]);

  if (!submission) return null;

  const { drawer } = submission;

  const createSubmission = () => {
    navigateWithHandoff(
      router,
      crossModuleRoutes.submissionTracker(undefined, {
        href: `${routes.intakeForms}?view=history`,
        label: "Submission History",
      }),
      {
        type: "intake-to-submission",
        sourcePath: `${routes.intakeForms}?view=history`,
        returnLabel: "Submission History",
        payload: {
          client: submission.client,
          submissionId: submission.id,
          formType: submission.formType,
          coverage: drawer.submittedFields.find((f) => f.label === "Coverage")?.value,
        },
      },
      { href: `${routes.intakeForms}?view=history`, label: "Submission History" },
    );
    onClose();
  };

  const resumeDraft = () => {
    router.push(crossModuleRoutes.intakeDrafts(submission.id));
    onClose();
  };

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close submission details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${submission.client} submission details`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(submission.client)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{submission.client}</div>
              <div className="va-ops-drawer-role">
                {submission.formType} · {submission.status}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div><dt>Submitted By</dt><dd>{submission.submittedBy}</dd></div>
            <div><dt>Submitted At</dt><dd>{submission.submittedAt}</dd></div>
            <div><dt>Assigned Team</dt><dd>{drawer.assignedTeam}</dd></div>
            <div><dt>Validation</dt><dd>{submission.validationStatus}</dd></div>
          </dl>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Submitted Fields</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              {drawer.submittedFields.map((field) => (
                <div key={field.label}>
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {drawer.documentsUploaded.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Documents Uploaded</div>
              <ul className="intake-history-doc-list">
                {drawer.documentsUploaded.map((doc) => (
                  <li key={doc.name}>
                    <span>{doc.name}</span>
                    <span className={cn("badge", doc.status === "Uploaded" ? "badge-green" : "badge-yellow")}>
                      {doc.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Validation Log</div>
            <ul className="va-ops-gap-list">
              {drawer.validationLog.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>

          {drawer.routingLog.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Routing Log</div>
              <ul className="intake-history-routing-log">
                {drawer.routingLog.map((entry) => (
                  <li key={`${entry.system}-${entry.time}`}>
                    <div className="intake-history-routing-header">
                      <strong>{entry.system}</strong>
                      <span className={cn("badge", routingStatusClass[entry.status as keyof typeof routingStatusClass] ?? "badge-gray")}>
                        {entry.status}
                      </span>
                    </div>
                    <div className="intake-history-routing-msg">{entry.message}</div>
                    <div className="intake-history-routing-time">{entry.time}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawer.systemResponses.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">System Responses</div>
              <ul className="va-ops-gap-list">
                {drawer.systemResponses.map((resp) => (
                  <li key={resp}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              {submission.status === "Draft" ? (
                <button type="button" className="va-ops-drawer-action-btn primary" onClick={resumeDraft}>
                  <AppIcon name="folder" size={15} strokeWidth={2} />
                  Resume Draft
                </button>
              ) : (
                <button type="button" className="va-ops-drawer-action-btn primary" onClick={createSubmission}>
                  <AppIcon name="plus" size={15} strokeWidth={2} />
                  Create Submission
                </button>
              )}
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="clipboard" size={15} strokeWidth={2} />
                Edit Submission
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Duplicate Form
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="download" size={15} strokeWidth={2} />
                Download PDF
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="x" size={15} strokeWidth={2} />
                Archive
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
