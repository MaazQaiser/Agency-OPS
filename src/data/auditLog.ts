import type { AgencyRole } from "@/data/rolePermissions";
import { routes } from "@/lib/routes";

export type AuditActionType =
  | "created"
  | "updated"
  | "deleted"
  | "sent"
  | "approved"
  | "rejected";

export type AuditSeverity = "critical" | "warning" | "success" | "pending";

export type AuditEventSource = "user" | "auto-rule" | "system";

export type AuditHubSource =
  | "VA Operations"
  | "Commercial Hub"
  | "Send Center"
  | "ePayPolicy"
  | "Retention"
  | "Training Hub"
  | "Carrier Library"
  | "Intake Forms"
  | "System";

export type AuditLogDetails = {
  previousState?: string;
  newState?: string;
  comments?: string[];
  attachments?: { name: string; href?: string }[];
  linkedWorkflowActions?: { label: string; href: string }[];
  internalNotes?: string[];
};

export type AuditLogEntry = {
  id: string;
  action: AuditActionType;
  severity: AuditSeverity;
  eventSource: AuditEventSource;
  /** Human-readable action summary */
  what: string;
  actor: string;
  actorRole: AgencyRole;
  recordAffected: string;
  recordId: string;
  recordLabel: string;
  recordHref: string;
  hubSource: AuditHubSource;
  timestamp: string;
  timestampMs: number;
  details?: AuditLogDetails;
};

export const auditSeverityLabels: Record<AuditSeverity, string> = {
  critical: "Critical",
  warning: "Warning",
  success: "Success",
  pending: "Pending",
};

export const auditEventSourceLabels: Record<AuditEventSource, string> = {
  user: "User action",
  "auto-rule": "Auto rule",
  system: "System trigger",
};

export const auditSeverityOptions: (AuditSeverity | "all")[] = [
  "all",
  "critical",
  "warning",
  "success",
  "pending",
];

export const auditActionLabels: Record<AuditActionType, string> = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
  sent: "Sent",
  approved: "Approved",
  rejected: "Rejected",
};

export const auditHubSources: AuditHubSource[] = [
  "VA Operations",
  "Commercial Hub",
  "Send Center",
  "ePayPolicy",
  "Retention",
  "Training Hub",
  "Carrier Library",
  "Intake Forms",
  "System",
];

export const auditActionTypes: AuditActionType[] = [
  "created",
  "updated",
  "deleted",
  "sent",
  "approved",
  "rejected",
];

export type AuditLogFilters = {
  action: AuditActionType | "all";
  hub: AuditHubSource | "all";
  role: AgencyRole | "all";
  severity: AuditSeverity | "all";
};

export const defaultAuditLogFilters: AuditLogFilters = {
  action: "all",
  hub: "all",
  role: "all",
  severity: "all",
};

export const AUDIT_LOG_PAGE_SIZE = 20;

export const AUDIT_LOG_STORAGE_KEY = "agency-ops-audit-log";

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

export function parseAuditRecord(recordAffected: string): { recordId: string; recordLabel: string } {
  const parts = recordAffected.split("·").map((s) => s.trim());
  const recordId = parts[0] ?? recordAffected;
  const recordLabel = parts.slice(1).join(" · ") || recordId;
  return { recordId, recordLabel };
}

export function resolveAuditRecordHref(recordId: string, hubSource: AuditHubSource): string {
  const id = recordId.toUpperCase();
  if (id.startsWith("PROP-")) {
    const slug = id.replace(/^PROP-/, "");
    return routes.sendCenterProposal(slug);
  }
  if (id.startsWith("SUB-")) {
    return `${routes.commercialHub}?view=submissions&submission=${encodeURIComponent(id)}`;
  }
  if (id.startsWith("INV-")) {
    return `${routes.epayPolicy}?view=tracker&invoice=${encodeURIComponent(id)}`;
  }
  if (id.startsWith("PAY-")) {
    return `${routes.epayPolicy}?view=tracker&payment=${encodeURIComponent(id)}`;
  }
  if (id.startsWith("RET-")) {
    return `${routes.retention}?account=${encodeURIComponent(id)}`;
  }
  if (id.startsWith("TRUST-")) {
    return `${routes.epayPolicy}?view=trust&batch=${encodeURIComponent(id)}`;
  }
  if (id.startsWith("CAR-")) {
    return `${routes.carrierLibrary}?carrier=${encodeURIComponent(id)}`;
  }
  if (id.startsWith("TRN-")) {
    return `${routes.trainingHub}?module=${encodeURIComponent(id)}`;
  }
  if (id.startsWith("LEAD-") || id.startsWith("DNC-")) {
    return `${routes.vaOperations}?record=${encodeURIComponent(id)}`;
  }
  if (id.startsWith("SYS-") || hubSource === "System") {
    return routes.systemHealth;
  }
  return routes.commercialHub;
}

