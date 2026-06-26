import type { AgencyRole } from "@/data/rolePermissions";

export type AuditActionType =
  | "created"
  | "updated"
  | "deleted"
  | "sent"
  | "approved"
  | "rejected";

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

export type AuditLogEntry = {
  id: string;
  action: AuditActionType;
  /** Human-readable action summary */
  what: string;
  actor: string;
  actorRole: AgencyRole;
  recordAffected: string;
  hubSource: AuditHubSource;
  timestamp: string;
  timestampMs: number;
};

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
};

export const defaultAuditLogFilters: AuditLogFilters = {
  action: "all",
  hub: "all",
  role: "all",
};

export const AUDIT_LOG_STORAGE_KEY = "agency-ops-audit-log";

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

export const seedAuditLog: AuditLogEntry[] = [
  {
    id: "al-001",
    action: "approved",
    what: "Licensed approval granted for GL + Umbrella package",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "PROP-4821 · Harbor Logistics",
    hubSource: "Send Center",
    timestamp: "10:42 AM",
    timestampMs: now - 18 * minute,
  },
  {
    id: "al-002",
    action: "updated",
    what: "Submission stage moved to Quote Review",
    actor: "Sarah Chen",
    actorRole: "producer",
    recordAffected: "SUB-2847 · Martinez Landscaping",
    hubSource: "Commercial Hub",
    timestamp: "10:31 AM",
    timestampMs: now - 29 * minute,
  },
  {
    id: "al-003",
    action: "sent",
    what: "Proposal emailed to client with DocuSign envelope",
    actor: "Pedro Alvarez",
    actorRole: "producer",
    recordAffected: "PROP-4799 · Greenline Logistics",
    hubSource: "Send Center",
    timestamp: "10:18 AM",
    timestampMs: now - 42 * minute,
  },
  {
    id: "al-004",
    action: "created",
    what: "New commercial intake submission opened",
    actor: "Jazmín Flores",
    actorRole: "va",
    recordAffected: "SUB-2901 · Atlas Roofing",
    hubSource: "Intake Forms",
    timestamp: "9:55 AM",
    timestampMs: now - 65 * minute,
  },
  {
    id: "al-005",
    action: "rejected",
    what: "Carrier quote declined — appetite mismatch",
    actor: "Tracie Wong",
    actorRole: "va",
    recordAffected: "SUB-2812 · Rivera Construction",
    hubSource: "Commercial Hub",
    timestamp: "9:40 AM",
    timestampMs: now - 80 * minute,
  },
  {
    id: "al-006",
    action: "created",
    what: "Installment invoice draft generated",
    actor: "Valerie Martinez",
    actorRole: "finance",
    recordAffected: "INV-2026-0912 · Kim Auto Shop",
    hubSource: "ePayPolicy",
    timestamp: "9:22 AM",
    timestampMs: now - 98 * minute,
  },
  {
    id: "al-007",
    action: "updated",
    what: "Retention save task priority escalated",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "RET-1184 · Coastal Marine",
    hubSource: "Retention",
    timestamp: "8:58 AM",
    timestampMs: now - 2 * hour,
  },
  {
    id: "al-008",
    action: "deleted",
    what: "Stale DNC override request removed",
    actor: "Kyle Nguyen",
    actorRole: "operations-manager",
    recordAffected: "DNC-0442 · Westside HVAC",
    hubSource: "VA Operations",
    timestamp: "8:45 AM",
    timestampMs: now - 2 * hour - 13 * minute,
  },
  {
    id: "al-009",
    action: "approved",
    what: "Training module completion verified",
    actor: "Kyle Nguyen",
    actorRole: "training-admin",
    recordAffected: "TRN-E&O-2026 · E&O Best Practices",
    hubSource: "Training Hub",
    timestamp: "8:30 AM",
    timestampMs: now - 2 * hour - 28 * minute,
  },
  {
    id: "al-010",
    action: "updated",
    what: "Carrier appetite rules revised for landscaping",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "CAR-TRAV · Travelers BOP",
    hubSource: "Carrier Library",
    timestamp: "8:12 AM",
    timestampMs: now - 3 * hour,
  },
  {
    id: "al-011",
    action: "sent",
    what: "Payment reminder sent for overdue balance",
    actor: "Valerie Martinez",
    actorRole: "finance",
    recordAffected: "PAY-8831 · Greenline Logistics",
    hubSource: "ePayPolicy",
    timestamp: "7:50 AM",
    timestampMs: now - 3 * hour - 22 * minute,
  },
  {
    id: "al-012",
    action: "created",
    what: "Lead assigned to producer dialer queue",
    actor: "Jazmín Flores",
    actorRole: "va",
    recordAffected: "LEAD-7720 · Summit Electric",
    hubSource: "VA Operations",
    timestamp: "7:35 AM",
    timestampMs: now - 3 * hour - 37 * minute,
  },
  {
    id: "al-013",
    action: "rejected",
    what: "Proposal revision requested — missing payroll schedule",
    actor: "Sarah Chen",
    actorRole: "producer",
    recordAffected: "PROP-4788 · Atlas Roofing",
    hubSource: "Send Center",
    timestamp: "6:10 PM",
    timestampMs: now - day - 2 * hour,
  },
  {
    id: "al-014",
    action: "updated",
    what: "E&O risk score recalculated after document upload",
    actor: "Pedro Alvarez",
    actorRole: "producer",
    recordAffected: "SUB-2847 · Martinez Landscaping",
    hubSource: "Commercial Hub",
    timestamp: "5:42 PM",
    timestampMs: now - day - 2 * hour - 28 * minute,
  },
  {
    id: "al-015",
    action: "approved",
    what: "Trust reconciliation batch signed off",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "TRUST-2026-06-24 · Daily Close",
    hubSource: "ePayPolicy",
    timestamp: "4:55 PM",
    timestampMs: now - day - 3 * hour,
  },
  {
    id: "al-016",
    action: "deleted",
    what: "Expired draft proposal purged",
    actor: "Pedro Alvarez",
    actorRole: "producer",
    recordAffected: "PROP-4610 · Old Harbor Draft",
    hubSource: "Send Center",
    timestamp: "3:20 PM",
    timestampMs: now - day - 5 * hour,
  },
  {
    id: "al-017",
    action: "created",
    what: "Cross-sell opportunity flagged for renewal",
    actor: "Sarah Chen",
    actorRole: "producer",
    recordAffected: "RET-1092 · Northline Builders",
    hubSource: "Retention",
    timestamp: "2:08 PM",
    timestampMs: now - day - 6 * hour,
  },
  {
    id: "al-018",
    action: "updated",
    what: "AgencyZoom sync configuration changed",
    actor: "Eva Chong",
    actorRole: "owner",
    recordAffected: "SYS-AZ-SYNC · Integration",
    hubSource: "System",
    timestamp: "11:30 AM",
    timestampMs: now - day - 9 * hour,
  },
  {
    id: "al-019",
    action: "sent",
    what: "Carrier submission package transmitted",
    actor: "Tracie Wong",
    actorRole: "va",
    recordAffected: "SUB-2890 · Greenline Logistics",
    hubSource: "Commercial Hub",
    timestamp: "10:15 AM",
    timestampMs: now - day - 10 * hour,
  },
  {
    id: "al-020",
    action: "created",
    what: "New carrier rule template added",
    actor: "Kyle Nguyen",
    actorRole: "training-admin",
    recordAffected: "CAR-HART · Hartford WC",
    hubSource: "Carrier Library",
    timestamp: "9:00 AM",
    timestampMs: now - day - 11 * hour,
  },
];

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
  const extra = persisted.filter((e) => !seen.has(e.id));
  return [...extra, ...base].sort((a, b) => b.timestampMs - a.timestampMs);
}

export function appendAuditLogEntry(
  entry: Omit<AuditLogEntry, "id" | "timestamp" | "timestampMs">,
  existing: AuditLogEntry[],
): AuditLogEntry[] {
  const next: AuditLogEntry = {
    ...entry,
    id: `al-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    timestampMs: Date.now(),
  };
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
    entry.hubSource,
    entry.actorRole,
    auditActionLabels[entry.action],
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function matchesAuditFilters(entry: AuditLogEntry, filters: AuditLogFilters): boolean {
  if (filters.action !== "all" && entry.action !== filters.action) return false;
  if (filters.hub !== "all" && entry.hubSource !== filters.hub) return false;
  if (filters.role !== "all" && entry.actorRole !== filters.role) return false;
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
