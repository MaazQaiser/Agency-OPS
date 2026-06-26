"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { DrawerSkeleton } from "@/components/shared/loading";
import { useDrawerLoading } from "@/hooks/useTabLoading";
import type { HubSubmission } from "@/data/commercialHub";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";
import { ClientLanguagePanel } from "@/components/bilingual/BilingualQueueDrawer";
import { EoRiskBreakdown } from "@/components/commercial/EoRiskBreakdown";
import { CoverageChecklistProgress } from "@/components/commercial/CoverageChecklistProgress";
import { eoRiskFromHubSubmission } from "@/lib/eoRiskScore";
import { progressFromHubMissingDocs } from "@/lib/coverageChecklistProgress";

type SubmissionDrawerProps = {
  submission: HubSubmission | null;
  onClose: () => void;
};

const statusClass = {
  Quoted: "badge-green",
  Pending: "badge-yellow",
  Overdue: "badge-red",
  Negotiation: "badge-blue",
  "Ready to Bind": "badge-green",
} as const;

export function SubmissionDrawer({ submission, onClose }: SubmissionDrawerProps) {
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

  const eoRisk = eoRiskFromHubSubmission(submission);
  const checklistProgress = progressFromHubMissingDocs(submission.missingDocs);

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close submission drawer"
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
                {submission.coverage} · {submission.stage}
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

          <div className="va-ops-drawer-section">
            <EoRiskBreakdown score={eoRisk} />
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Current Stage</div>
            <span className={cn("badge", statusClass[submission.status])}>{submission.status}</span>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Coverage Requested</div>
            <p className="va-ops-drawer-text">{submission.coverageRequested}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Carrier Submissions</div>
            <ul className="va-ops-carrier-compare">
              {submission.carrierSubmissions.map((row) => (
                <li key={`${row.carrier}-${row.status}`}>
                  <div className="va-ops-carrier-name">{row.carrier}</div>
                  <div className="va-ops-carrier-premium">
                    {row.status}
                    {row.premium ? ` · ${row.premium}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quote Comparison</div>
            <ul className="va-ops-carrier-compare">
              {submission.quoteComparison.map((row) => (
                <li key={row.carrier}>
                  <div className="va-ops-carrier-name">{row.carrier}</div>
                  <div className="va-ops-carrier-premium">{row.premium}</div>
                  <div className="va-ops-carrier-notes">{row.notes}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <CoverageChecklistProgress progress={checklistProgress} />
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Missing Docs</div>
            {submission.missingDocs.length > 0 ? (
              <ul className="va-ops-drawer-list">
                {submission.missingDocs.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            ) : (
              <p className="va-ops-drawer-text">None outstanding</p>
            )}
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Producer Notes</div>
            <ul className="va-ops-drawer-list">
              {submission.producerNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Broker Notes</div>
            <ul className="va-ops-drawer-list">
              {submission.brokerNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quick Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="target" size={15} strokeWidth={2} />
                Add Market
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="upload" size={15} strokeWidth={2} />
                Upload Docs
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="refresh" size={15} strokeWidth={2} />
                Request Follow-Up
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="trending-up" size={15} strokeWidth={2} />
                Move Stage
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Mark Bind Ready
              </button>
            </div>
          </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