function buildEntry(
  partial: Omit<AuditLogEntry, "recordId" | "recordLabel" | "recordHref"> & {
    recordAffected: string;
  },
): AuditLogEntry {
  const { recordId, recordLabel } = parseAuditRecord(partial.recordAffected);
  return {
    ...partial,
    recordId,
    recordLabel,
    recordHref: resolveAuditRecordHref(recordId, partial.hubSource),
  };
}

const defaultDetails = (overrides: AuditLogDetails = {}): AuditLogDetails => ({
  previousState: "—",
  newState: "—",
  comments: [],
  attachments: [],
  linkedWorkflowActions: [],
  internalNotes: [],
  ...overrides,
});

const craftedAuditEntries: AuditLogEntry[] = [
  buildEntry({
    id: "al-001",
    action: "approved",
    severity: "success",
    eventSource: "user",
    what: "Licensed approval granted for GL + Umbrella package",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "PROP-4821 · Harbor Logistics",
    hubSource: "Send Center",
    timestamp: "10:42 AM",
    timestampMs: now - 18 * minute,
    details: defaultDetails({
      previousState: "Pending licensed review",
      newState: "Approved — ready to bind",
      comments: ["GL limits confirmed at $2M / $4M aggregate."],
      linkedWorkflowActions: [
        { label: "Open proposal", href: routes.sendCenterProposal("4821") },
        { label: "Send bind request", href: routes.sendCenter },
      ],
      internalNotes: ["Owner sign-off recorded for E&O trail."],
    }),
  }),
  buildEntry({
    id: "al-002",
    action: "updated",
    severity: "pending",
    eventSource: "user",
    what: "Submission stage moved to Quote Review",
    actor: "Sarah Chen",
    actorRole: "producer",
    recordAffected: "SUB-2847 · Martinez Landscaping",
    hubSource: "Commercial Hub",
    timestamp: "10:31 AM",
    timestampMs: now - 29 * minute,
    details: defaultDetails({
      previousState: "Market submission",
      newState: "Quote review",
      comments: ["Waiting on Hartford revised premium."],
      linkedWorkflowActions: [
        { label: "View submission", href: `${routes.commercialHub}?view=submissions&submission=SUB-2847` },
      ],
    }),
  }),
  buildEntry({
    id: "al-003",
    action: "sent",
    severity: "success",
    eventSource: "user",
    what: "Proposal emailed to client with DocuSign envelope",
    actor: "Pedro Alvarez",
    actorRole: "producer",
    recordAffected: "PROP-4799 · Greenline Logistics",
    hubSource: "Send Center",
    timestamp: "10:18 AM",
    timestampMs: now - 42 * minute,
    details: defaultDetails({
      previousState: "Draft",
      newState: "Sent — awaiting signature",
      attachments: [{ name: "Greenline_GL_Proposal.pdf" }],
      linkedWorkflowActions: [{ label: "Track envelope", href: routes.sendCenter }],
    }),
  }),
  buildEntry({
    id: "al-004",
    action: "created",
    severity: "success",
    eventSource: "user",
    what: "New commercial intake submission opened",
    actor: "Jazmín Flores",
    actorRole: "va",
    recordAffected: "SUB-2901 · Atlas Roofing",
    hubSource: "Intake Forms",
    timestamp: "9:55 AM",
    timestampMs: now - 65 * minute,
    details: defaultDetails({
      previousState: "—",
      newState: "Intake received",
      attachments: [{ name: "Atlas_ACORD_125.pdf" }],
    }),
  }),
  buildEntry({
    id: "al-005",
    action: "rejected",
    severity: "warning",
    eventSource: "user",
    what: "Carrier quote declined — appetite mismatch",
    actor: "Tracie Wong",
    actorRole: "va",
    recordAffected: "SUB-2812 · Rivera Construction",
    hubSource: "Commercial Hub",
    timestamp: "9:40 AM",
    timestampMs: now - 80 * minute,
    details: defaultDetails({
      previousState: "Quoted",
      newState: "Declined — class code 5403",
      comments: ["Recommend alternate market via Carrier Library stack."],
      internalNotes: ["Decline logged for producer coaching."],
    }),
  }),
  buildEntry({
    id: "al-006",
    action: "created",
    severity: "pending",
    eventSource: "user",
    what: "Installment invoice draft generated",
    actor: "Valerie Martinez",
    actorRole: "finance",
    recordAffected: "INV-2026-0912 · Kim Auto Shop",
    hubSource: "ePayPolicy",
    timestamp: "9:22 AM",
    timestampMs: now - 98 * minute,
    details: defaultDetails({
      previousState: "—",
      newState: "Draft invoice — $4,280.00",
      linkedWorkflowActions: [
        { label: "Review invoice", href: `${routes.epayPolicy}?view=tracker&invoice=INV-2026-0912` },
      ],
    }),
  }),
  buildEntry({
    id: "al-007",
    action: "updated",
    severity: "critical",
    eventSource: "user",
    what: "Retention save task priority escalated",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "RET-1184 · Coastal Marine",
    hubSource: "Retention",
    timestamp: "8:58 AM",
    timestampMs: now - 2 * hour,
    details: defaultDetails({
      previousState: "Standard priority",
      newState: "Critical — 72h to lapse",
      internalNotes: ["Owner override — assign senior producer."],
    }),
  }),
  buildEntry({
    id: "al-008",
    action: "deleted",
    severity: "warning",
    eventSource: "user",
    what: "Stale DNC override request removed",
    actor: "Kyle Nguyen",
    actorRole: "operations-manager",
    recordAffected: "DNC-0442 · Westside HVAC",
    hubSource: "VA Operations",
    timestamp: "8:45 AM",
    timestampMs: now - 2 * hour - 13 * minute,
    details: defaultDetails({
      previousState: "Override pending",
      newState: "Removed — expired",
      internalNotes: ["TCPA compliance cleanup."],
    }),
  }),
  buildEntry({
    id: "al-009",
    action: "approved",
    severity: "success",
    eventSource: "user",
    what: "Training module completion verified",
    actor: "Kyle Nguyen",
    actorRole: "training-admin",
    recordAffected: "TRN-E&O-2026 · E&O Best Practices",
    hubSource: "Training Hub",
    timestamp: "8:30 AM",
    timestampMs: now - 2 * hour - 28 * minute,
    details: defaultDetails({
      previousState: "In progress",
      newState: "Completed — certificate issued",
    }),
  }),
  buildEntry({
    id: "al-010",
    action: "updated",
    severity: "success",
    eventSource: "user",
    what: "Carrier appetite rules revised for landscaping",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "CAR-TRAV · Travelers BOP",
    hubSource: "Carrier Library",
    timestamp: "8:12 AM",
    timestampMs: now - 3 * hour,
    details: defaultDetails({
      previousState: "Moderate appetite",
      newState: "Preferred — landscaping class",
      comments: ["Synced to submission rules engine."],
    }),
  }),
  buildEntry({
    id: "al-011",
    action: "sent",
    severity: "warning",
    eventSource: "auto-rule",
    what: "Invoice reminder sent for overdue balance",
    actor: "Agency OS",
    actorRole: "finance",
    recordAffected: "PAY-8831 · Greenline Logistics",
    hubSource: "ePayPolicy",
    timestamp: "7:50 AM",
    timestampMs: now - 3 * hour - 22 * minute,
    details: defaultDetails({
      previousState: "Past due 15 days",
      newState: "Reminder email dispatched",
      comments: ["Auto-rule: overdue_balance_15d triggered."],
      linkedWorkflowActions: [
        { label: "View payment", href: `${routes.epayPolicy}?view=tracker&payment=PAY-8831` },
      ],
    }),
  }),
  buildEntry({
    id: "al-012",
    action: "created",
    severity: "success",
    eventSource: "auto-rule",
    what: "Lead auto-assigned to producer dialer queue",
    actor: "Agency OS",
    actorRole: "va",
    recordAffected: "LEAD-7720 · Summit Electric",
    hubSource: "VA Operations",
    timestamp: "7:35 AM",
    timestampMs: now - 3 * hour - 37 * minute,
    details: defaultDetails({
      previousState: "Unassigned",
      newState: "Assigned — Pedro Alvarez",
      comments: ["Auto-assignment triggered by territory rule TX-NORTH."],
      internalNotes: ["Round-robin producer queue applied."],
    }),
  }),
  buildEntry({
    id: "al-013",
    action: "rejected",
    severity: "pending",
    eventSource: "user",
    what: "Proposal revision requested — missing payroll schedule",
    actor: "Sarah Chen",
    actorRole: "producer",
    recordAffected: "PROP-4788 · Atlas Roofing",
    hubSource: "Send Center",
    timestamp: "6:10 PM",
    timestampMs: now - day - 2 * hour,
    details: defaultDetails({
      previousState: "Sent",
      newState: "Revision requested",
      comments: ["Client needs updated payroll by class code."],
    }),
  }),
  buildEntry({
    id: "al-014",
    action: "updated",
    severity: "success",
    eventSource: "system",
    what: "E&O risk score recalculated after document upload",
    actor: "Agency OS",
    actorRole: "producer",
    recordAffected: "SUB-2847 · Martinez Landscaping",
    hubSource: "Commercial Hub",
    timestamp: "5:42 PM",
    timestampMs: now - day - 2 * hour - 28 * minute,
    details: defaultDetails({
      previousState: "Risk score 72",
      newState: "Risk score 81",
      comments: ["System trigger: document_ingest_complete."],
    }),
  }),
  buildEntry({
    id: "al-015",
    action: "approved",
    severity: "success",
    eventSource: "user",
    what: "Trust reconciliation batch signed off",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "TRUST-2026-06-24 · Daily Close",
    hubSource: "ePayPolicy",
    timestamp: "4:55 PM",
    timestampMs: now - day - 3 * hour,
    details: defaultDetails({
      previousState: "Variance review",
      newState: "Reconciled — $0.00 delta",
    }),
  }),
  buildEntry({
    id: "al-016",
    action: "deleted",
    severity: "warning",
    eventSource: "user",
    what: "Expired draft proposal purged",
    actor: "Pedro Alvarez",
    actorRole: "producer",
    recordAffected: "PROP-4610 · Old Harbor Draft",
    hubSource: "Send Center",
    timestamp: "3:20 PM",
    timestampMs: now - day - 5 * hour,
    details: defaultDetails({
      previousState: "Expired draft",
      newState: "Purged",
      internalNotes: ["Retention policy: drafts > 90 days."],
    }),
  }),
  buildEntry({
    id: "al-017",
    action: "created",
    severity: "success",
    eventSource: "auto-rule",
    what: "Cross-sell opportunity flagged for renewal",
    actor: "Agency OS",
    actorRole: "producer",
    recordAffected: "RET-1092 · Northline Builders",
    hubSource: "Retention",
    timestamp: "2:08 PM",
    timestampMs: now - day - 6 * hour,
    details: defaultDetails({
      previousState: "Renewal window closed",
      newState: "Cross-sell flagged — cyber",
      comments: ["Auto-rule: renewal_cross_sell_cyber matched."],
    }),
  }),
  buildEntry({
    id: "al-018",
    action: "updated",
    severity: "warning",
    eventSource: "user",
    what: "AgencyZoom sync configuration changed",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "SYS-AZ-SYNC · Integration",
    hubSource: "System",
    timestamp: "11:30 AM",
    timestampMs: now - day - 9 * hour,
    details: defaultDetails({
      previousState: "Sync interval 15m",
      newState: "Sync interval 5m",
      internalNotes: ["Owner config change — monitor API limits."],
    }),
  }),
  buildEntry({
    id: "al-019",
    action: "sent",
    severity: "success",
    eventSource: "user",
    what: "Carrier submission package transmitted",
    actor: "Tracie Wong",
    actorRole: "va",
    recordAffected: "SUB-2890 · Greenline Logistics",
    hubSource: "Commercial Hub",
    timestamp: "10:15 AM",
    timestampMs: now - day - 10 * hour,
    details: defaultDetails({
      previousState: "Ready to submit",
      newState: "Transmitted to market",
      attachments: [{ name: "Greenline_Submission_Package.zip" }],
    }),
  }),
  buildEntry({
    id: "al-020",
    action: "created",
    severity: "success",
    eventSource: "user",
    what: "New carrier rule template added",
    actor: "Kyle Nguyen",
    actorRole: "training-admin",
    recordAffected: "CAR-HART · Hartford WC",
    hubSource: "Carrier Library",
    timestamp: "9:00 AM",
    timestampMs: now - day - 11 * hour,
    details: defaultDetails({
      previousState: "—",
      newState: "Template published",
    }),
  }),
  buildEntry({
    id: "al-sys-001",
    action: "updated",
    severity: "critical",
    eventSource: "system",
    what: "Carrier API timeout — Travelers quote endpoint unreachable",
    actor: "Agency OS",
    actorRole: "operations-manager",
    recordAffected: "SYS-CARRIER-API · Travelers GL",
    hubSource: "System",
    timestamp: "10:05 AM",
    timestampMs: now - 55 * minute,
    details: defaultDetails({
      previousState: "Healthy",
      newState: "Timeout after 30s — 3 retries failed",
      comments: ["Incident logged to System Health."],
      linkedWorkflowActions: [{ label: "System Health", href: routes.systemHealth }],
      internalNotes: ["Fallback to manual quote workflow recommended."],
    }),
  }),
  buildEntry({
    id: "al-sys-002",
    action: "rejected",
    severity: "critical",
    eventSource: "system",
    what: "Payment sync failed — gateway returned 503",
    actor: "Agency OS",
    actorRole: "finance",
    recordAffected: "PAY-8844 · Coastal Marine",
    hubSource: "ePayPolicy",
    timestamp: "9:48 AM",
    timestampMs: now - 72 * minute,
    details: defaultDetails({
      previousState: "Sync in progress",
      newState: "Failed — queued for retry",
      comments: ["System trigger: epay_sync_job."],
      linkedWorkflowActions: [
        { label: "Payment tracker", href: `${routes.epayPolicy}?view=tracker&payment=PAY-8844` },
      ],
    }),
  }),
  buildEntry({
    id: "al-sys-003",
    action: "updated",
    severity: "critical",
    eventSource: "system",
    what: "Trust reconciliation mismatch detected — $142.50 variance",
    actor: "Agency OS",
    actorRole: "finance",
    recordAffected: "TRUST-2026-06-27 · Daily Close",
    hubSource: "ePayPolicy",
    timestamp: "9:15 AM",
    timestampMs: now - 105 * minute,
    details: defaultDetails({
      previousState: "Balanced",
      newState: "Mismatch — review required",
      comments: ["Unmatched deposit from Kim Auto Shop batch."],
      internalNotes: ["Finance review flagged as pending."],
    }),
  }),
  buildEntry({
    id: "al-sys-004",
    action: "approved",
    severity: "success",
    eventSource: "system",
    what: "DocuSign envelope completed — all signers",
    actor: "DocuSign",
    actorRole: "producer",
    recordAffected: "PROP-4799 · Greenline Logistics",
    hubSource: "Send Center",
    timestamp: "10:22 AM",
    timestampMs: now - 38 * minute,
    details: defaultDetails({
      previousState: "Awaiting signature",
      newState: "Completed",
      attachments: [{ name: "Signed_Proposal_Greenline.pdf" }],
      linkedWorkflowActions: [{ label: "Open proposal", href: routes.sendCenterProposal("4799") }],
    }),
  }),
  buildEntry({
    id: "al-sys-005",
    action: "sent",
    severity: "warning",
    eventSource: "auto-rule",
    what: "Invoice reminder sent — installment due in 3 days",
    actor: "Agency OS",
    actorRole: "finance",
    recordAffected: "INV-2026-0912 · Kim Auto Shop",
    hubSource: "ePayPolicy",
    timestamp: "8:00 AM",
    timestampMs: now - 3 * hour - 12 * minute,
    details: defaultDetails({
      previousState: "Due in 3 days",
      newState: "Reminder dispatched",
      comments: ["Auto-rule: invoice_due_3d triggered."],
    }),
  }),
  buildEntry({
    id: "al-sys-006",
    action: "created",
    severity: "success",
    eventSource: "auto-rule",
    what: "Auto-assignment triggered — new lead routed to VA queue",
    actor: "Agency OS",
    actorRole: "va",
    recordAffected: "LEAD-7731 · Bayview Plumbing",
    hubSource: "VA Operations",
    timestamp: "7:20 AM",
    timestampMs: now - 4 * hour,
    details: defaultDetails({
      previousState: "Inbound web lead",
      newState: "Assigned — Jazmín Flores",
      comments: ["Auto-assignment triggered by source=website + TX-SOUTH."],
    }),
  }),
];

