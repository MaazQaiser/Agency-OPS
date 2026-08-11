"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import {
  formatAuditClock,
  formatAuditDayLabel,
  getAuditLifecycleTone,
  getCurrentAuditLifecycleState,
  type AuditLifecycleState,
  type AuditTimelineEvent,
  type DraftAuditTrail,
} from "@/data/aiDraftAuditTrail";
import { cn } from "@/lib/cn";

type ApprovalAuditTrailPanelProps = {
  trail: DraftAuditTrail | null;
  onSelectVersion: (versionId: string) => void;
  className?: string;
};

function LifecycleIcon({ state }: { state: AuditLifecycleState }) {
  const name =
    state === "created"
      ? "clipboard"
      : state === "generated"
        ? "sparkles"
        : state === "reviewed"
          ? "user-check"
          : state === "approved"
            ? "check"
            : "send";
  return <AppIcon name={name} size={14} strokeWidth={2.25} aria-hidden />;
}

function TimelineEventCard({
  event,
  isCurrent,
}: {
  event: AuditTimelineEvent;
  isCurrent: boolean;
}) {
  const tone = getAuditLifecycleTone(event.state);
  return (
    <article
      className={cn(
        "send-center-audit-event-card",
        `send-center-audit-event-card--${tone}`,
        isCurrent && "is-current",
      )}
    >
      <div className={cn("send-center-audit-event-icon", `tone-${tone}`)} aria-hidden="true">
        <LifecycleIcon state={event.state} />
      </div>
      <div className="send-center-audit-event-body">
        <div className="send-center-audit-event-top">
          <h4 className="send-center-audit-event-title">{event.title}</h4>
          <time className="send-center-audit-event-time" dateTime={new Date(event.atMs).toISOString()}>
            {event.timeLabel}
          </time>
        </div>
        <p className="send-center-audit-event-desc">{event.description}</p>
        <div className="send-center-audit-event-meta">
          <span className="send-center-audit-event-user">{event.user}</span>
          <span className="send-center-audit-event-role">{event.role}</span>
          <span className="send-center-audit-event-day">
            {event.dayLabel} • {event.timeLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * Approval Timeline & Audit Trail — full draft lifecycle history.
 */
export function ApprovalAuditTrailPanel({
  trail,
  onSelectVersion,
  className,
}: ApprovalAuditTrailPanelProps) {
  if (!trail || trail.events.length === 0) {
    return (
      <section
        className={cn("va-ops-panel send-center-audit-empty-panel", className)}
        aria-label="Approval timeline"
      >
        <div className="send-center-audit-empty" role="status">
          <div className="send-center-audit-empty-illustration" aria-hidden="true">
            <AppIcon name="clipboard" size={32} strokeWidth={1.6} />
          </div>
          <h3 className="send-center-audit-empty-title">No approval history available yet.</h3>
          <p className="send-center-audit-empty-desc">
            Timeline will appear after a draft is generated.
          </p>
        </div>
      </section>
    );
  }

  const currentState = getCurrentAuditLifecycleState(trail.events);
  const chronological = [...trail.events].sort((a, b) => a.atMs - b.atMs);
  const activityNewestFirst = [...trail.activity].sort((a, b) => b.atMs - a.atMs);
  const versionsNewestFirst = [...trail.versions].sort((a, b) => b.version - a.version);

  return (
    <section
      className={cn("send-center-audit-trail", className)}
      aria-label="Approval timeline and audit trail"
    >
      <div className="send-center-audit-trail-grid">
        <div className="send-center-audit-timeline-col">
          <section className="va-ops-panel send-center-audit-timeline-panel">
            <div className="send-center-proposal-card-header">
              <h3 className="send-center-section-title">Approval Timeline</h3>
              <span className="badge badge-gray">Lifecycle</span>
            </div>

            <ol className="send-center-audit-timeline">
              {chronological.map((event, index) => {
                const lastCurrentIndex = chronological.reduce(
                  (acc, e, i) => (e.state === currentState ? i : acc),
                  -1,
                );
                const isCurrent = index === lastCurrentIndex;
                return (
                  <li key={event.id} className="send-center-audit-timeline-item">
                    <div className="send-center-audit-timeline-rail" aria-hidden="true">
                      <span
                        className={cn(
                          "send-center-audit-timeline-dot",
                          `tone-${getAuditLifecycleTone(event.state)}`,
                          isCurrent && "is-current",
                        )}
                      >
                        ✓
                      </span>
                      {index < chronological.length - 1 && (
                        <span className="send-center-audit-timeline-connector" />
                      )}
                    </div>
                    <TimelineEventCard event={event} isCurrent={isCurrent} />
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <div className="send-center-audit-side-col">
          <section className="va-ops-panel send-center-audit-details-panel" aria-label="Audit details">
            <h3 className="send-center-section-title">Audit Details</h3>
            <dl className="send-center-new-draft-preview-list send-center-ai-draft-meta send-center-audit-details-list">
              <div>
                <dt>Draft ID</dt>
                <dd>{trail.draftId}</dd>
              </div>
              <div>
                <dt>Proposal ID</dt>
                <dd>{trail.proposalId}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>v{trail.version}</dd>
              </div>
              <div>
                <dt>Generated By</dt>
                <dd>{trail.generatedBy}</dd>
              </div>
              <div>
                <dt>Approved By</dt>
                <dd>{trail.approvedBy ?? "—"}</dd>
              </div>
              <div>
                <dt>Last Modified</dt>
                <dd>
                  {formatAuditDayLabel(trail.lastModifiedMs)} • {formatAuditClock(trail.lastModifiedMs)}
                </dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{trail.language}</dd>
              </div>
              <div>
                <dt>Template Used</dt>
                <dd>{trail.templateUsed}</dd>
              </div>
            </dl>
          </section>

          <section className="va-ops-panel send-center-audit-versions-panel" aria-label="Previous versions">
            <h3 className="send-center-section-title">Previous Versions</h3>
            <ul className="send-center-audit-versions">
              {versionsNewestFirst.map((version) => {
                const selected = version.id === trail.selectedVersionId;
                return (
                  <li key={version.id}>
                    <button
                      type="button"
                      className={cn(
                        "send-center-audit-version-btn",
                        selected && "is-selected",
                      )}
                      onClick={() => onSelectVersion(version.id)}
                      aria-pressed={selected}
                    >
                      <span className="send-center-audit-version-label">Version {version.version}</span>
                      <span className={cn("badge", version.status === "Generated" ? "badge-violet" : version.status === "Edited" ? "badge-blue" : "badge-green")}>
                        {version.status}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="va-ops-panel send-center-audit-activity-panel" aria-label="Activity feed">
            <h3 className="send-center-section-title">Activity</h3>
            <ul className="send-center-audit-activity">
              {activityNewestFirst.map((item) => (
                <li key={item.id} className="send-center-audit-activity-item">
                  <span className="send-center-audit-activity-dot" aria-hidden="true" />
                  <div>
                    <p className="send-center-audit-activity-message">{item.message}</p>
                    <time className="send-center-audit-activity-time">
                      {formatAuditDayLabel(item.atMs)} • {formatAuditClock(item.atMs)}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="send-center-audit-export-actions">
            <button type="button" className="va-ops-action-btn" disabled>
              <AppIcon name="download" size={14} strokeWidth={2} aria-hidden />
              Download Audit Log
            </button>
            <button type="button" className="va-ops-action-btn" disabled>
              Print Timeline
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
