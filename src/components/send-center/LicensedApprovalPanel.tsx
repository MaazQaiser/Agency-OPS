"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { formatAiDraftRelativeTime, type AiDraftSession } from "@/data/aiDraftReview";
import { cn } from "@/lib/cn";

type LicensedApprovalPanelProps = {
  session: AiDraftSession;
  onAssignProducer?: () => void;
  className?: string;
};

/**
 * Right-rail licensed approval status (or empty reviewer state).
 * Full lifecycle history lives in ApprovalAuditTrailPanel.
 */
export function LicensedApprovalPanel({
  session,
  onAssignProducer,
  className,
}: LicensedApprovalPanelProps) {
  const reviewer = session.licensedReviewer;
  const isWaiting = session.licensedReviewGate === "waiting";
  const statusLabel = isWaiting ? "Waiting for Licensed Producer" : "Pending Review";
  const requestedMs = session.licensedReviewRequestedAtMs ?? session.generatedAtMs;

  if (!reviewer) {
    return (
      <section
        className={cn("va-ops-panel send-center-licensed-panel", className)}
        aria-label="Licensed producer assignment"
      >
        <div className="send-center-licensed-empty" role="status">
          <div className="send-center-licensed-empty-illustration" aria-hidden="true">
            <AppIcon name="user-check" size={36} strokeWidth={1.6} />
            <span className="send-center-licensed-empty-ring" />
          </div>
          <h3 className="send-center-licensed-empty-title">No reviewer assigned.</h3>
          <p className="send-center-licensed-empty-desc">
            Assign a licensed producer before requesting approval.
          </p>
          {onAssignProducer && (
            <button type="button" className="va-ops-action-btn" onClick={onAssignProducer}>
              Assign Producer
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className={cn("send-center-licensed-panel-stack", className)}>
      <section className="va-ops-panel send-center-licensed-status-card" aria-label="Approval status">
        <div className="send-center-proposal-card-header">
          <h3 className="send-center-section-title">Approval Status</h3>
          <span className="badge badge-yellow">{isWaiting ? "Waiting" : "Pending"}</span>
        </div>

        {isWaiting && (
          <div className="send-center-licensed-requested-banner" role="status">
            <AppIcon name="check" size={16} strokeWidth={2.25} aria-hidden />
            <span>Approval Requested</span>
            <span className="send-center-licensed-waiting-dot" aria-hidden="true" />
          </div>
        )}

        <dl className="send-center-new-draft-preview-list send-center-ai-draft-meta">
          <div>
            <dt>Status</dt>
            <dd>{statusLabel}</dd>
          </div>
          <div>
            <dt>Assigned To</dt>
            <dd>{reviewer}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>Licensed Producer</dd>
          </div>
          <div>
            <dt>Requested</dt>
            <dd>{formatAiDraftRelativeTime(requestedMs)}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>
              <span className="badge badge-yellow">{session.licensedReviewPriority}</span>
            </dd>
          </div>
          <div>
            <dt>Estimated Review</dt>
            <dd>{session.estimatedReviewLabel}</dd>
          </div>
        </dl>

        {isWaiting && (
          <div className="send-center-licensed-waiting" aria-live="polite">
            <span className="send-center-licensed-waiting-spinner" aria-hidden="true" />
            <span>Waiting for licensed producer review…</span>
          </div>
        )}
      </section>
    </div>
  );
}
