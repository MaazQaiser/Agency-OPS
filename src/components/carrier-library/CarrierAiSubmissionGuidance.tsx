"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { aiSubmissionGuidance } from "@/data/submissionRules";

export function CarrierAiSubmissionGuidance() {
  const { summary, bestCarrier, declineRisks, requiredDocs, backupCarrier } = aiSubmissionGuidance;

  return (
    <section className="va-ops-panel carrier-ai-guidance" aria-label="AI submission guidance">
      <div className="carrier-ai-guidance-header">
        <AppIcon name="sparkles" size={18} strokeWidth={2} className="carrier-ai-guidance-icon" />
        <div>
          <h3 className="carrier-ai-guidance-title">AI Submission Guidance</h3>
          <p className="carrier-ai-guidance-summary">{summary}</p>
        </div>
      </div>

      <div className="carrier-ai-guidance-grid">
        <article className="carrier-ai-guidance-block carrier-ai-guidance-block--best">
          <span className="carrier-ai-guidance-block-label">Best carrier</span>
          <strong className="carrier-ai-guidance-block-value">{bestCarrier.name}</strong>
          <span className="carrier-ai-guidance-block-meta">{bestCarrier.product}</span>
          <p className="carrier-ai-guidance-block-detail">{bestCarrier.reason}</p>
        </article>

        <article className="carrier-ai-guidance-block carrier-ai-guidance-block--decline">
          <span className="carrier-ai-guidance-block-label">Decline risks</span>
          <ul className="carrier-ai-guidance-list">
            {declineRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </article>

        <article className="carrier-ai-guidance-block carrier-ai-guidance-block--docs">
          <span className="carrier-ai-guidance-block-label">Required docs</span>
          <ul className="carrier-ai-guidance-list carrier-ai-guidance-docs">
            {requiredDocs.map((doc) => (
              <li key={doc}>
                <AppIcon name="file-text" size={13} strokeWidth={2} />
                {doc}
              </li>
            ))}
          </ul>
        </article>

        <article className="carrier-ai-guidance-block carrier-ai-guidance-block--backup">
          <span className="carrier-ai-guidance-block-label">Suggested backup</span>
          <strong className="carrier-ai-guidance-block-value">{backupCarrier.name}</strong>
          <span className="carrier-ai-guidance-block-meta">{backupCarrier.product}</span>
          <p className="carrier-ai-guidance-block-detail">{backupCarrier.reason}</p>
        </article>
      </div>
    </section>
  );
}
