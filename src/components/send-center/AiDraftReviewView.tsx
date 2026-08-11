"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  appendApprovedAuditEvent,
  appendReviewedAuditEvent,
  appendSentAuditEvent,
  formatAuditClock,
  formatAuditDayLabel,
  formatProposalId,
  selectAuditVersion,
} from "@/data/aiDraftAuditTrail";
import {
  detectCoverageRelatedContent,
  formatAiDraftRelativeTime,
  regenerateAiDraftSession,
  requestLicensedApproval,
  splitBodyIntoSegments,
  type AiDraftSession,
} from "@/data/aiDraftReview";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { AiDraftBadge } from "./AiDraftBadge";
import { ComplianceLockRing } from "./ComplianceLockRing";
import { OutboundEmailEditor } from "./OutboundEmailEditor";

type AiDraftReviewViewProps = {
  session: AiDraftSession;
  onSessionChange: (session: AiDraftSession) => void;
  onClose: () => void;
  onToast: (message: string, variant?: "success" | "error") => void;
  onSent?: (session: AiDraftSession) => void;
};

type WorkspaceTab = "message" | "compliance" | "approval" | "history";
type HistorySubTab = "activity" | "versions" | "audit";

const WORKSPACE_TABS: { id: WorkspaceTab; label: string }[] = [
  { id: "message", label: "Message" },
  { id: "compliance", label: "Compliance" },
  { id: "approval", label: "Approval" },
  { id: "history", label: "History" },
];

/**
 * Premium Draft Review Workspace — tabbed UI, same business logic as before.
 */
