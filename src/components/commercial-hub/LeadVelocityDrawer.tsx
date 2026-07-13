"use client";

import { useEffect } from "react";
import { VaOpsDrawerRoot } from "@/components/ui/VaOpsDrawerRoot";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  speedRatingClass,
  velocityBenchmarksMs,
  velocityStatusClass,
  formatDurationMs,
  type LeadVelocityRecord,
} from "@/data/leadVelocity";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { ClientLanguagePanel } from "@/components/bilingual/BilingualQueueDrawer";
import { LeadVelocityStepper } from "./LeadVelocityStepper";

type LeadVelocityDrawerProps = {
  record: LeadVelocityRecord | null;
  onClose: () => void;
  onAction: (action: string, record: LeadVelocityRecord) => void;
};

export function LeadVelocityDrawer({ record, onClose, onAction }: LeadVelocityDrawerProps) {
  const { can } = usePermissions();
  const canReassign = can("action:reassign-tasks");
  const canEscalate = can("action:escalate-queues");
  const canFollowUp = can("action:follow-up");
  const canOverrideOwner = can("action:override-owner");
  const canForceStage = can("action:force-stage");
  const showActions = canReassign || canEscalate || canFollowUp || canOverrideOwner || canForceStage;
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

  const slowest = record.stages.find((s) => s.isSlowest);

  return (
    <VaOpsDrawerRoot>
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close lead velocity" onClick={onClose} />
      <aside
        className="va-ops-drawer va-ops-drawer-wide lead-velocity-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Velocity: ${record.leadName}`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(record.leadName)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{record.leadName}</div>
              <div className="va-ops-drawer-role">
                {record.businessName} · {record.leadSource}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="lead-velocity-drawer-badges">
            <span className={cn("badge", velocityStatusClass[record.currentStatus])}>{record.currentStatus}</span>
            <span className={cn("badge", speedRatingClass[record.responseSpeed])}>{record.responseSpeed}</span>
            <span className="badge badge-gray">{record.conversionProbability}% conversion</span>
            {record.escalated && <span className="badge badge-red">Escalated</span>}
          </div>

          <ClientLanguagePanel clientName={record.businessName} />

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Velocity Summary</div>
            <dl className="va-ops-lead-details">
              <div>
                <dt>First response</dt>
                <dd className={record.firstResponseMs > velocityBenchmarksMs.firstContact ? "lead-velocity-slow-text" : ""}>
                  {record.firstResponseTime}
                </dd>
              </div>
              <div>
                <dt>Time to intake</dt>
                <dd>{record.timeToIntake}</dd>
              </div>
              <div>
                <dt>Time to quote</dt>
                <dd>{record.timeToQuote}</dd>
              </div>
              <div>
                <dt>Time to proposal</dt>
                <dd>{record.timeToProposal}</dd>
              </div>
              <div>
                <dt>Total cycle</dt>
                <dd>{record.totalCycleTime}</dd>
              </div>
              <div>
                <dt>Assigned VA</dt>
                <dd>
                  <UserChip name={record.assignedVa} />
                </dd>
              </div>
              <div>
                <dt>Assigned Producer</dt>
                <dd>
                  <UserChip name={record.assignedProducer} />
                </dd>
              </div>
            </dl>
          </section>

          {slowest && (
            <div className="lead-velocity-slowest-callout" role="status">
              <AppIcon name="triangle-alert" size={16} strokeWidth={2} />
              <span>
                Slowest stage: <strong>{slowest.label}</strong>: {slowest.gapFromPrev} ({slowest.owner})
              </span>
            </div>
          )}

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Velocity Timeline</div>
            <LeadVelocityStepper stages={record.stages} />
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Stage Gaps</div>
            <ul className="lead-velocity-gap-list">
              {record.stages.map((s, i) => {
                if (i === 0 || !s.gapFromPrevMs) return null;
                const prev = record.stages[i - 1];
                return (
                  <li key={s.key} className={cn(s.isSlowest && "slowest")}>
                    <span>
                      {prev.label} → {s.label}
                    </span>
                    <strong>{s.gapFromPrev}</strong>
                    <UserChip name={s.owner} />
                    {s.isSlowest && <span className="badge badge-red">Slowest</span>}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Speed Benchmarks</div>
            <ul className="lead-velocity-benchmark-list">
              <li>
                <span>First Contact</span>
                <strong>&lt; 15 mins</strong>
                <span className={cn("badge", record.firstResponseMs <= velocityBenchmarksMs.firstContact ? "badge-green" : "badge-red")}>
                  {record.firstResponseTime || "Pending"}
                </span>
              </li>
              <li>
                <span>Intake Start</span>
                <strong>&lt; 2 hours</strong>
                <span className={cn("badge", record.timeToIntakeMs > 0 && record.timeToIntakeMs <= velocityBenchmarksMs.intakeStart ? "badge-green" : record.timeToIntakeMs > 0 ? "badge-red" : "badge-gray")}>
                  {record.timeToIntake || "Pending"}
                </span>
              </li>
              <li>
                <span>Quote Request</span>
                <strong>&lt; 24h</strong>
                <span className={cn("badge", record.timeToQuoteMs > 0 && record.timeToQuoteMs <= velocityBenchmarksMs.quoteRequest ? "badge-green" : record.timeToQuoteMs > 0 ? "badge-red" : "badge-gray")}>
                  {record.timeToQuote || "Pending"}
                </span>
              </li>
              <li>
                <span>Proposal Sent</span>
                <strong>&lt; 48h</strong>
                <span className={cn("badge", record.timeToProposalMs > 0 && record.timeToProposalMs <= velocityBenchmarksMs.proposalSent ? "badge-green" : record.timeToProposalMs > 0 ? "badge-red" : "badge-gray")}>
                  {record.timeToProposal || "Pending"}
                </span>
              </li>
              <li>
                <span>Bind</span>
                <strong>&lt; 7 days</strong>
                <span className={cn("badge", record.currentStatus === "Bound" && record.totalCycleMs <= velocityBenchmarksMs.bind ? "badge-green" : record.currentStatus === "Bound" ? "badge-red" : "badge-gray")}>
                  {record.currentStatus === "Bound" ? record.totalCycleTime : "In progress"}
                </span>
              </li>
            </ul>
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Internal Notes</div>
            {record.internalNotes.length === 0 ? (
              <p className="lead-velocity-empty">No internal notes.</p>
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
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Reassign lead", record)}>
                  Reassign lead
                </button>
                )}
                {canEscalate && (
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Escalate priority", record)}>
                  Escalate priority
                </button>
                )}
                {canFollowUp && (
                <button type="button" className="va-ops-drawer-action-btn primary" onClick={() => onAction("Trigger follow-up", record)}>
                  Trigger follow-up
                </button>
                )}
                {canOverrideOwner && (
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Override owner", record)}>
                  Override owner
                </button>
                )}
                {canForceStage && (
                <button type="button" className="va-ops-drawer-action-btn send-center-action-danger" onClick={() => onAction("Mark lost", record)}>
                  Mark lost
                </button>
                )}
              </div>
            </section>
          )}
        </div>
      </aside>
    </VaOpsDrawerRoot>
  );
}

export function formatBenchmarkGap(ms: number, targetMs: number): string {
  const diff = ms - targetMs;
  if (diff <= 0) return "On target";
  return `${formatDurationMs(diff)} above target`;
}
