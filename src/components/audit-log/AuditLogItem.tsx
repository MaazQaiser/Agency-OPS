"use client";

import { getRoleLabel } from "@/data/rolePermissions";
import {
  auditActionLabels,
  type AuditActionType,
  type AuditLogEntry,
} from "@/data/auditLog";
import { cn } from "@/lib/cn";

type AuditLogItemProps = {
  entry: AuditLogEntry;
  className?: string;
};

const actionClass: Record<AuditActionType, string> = {
  created: "audit-log-action--created",
  updated: "audit-log-action--updated",
  deleted: "audit-log-action--deleted",
  sent: "audit-log-action--sent",
  approved: "audit-log-action--approved",
  rejected: "audit-log-action--rejected",
};

export function AuditLogItem({ entry, className }: AuditLogItemProps) {
  return (
    <li className={cn("audit-log-item", className)}>
      <div className="audit-log-item-header">
        <span className={cn("audit-log-action-badge", actionClass[entry.action])}>
          {auditActionLabels[entry.action]}
        </span>
        <time className="audit-log-timestamp" dateTime={new Date(entry.timestampMs).toISOString()}>
          {entry.timestamp}
        </time>
      </div>

      <p className="audit-log-what">{entry.what}</p>

      <dl className="audit-log-meta">
        <div className="audit-log-meta-row">
          <dt>Who</dt>
          <dd>
            {entry.actor}
            <span className="audit-log-role"> · {getRoleLabel(entry.actorRole)}</span>
          </dd>
        </div>
        <div className="audit-log-meta-row">
          <dt>Record</dt>
          <dd className="audit-log-record">{entry.recordAffected}</dd>
        </div>
        <div className="audit-log-meta-row">
          <dt>Hub</dt>
          <dd>{entry.hubSource}</dd>
        </div>
      </dl>
    </li>
  );
}
