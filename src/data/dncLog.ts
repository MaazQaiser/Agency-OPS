export type DncType = "Call DNC" | "Email DNC" | "SMS DNC" | "Full Block";

export type DncStatus = "Active" | "Under Review" | "Cleared";

export type DncOverrideStatus = "None" | "Pending Owner Approval" | "Approved" | "Denied";

export type DncAlertSeverity = "critical" | "warning" | "info";

export type DncComplianceAlert = {
  id: string;
  title: string;
  detail: string;
  severity: DncAlertSeverity;
  recordId?: string;
  timestamp: string;
};

export type DncTimelineEntry = {
  id: string;
  label: string;
  detail: string;
  actor: string;
  timestamp: string;
};

export type DncCommunicationEntry = {
  id: string;
  channel: string;
  summary: string;
  timestamp: string;
  blocked: boolean;
};

export type DncRecord = {
  id: string;
  leadName: string;
  businessName: string;
  phone: string;
  email: string;
  dncType: DncType;
  reason: string;
  markedBy: string;
  dateAdded: string;
  dateAddedMs: number;
  status: DncStatus;
  overrideStatus: DncOverrideStatus;
  notes: string[];
  relatedSubmissions: string[];
  communicationHistory: DncCommunicationEntry[];
  overrideRequests: { id: string; requestedBy: string; reason: string; status: DncOverrideStatus; timestamp: string }[];
  complianceTimeline: DncTimelineEntry[];
};

export type DncSummaryCard = {
  id: string;
  label: string;
  value: number;
  filterKey: "all" | "newToday" | "pendingReview" | "ownerOverrides" | "breaches";
};

export type DncFilters = {
  dncType: string;
  dateRange: string;
  markedBy: string;
  status: string;
  overrideStatus: string;
};

export const defaultDncFilters: DncFilters = {
  dncType: "All Types",
  dateRange: "All Time",
  markedBy: "All Users",
  status: "All Statuses",
  overrideStatus: "All Overrides",
};

export const dncTypeOptions = ["All Types", "Call DNC", "Email DNC", "SMS DNC", "Full Block"] as const;

export const dncDateRangeOptions = ["All Time", "Today", "Last 7 Days", "Last 30 Days", "Last 90 Days"] as const;

export const dncMarkedByOptions = ["All Users", "Kat", "Jaffer", "JoJo", "Pedro", "Eva Chong", "System"] as const;

export const dncStatusOptions = ["All Statuses", "Active", "Under Review", "Cleared"] as const;

export const dncOverrideStatusOptions = [
  "All Overrides",
  "None",
  "Pending Owner Approval",
  "Approved",
  "Denied",
] as const;

export const dncTypeClass: Record<DncType, string> = {
  "Call DNC": "badge-yellow",
  "Email DNC": "badge-blue",
  "SMS DNC": "badge-amber",
  "Full Block": "badge-red",
};

export const dncStatusClass: Record<DncStatus, string> = {
  Active: "badge-red",
  "Under Review": "badge-yellow",
  Cleared: "badge-green",
};

export const dncOverrideClass: Record<DncOverrideStatus, string> = {
  None: "badge-gray",
  "Pending Owner Approval": "badge-yellow",
  Approved: "badge-green",
  Denied: "badge-red",
};

export const dncAlertSeverityClass: Record<DncAlertSeverity, string> = {
  critical: "badge-red",
  warning: "badge-yellow",
  info: "badge-blue",
};

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

export const dncSummaryCards: DncSummaryCard[] = [
  { id: "total", label: "Total DNC Leads", value: 5, filterKey: "all" },
  { id: "new-today", label: "New DNC Today", value: 1, filterKey: "newToday" },
  { id: "pending", label: "Pending Review", value: 1, filterKey: "pendingReview" },
  { id: "overrides", label: "Owner Overrides", value: 1, filterKey: "ownerOverrides" },
  { id: "breaches", label: "Compliance Breaches", value: 1, filterKey: "breaches" },
];