const historyActors: { actor: string; actorRole: AgencyRole }[] = [
  { actor: "Eva Chong", actorRole: "owner" },
  { actor: "Sarah Chen", actorRole: "producer" },
  { actor: "Pedro Alvarez", actorRole: "producer" },
  { actor: "Jazmín Flores", actorRole: "va" },
  { actor: "Valerie Martinez", actorRole: "finance" },
  { actor: "Kyle Nguyen", actorRole: "operations-manager" },
  { actor: "Tracie Wong", actorRole: "va" },
  { actor: "Agency OS", actorRole: "operations-manager" },
];

const historyRecords: { recordAffected: string; hubSource: AuditHubSource }[] = [
  { recordAffected: "SUB-2750 · Apex Concrete", hubSource: "Commercial Hub" },
  { recordAffected: "PROP-4701 · Summit Electric", hubSource: "Send Center" },
  { recordAffected: "INV-2026-0880 · Northline Builders", hubSource: "ePayPolicy" },
  { recordAffected: "RET-1055 · Harbor Logistics", hubSource: "Retention" },
  { recordAffected: "LEAD-7601 · Coastal HVAC", hubSource: "VA Operations" },
  { recordAffected: "CAR-UTIC · Utica BOP", hubSource: "Carrier Library" },
  { recordAffected: "PAY-8700 · Atlas Roofing", hubSource: "ePayPolicy" },
  { recordAffected: "SUB-2788 · Greenline Logistics", hubSource: "Commercial Hub" },
];

