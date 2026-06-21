"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  formatDurationMs,
  slaHealthClass,
  type SubmissionClockRecord,
} from "@/data/submissionClock";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { SubmissionClockStepper } from "./SubmissionClockStepper";

type SubmissionClockDrawerProps = {
  record: SubmissionClockRecord | null;
  liveStageAge: string;
  onClose: () => void;
  onAction: (action: string, record: SubmissionClockRecord) => void;
};

export function SubmissionClockDrawer({
  record,
  liveStageAge,
  onClose,
  onAction,
}: SubmissionClockDrawerProps) {
  const { can } = usePermissions();
  const canReassign = can("action:reassign-tasks");
  const canEscalate = can("action:escalate-queues");
  const canForceStage = can("action:force-stage");
  const canAddNotes = can("action:add-notes");
  const showActions = canReassign || canEscalate || canForceStage || canAddNotes;
  useEffect(() => {
    if (!record) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [record, onClose]);

  if (!record) return null;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close submission clock" onClick={onClose} />
      <aside className="va-ops-drawer va-ops-drawer-wide submission-clock-drawer" role="dialog" aria-modal="true" aria-label={`Clock: ${record.clientName}`}>
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(record.clientName)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{record.clientName}</div>
              <div className="va-ops-drawer-role">{record.submissionId} · {record.carrier}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="submission-clock-drawer-badges">
            <span className={cn("badge", slaHealthClass[record.slaStatus])}>{record.slaStatus}</span>
            <span className="badge badge-blue">{record.currentStage}</span>
            <span className="badge badge-gray">{record.bindProbability}% bind prob.</span>
            {record.slaPaused && <span className="badge badge-yellow">SLA Paused</span>}
          </div>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Time Summary</div>
            <dl className="va-ops-lead-details">
              <div><dt>Total age</dt><dd>{record.totalAge}</dd></div>
              <div><dt>Current stage age</dt><dd className={record.slaStatus === "Overdue" ? "submission-clock-overdue-text" : ""}>{liveStageAge}</dd></div>
              <div><dt>Assigned VA</dt><dd><UserChip name={record.assignedVa} /></dd></div>
              <div><dt>Assigned Producer</dt><dd><UserChip name={record.assignedProducer} /></dd></div>
            </dl>
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Stage Timeline</div>
            <SubmissionClockStepper stages={record.stages} />
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Stage Durations</div>
            <ul className="submission-clock-duration-list">
              {record.stages.map((s, i) => {
                if (i === 0 || !s.timeSpentMs) return null;
                const prev = record.stages[i - 1];
                return (
                  <li key={s.key}>
                    <span>{prev.label} → {s.label}</span>
                    <strong className={cn(s.overdue && "submission-clock-overdue-text")}>{s.timeSpent}</strong>
                    {s.overdue && <span className="badge badge-red">Over SLA</span>}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Internal Notes</div>
            {record.internalNotes.length === 0 ? (
              <p className="submission-clock-empty">No internal notes.</p>
            ) : (
              <ul className="va-ops-drawer-list">
                {record.internalNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </section>

          {showActions && (
            <section className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Owner Actions</div>
              <div className="va-ops-drawer-quick-actions">
                {canReassign && (
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Reassign submission", record)}>
                  Reassign submission
                </button>
                )}
                {canEscalate && (
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Escalate stage", record)}>
                  Escalate stage
                </button>
                )}
                {canForceStage && (
                <button type="button" className="va-ops-drawer-action-btn primary" onClick={() => onAction("Force move stage", record)}>
                  Force move stage
                </button>
                )}
                {canForceStage && (
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Pause SLA", record)}>
                  {record.slaPaused ? "Resume SLA" : "Pause SLA"}
                </button>
                )}
                {canAddNotes && (
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Add internal note", record)}>
                  Add internal note
                </button>
                )}
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

export function computeLiveStageAge(record: SubmissionClockRecord, tickMs: number): string {
  if (record.slaPaused) return `${formatDurationMs(record.currentStageAgeMs)} (paused)`;
  const current = record.stages.find((s) => s.state === "current" || s.state === "delayed" || s.state === "blocked");
  if (!current?.timestampMs) return record.currentStageAge;
  return formatDurationMs(tickMs - current.timestampMs);
}
