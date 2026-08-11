import type { AiDraftLanguage, AiDraftSession } from "./aiDraftReview";

export function formatProposalId(draftId: string): string {
  const numeric = draftId.replace(/\D/g, "").slice(-4) || "1034";
  return `AO-2026-${numeric.padStart(4, "0")}`;
}

export type AuditLifecycleState =
  | "created"
  | "generated"
  | "reviewed"
  | "approved"
  | "sent";

export type AuditTimelineEvent = {
  id: string;
  state: AuditLifecycleState;
  title: string;
  description: string;
  user: string;
  role: string;
  atMs: number;
  timeLabel: string;
  dayLabel: string;
};

export type AuditVersionStatus = "Generated" | "Edited" | "Approved" | "Sent";

export type AuditVersion = {
  id: string;
  version: number;
  status: AuditVersionStatus;
  atMs: number;
  subject: string;
  body: string;
};

export type AuditActivityItem = {
  id: string;
  message: string;
  atMs: number;
};

export type DraftAuditTrail = {
  draftId: string;
  proposalId: string;
  version: number;
  generatedBy: string;
  approvedBy: string | null;
  lastModifiedMs: number;
  language: string;
  templateUsed: string;
  events: AuditTimelineEvent[];
  versions: AuditVersion[];
  activity: AuditActivityItem[];
  selectedVersionId: string;
};

/** Mock operator for user-driven audit events. */
export const AUDIT_OPERATOR_NAME = "Maaz";
export const AUDIT_OPERATOR_ROLE = "Agency VA";

const LIFECYCLE_ORDER: AuditLifecycleState[] = [
  "created",
  "generated",
  "reviewed",
  "approved",
  "sent",
];