export const dncComplianceAlerts: DncComplianceAlert[] = [
  {
    id: "alert-1",
    title: "Attempted contact on DNC lead",
    detail: "Dialer queue attempted call to Greenline Logistics: blocked automatically.",
    severity: "critical",
    recordId: "dnc-rivera",
    timestamp: "22m ago",
  },
  {
    id: "alert-2",
    title: "Duplicate lead flagged",
    detail: "Kim Auto Shop matches existing DNC record #dnc-kim by phone number.",
    severity: "warning",
    recordId: "dnc-kim",
    timestamp: "1h ago",
  },
  {
    id: "alert-3",
    title: "Override pending > 24h",
    detail: "Martinez Landscaping override request awaiting owner approval for 26 hours.",
    severity: "warning",
    recordId: "dnc-martinez",
    timestamp: "3h ago",
  },
  {
    id: "alert-4",
    title: "Unauthorized outreach attempt",
    detail: "Send Center draft blocked for Greenline Logistics: Full Block DNC active.",
    severity: "info",
    recordId: "dnc-greenline",
    timestamp: "5h ago",
  },
];

export const seedDncRecords: DncRecord[] = [
  {
    id: "dnc-rivera",
    leadName: "James Rivera",
    businessName: "Rivera Construction Inc.",
    phone: "(415) 555-0192",
    email: "j.rivera@riveraconstruction.com",
    dncType: "Full Block",
    reason: "Client requested no further contact via phone and email after bind cancellation.",
    markedBy: "Valerie",
    dateAdded: "Jun 20, 2026",
    dateAddedMs: now - 2 * day,
    status: "Active",
    overrideStatus: "None",
    notes: ["Confirmed verbal DNC on recorded line.", "Legal reviewed: full block approved."],
    relatedSubmissions: ["trk-rivera", "Workers Comp quote"],
    communicationHistory: [
      { id: "c1", channel: "Call", summary: "Outbound attempt blocked: DNC active", timestamp: "Jun 21, 2026 · 9:12 AM", blocked: true },
      { id: "c2", channel: "Email", summary: "Renewal reminder suppressed", timestamp: "Jun 19, 2026 · 2:00 PM", blocked: true },
    ],
    overrideRequests: [],
    complianceTimeline: [
      { id: "t1", label: "DNC marked", detail: "Full Block applied", actor: "Valerie", timestamp: "Jun 20, 2026 · 10:30 AM" },
      { id: "t2", label: "Contact blocked", detail: "Dialer attempt auto-blocked", actor: "System", timestamp: "Jun 21, 2026 · 9:12 AM" },
    ],
  },
  {
    id: "dnc-martinez",
    leadName: "Carlos Martinez",
    businessName: "Martinez Landscaping LLC",
    phone: "(512) 555-0144",
    email: "carlos@martinezlandscaping.com",
    dncType: "Call DNC",
    reason: "Requested no phone contact: prefers email only during renewal period.",
    markedBy: "JoJo",
    dateAdded: "Jun 19, 2026",
    dateAddedMs: now - day,
    status: "Under Review",
    overrideStatus: "Pending Owner Approval",
    notes: ["Producer requested override for renewal outreach."],
    relatedSubmissions: ["Submission #2048", "BOP + WC package"],
    communicationHistory: [
      { id: "c1", channel: "Call", summary: "Call attempt blocked", timestamp: "Jun 21, 2026 · 8:00 AM", blocked: true },
      { id: "c2", channel: "Email", summary: "Proposal delivery allowed: Call DNC only", timestamp: "Jun 18, 2026 · 11:00 AM", blocked: false },
    ],
    overrideRequests: [
      {
        id: "ov-1",
        requestedBy: "Eva Chong",
        reason: "Renewal bind requires phone confirmation",
        status: "Pending Owner Approval",
        timestamp: "Jun 20, 2026 · 4:00 PM",
      },
    ],
    complianceTimeline: [
      { id: "t1", label: "DNC marked", detail: "Call DNC applied", actor: "JoJo", timestamp: "Jun 19, 2026 · 9:00 AM" },
      { id: "t2", label: "Override requested", detail: "Producer renewal exception", actor: "Eva Chong", timestamp: "Jun 20, 2026 · 4:00 PM" },
    ],
  },
  {
    id: "dnc-greenline",
    leadName: "Min Park",
    businessName: "Greenline Logistics",
    phone: "(214) 555-0188",
    email: "min@greenlinelogistics.com",
    dncType: "Full Block",
    reason: "Account sold: new owner requested complete communication stop.",
    markedBy: "System",
    dateAdded: "Jun 18, 2026",
    dateAddedMs: now - 3 * day,
    status: "Active",
    overrideStatus: "None",
    notes: ["Auto-flagged from AgencyZoom sync."],
    relatedSubmissions: ["prop-greenline", "trk-greenline"],
    communicationHistory: [
      { id: "c1", channel: "Send Center", summary: "Proposal send blocked", timestamp: "Jun 21, 2026 · 6:00 AM", blocked: true },
    ],
    overrideRequests: [],
    complianceTimeline: [
      { id: "t1", label: "DNC marked", detail: "Full Block via system sync", actor: "System", timestamp: "Jun 18, 2026 · 6:12 AM" },
      { id: "t2", label: "Proposal blocked", detail: "Send Center enforcement", actor: "System", timestamp: "Jun 21, 2026 · 6:00 AM" },
    ],
  },
  {
    id: "dnc-kim",
    leadName: "David Kim",
    businessName: "Kim Auto Shop Inc.",
    phone: "(469) 555-0177",
    email: "david@kimautoshop.com",
    dncType: "SMS DNC",
    reason: "Opted out of SMS reminders: TCPA compliance.",
    markedBy: "Kat",
    dateAdded: "Jun 21, 2026",
    dateAddedMs: now - 4 * 60 * 60 * 1000,
    status: "Active",
    overrideStatus: "None",
    notes: [],
    relatedSubmissions: ["trk-kim", "prop-kim"],
    communicationHistory: [
      { id: "c1", channel: "SMS", summary: "Payment reminder SMS suppressed", timestamp: "Jun 21, 2026 · 7:30 AM", blocked: true },
    ],
    overrideRequests: [],
    complianceTimeline: [
      { id: "t1", label: "DNC marked", detail: "SMS DNC from opt-out keyword STOP", actor: "Kat", timestamp: "Jun 21, 2026 · 7:15 AM" },
    ],
  },
  {
    id: "dnc-atlas",
    leadName: "Robert Chen",
    businessName: "Atlas Roofing",
    phone: "(415) 555-0155",
    email: "r.chen@atlasroofing.com",
    dncType: "Call DNC",
    reason: "Temporary call DNC during audit: client requested 30-day pause.",
    markedBy: "Tracie",
    dateAdded: "Jun 15, 2026",
    dateAddedMs: now - 6 * day,
    status: "Cleared",
    overrideStatus: "Approved",
    notes: ["Owner approved temporary override for bind confirmation call."],
    relatedSubmissions: ["trk-atlas", "General Liability submission"],
    communicationHistory: [
      { id: "c1", channel: "Call", summary: "Override call completed: bind confirmed", timestamp: "Jun 17, 2026 · 2:00 PM", blocked: false },
    ],
    overrideRequests: [
      {
        id: "ov-2",
        requestedBy: "Pedro",
        reason: "Bind confirmation required",
        status: "Approved",
        timestamp: "Jun 16, 2026 · 11:00 AM",
      },
    ],
    complianceTimeline: [
      { id: "t1", label: "DNC marked", detail: "Call DNC applied", actor: "Tracie", timestamp: "Jun 15, 2026 · 9:00 AM" },
      { id: "t2", label: "Override approved", detail: "Owner approved one-time call", actor: "Eva", timestamp: "Jun 16, 2026 · 10:00 AM" },
      { id: "t3", label: "DNC cleared", detail: "Temporary hold expired", actor: "Eva", timestamp: "Jun 18, 2026 · 5:00 PM" },
    ],
  },
];