export function AiDraftReviewView({
  session,
  onSessionChange,
  onClose,
  onToast,
  onSent,
}: AiDraftReviewViewProps) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("message");
  const [historySubTab, setHistorySubTab] = useState<HistorySubTab>("activity");
  const [lastSavedLabel, setLastSavedLabel] = useState("Just now");

  const isReview = session.phase === "review";
  const isApproved = session.phase === "approved";
  const isAiOrigin = session.highlightGenerated && !session.editedByUser;
  const needsLicensedGate =
    session.requiresLicensedReview && session.licensedReviewGate !== "not-required";
  const isWaitingLicensed = session.licensedReviewGate === "waiting";
  const canRequestApproval = Boolean(session.licensedReviewer) && !isWaitingLicensed;
  const editingLocked = isWaitingLicensed;
  const canSend =
    isApproved &&
    !(session.requiresLicensedReview && session.licensedReviewGate !== "not-required");

  const proposalId = session.auditTrail.proposalId.startsWith("AO-")
    ? session.auditTrail.proposalId
    : formatProposalId(session.id);
  const versionLabel = `Draft v${session.auditTrail.version}`;
  const title =
    session.selectedTemplate?.trim() ||
    (session.policyType ? `${session.policyType} Proposal` : "Commercial Proposal");

  const statusBadge = (() => {
    if (isWaitingLicensed) return { label: "Review Required", tone: "badge-yellow" as const };
    if (needsLicensedGate) return { label: "Review Required", tone: "badge-yellow" as const };
    if (isApproved) return { label: "Approved", tone: "badge-green" as const };
    return { label: "Pending Approval", tone: "badge-violet" as const };
  })();

  const coverageSegments = useMemo(
    () => splitBodyIntoSegments(session.body).filter((s) => s.isCoverage),
    [session.body],
  );

  const lastUpdated = formatAiDraftRelativeTime(session.auditTrail.lastModifiedMs);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const syncCoverageFlag = (subject: string, body: string, base: AiDraftSession): AiDraftSession => {
    const requires = detectCoverageRelatedContent(subject, body);
    if (!requires) {
      return {
        ...base,
        subject,
        body,
        requiresLicensedReview: false,
        licensedReviewGate: "not-required",
      };
    }
    if (base.licensedReviewGate === "waiting") {
      return { ...base, subject, body, requiresLicensedReview: true };
    }
    return {
      ...base,
      subject,
      body,
      requiresLicensedReview: true,
      licensedReviewGate: "pending-request",
      licensedReviewRequestedAtMs: base.licensedReviewRequestedAtMs ?? Date.now() - 2 * 60 * 1000,
    };
  };

  const markEditedIfNeeded = (nextSubject: string, nextBody: string) => {
    if (editingLocked) return;
    const atMs = Date.now();
    const alreadyReviewed = session.editedByUser;
    const editedBase: AiDraftSession = {
      ...session,
      highlightGenerated: false,
      editedByUser: true,
      auditTrail: alreadyReviewed
        ? { ...session.auditTrail, lastModifiedMs: atMs }
        : appendReviewedAuditEvent(session.auditTrail, nextSubject, nextBody, atMs),
    };
    onSessionChange(syncCoverageFlag(nextSubject, nextBody, editedBase));
  };

  const handleSubjectChange = (value: string) => {
    if (value === session.subject || editingLocked) return;
    markEditedIfNeeded(value, session.body);
  };

  const handleBodyChange = (value: string) => {
    if (value === session.body || editingLocked) return;
    markEditedIfNeeded(session.subject, value);
  };

  const handleRegenerate = () => {
    if (editingLocked) return;
    onSessionChange(regenerateAiDraftSession(session));
    onToast(toastMessages.sendCenter.aiDraftRegenerated, "success");
  };

  const handleEditManually = () => {
    if (editingLocked) return;
    const atMs = Date.now();
    onSessionChange({
      ...session,
      highlightGenerated: false,
      editedByUser: true,
      auditTrail: session.editedByUser
        ? session.auditTrail
        : appendReviewedAuditEvent(session.auditTrail, session.subject, session.body, atMs),
    });
    onToast(toastMessages.sendCenter.aiDraftManualEdit, "success");
    setActiveTab("message");
    window.requestAnimationFrame(() => {
      bodyRef.current?.focus();
      const el = bodyRef.current;
      if (el) {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    });
  };

  const handleApprove = () => {
    if (session.requiresLicensedReview) {
      onToast(toastMessages.sendCenter.licensedReviewRequired, "error");
      return;
    }
    const approver = session.producerAssigned || session.licensedReviewer || "Sarah";
    const atMs = Date.now();
    onSessionChange({
      ...session,
      phase: "approved",
      highlightGenerated: false,
      auditTrail: appendApprovedAuditEvent(
        session.auditTrail,
        approver,
        session.subject,
        session.body,
        atMs,
      ),
    });
    onToast(toastMessages.sendCenter.aiDraftApproved, "success");
  };

  const handleRequestApproval = () => {
    if (!session.licensedReviewer) {
      onToast(toastMessages.sendCenter.licensedReviewerMissing, "error");
      setActiveTab("approval");
      return;
    }
    onSessionChange(requestLicensedApproval(session));
    onToast(toastMessages.sendCenter.licensedApprovalRequested, "success");
  };

  const handleSaveDraft = () => {
    setLastSavedLabel("Just now");
    onToast(toastMessages.sendCenter.draftSaved, "success");
  };

  const handleAssignProducer = () => {
    onSessionChange({
      ...session,
      licensedReviewer: "Sarah",
      producerAssigned: session.producerAssigned || "Sarah",
    });
    onToast(toastMessages.sendCenter.licensedReviewerAssigned, "success");
  };

  const handleSelectVersion = (versionId: string) => {
    const nextTrail = selectAuditVersion(session.auditTrail, versionId);
    const selected = nextTrail.versions.find((v) => v.id === versionId);
    if (!selected) return;
    onSessionChange({
      ...session,
      subject: selected.subject,
      body: selected.body,
      auditTrail: nextTrail,
      highlightGenerated: selected.status === "Generated",
      editedByUser:
        selected.status === "Edited" ||
        selected.status === "Approved" ||
        selected.status === "Sent",
    });
  };

  const handleSend = async () => {
    if (session.requiresLicensedReview && session.licensedReviewGate !== "not-required") {
      onToast(toastMessages.sendCenter.licensedReviewRequired, "error");
      return;
    }
    setSending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    const atMs = Date.now();
    const sentSession: AiDraftSession = {
      ...session,
      auditTrail: appendSentAuditEvent(session.auditTrail, session.subject, session.body, undefined, atMs),
    };
    onSessionChange(sentSession);
    onToast(toastMessages.sendCenter.proposalSent, "success");
    setSending(false);
    onSent?.(sentSession);
  };

  const approvalSteps = [
    { id: "generated", label: "Draft generated", done: true },
    {
      id: "coverage",
      label: "Coverage detected",
      done: session.requiresLicensedReview,
    },
    {
      id: "requested",
      label: "Review requested",
      done: isWaitingLicensed || isApproved,
    },
    {
      id: "licensed",
      label: "Licensed producer approval",
      done: !needsLicensedGate && (isApproved || !session.requiresLicensedReview),
    },
    {
      id: "human",
      label: "Human approval",
      done: isApproved,
    },
    { id: "send", label: "Send", done: false },
  ];

  const complianceChecks = [
    { id: "redacted", label: "Sensitive identifiers redacted", state: "ok" as const },
    {
      id: "min-data",
      label: "Minimum required data",
      state: session.clientName.trim() ? ("ok" as const) : ("warn" as const),
    },
    { id: "transcript", label: "Full transcript excluded", state: "ok" as const },
    { id: "no-decision", label: "No coverage decision generated", state: "ok" as const },
    {
      id: "coverage",
      label: "Coverage content detected",
      state: session.requiresLicensedReview ? ("warn" as const) : ("ok" as const),
    },
    {
      id: "licensed",
      label: "Licensed producer review required",
      state: needsLicensedGate ? ("warn" as const) : ("ok" as const),
    },
    {
      id: "approval",
      label: "Human approval pending",
      state: isApproved ? ("ok" as const) : ("pending" as const),
    },
  ];

  return (
    <div
      className="va-ops-role-view send-center-tab send-center-draft-workspace"
      role="region"
      aria-labelledby="draft-workspace-title"
    >
      {/* 1. Header */}
      <header className="send-center-draft-ws-header">
        <div className="send-center-draft-ws-header-left">
          <button
            type="button"
            className="send-center-draft-ws-back"
            onClick={onClose}
            aria-label="Back to Send Center"
          >
            <AppIcon name="chevron-down" size={16} strokeWidth={2.5} className="training-back-icon" />
            Back
          </button>
          <div className="send-center-draft-ws-header-copy">
            <nav className="send-center-draft-ws-crumb" aria-label="Breadcrumb">
              <span>Send Center</span>
              <span aria-hidden="true">/</span>
              <span>Coverage Compliance</span>
            </nav>
            <h2 id="draft-workspace-title" className="send-center-draft-ws-title">
              {title}
            </h2>
            <p className="send-center-draft-ws-meta">
              <span>{proposalId}</span>
              <span aria-hidden="true">·</span>
              <span>{versionLabel}</span>
              <span aria-hidden="true">·</span>
              <span>Last updated {lastUpdated}</span>
            </p>
          </div>
        </div>
        <span className={cn("badge", statusBadge.tone)}>{statusBadge.label}</span>
      </header>

      {/* 2. Compliance banner */}
      {(needsLicensedGate || isWaitingLicensed) && (
        <div className="send-center-draft-ws-banner" role="status">
          <div className="send-center-draft-ws-banner-copy">
            <p className="send-center-draft-ws-banner-title">
              <span aria-hidden="true">⚠</span> Review Required
            </p>
            <p className="send-center-draft-ws-banner-desc">
              Coverage content detected. Licensed producer approval is required before this
              message can be sent.
            </p>
          </div>
          <button
            type="button"
            className="va-ops-action-btn"
            onClick={() => setActiveTab("compliance")}
          >
            View Compliance
          </button>
        </div>
      )}

      {/* 3. Tabs */}
      <div
        className="send-center-draft-ws-tabs"
        role="tablist"
        aria-label="Draft review sections"
      >
        {WORKSPACE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`draft-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`draft-panel-${tab.id}`}
            className={cn(
              "send-center-draft-ws-tab",
              activeTab === tab.id && "is-active",
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4–7. Tab panels */}
      <div className="send-center-draft-ws-body">
        {activeTab === "message" && (
          <div
            id="draft-panel-message"
            role="tabpanel"
            aria-labelledby="draft-tab-message"
            className="send-center-draft-ws-message"
          >
            <section className="va-ops-panel send-center-draft-ws-message-main" aria-label="Outbound message">
              <div className="send-center-draft-ws-message-head">
                <h3 className="send-center-section-title">Outbound Message</h3>
                {editingLocked && <span className="badge badge-yellow">Editing locked</span>}
              </div>

              <div className="send-center-draft-ws-chip-row" aria-label="Draft metadata">
                <AiDraftBadge variant={isAiOrigin ? "ai" : "edited"} showHelper={false} />
                <span className="send-center-draft-ws-chip">{session.policyType || title}</span>
                <span className="send-center-draft-ws-chip">{session.language}</span>
                <span className="send-center-draft-ws-chip">{session.tone}</span>
                <span className="send-center-draft-ws-chip">{versionLabel}</span>
                <button
                  type="button"
                  className="va-ops-action-btn send-center-draft-ws-regen"
                  onClick={handleRegenerate}
                  disabled={editingLocked}
                >
                  <AppIcon name="refresh" size={14} strokeWidth={2.25} aria-hidden />
                  Regenerate
                </button>
              </div>

              <OutboundEmailEditor
                subject={session.subject}
                body={session.body}
                onSubjectChange={handleSubjectChange}
                onBodyChange={handleBodyChange}
                highlightGenerated={isAiOrigin && !editingLocked && !needsLicensedGate}
                readOnly={editingLocked}
                lockCoverageSections={isWaitingLicensed}
                highlightCoverageSections={needsLicensedGate && !isWaitingLicensed}
                bodyRef={bodyRef}
              />
            </section>

            <aside className="va-ops-panel send-center-draft-ws-context" aria-label="Draft context">
              <h3 className="send-center-section-title">Draft Context</h3>
              <dl className="send-center-draft-ws-context-list">
                <div>
                  <dt>Draft status</dt>
                  <dd>
                    <span className={cn("badge", statusBadge.tone)}>{statusBadge.label}</span>
                  </dd>
                </div>
                <div>
                  <dt>Origin</dt>
                  <dd>{isAiOrigin ? "AI generated" : "Edited by user"}</dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>{versionLabel}</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>{session.language}</dd>
                </div>
                <div>
                  <dt>Template</dt>
                  <dd>{session.selectedTemplate || "—"}</dd>
                </div>
                <div>
                  <dt>Last edited</dt>
                  <dd>{lastUpdated}</dd>
                </div>
                {session.clientName && (
                  <div>
                    <dt>Client</dt>
                    <dd>{session.clientName}</dd>
                  </div>
                )}
              </dl>
            </aside>
          </div>
        )}

        {activeTab === "compliance" && (
          <div
            id="draft-panel-compliance"
            role="tabpanel"
            aria-labelledby="draft-tab-compliance"
            className="send-center-draft-ws-panel"
          >
            <section className="va-ops-panel">
              <h3 className="send-center-section-title">Compliance Review</h3>
              <ul className="send-center-draft-ws-checklist">
                {complianceChecks.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      "send-center-draft-ws-check",
                      item.state === "ok" && "is-ok",
                      item.state === "warn" && "is-warn",
                      item.state === "pending" && "is-pending",
                    )}
                  >
                    <span className="send-center-draft-ws-check-mark" aria-hidden="true">
                      {item.state === "ok" ? "✓" : item.state === "warn" ? "⚠" : "○"}
                    </span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </section>

            {coverageSegments.length > 0 && (
              <section className="va-ops-panel">
                <h3 className="send-center-section-title">Coverage Content Detected</h3>
                <p className="send-center-draft-ws-panel-desc">
                  Flagged passages that require licensed producer review.
                </p>
                <div className="send-center-draft-ws-coverage-list">
                  {coverageSegments.map((segment, index) => (
                    <article key={segment.id} className="send-center-draft-ws-coverage-item">
                      <div className="send-center-draft-ws-coverage-item-head">
                        <span className="send-center-draft-ws-coverage-ref">
                          Coverage reference {index + 1}
                        </span>
                        <span className="badge badge-yellow">
                          {isWaitingLicensed ? "Pending review" : "Needs review"}
                        </span>
                      </div>
                      <blockquote className="send-center-draft-ws-coverage-quote">
                        {segment.text.length > 220
                          ? `${segment.text.slice(0, 220).trim()}…`
                          : segment.text}
                      </blockquote>
                      <p className="send-center-draft-ws-coverage-reason">
                        Reason: Coverage / premium language
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="va-ops-panel">
              <h3 className="send-center-section-title">AI Compliance</h3>
              <p className="send-center-draft-ws-panel-desc">
                Claude assists with drafting only. Humans review and send.
              </p>
              <dl className="send-center-draft-ws-context-list send-center-draft-ws-context-list--flat">
                <div>
                  <dt>Claude API</dt>
                  <dd>
                    <span className="badge badge-gray">Disabled / Pending Activation</span>
                  </dd>
                </div>
                <div>
                  <dt>Generated by</dt>
                  <dd>{session.generatedBy}</dd>
                </div>
              </dl>
            </section>
          </div>
        )}

        {activeTab === "approval" && (
          <div
            id="draft-panel-approval"
            role="tabpanel"
            aria-labelledby="draft-tab-approval"
            className="send-center-draft-ws-panel"
          >
            <section className="va-ops-panel">
              <div className="send-center-draft-ws-message-head">
                <h3 className="send-center-section-title">Licensed Producer Review</h3>
                <span className={cn("badge", statusBadge.tone)}>
                  {isWaitingLicensed ? "Pending" : needsLicensedGate ? "Pending" : isApproved ? "Approved" : "Ready"}
                </span>
              </div>

              <dl className="send-center-draft-ws-context-list send-center-draft-ws-context-list--grid">
                <div>
                  <dt>Status</dt>
                  <dd>
                    {isWaitingLicensed
                      ? "Waiting for licensed producer"
                      : needsLicensedGate
                        ? "Pending request"
                        : isApproved
                          ? "Approved"
                          : "Not required"}
                  </dd>
                </div>
                <div>
                  <dt>Assigned to</dt>
                  <dd>
                    {session.licensedReviewer ?? (
                      <button
                        type="button"
                        className="send-center-draft-ws-link-btn"
                        onClick={handleAssignProducer}
                      >
                        Assign producer
                      </button>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>Licensed Producer</dd>
                </div>
                <div>
                  <dt>Requested</dt>
                  <dd>
                    {session.licensedReviewRequestedAtMs
                      ? formatAuditClock(session.licensedReviewRequestedAtMs)
                      : "—"}
                  </dd>
                </div>
              </dl>

              <ol className="send-center-draft-ws-timeline" aria-label="Approval timeline">
                {approvalSteps.map((step, index) => (
                  <li
                    key={step.id}
                    className={cn(
                      "send-center-draft-ws-timeline-step",
                      step.done && "is-done",
                      !step.done && index === approvalSteps.findIndex((s) => !s.done) && "is-current",
                    )}
                  >
                    <span className="send-center-draft-ws-timeline-dot" aria-hidden="true" />
                    <span>{step.label}</span>
                  </li>
                ))}
              </ol>

              <div className="send-center-draft-ws-approval-actions">
                {needsLicensedGate && !isWaitingLicensed && (
                  <button
                    type="button"
                    className="va-ops-action-btn send-center-proposal-save-btn"
                    onClick={handleRequestApproval}
                    disabled={!canRequestApproval}
                  >
                    Request Review
                  </button>
                )}
                {isWaitingLicensed && (
                  <p className="send-center-draft-ws-panel-desc">
                    Only a licensed producer can approve coverage content.
                  </p>
                )}
                {!needsLicensedGate && isReview && (
                  <button
                    type="button"
                    className="va-ops-action-btn send-center-proposal-save-btn"
                    onClick={handleApprove}
                  >
                    Approve Draft
                  </button>
                )}
                {!editingLocked && needsLicensedGate && (
                  <button type="button" className="va-ops-action-btn" onClick={handleEditManually}>
                    Continue Editing
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "history" && (
          <div
            id="draft-panel-history"
            role="tabpanel"
            aria-labelledby="draft-tab-history"
            className="send-center-draft-ws-panel"
          >
            <div className="send-center-draft-ws-subtabs" role="tablist" aria-label="History views">
              {(
                [
                  { id: "activity", label: "Activity" },
                  { id: "versions", label: "Versions" },
                  { id: "audit", label: "Audit" },
                ] as const
              ).map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  role="tab"
                  aria-selected={historySubTab === sub.id}
                  className={cn(
                    "send-center-draft-ws-subtab",
                    historySubTab === sub.id && "is-active",
                  )}
                  onClick={() => setHistorySubTab(sub.id)}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {historySubTab === "activity" && (
              <section className="va-ops-panel">
                <h3 className="send-center-section-title">Activity</h3>
                <ol className="send-center-draft-ws-activity">
                  {session.auditTrail.events
                    .slice()
                    .sort((a, b) => b.atMs - a.atMs)
                    .map((event) => (
                      <li key={event.id} className="send-center-draft-ws-activity-item">
                        <div className="send-center-draft-ws-activity-main">
                          <strong>{event.title}</strong>
                          <span>{event.user}</span>
                        </div>
                        <time dateTime={new Date(event.atMs).toISOString()}>
                          {formatAuditDayLabel(event.atMs)} · {formatAuditClock(event.atMs)}
                        </time>
                      </li>
                    ))}
                </ol>
              </section>
            )}

            {historySubTab === "versions" && (
              <section className="va-ops-panel">
                <h3 className="send-center-section-title">Versions</h3>
                <ul className="send-center-draft-ws-versions">
                  {[...session.auditTrail.versions]
                    .sort((a, b) => b.version - a.version)
                    .map((version) => {
                      const isCurrent = version.id === session.auditTrail.selectedVersionId;
                      return (
                        <li key={version.id}>
                          <button
                            type="button"
                            className={cn(
                              "send-center-draft-ws-version",
                              isCurrent && "is-current",
                            )}
                            onClick={() => handleSelectVersion(version.id)}
                          >
                            <span className="send-center-draft-ws-version-title">
                              Version {version.version}
                              {isCurrent && <span className="badge badge-blue">Current</span>}
                            </span>
                            <span className="send-center-draft-ws-version-meta">
                              {version.status} · {formatAuditClock(version.atMs)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </section>
            )}

            {historySubTab === "audit" && (
              <section className="va-ops-panel">
                <h3 className="send-center-section-title">Audit</h3>
                <div className="send-center-draft-ws-audit-scroll">
                  <table className="send-center-draft-ws-audit-table">
                    <thead>
                      <tr>
                        <th scope="col">Action</th>
                        <th scope="col">User</th>
                        <th scope="col">Role</th>
                        <th scope="col">Timestamp</th>
                        <th scope="col">Record</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.auditTrail.events
                        .slice()
                        .sort((a, b) => b.atMs - a.atMs)
                        .map((event) => (
                          <tr key={event.id}>
                            <td>{event.title}</td>
                            <td>{event.user}</td>
                            <td>{event.role}</td>
                            <td>
                              {formatAuditDayLabel(event.atMs)} {formatAuditClock(event.atMs)}
                            </td>
                            <td className="send-center-draft-ws-audit-mono">{proposalId}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* 9. Sticky action bar */}
      <footer className="send-center-draft-ws-sticky" aria-label="Draft actions">
        <div className="send-center-draft-ws-sticky-inner">
          <div className="send-center-draft-ws-sticky-left">
            <span className="send-center-draft-ws-sticky-saved">Draft saved</span>
            <span className="send-center-draft-ws-sticky-time">Last saved {lastSavedLabel}</span>
          </div>
          <div className="send-center-draft-ws-sticky-center">
            Compliance:{" "}
            <strong>
              {needsLicensedGate || isWaitingLicensed
                ? "Review required"
                : isApproved
                  ? "Cleared"
                  : "Pending approval"}
            </strong>
          </div>
          <div className="send-center-draft-ws-sticky-right">
            <button type="button" className="va-ops-action-btn" onClick={handleSaveDraft}>
              Save Draft
            </button>
            {needsLicensedGate && !isWaitingLicensed && (
              <button
                type="button"
                className="va-ops-action-btn send-center-proposal-save-btn"
                onClick={handleRequestApproval}
                disabled={!canRequestApproval}
              >
                Request Review
              </button>
            )}
            {isWaitingLicensed && (
              <span className="send-center-draft-ws-sticky-blocked">
                Send unavailable until licensed approval
              </span>
            )}
            {!needsLicensedGate && isReview && (
              <button
                type="button"
                className="va-ops-action-btn send-center-proposal-save-btn"
                onClick={handleApprove}
              >
                Approve Draft
              </button>
            )}
            {canSend && (
              <ComplianceLockRing
                locked={false}
                label={sending ? "Sending…" : "Send"}
                onSend={() => {
                  if (!sending) void handleSend();
                }}
              />
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
