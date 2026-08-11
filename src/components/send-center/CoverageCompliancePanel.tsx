"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import type { AiDraftSession } from "@/data/aiDraftReview";
import { cn } from "@/lib/cn";

type CoverageCompliancePanelProps = {
  session: AiDraftSession;
  hasCoverageIssues: boolean;
  onRequestReview: () => void;
  onContinueEditing: () => void;
  onSaveDraft: () => void;
  onAssignProducer?: () => void;
  canRequestReview?: boolean;
  className?: string;
};

type ChecklistItem = {
  id: string;
  label: string;
  state: "ok" | "warn";
};

function buildChecklist(session: AiDraftSession, hasCoverageIssues: boolean): ChecklistItem[] {
  const hasCustomer = Boolean(session.clientName.trim());
  const hasAttachments = true;
  const formattingOk = Boolean(session.subject.trim() && session.body.trim());
  return [
    {
      id: "customer",
      label: "Customer Information Present",
      state: hasCustomer ? "ok" : "warn",
    },
    {
      id: "attachments",
      label: "Required Attachments Added",
      state: hasAttachments ? "ok" : "warn",
    },
    {
      id: "licensed",
      label:
        session.licensedReviewGate === "waiting" || hasCoverageIssues
          ? "Licensed Review Pending"
          : "Licensed Review Not Required",
      state: hasCoverageIssues || session.licensedReviewGate === "waiting" ? "warn" : "ok",
    },
    {
      id: "formatting",
      label: "Email Formatting Complete",
      state: formattingOk ? "ok" : "warn",
    },
  ];
}

/**
 * Coverage compliance sidebar: status, checklist, risk, or clear empty state.
 * Primary actions live in the sticky footer — not duplicated here.
 */
export function CoverageCompliancePanel({
  session,
  hasCoverageIssues,
  onAssignProducer,
  className,
}: CoverageCompliancePanelProps) {
  if (!hasCoverageIssues) {
    return (
      <section
        className={cn("va-ops-panel send-center-compliance-clear", className)}
        aria-label="Compliance status"
      >
        <div className="send-center-compliance-clear-inner" role="status">
          <div className="send-center-compliance-clear-icon" aria-hidden="true">
            <AppIcon name="check" size={22} strokeWidth={2.25} />
          </div>
          <h3 className="send-center-compliance-clear-title">No Compliance Warnings</h3>
          <p className="send-center-compliance-clear-desc">
            This draft is ready for approval.
          </p>
        </div>
      </section>
    );
  }

  const isWaiting = session.licensedReviewGate === "waiting";
  const approvalStatus = isWaiting ? "Waiting" : "Pending";
  const checklist = buildChecklist(session, true);
  const missingReviewer = !session.licensedReviewer;

  return (
    <div className={cn("send-center-compliance-stack", className)}>
      <section className="va-ops-panel send-center-compliance-status-card" aria-label="Compliance status">
        <div className="send-center-proposal-card-header">
          <h3 className="send-center-section-title">Compliance Status</h3>
          <span className="badge badge-yellow">Review Required</span>
        </div>

        <dl className="send-center-new-draft-preview-list send-center-ai-draft-meta">
          <div>
            <dt>Coverage Language</dt>
            <dd>
              <span className="badge badge-yellow">Detected</span>
            </dd>
          </div>
          <div>
            <dt>Licensed Review</dt>
            <dd>
              <span className="badge badge-red">Required</span>
            </dd>
          </div>
          <div>
            <dt>Approval Status</dt>
            <dd>
              <span className="badge badge-yellow">{approvalStatus}</span>
            </dd>
          </div>
          <div>
            <dt>Risk Level</dt>
            <dd>
              <span className="badge badge-yellow">Medium</span>
            </dd>
          </div>
        </dl>

        {missingReviewer && (
          <div className="send-center-compliance-assign">
            <p>Assign a licensed producer before requesting review.</p>
            {onAssignProducer && (
              <button type="button" className="va-ops-action-btn" onClick={onAssignProducer}>
                Assign Producer
              </button>
            )}
          </div>
        )}
      </section>

      <section className="va-ops-panel send-center-compliance-checklist-card" aria-label="Compliance checklist">
        <h3 className="send-center-section-title">Compliance Checklist</h3>
        <ul className="send-center-compliance-checklist">
          {checklist.map((item) => (
            <li
              key={item.id}
              className={cn(
                "send-center-compliance-check-item",
                item.state === "ok" ? "is-ok" : "is-warn",
              )}
            >
              <span className="send-center-compliance-check-mark" aria-hidden="true">
                {item.state === "ok" ? "✓" : "⚠"}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="va-ops-panel send-center-compliance-risk-card" aria-label="Risk assessment">
        <div className="send-center-proposal-card-header">
          <h3 className="send-center-section-title">Risk Assessment</h3>
          <span className="badge badge-yellow">Medium</span>
        </div>
        <dl className="send-center-new-draft-preview-list send-center-ai-draft-meta">
          <div>
            <dt>Coverage Content</dt>
            <dd>
              <span className="badge badge-yellow">Detected</span>
            </dd>
          </div>
          <div>
            <dt>Sending Status</dt>
            <dd>
              <span className="badge badge-red">Blocked</span>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
