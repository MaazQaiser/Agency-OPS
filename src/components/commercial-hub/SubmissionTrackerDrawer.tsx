"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { DrawerSkeleton } from "@/components/shared/loading";
import { useDrawerLoading } from "@/hooks/useTabLoading";
import {
  computeCarrierSla,
  computeClientSla,
  computeHealthScore,
  getHealthClass,
  getSubmissionTimeline,
  requiredMarketCount,
  type TrackerSubmission,
} from "@/data/submissionTracker";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";
import { ClientLanguagePanel } from "@/components/bilingual/BilingualQueueDrawer";
import { EoRiskBreakdown } from "@/components/commercial/EoRiskBreakdown";
import { CoverageChecklistProgress } from "@/components/commercial/CoverageChecklistProgress";
import { eoRiskFromTrackerSubmission } from "@/lib/eoRiskScore";
import { progressFromTrackerSubmission } from "@/lib/coverageChecklistProgress";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { VaOpsDrawerRoot } from "@/components/ui/VaOpsDrawerRoot";
import { SubmissionQuotePanel } from "./SubmissionQuotePanel";

const docStatusIcon = {
  complete: "check",
  pending: "refresh",
  missing: "x",
} as const;

const statusClass: Record<string, string> = {
  "New Intake": "badge-blue",
  Reviewing: "badge-yellow",
  Marketed: "badge-gray",
  Quoted: "badge-green",
  Negotiation: "badge-yellow",
  "Pending Producer Approval": "badge-yellow",
  "Pending Docs": "badge-yellow",
  "Ready to Bind": "badge-green",
  Bound: "badge-green",
  Declined: "badge-red",
};

type SubmissionTrackerDrawerProps = {
  submission: TrackerSubmission | null;
  onClose: () => void;
};

function bindReadinessItems(submission: TrackerSubmission) {
  const binding = submission.binding;
  return [
    { label: "Quote selected", complete: Boolean(binding?.quoteSelected || submission.selectedQuoteId) },
    { label: "Producer approved", complete: Boolean(binding?.producerApproved) },
    { label: "Client approved", complete: Boolean(binding?.clientApproved) },
    { label: "Documents complete", complete: submission.documents.every((d) => d.status === "complete") },
    { label: "Payment ready", complete: Boolean(binding?.paymentReady) },
    {
      label: "Minimum markets met",
      complete: submission.marketsSubmitted >= requiredMarketCount,
    },
  ];
}