const historyActions: AuditActionType[] = ["created", "updated", "sent", "approved", "rejected"];
const historySeverities: AuditSeverity[] = ["success", "warning", "pending", "critical"];
const historySources: AuditEventSource[] = ["user", "auto-rule", "system"];

const historyWhats = [
  "Policy endorsement processed",
  "Client contact record updated",
  "Renewal notice generated",
  "Commission split adjusted",
  "Document uploaded to file",
  "Workflow step completed",
  "Carrier response logged",
  "Task reassigned",
  "Note added to account",
  "Status sync completed",
];

function generateHistoricalAuditEntries(count: number): AuditLogEntry[] {
  const entries: AuditLogEntry[] = [];
  for (let i = 0; i < count; i++) {
    const actorPick = historyActors[i % historyActors.length]!;
    const recordPick = historyRecords[i % historyRecords.length]!;
    const action = historyActions[i % historyActions.length]!;
    const severity = historySeverities[i % historySeverities.length]!;
    const eventSource = historySources[i % historySources.length]!;
    const offsetMs = (2 + Math.floor(i / 8)) * day + (i % 24) * hour + (i % 60) * minute;
    const ts = new Date(now - offsetMs);
    entries.push(
      buildEntry({
        id: `al-hist-${String(i + 1).padStart(3, "0")}`,
        action,
        severity,
        eventSource,
        what: historyWhats[i % historyWhats.length]!,
        actor: actorPick.actor,
        actorRole: actorPick.actorRole,
        recordAffected: recordPick.recordAffected,
        hubSource: recordPick.hubSource,
        timestamp: ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        timestampMs: ts.getTime(),
        details: defaultDetails({
          previousState: "Prior state archived",
          newState: "Updated per workflow",
        }),
      }),
    );
  }
  return entries;
}

