"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import {
  formatAuditClock,
  formatAuditDayLabel,
  type DraftAuditTrail,
} from "@/data/aiDraftAuditTrail";
import type { AiDraftSession } from "@/data/aiDraftReview";
import {
  buildAiGenerationMeta,
  enrichProposalActivityFeed,
  formatProposalId,
  getVersionHistoryLabel,
  mapTrailActivityToFeed,
  proposalLogStatusBadgeClass,
  resolveProposalLogStatus,
} from "@/data/proposalLog";
import { cn } from "@/lib/cn";

type ProposalLogPanelProps = {
  session: AiDraftSession;
  trail: DraftAuditTrail;
  onSelectVersion: (versionId: string) => void;
  className?: string;
};

/**
 * Proposal Log & AI Audit Metadata — draft visibility and mock audit tracking.
 */
export function ProposalLogPanel({
  session,
  trail,
  onSelectVersion,
  className,
}: ProposalLogPanelProps) {
  const status = resolveProposalLogStatus(session);
  const proposalId =
    trail.proposalId.startsWith("AO-") ? trail.proposalId : formatProposalId(session.id);
  const aiMeta = buildAiGenerationMeta(session, trail);
  const generatedAt = session.generatedAtMs;
  const lastEditedAt = trail.lastModifiedMs;
  const activity = enrichProposalActivityFeed(session, mapTrailActivityToFeed(trail.activity));
  const versionsAsc = [...trail.versions].sort((a, b) => a.version - b.version);
  const sentBy =
    trail.events.some((e) => e.state === "sent")
      ? trail.events.find((e) => e.state === "sent")?.user ?? "Send Center"
      : "Pending";

  const generationKpis = [
    { id: "provider", label: "AI Provider", value: aiMeta.provider, icon: "sparkles" as const },
    { id: "prompt", label: "Prompt Template", value: aiMeta.promptTemplate, icon: "file-text" as const },
    { id: "confidence", label: "Confidence", value: aiMeta.confidence, icon: "shield" as const },
    { id: "length", label: "Draft Length", value: `${aiMeta.wordCount} Words`, icon: "clipboard" as const },
    { id: "time", label: "Generation Time", value: `${aiMeta.generationSeconds} Seconds`, icon: "clock" as const },
  ];

  const metadataRows = [
    {
      id: "generated",
      label: "Generated",
      value: `${formatAuditDayLabel(generatedAt)} • ${formatAuditClock(generatedAt)}`,
      icon: "sparkles" as const,
    },
    {
      id: "edited",
      label: "Last Edited",
      value: `${formatAuditDayLabel(lastEditedAt)} • ${formatAuditClock(lastEditedAt)}`,
      icon: "clock" as const,
    },
    {
      id: "approved",
      label: "Approved By",
      value: trail.approvedBy ?? "Pending",
      icon: "user-check" as const,
    },
    {
      id: "sent",
      label: "Sent By",
      value: sentBy,
      icon: "send" as const,
    },
  ];

  return (
    <section
      className={cn("send-center-proposal-log", className)}
      aria-label="Proposal log and AI audit metadata"
    >
      <div className="send-center-proposal-log-header">
        <div>
          <h3 className="send-center-section-title">Proposal Log & AI Audit Metadata</h3>
          <p className="send-center-proposal-log-subtitle">
            Metadata and history for this AI-generated draft.
          </p>
        </div>
        <div className="send-center-proposal-log-exports">
          <button type="button" className="va-ops-action-btn" disabled>
            <AppIcon name="download" size={14} strokeWidth={2} aria-hidden />
            Download Metadata
          </button>
          <button type="button" className="va-ops-action-btn" disabled>
            Export Audit Log
          </button>
          <button type="button" className="va-ops-action-btn" disabled>
            Print Summary
          </button>
        </div>
      </div>

      <div className="send-center-proposal-log-grid">
        <div className="send-center-proposal-log-main">
          <section className="va-ops-panel send-center-proposal-details-card" aria-label="Proposal details">
            <div className="send-center-proposal-card-header">
              <h4 className="send-center-section-title">Proposal Details</h4>
              <span className={cn("badge", proposalLogStatusBadgeClass[status])}>{status}</span>
            </div>
            <dl className="send-center-proposal-log-details-grid">
              <div>
                <dt>Proposal ID</dt>
                <dd>{proposalId}</dd>
              </div>
              <div>
                <dt>Draft Version</dt>
                <dd>v{trail.version}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={cn("badge", proposalLogStatusBadgeClass[status])}>{status}</span>
                </dd>
              </div>
              <div>
                <dt>Template</dt>
                <dd>{session.selectedTemplate || trail.templateUsed || "Quote Follow-up"}</dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{session.language}</dd>
              </div>
              <div>
                <dt>Tone</dt>
                <dd>{session.tone}</dd>
              </div>
              <div>
                <dt>Generated By</dt>
                <dd>{session.generatedBy}</dd>
              </div>
            </dl>
          </section>

          <section className="va-ops-panel" aria-label="Draft metadata">
            <h4 className="send-center-section-title">Draft Metadata</h4>
            <ul className="send-center-proposal-log-meta-list">
              {metadataRows.map((row) => (
                <li key={row.id} className="send-center-proposal-log-meta-row">
                  <span className="send-center-proposal-log-meta-icon" aria-hidden="true">
                    <AppIcon name={row.icon} size={14} strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="send-center-proposal-log-meta-label">{row.label}</p>
                    <p className="send-center-proposal-log-meta-value">{row.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="va-ops-panel" aria-label="AI generation">
            <h4 className="send-center-section-title">AI Generation</h4>
            <div className="send-center-proposal-log-kpi-grid">
              {generationKpis.map((kpi) => (
                <article key={kpi.id} className="send-center-proposal-log-kpi">
                  <div className="send-center-proposal-log-kpi-top">
                    <AppIcon name={kpi.icon} size={14} strokeWidth={2.25} aria-hidden />
                    <span>{kpi.label}</span>
                  </div>
                  <p className="send-center-proposal-log-kpi-value">{kpi.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="va-ops-panel" aria-label="Version history">
            <h4 className="send-center-section-title">Version History</h4>
            <ul className="send-center-proposal-log-versions">
              {versionsAsc.map((version) => {
                const selected = version.id === trail.selectedVersionId;
                const label = getVersionHistoryLabel(version, trail.versions, trail.selectedVersionId);
                return (
                  <li key={version.id}>
                    <button
                      type="button"
                      className={cn(
                        "send-center-proposal-log-version-btn",
                        selected && "is-selected",
                      )}
                      onClick={() => onSelectVersion(version.id)}
                      aria-pressed={selected}
                    >
                      <span className="send-center-proposal-log-version-num">
                        Version {version.version}
                      </span>
                      <span className="send-center-proposal-log-version-label">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="send-center-proposal-log-side">
          <section className="va-ops-panel send-center-proposal-log-activity" aria-label="Proposal activity">
            <h4 className="send-center-section-title">Proposal Activity</h4>
            <ol className="send-center-proposal-log-activity-list">
              {activity.map((item) => (
                <li key={item.id} className="send-center-proposal-log-activity-item">
                  <span className="send-center-proposal-log-activity-icon" aria-hidden="true">
                    <AppIcon name={item.icon} size={14} strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="send-center-proposal-log-activity-desc">{item.description}</p>
                    <div className="send-center-proposal-log-activity-meta">
                      <span>{item.user}</span>
                      <time dateTime={new Date(item.atMs).toISOString()}>{item.timeLabel}</time>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </section>
  );
}
