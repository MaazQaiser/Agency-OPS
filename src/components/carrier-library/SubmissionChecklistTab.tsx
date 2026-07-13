"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { DEFAULT_CARRIER_PROFILE_ID } from "@/data/carrierProfile";
import {
  coverageValidationClass,
  DEFAULT_SUBMISSION_ID,
  documentStatusClass,
  getSubmissionApprovalStatus,
  getSubmissionChecklist,
  submissionChecklistHeader,
  type SubmissionDocument,
} from "@/data/submissionChecklist";
import { routes } from "@/lib/routes";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { cn } from "@/lib/cn";
import { HubEmptyState } from "@/components/state";
import { SubmissionDocumentDrawer } from "./SubmissionDocumentDrawer";

export function SubmissionChecklistTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submission") ?? DEFAULT_SUBMISSION_ID;
  const carrierId = searchParams.get("carrier") ?? DEFAULT_CARRIER_PROFILE_ID;

  const submission = useMemo(() => getSubmissionChecklist(submissionId), [submissionId]);
  const [selectedDocument, setSelectedDocument] = useState<SubmissionDocument | null>(null);

  const goToProfile = () => {
    router.push(`${routes.carrierLibrary}?view=profile&carrier=${carrierId}`, { scroll: false });
  };

  if (!submission) {
    return (
      <div className="va-ops-role-view submission-checklist">
        <section className="va-ops-panel">
          <HubEmptyState
            preset="generic-list"
            title="Submission checklist not found"
            description="This submission may have been archived or the link is outdated."
            ctaLabel="Back to Carrier Profile"
            onAction={goToProfile}
          />
        </section>
      </div>
    );
  }

  const approvalStatus = getSubmissionApprovalStatus(submission);
  const isReady = approvalStatus === "Ready";
  const { readiness } = submission;

  return (
    <div className="va-ops-role-view submission-checklist">
      <RoleTabHeader
        title={submissionChecklistHeader.title}
        subtitle={submissionChecklistHeader.subtitle}
        quickActions={submissionChecklistHeader.quickActions}
      />

      <section className="va-ops-panel submission-summary" aria-label="Submission summary">
        <h3 className="submission-client-name">{submission.clientName}</h3>
        <dl className="submission-summary-grid">
          <div>
            <dt>Carrier</dt>
            <dd>{submission.carrier}</dd>
          </div>
          <div>
            <dt>Coverage Type</dt>
            <dd>{submission.coverageType}</dd>
          </div>
          <div>
            <dt>Assigned VA</dt>
            <dd>{submission.assignedVa}</dd>
          </div>
          <div>
            <dt>Producer</dt>
            <dd>{submission.producer}</dd>
          </div>
          <div>
            <dt>Submission Date</dt>
            <dd>{submission.submissionDate}</dd>
          </div>
          <div>
            <dt>Renewal Date</dt>
            <dd>{submission.renewalDate}</dd>
          </div>
          <div>
            <dt>Estimated Premium</dt>
            <dd className="commercial-hub-premium">{submission.estimatedPremium}</dd>
          </div>
        </dl>
      </section>

      <div className="submission-checklist-main">
        <section className="va-ops-panel" aria-label="Required documents">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Required Documents</h3>
            <p className="va-ops-section-sub">Click a document to view upload history and details.</p>
          </div>
          <div className="submission-doc-list">
            {submission.documents.map((doc) => (
              <button
                key={doc.id}
                type="button"
                className="submission-doc-row"
                onClick={() => setSelectedDocument(doc)}
              >
                <div className="submission-doc-row-main">
                  <span className="submission-doc-name">{doc.name}</span>
                  <span className={cn("badge", documentStatusClass[doc.status])}>{doc.status}</span>
                </div>
                <div className="submission-doc-row-meta">
                  {doc.uploadedBy && (
                    <span>
                      Uploaded by: <strong>{doc.uploadedBy}</strong>
                    </span>
                  )}
                  {doc.requestedAgo && (
                    <span>
                      Requested: <strong>{doc.requestedAgo}</strong>
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="submission-checklist-sidebar">
          <section className="va-ops-panel submission-readiness-panel" aria-label="Readiness score">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Readiness Score</h3>
              <p className="va-ops-section-sub">Quick readiness view before submit.</p>
            </div>
            <dl className="submission-readiness-stats">
              <div>
                <dt>Completed Items</dt>
                <dd>{readiness.completedItems}</dd>
              </div>
              <div>
                <dt>Pending Items</dt>
                <dd>{readiness.pendingItems}</dd>
              </div>
              <div>
                <dt>Completion</dt>
                <dd>{readiness.completion}%</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={cn("badge", readiness.status === "Ready" ? "badge-green" : "badge-red")}>
                    {readiness.status}
                  </span>
                </dd>
              </div>
            </dl>
            <div className="submission-readiness-progress">
              <div
                className="submission-readiness-progress-fill"
                style={{ width: `${readiness.completion}%` }}
              />
            </div>
            {readiness.blockingItems.length > 0 && (
              <div className="submission-blocking-items">
                <div className="submission-blocking-label">Blocking Items</div>
                <ul>
                  {readiness.blockingItems.map((item) => (
                    <li key={item}>
                      <AppIcon name="triangle-alert" size={14} strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </aside>
      </div>

      <section className="va-ops-panel" aria-label="Coverage validation">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Coverage Validation</h3>
          <p className="va-ops-section-sub">Confirm coverage lines before sending to market.</p>
        </div>
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table submission-coverage-table">
            <thead>
              <tr>
                <th>Coverage</th>
                <th>Status</th>
                <th>Details</th>
                <th>Issue</th>
              </tr>
            </thead>
            <tbody>
              {submission.coverageValidation.map((item) => (
                <tr key={item.id}>
                  <td className="commercial-hub-client-cell">{item.name}</td>
                  <td>
                    <span className={cn("badge", coverageValidationClass[item.status])}>{item.status}</span>
                  </td>
                  <td>{item.detail}</td>
                  <td className={item.issue ? "submission-cell-warning" : ""}>{item.issue ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="submission-checklist-mid-grid">
        <section className="va-ops-panel" aria-label="Underwriting questions">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Carrier Underwriting Questions</h3>
            <p className="va-ops-section-sub">Carrier qualification responses.</p>
          </div>
          <dl className="submission-underwriting-grid">
            <div>
              <dt>Years in Business</dt>
              <dd>{submission.underwritingQuestions.yearsInBusiness}</dd>
            </div>
            <div>
              <dt>Prior Claims</dt>
              <dd>{submission.underwritingQuestions.priorClaims}</dd>
            </div>
            <div>
              <dt>Open Losses</dt>
              <dd>{submission.underwritingQuestions.openLosses}</dd>
            </div>
            <div>
              <dt>Prior Cancellation</dt>
              <dd>{submission.underwritingQuestions.priorCancellation}</dd>
            </div>
            <div>
              <dt>Subcontractor Cost</dt>
              <dd>{submission.underwritingQuestions.subcontractorCost}</dd>
            </div>
            <div>
              <dt>High-Risk Ops</dt>
              <dd>{submission.underwritingQuestions.highRiskOperations}</dd>
            </div>
          </dl>
        </section>

        <section className="va-ops-panel" aria-label="Broker notes">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Broker Notes</h3>
            <p className="va-ops-section-sub">Team collaboration and submission context.</p>
          </div>
          <ul className="carrier-notes-list">
            {submission.brokerNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel submission-approval-panel aos-card--action" aria-label="Submission approval">
        <div className="submission-approval-header">
          <div>
            <h3 className="va-ops-section-title">Submission Approval</h3>
            <p className="va-ops-section-sub">Final gate before sending to market.</p>
          </div>
          <span className={cn("badge submission-approval-badge", isReady ? "badge-green" : "badge-red")}>
            {approvalStatus}
          </span>
        </div>
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table submission-approval-table">
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submission.approvalChecklist.map((item) => (
                <tr key={item.id} className={cn(item.complete && "submission-approval-row-complete")}>
                  <td>{item.label}</td>
                  <td>
                    <span className={cn("submission-approval-status-cell", item.complete ? "complete" : "incomplete")}>
                      <AppIcon name={item.complete ? "check" : "x"} size={15} strokeWidth={2.5} />
                      {item.complete ? "Complete" : "Incomplete"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="submission-approval-actions">
          <button
            type="button"
            className={cn("va-ops-role-action-btn submission-submit-cta", !isReady && "disabled")}
            disabled={!isReady}
          >
            <AppIcon name="send" size={15} strokeWidth={2} />
            Submit to Carrier
          </button>
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Checklist activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Checklist Activity</h3>
          <p className="va-ops-section-sub">Audit trail of submission preparation.</p>
        </div>
        <ol className="outreach-activity-timeline">
          {submission.activity.map((item) => (
            <li key={item.id} className="outreach-activity-item">
              <div className="outreach-activity-dot" aria-hidden="true" />
              <div className="outreach-activity-content">
                <div className="outreach-activity-message">{item.message}</div>
                <div className="outreach-activity-time">{item.timeAgo}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <SubmissionDocumentDrawer doc={selectedDocument} onClose={() => setSelectedDocument(null)} />
    </div>
  );
}