export const seedAuditLog: AuditLogEntry[] = [
  ...craftedAuditEntries,
  ...generateHistoricalAuditEntries(158),
].sort((a, b) => b.timestampMs - a.timestampMs);

export function normalizeAuditEntry(entry: AuditLogEntry): AuditLogEntry {
  const { recordId, recordLabel } = entry.recordId
    ? { recordId: entry.recordId, recordLabel: entry.recordLabel ?? entry.recordId }
    : parseAuditRecord(entry.recordAffected);
  return {
    ...entry,
    severity: entry.severity ?? "success",
    eventSource: entry.eventSource ?? "user",
    recordId,
    recordLabel: entry.recordLabel ?? recordLabel,
    recordHref: entry.recordHref ?? resolveAuditRecordHref(recordId, entry.hubSource),
    details: entry.details ?? defaultDetails(),
  };
}

export function loadAuditLogEntries(): AuditLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuditLogEntry[];
  } catch {
    return [];
  }
}

export function saveAuditLogEntries(entries: AuditLogEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(entries.slice(0, 500)));
  } catch {
    /* ignore */
  }
}

export function mergeAuditLog(
  base: AuditLogEntry[],
  persisted: AuditLogEntry[],
): AuditLogEntry[] {
  const seen = new Set(base.map((e) => e.id));
  const extra = persisted.filter((e) => !seen.has(e.id)).map(normalizeAuditEntry);
  return [...extra, ...base].sort((a, b) => b.timestampMs - a.timestampMs);
}