export function SubmissionTrackerDrawer({ submission, onClose }: SubmissionTrackerDrawerProps) {
  const drawerLoading = useDrawerLoading(submission);

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

  const eoRisk = eoRiskFromTrackerSubmission(submission);
  const checklistProgress = progressFromTrackerSubmission(submission);
  const healthScore = computeHealthScore(submission);
  const carrierSla = computeCarrierSla(submission);
  const clientSla = computeClientSla(submission);
  const timeline = getSubmissionTimeline(submission);
  const bindItems = bindReadinessItems(submission);
  const bindReady = bindItems.every((item) => item.complete);
  const riskFlags = [
    ...submission.coverageChecklist
      .filter((item) => item.status !== "complete")
      .map((item) => `${item.label} incomplete`),
    ...submission.documents
      .filter((item) => item.status === "missing")
      .map((item) => `${item.label} missing`),
    ...(submission.marketsSubmitted < requiredMarketCount ? ["Minimum markets not met"] : []),
  ];

  return (
    <VaOpsDrawerRoot>
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close submission drawer"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer submission-tracker-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${submission.client} submission inspection`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(submission.client)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{submission.client}</div>
              <div className="va-ops-drawer-role">
                {submission.coverage} · {submission.state}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          {drawerLoading ? (
            <DrawerSkeleton label="Loading submission details" />
          ) : (
            <>
              <ClientLanguagePanel clientName={submission.client} />

              <div className="va-ops-drawer-section submission-drawer-profile">
                <div className="va-ops-drawer-section-label">Client Profile</div>
                <dl className="submission-drawer-meta-grid">
                  <div>
                    <dt>Producer</dt>
                    <dd><UserChip name={submission.producer} showAvatar={false} /></dd>
                  </div>
                  <div>
                    <dt>Assigned VA</dt>
                    <dd>{submission.va}</dd>
                  </div>
                  <div>
                    <dt>Stage</dt>
                    <dd>
                      <span className={cn("badge", statusClass[submission.status])}>{submission.status}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Days open</dt>
                    <dd>{submission.daysOpen}</dd>
                  </div>
                  <div>
                    <dt>Target premium</dt>
                    <dd>{submission.premiumValue}</dd>
                  </div>
                  <div>
                    <dt>Next action</dt>
                    <dd>{submission.nextAction}</dd>
                  </div>
                </dl>
              </div>

              <div className="va-ops-drawer-section">
                <CoverageChecklistProgress progress={checklistProgress} />
              </div>

              <div className="va-ops-drawer-section">
                <div className="va-ops-drawer-section-label">Coverage Summary</div>
                <ul className="va-ops-drawer-list">
                  {submission.coverageChecklist.map((item) => (
                    <li key={item.label}>
                      {item.label} — {item.status}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="va-ops-drawer-section">
                <div className="va-ops-drawer-section-label">Documents Checklist</div>
                <ul className="submission-doc-checklist">
                  {submission.documents.map((item) => (
                    <li key={item.label} className={item.status}>
                      <AppIcon name={docStatusIcon[item.status]} size={14} strokeWidth={2.5} />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="va-ops-drawer-section">
                <div className="va-ops-drawer-section-label">Markets Sent</div>
                <ul className="va-ops-carrier-compare">
                  {submission.carriers.map((row) => (
                    <li key={`${row.carrier}-${row.status}`}>
                      <div className="va-ops-carrier-name">{row.carrier}</div>
                      <div className="va-ops-carrier-premium">{row.status}</div>
                    </li>
                  ))}
                </ul>
              </div>

              {submission.quotes.length > 0 && (
                <div className="va-ops-drawer-section">
                  <SubmissionQuotePanel
                    submission={submission}
                    selectedQuoteId={submission.selectedQuoteId}
                    onSelectQuote={() => {}}
                    onSendToProducer={() => {}}
                  />
                </div>
              )}

              <div className="va-ops-drawer-section">
                <div className="va-ops-drawer-section-label">Producer Notes</div>
                <ul className="va-ops-drawer-list">
                  {submission.producerNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="va-ops-drawer-section">
                <EoRiskBreakdown score={eoRisk} />
                <div className="va-ops-drawer-section-label">Risk Flags</div>
                {riskFlags.length === 0 ? (
                  <p className="va-ops-drawer-text">No active risk flags.</p>
                ) : (
                  <ul className="coverage-risk-flags-list">
                    {riskFlags.map((flag) => (
                      <li key={flag}>
                        <AppIcon name="triangle-alert" size={14} strokeWidth={2} />
                        {flag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="va-ops-drawer-section">
                <div className="va-ops-drawer-section-label">Bind Readiness</div>
                <div className={cn("submission-bind-readiness", bindReady && "is-ready")}>
                  <span className={cn("submission-health-score", getHealthClass(healthScore))}>
                    {bindReady ? "Ready" : "Not ready"}
                  </span>
                  <ul className="submission-bind-readiness-list">
                    {bindItems.map((item) => (
                      <li key={item.label} className={cn(item.complete && "is-complete")}>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="submission-tracker-sla-strip submission-drawer-sla">
                  <div className="submission-tracker-sla-item">
                    <span className="submission-tracker-detail-label">Health</span>
                    <span className={cn("submission-health-score", getHealthClass(healthScore))}>
                      {healthScore}%
                    </span>
                  </div>
                  <div className="submission-tracker-sla-item">
                    <span className="submission-tracker-detail-label">Carrier SLA</span>
                    <span className={cn("submission-sla", carrierSla.overdue && "submission-sla-blocked")}>
                      {carrierSla.label}
                    </span>
                  </div>
                  <div className="submission-tracker-sla-item">
                    <span className="submission-tracker-detail-label">Client SLA</span>
                    <span className={cn("submission-sla", clientSla.overdue && "submission-sla-blocked")}>
                      {clientSla.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="va-ops-drawer-section">
                <div className="va-ops-drawer-section-label">Activity Timeline</div>
                <ol className="submission-timeline">
                  {timeline.map((step, index) => (
                    <li
                      key={step.label}
                      className={cn("submission-timeline-step", step.complete && "complete")}
                    >
                      <div className="submission-timeline-marker" aria-hidden="true" />
                      <div className="submission-timeline-content">
                        <div className="submission-timeline-label">{step.label}</div>
                        {step.timestamp && (
                          <div className="submission-timeline-time">{step.timestamp}</div>
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="submission-timeline-connector" aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      </aside>
    </VaOpsDrawerRoot>
  );
}
