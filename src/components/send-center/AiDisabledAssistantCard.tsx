"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import {
  aiDisabledCapabilities,
  type SendCenterAiSettings,
} from "@/data/sendCenterAiSettings";
import { cn } from "@/lib/cn";

type AiDisabledAssistantCardProps = {
  settings: SendCenterAiSettings;
  className?: string;
};

/**
 * Muted AI Assistant panel shown when drafting is admin-disabled.
 */
export function AiDisabledAssistantCard({ settings, className }: AiDisabledAssistantCardProps) {
  return (
    <div className={cn("send-center-ai-disabled-stack", className)}>
      <section className="va-ops-panel send-center-ai-disabled-card" aria-label="AI Assistant status">
        <div className="send-center-ai-disabled-illustration" aria-hidden="true">
          <span className="send-center-ai-disabled-illustration-ring" />
          <AppIcon name="sparkles" size={28} strokeWidth={1.6} className="send-center-ai-disabled-sparkle" />
          <span className="send-center-ai-disabled-slash" />
          <span className="send-center-ai-disabled-lock-badge">
            <AppIcon name="lock" size={12} strokeWidth={2.25} />
          </span>
        </div>

        <div className="send-center-proposal-card-header">
          <h3 className="send-center-section-title">AI Assistant</h3>
          <span className="badge badge-gray">Disabled</span>
        </div>

        <dl className="send-center-new-draft-preview-list send-center-ai-draft-meta">
          <div>
            <dt>Status</dt>
            <dd>
              <span className="badge badge-gray">{settings.statusLabel}</span>
            </dd>
          </div>
          <div>
            <dt>Reason</dt>
            <dd>{settings.reason}</dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>{settings.lastUpdatedLabel}</dd>
          </div>
        </dl>
      </section>

      <section className="va-ops-panel send-center-ai-disabled-checklist-card" aria-label="Available actions">
        <h3 className="send-center-section-title">While AI drafting is disabled you can still:</h3>
        <ul className="send-center-ai-disabled-checklist">
          {aiDisabledCapabilities.map((item) => (
            <li key={item}>
              <AppIcon name="check" size={14} strokeWidth={2.5} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="va-ops-panel send-center-ai-disabled-admin-card" aria-label="Administrator notice">
        <h3 className="send-center-section-title">{settings.adminNoticeTitle}</h3>
        <p className="send-center-ai-disabled-admin-body">{settings.adminNoticeBody}</p>
      </section>
    </div>
  );
}