export const DNC_STORAGE_KEY = "agency-ops-dnc-records";
export const DNC_AUDIT_KEY = "agency-ops-dnc-audit-trail";

export type DncRecordOverrides = Record<
  string,
  Partial<Pick<DncRecord, "status" | "overrideStatus" | "notes" | "complianceTimeline" | "overrideRequests">>
>;

export type DncAuditEntry = {
  id: string;
  recordId: string;
  action: string;
  actor: string;
  timestamp: string;
  timestampMs: number;
};

export function loadDncOverrides(): DncRecordOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DNC_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DncRecordOverrides) : {};
  } catch {
    return {};
  }
}

export function saveDncOverrides(overrides: DncRecordOverrides): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DNC_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    /* ignore */
  }
}

export function loadDncAuditTrail(): DncAuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DNC_AUDIT_KEY);
    return raw ? (JSON.parse(raw) as DncAuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendDncAudit(entry: Omit<DncAuditEntry, "id" | "timestampMs">): DncAuditEntry[] {
  const full: DncAuditEntry = {
    ...entry,
    id: `audit-${Date.now()}`,
    timestampMs: Date.now(),
  };
  const existing = loadDncAuditTrail();
  const next = [full, ...existing].slice(0, 100);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DNC_AUDIT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  return next;
}

export function mergeDncRecords(base: DncRecord[], overrides: DncRecordOverrides): DncRecord[] {
  return base.map((r) => {
    const o = overrides[r.id];
    if (!o) return r;
    return { ...r, ...o, notes: o.notes ?? r.notes, complianceTimeline: o.complianceTimeline ?? r.complianceTimeline };
  });
}

export function matchesDncSearch(record: DncRecord, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [record.leadName, record.businessName, record.phone, record.email, record.reason, record.markedBy]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function matchesDncFilters(record: DncRecord, filters: DncFilters): boolean {
  if (filters.dncType !== "All Types" && record.dncType !== filters.dncType) return false;
  if (filters.markedBy !== "All Users" && record.markedBy !== filters.markedBy) return false;
  if (filters.status !== "All Statuses" && record.status !== filters.status) return false;
  if (filters.overrideStatus !== "All Overrides" && record.overrideStatus !== filters.overrideStatus) return false;

  const nowMs = Date.now();
  if (filters.dateRange === "Today" && nowMs - record.dateAddedMs > day) return false;
  if (filters.dateRange === "Last 7 Days" && nowMs - record.dateAddedMs > 7 * day) return false;
  if (filters.dateRange === "Last 30 Days" && nowMs - record.dateAddedMs > 30 * day) return false;
  if (filters.dateRange === "Last 90 Days" && nowMs - record.dateAddedMs > 90 * day) return false;

  return true;
}

export function applySummaryFilter(
  records: DncRecord[],
  filterKey: DncSummaryCard["filterKey"],
): DncRecord[] {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  switch (filterKey) {
    case "newToday":
      return records.filter((r) => r.dateAddedMs >= todayStart.getTime());
    case "pendingReview":
      return records.filter((r) => r.status === "Under Review" || r.overrideStatus === "Pending Owner Approval");
    case "ownerOverrides":
      return records.filter((r) => r.overrideStatus === "Approved" || r.overrideStatus === "Denied");
    case "breaches":
      return records.filter((r) => r.complianceTimeline.some((t) => t.label.toLowerCase().includes("blocked")));
    default:
      return records;
  }
}

export function computeDncSummaryCounts(records: DncRecord[]): DncSummaryCard[] {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return dncSummaryCards.map((card) => {
    let value = card.value;
    switch (card.filterKey) {
      case "all":
        value = records.length;
        break;
      case "newToday":
        value = records.filter((r) => r.dateAddedMs >= todayStart.getTime()).length;
        break;
      case "pendingReview":
        value = records.filter((r) => r.status === "Under Review" || r.overrideStatus === "Pending Owner Approval").length;
        break;
      case "ownerOverrides":
        value = records.filter((r) => r.overrideStatus === "Approved" || r.overrideStatus === "Denied").length;
        break;
      case "breaches":
        value = records.filter((r) => r.status === "Active" && r.complianceTimeline.some((t) => t.label.toLowerCase().includes("blocked"))).length;
        break;
    }
    return { ...card, value };
  });
}