export function formatAuditClock(atMs: number): string {
  return new Date(atMs).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatAuditDayLabel(atMs: number, nowMs = Date.now()): string {
  const day = new Date(atMs);
  const now = new Date(nowMs);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfThatDay = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const diffDays = Math.round((startOfToday - startOfThatDay) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function makeEvent(
  state: AuditLifecycleState,
  title: string,
  description: string,
  user: string,
  role: string,
  atMs: number,
): AuditTimelineEvent {
  return {
    id: nextId("evt"),
    state,
    title,
    description,
    user,
    role,
    atMs,
    timeLabel: formatAuditClock(atMs),
    dayLabel: formatAuditDayLabel(atMs),
  };
}

function makeVersion(
  version: number,
  status: AuditVersionStatus,
  subject: string,
  body: string,
  atMs: number,
): AuditVersion {
  return {
    id: `ver-${version}-${atMs}`,
    version,
    status,
    atMs,
    subject,
    body,
  };
}

function makeActivity(message: string, atMs: number): AuditActivityItem {
  return { id: nextId("act"), message, atMs };
}

export function getAuditLifecycleTone(state: AuditLifecycleState): string {
  switch (state) {
    case "created":
      return "gray";
    case "generated":
      return "violet";
    case "reviewed":
      return "blue";
    case "approved":
    case "sent":
      return "green";
    default:
      return "gray";
  }
}

export function getCurrentAuditLifecycleState(events: AuditTimelineEvent[]): AuditLifecycleState | null {
  if (events.length === 0) return null;
  let furthest: AuditLifecycleState = events[0]!.state;
  for (const event of events) {
    if (LIFECYCLE_ORDER.indexOf(event.state) > LIFECYCLE_ORDER.indexOf(furthest)) {
      furthest = event.state;
    }
  }
  return furthest;
}

export function createInitialAuditTrail(input: {
  draftId: string;
  proposalId?: string;
  generatedBy: string;
  language: AiDraftLanguage | string;
  templateUsed: string;
  subject: string;
  body: string;
  atMs: number;
  createdBy?: string;
}): DraftAuditTrail {
  const createdAt = input.atMs - 60_000;
  const generatedAt = input.atMs;
  const createdBy = input.createdBy ?? AUDIT_OPERATOR_NAME;
  const version = makeVersion(1, "Generated", input.subject, input.body, generatedAt);
  const events = [
    makeEvent(
      "created",
      "Draft Created",
      "Outbound draft opened in Send Center.",
      createdBy,
      AUDIT_OPERATOR_ROLE,
      createdAt,
    ),
    makeEvent(
      "generated",
      "AI Draft Generated",
      "Claude AI produced the initial outbound message.",
      input.generatedBy,
      "AI Assistant",
      generatedAt,
    ),
  ];
  const activity = [
    makeActivity(`${input.generatedBy.replace(" AI", "")} generated draft`, generatedAt),
    makeActivity(`${createdBy} created draft`, createdAt),
  ].sort((a, b) => b.atMs - a.atMs);

  return {
    draftId: input.draftId,
    proposalId: input.proposalId ?? formatProposalId(input.draftId),
    version: 1,
    generatedBy: input.generatedBy,
    approvedBy: null,
    lastModifiedMs: generatedAt,
    language: input.language,
    templateUsed: input.templateUsed,
    events,
    versions: [version],
    activity,
    selectedVersionId: version.id,
  };
}

function bumpTrail(
  trail: DraftAuditTrail,
  patch: Partial<Omit<DraftAuditTrail, "events" | "versions" | "activity" | "version">> & {
    event?: AuditTimelineEvent;
    versionEntry?: AuditVersion;
    activityMessage?: string;
    activityAtMs?: number;
    versionNumber?: number;
  },
): DraftAuditTrail {
  const events = patch.event ? [...trail.events, patch.event] : trail.events;
  const versions = patch.versionEntry ? [...trail.versions, patch.versionEntry] : trail.versions;
  const activity = patch.activityMessage
    ? [
        makeActivity(patch.activityMessage, patch.activityAtMs ?? Date.now()),
        ...trail.activity,
      ]
    : trail.activity;

  const {
    event: _event,
    versionEntry: _versionEntry,
    activityMessage: _activityMessage,
    activityAtMs: _activityAtMs,
    versionNumber,
    ...rest
  } = patch;

  return {
    ...trail,
    ...rest,
    events,
    versions,
    activity,
    selectedVersionId: patch.versionEntry?.id ?? trail.selectedVersionId,
    lastModifiedMs: patch.lastModifiedMs ?? trail.lastModifiedMs,
    version: versionNumber ?? patch.versionEntry?.version ?? trail.version,
  };
}

export function appendReviewedAuditEvent(
  trail: DraftAuditTrail,
  subject: string,
  body: string,
  atMs = Date.now(),
): DraftAuditTrail {
  const nextVersion = trail.version + 1;
  return bumpTrail(trail, {
    versionEntry: makeVersion(nextVersion, "Edited", subject, body, atMs),
    event: makeEvent(
      "reviewed",
      "Reviewed by User",
      "Outbound content was edited before approval.",
      AUDIT_OPERATOR_NAME,
      AUDIT_OPERATOR_ROLE,
      atMs,
    ),
    activityMessage: `${AUDIT_OPERATOR_NAME} edited greeting`,
    activityAtMs: atMs,
    lastModifiedMs: atMs,
  });
}

export function appendGeneratedAuditEvent(
  trail: DraftAuditTrail,
  subject: string,
  body: string,
  generatedBy: string,
  atMs = Date.now(),
): DraftAuditTrail {
  const nextVersion = trail.version + 1;
  return bumpTrail(trail, {
    versionEntry: makeVersion(nextVersion, "Generated", subject, body, atMs),
    event: makeEvent(
      "generated",
      "AI Draft Generated",
      "Draft regenerated with updated AI content.",
      generatedBy,
      "AI Assistant",
      atMs,
    ),
    activityMessage: `${generatedBy.replace(" AI", "")} generated draft`,
    activityAtMs: atMs,
    lastModifiedMs: atMs,
    generatedBy,
  });
}

export function appendApprovedAuditEvent(
  trail: DraftAuditTrail,
  approvedBy: string,
  subject: string,
  body: string,
  atMs = Date.now(),
): DraftAuditTrail {
  const nextVersion = trail.version + 1;
  return bumpTrail(trail, {
    versionEntry: makeVersion(nextVersion, "Approved", subject, body, atMs),
    event: makeEvent(
      "approved",
      `Approved by ${approvedBy}`,
      "Licensed producer approved the outbound draft.",
      approvedBy,
      "Licensed Producer",
      atMs,
    ),
    activityMessage: `${approvedBy} approved draft`,
    activityAtMs: atMs,
    lastModifiedMs: atMs,
    approvedBy,
  });
}

export function appendSentAuditEvent(
  trail: DraftAuditTrail,
  subject: string,
  body: string,
  sentBy = AUDIT_OPERATOR_NAME,
  atMs = Date.now(),
): DraftAuditTrail {
  const nextVersion = trail.version + 1;
  return bumpTrail(trail, {
    versionEntry: makeVersion(nextVersion, "Sent", subject, body, atMs),
    event: makeEvent(
      "sent",
      "Sent",
      "Email delivered to the client successfully.",
      sentBy,
      AUDIT_OPERATOR_ROLE,
      atMs,
    ),
    activityMessage: "Email sent successfully",
    activityAtMs: atMs,
    lastModifiedMs: atMs,
  });
}

export function appendReviewRequestedAuditEvent(
  trail: DraftAuditTrail,
  reviewer: string,
  atMs = Date.now(),
): DraftAuditTrail {
  return bumpTrail(trail, {
    event: makeEvent(
      "reviewed",
      "Review Requested",
      `Approval requested from ${reviewer}.`,
      AUDIT_OPERATOR_NAME,
      AUDIT_OPERATOR_ROLE,
      atMs,
    ),
    activityMessage: `${AUDIT_OPERATOR_NAME} requested licensed review`,
    activityAtMs: atMs,
    lastModifiedMs: atMs,
  });
}

export function selectAuditVersion(
  trail: DraftAuditTrail,
  versionId: string,
): DraftAuditTrail {
  if (!trail.versions.some((v) => v.id === versionId)) return trail;
  return { ...trail, selectedVersionId: versionId };
}

/** Derive a display-ready trail from session (supports older sessions without trail). */
export function resolveSessionAuditTrail(session: AiDraftSession): DraftAuditTrail {
  if (session.auditTrail) return session.auditTrail;
  return createInitialAuditTrail({
    draftId: session.id,
    generatedBy: session.generatedBy,
    language: session.language,
    templateUsed: session.selectedTemplate,
    subject: session.subject,
    body: session.body,
    atMs: session.generatedAtMs,
  });
}
