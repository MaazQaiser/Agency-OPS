"use client";

import Link from "next/link";
import { useState } from "react";
import { getRoleLabel } from "@/data/rolePermissions";
import {
  auditActionLabels,
  auditEventSourceLabels,
  auditSeverityLabels,
  type AuditActionType,
  type AuditLogEntry,
  type AuditSeverity,
} from "@/data/auditLog";
import { AppIcon } from "@/components/ui/AppIcon";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { cn } from "@/lib/cn";

type AuditLogItemProps = {
  entry: AuditLogEntry;
  className?: string;
  onNavigate?: () => void;
};

const actionClass: Record<AuditActionType, string> = {
  created: "audit-log-action--created",
  updated: "audit-log-action--updated",
  deleted: "audit-log-action--deleted",
  sent: "audit-log-action--sent",
  approved: "audit-log-action--approved",
  rejected: "audit-log-action--rejected",
};

const severityClass: Record<AuditSeverity, string> = {
  critical: "audit-log-severity--critical",
  warning: "audit-log-severity--warning",
  success: "audit-log-severity--success",
  pending: "audit-log-severity--pending",
};

export function AuditLogItem({ entry, className, onNavigate }: AuditLogItemProps) {
  const [expanded, setExpanded] = useState(false);
  const details = entry.details;

  return (
    <li className={cn("audit-log-item", expanded && "audit-log-item--expanded", className)}>
      <div className="audit-log-item-header">
        <div className="audit-log-item-badges">
          <span className={cn("audit-log-severity-pill", severityClass[entry.severity])}>
            {auditSeverityLabels[entry.severity]}
          </span>
          <span className={cn("audit-log-action-badge", actionClass[entry.action])}>
            {auditActionLabels[entry.action]}
          </span>
        </div>
        <time className="audit-log-timestamp" dateTime={new Date(entry.timestampMs).toISOString()}>
          {entry.timestamp}
        </time>
      </div>

      <p className="audit-log-what">{entry.what}</p>

      <dl className="audit-log-meta">
        <div className="audit-log-meta-row">
          <dt>Who</dt>
          <dd>
            <TeamAvatar
              name={entry.actor}
              size="xs"
              showStatus={false}
              showTooltip={false}
              interactive
              openProfileOnClick
              className="audit-log-actor-avatar"
            />
            {entry.actor}
            <span className="audit-log-role"> · {getRoleLabel(entry.actorRole)}</span>
          </dd>
        </div>
        <div className="audit-log-meta-row">
          <dt>Record</dt>
          <dd className="audit-log-record">
            <Link
              href={entry.recordHref}
              className="audit-log-record-link"
              onClick={onNavigate}
            >
              {entry.recordId}
            </Link>
            {entry.recordLabel !== entry.recordId && (
              <span className="audit-log-record-label"> · {entry.recordLabel}</span>
            )}
          </dd>
        </div>
        <div className="audit-log-meta-row">
          <dt>Hub</dt>
          <dd>{entry.hubSource}</dd>
        </div>
        <div className="audit-log-meta-row">
          <dt>Why</dt>
          <dd className="audit-log-why">{auditEventSourceLabels[entry.eventSource]}</dd>
        </div>
      </dl>

      {details && (
        <>
          <button
            type="button"
            className="audit-log-details-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
          >
            View details
            <AppIcon
              name="chevron-down"
              size={14}
              strokeWidth={2.25}
              className={cn("audit-log-details-chevron", expanded && "audit-log-details-chevron--open")}
              aria-hidden="true"
            />
          </button>

          {expanded && (
            <div className="audit-log-details" id={`audit-details-${entry.id}`}>
              <div className="audit-log-details-grid">
                <div className="audit-log-details-block">
                  <span className="audit-log-details-label">Previous state</span>
                  <p>{details.previousState ?? "-"}</p>
                </div>
                <div className="audit-log-details-block">
                  <span className="audit-log-details-label">New state</span>
                  <p>{details.newState ?? "-"}</p>
                </div>
              </div>

              {details.comments && details.comments.length > 0 && (
                <div className="audit-log-details-block">
                  <span className="audit-log-details-label">Comments</span>
                  <ul className="audit-log-details-list">
                    {details.comments.map((comment) => (
                      <li key={comment}>{comment}</li>
                    ))}
                  </ul>
                </div>
              )}

              {details.attachments && details.attachments.length > 0 && (
                <div className="audit-log-details-block">
                  <span className="audit-log-details-label">Attachments</span>
                  <ul className="audit-log-details-list audit-log-details-attachments">
                    {details.attachments.map((file) => (
                      <li key={file.name}>
                        <AppIcon name="file-text" size={13} strokeWidth={2} aria-hidden="true" />
                        {file.href ? (
                          <a href={file.href}>{file.name}</a>
                        ) : (
                          <span>{file.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {details.linkedWorkflowActions && details.linkedWorkflowActions.length > 0 && (
                <div className="audit-log-details-block">
                  <span className="audit-log-details-label">Linked workflow actions</span>
                  <ul className="audit-log-details-links">
                    {details.linkedWorkflowActions.map((action) => (
                      <li key={action.label}>
                        <Link href={action.href} onClick={onNavigate}>
                          {action.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {details.internalNotes && details.internalNotes.length > 0 && (
                <div className="audit-log-details-block audit-log-details-block--internal">
                  <span className="audit-log-details-label">Internal notes</span>
                  <ul className="audit-log-details-list">
                    {details.internalNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </li>
  );
}