export function appendAuditLogEntry(
  entry: Omit<AuditLogEntry, "id" | "timestamp" | "timestampMs" | "recordId" | "recordLabel" | "recordHref"> & {
    recordAffected: string;
  },
  existing: AuditLogEntry[],
): AuditLogEntry[] {
  const next = buildEntry({
    ...entry,
    id: `al-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    timestampMs: Date.now(),
  });
  const merged = [next, ...existing].slice(0, 500);
  saveAuditLogEntries(merged.filter((e) => !seedAuditLog.some((s) => s.id === e.id)));
  return merged;
}

export function matchesAuditSearch(entry: AuditLogEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    entry.what,
    entry.actor,
    entry.recordAffected,
    entry.recordId,
    entry.hubSource,
    entry.actorRole,
    auditActionLabels[entry.action],
    auditSeverityLabels[entry.severity],
    auditEventSourceLabels[entry.eventSource],
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function matchesAuditFilters(entry: AuditLogEntry, filters: AuditLogFilters): boolean {
  if (filters.action !== "all" && entry.action !== filters.action) return false;
  if (filters.hub !== "all" && entry.hubSource !== filters.hub) return false;
  if (filters.role !== "all" && entry.actorRole !== filters.role) return false;
  if (filters.severity !== "all" && entry.severity !== filters.severity) return false;
  return true;
}

export function filterAuditLog(
  entries: AuditLogEntry[],
  query: string,
  filters: AuditLogFilters,
): AuditLogEntry[] {
  return entries
    .filter((e) => matchesAuditSearch(e, query))
    .filter((e) => matchesAuditFilters(e, filters));
}

export function formatAuditGroupLabel(timestampMs: number, nowMs = Date.now()): string {
  const date = new Date(timestampMs);
  const now = new Date(nowMs);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - day;

  if (timestampMs >= startOfToday) return "Today";
  if (timestampMs >= startOfYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function groupAuditLogByDate(
  entries: AuditLogEntry[],
): { label: string; entries: AuditLogEntry[] }[] {
  const groups = new Map<string, AuditLogEntry[]>();
  const order: string[] = [];

  for (const entry of entries) {
    const label = formatAuditGroupLabel(entry.timestampMs);
    if (!groups.has(label)) {
      groups.set(label, []);
      order.push(label);
    }
    groups.get(label)!.push(entry);
  }

  return order.map((label) => ({ label, entries: groups.get(label)! }));
}

export type AuditLogMetrics = {
  totalEventsToday: number;
  criticalActions: number;
  failedActions: number;
  pendingReviews: number;
};

export function computeAuditMetrics(entries: AuditLogEntry[], nowMs = Date.now()): AuditLogMetrics {
  const startOfToday = new Date(nowMs);
  startOfToday.setHours(0, 0, 0, 0);
  const todayStart = startOfToday.getTime();

  let totalEventsToday = 0;
  let criticalActions = 0;
  let failedActions = 0;
  let pendingReviews = 0;

  for (const entry of entries) {
    if (entry.timestampMs >= todayStart) totalEventsToday += 1;
    if (entry.severity === "critical") criticalActions += 1;
    if (entry.action === "rejected" || entry.what.toLowerCase().includes("failed")) failedActions += 1;
    if (entry.severity === "pending") pendingReviews += 1;
  }

  return { totalEventsToday, criticalActions, failedActions, pendingReviews };
}

export function exportAuditLogCsv(entries: AuditLogEntry[]): void {
  if (typeof window === "undefined" || entries.length === 0) return;

  const headers = [
    "Timestamp",
    "Action",
    "Severity",
    "Source",
    "What",
    "Actor",
    "Role",
    "Record ID",
    "Record",
    "Hub",
  ];

  const rows = entries.map((entry) => [
    new Date(entry.timestampMs).toISOString(),
    auditActionLabels[entry.action],
    auditSeverityLabels[entry.severity],
    auditEventSourceLabels[entry.eventSource],
    entry.what,
    entry.actor,
    entry.actorRole,
    entry.recordId,
    entry.recordLabel,
    entry.hubSource,
  ]);

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `agency-os-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
