"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  aiComplianceChecklist,
  aiComplianceFooterCopy,
  type ComplianceNoticeState,
} from "@/data/aiComplianceNotice";
import { cn } from "@/lib/cn";
import { AiCompliancePolicyModal } from "./AiCompliancePolicyModal";

type ComplianceNoticeFooterProps = {
  state?: ComplianceNoticeState;
  className?: string;
};

/**
 * Persistent AI compliance notice for compose and draft review surfaces.
 */
export function ComplianceNoticeFooter({
  state = "normal",
  className,
}: ComplianceNoticeFooterProps) {
  const [expanded, setExpanded] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "send-center-compliance-notice",
          `send-center-compliance-notice--${state}`,
          className,
        )}
        aria-label="AI drafting compliance notice"
      >
        <div className="send-center-compliance-notice-main">
          <div className="send-center-compliance-notice-heading">
            <span className="send-center-compliance-notice-icon" aria-hidden="true">
              <AppIcon name="shield" size={14} strokeWidth={2.25} />
            </span>
            <div className="send-center-compliance-notice-copy">
              <p className="send-center-compliance-notice-title">
                {aiComplianceFooterCopy.title}
              </p>
              <p className="send-center-compliance-notice-lines">
                {aiComplianceFooterCopy.lines.join(" ")}
              </p>
            </div>
          </div>

          <div className="send-center-compliance-notice-meta">
            <span
              className="send-center-compliance-privacy-badge"
              tabIndex={0}
              title={aiComplianceFooterCopy.privacyTooltip}
              aria-label={`${aiComplianceFooterCopy.privacyBadge}. ${aiComplianceFooterCopy.privacyTooltip}`}
            >
              <AppIcon name="lock" size={11} strokeWidth={2.25} aria-hidden />
              {aiComplianceFooterCopy.privacyBadge}
              <span className="send-center-compliance-privacy-tooltip" role="tooltip">
                {aiComplianceFooterCopy.privacyTooltip}
              </span>
            </span>

            <button
              type="button"
              className="send-center-compliance-learn-more"
              onClick={() => setPolicyOpen(true)}
            >
              {aiComplianceFooterCopy.learnMoreLabel}
              <span aria-hidden="true"> →</span>
            </button>
          </div>
        </div>

        <div className="send-center-compliance-notice-collapse">
          <button
            type="button"
            className="send-center-compliance-collapse-trigger"
            aria-expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <span>{aiComplianceFooterCopy.expandLabel}</span>
            <AppIcon
              name="chevron-down"
              size={14}
              strokeWidth={2.25}
              className={cn(
                "send-center-compliance-collapse-chevron",
                expanded && "is-open",
              )}
              aria-hidden
            />
          </button>

          {expanded && (
            <ul className="send-center-compliance-notice-checklist">
              {aiComplianceChecklist.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <AiCompliancePolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </>
  );
}
