export type ClockStageKey =
  | "intake-started"
  | "docs-completed"
  | "submitted-to-market"
  | "carrier-response"
  | "producer-review"
  | "client-sent"
  | "bound";

export type SlaHealth = "Healthy" | "At Risk" | "Delayed" | "Overdue";

export type ClockStageState = "completed" | "current" | "pending" | "blocked" | "delayed";

export type ClockAlertSeverity = "critical" | "warning" | "info";

export type ClockStageEntry = {
  key: ClockStageKey;
  label: string;
  timestamp: string | null;
  timestampMs: number | null;
  timeSpent: string;
  timeSpentMs: number | null;
  owner: string;
  state: ClockStageState;
  slaTargetHours: number;
  overdue: boolean;
};

export type SubmissionClockRecord = {
  id: string;
  submissionId: string;
  clientName: string;
  currentStage: string;
  currentStageKey: ClockStageKey;
  totalAge: string;
  totalAgeMs: number;
  currentStageAge: string;
  currentStageAgeMs: number;
  assignedVa: string;
  assignedProducer: string;
  carrier: string;
  priority: "High" | "Medium" | "Low";
  slaStatus: SlaHealth;
  bindProbability: number;
  stages: ClockStageEntry[];
  internalNotes: string[];
  slaPaused: boolean;
};

export type ClockSummaryCard = {
  id: string;
  label: string;
  value: string;
  filterKey: "all" | "avgAge" | "fastestBind" | "slowest" | "slaBreaches" | "pendingReview" | "timeToBind";
};

export type ClockComplianceAlert = {
  id: string;
  title: string;
  detail: string;
  severity: ClockAlertSeverity;
  recordId?: string;
  timestamp: string;
};

export type ClockFilters = {
  stage: string;
  age: string;
  slaStatus: string;
  assignedVa: string;
  assignedProducer: string;
  carrier: string;
  priority: string;
};

export const defaultClockFilters: ClockFilters = {
  stage: "All Stages",
  age: "All Ages",
  slaStatus: "All SLA Statuses",
  assignedVa: "All VAs",
  assignedProducer: "All Producers",
  carrier: "All Carriers",
  priority: "All Priorities",
};

export const clockStageLabels: Record<ClockStageKey, string> = {
  "intake-started": "Intake Started",
  "docs-completed": "Docs Completed",
  "submitted-to-market": "Submitted to Market",
  "carrier-response": "Carrier Response",
  "producer-review": "Producer Review",
  "client-sent": "Client Sent",
  bound: "Bound",
};

export const clockStageOrder: ClockStageKey[] = [
  "intake-started",
  "docs-completed",
  "submitted-to-market",
  "carrier-response",
  "producer-review",
  "client-sent",
  "bound",
];

export const slaTargetsHours: Record<ClockStageKey, number> = {
  "intake-started": 2,
  "docs-completed": 24,
  "submitted-to-market": 24,
  "carrier-response": 48,
  "producer-review": 1,
  "client-sent": 24,
  bound: 72,
};

export const clockStageFilterOptions = ["All Stages", ...clockStageOrder.map((k) => clockStageLabels[k])];

export const clockAgeFilterOptions = ["All Ages", "0–2 Days", "3–5 Days", "6–10 Days", "11+ Days"];

export const clockSlaFilterOptions = ["All SLA Statuses", "Healthy", "At Risk", "Delayed", "Overdue"];

export const clockVaFilterOptions = ["All VAs", "JoJo", "Pedro", "Hamad", "Tracie"];

export const clockProducerFilterOptions = ["All Producers", "Eva", "Tracie", "Sarah"];

export const clockCarrierFilterOptions = ["All Carriers", "Markel", "Travelers", "CNA", "ICW", "Kingsway", "Bristol West"];

export const clockPriorityFilterOptions = ["All Priorities", "High", "Medium", "Low"];

export const slaHealthClass: Record<SlaHealth, string> = {
  Healthy: "badge-green",
  "At Risk": "badge-yellow",
  Delayed: "badge-amber",
  Overdue: "badge-red",
};

export const clockAlertSeverityClass: Record<ClockAlertSeverity, string> = {
  critical: "badge-red",
  warning: "badge-yellow",
  info: "badge-blue",
};

export const clockStageStateClass: Record<ClockStageState, string> = {
  completed: "completed",
  current: "current",
  pending: "pending",
  blocked: "blocked",
  delayed: "delayed",
};

const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

function stage(
  key: ClockStageKey,
  timestamp: string | null,
  timestampMs: number | null,
  timeSpent: string,
  timeSpentMs: number | null,
  owner: string,
  state: ClockStageState,
  overdue = false,
): ClockStageEntry {
  return {
    key,
    label: clockStageLabels[key],
    timestamp,
    timestampMs,
    timeSpent,
    timeSpentMs,
    owner,
    state,
    slaTargetHours: slaTargetsHours[key],
    overdue,
  };
}

export const seedSubmissionClockRecords: SubmissionClockRecord[] = [
  {
    id: "clk-martinez",
    submissionId: "SUB-2048",
    clientName: "Martinez Landscaping",
    currentStage: "Carrier Response",
    currentStageKey: "carrier-response",
    totalAge: "8d 4h",
    totalAgeMs: 8 * day + 4 * hour,
    currentStageAge: "2d 6h",
    currentStageAgeMs: 2 * day + 6 * hour,
    assignedVa: "JoJo",
    assignedProducer: "Eva",
    carrier: "Markel",
    priority: "High",
    slaStatus: "Delayed",
    bindProbability: 72,
    slaPaused: false,
    internalNotes: ["Markel UW silent 3 days — escalation sent."],
    stages: [
      stage("intake-started", "May 12, 2026 · 9:00 AM", now - 8 * day - 4 * hour, "1h 20m", 80 * 60 * 1000, "JoJo", "completed"),
      stage("docs-completed", "May 12, 2026 · 4:30 PM", now - 7 * day - 20 * hour, "7h 30m", 7.5 * hour, "JoJo", "completed"),
      stage("submitted-to-market", "May 13, 2026 · 10:00 AM", now - 7 * day - 14 * hour, "17h 30m", 17.5 * hour, "Pedro", "completed"),
      stage("carrier-response", "May 15, 2026 · 2:00 PM", now - 5 * day - 10 * hour, "2d 6h", 2 * day + 6 * hour, "JoJo", "current", true),
      stage("producer-review", null, null, "—", null, "Eva", "pending"),
      stage("client-sent", null, null, "—", null, "Eva", "pending"),
      stage("bound", null, null, "—", null, "Eva", "pending"),
    ],
  },
  {
    id: "clk-kim",
    submissionId: "SUB-2051",
    clientName: "Kim Auto Shop",
    currentStage: "Docs Completed",
    currentStageKey: "docs-completed",
    totalAge: "6d 2h",
    totalAgeMs: 6 * day + 2 * hour,
    currentStageAge: "1d 18h",
    currentStageAgeMs: day + 18 * hour,
    assignedVa: "Pedro",
    assignedProducer: "Eva",
    carrier: "Travelers",
    priority: "High",
    slaStatus: "Overdue",
    bindProbability: 38,
    slaPaused: false,
    internalNotes: ["Missing signed app and loss runs blocking market submit."],
    stages: [
      stage("intake-started", "May 14, 2026 · 8:00 AM", now - 6 * day - 2 * hour, "45m", 45 * 60 * 1000, "Pedro", "completed"),
      stage("docs-completed", "May 14, 2026 · 6:00 PM", now - 5 * day - 8 * hour, "—", null, "Pedro", "blocked", true),
      stage("submitted-to-market", null, null, "—", null, "Pedro", "pending"),
      stage("carrier-response", null, null, "—", null, "Pedro", "pending"),
      stage("producer-review", null, null, "—", null, "Eva", "pending"),
      stage("client-sent", null, null, "—", null, "Eva", "pending"),
      stage("bound", null, null, "—", null, "Eva", "pending"),
    ],
  },
  {
    id: "clk-seoul",
    submissionId: "SUB-2044",
    clientName: "Greenline Logistics",
    currentStage: "Producer Review",
    currentStageKey: "producer-review",
    totalAge: "4d 6h",
    totalAgeMs: 4 * day + 6 * hour,
    currentStageAge: "1h 45m",
    currentStageAgeMs: 105 * 60 * 1000,
    assignedVa: "JoJo",
    assignedProducer: "Tracie",
    carrier: "CNA",
    priority: "Medium",
    slaStatus: "At Risk",
    bindProbability: 81,
    slaPaused: false,
    internalNotes: [],
    stages: [
      stage("intake-started", "May 16, 2026 · 9:00 AM", now - 4 * day - 6 * hour, "55m", 55 * 60 * 1000, "JoJo", "completed"),
      stage("docs-completed", "May 16, 2026 · 5:00 PM", now - 3 * day - 22 * hour, "8h", 8 * hour, "JoJo", "completed"),
      stage("submitted-to-market", "May 17, 2026 · 9:00 AM", now - 3 * day - 14 * hour, "16h", 16 * hour, "JoJo", "completed"),
      stage("carrier-response", "May 18, 2026 · 3:00 PM", now - 2 * day - 8 * hour, "1d 6h", day + 6 * hour, "JoJo", "completed"),
      stage("producer-review", "May 20, 2026 · 10:15 AM", now - 105 * 60 * 1000, "1h 45m", 105 * 60 * 1000, "Tracie", "current"),
      stage("client-sent", null, null, "—", null, "Tracie", "pending"),
      stage("bound", null, null, "—", null, "Tracie", "pending"),
    ],
  },
  {
    id: "clk-westside",
    submissionId: "SUB-2039",
    clientName: "Rivera Construction",
    currentStage: "Bound",
    currentStageKey: "bound",
    totalAge: "12d 2h",
    totalAgeMs: 12 * day + 2 * hour,
    currentStageAge: "1d 0h",
    currentStageAgeMs: day,
    assignedVa: "Pedro",
    assignedProducer: "Kyle",
    carrier: "AmTrust",
    priority: "Medium",
    slaStatus: "Healthy",
    bindProbability: 100,
    slaPaused: false,
    internalNotes: ["Bound — COI pending for GC contract."],
    stages: [
      stage("intake-started", "May 8, 2026 · 8:00 AM", now - 12 * day - 2 * hour, "1h 10m", 70 * 60 * 1000, "Pedro", "completed"),
      stage("docs-completed", "May 8, 2026 · 3:00 PM", now - 11 * day - 19 * hour, "7h", 7 * hour, "Pedro", "completed"),
      stage("submitted-to-market", "May 9, 2026 · 10:00 AM", now - 11 * day - 12 * hour, "19h", 19 * hour, "Pedro", "completed"),
      stage("carrier-response", "May 11, 2026 · 2:00 PM", now - 9 * day - 8 * hour, "2d 4h", 2 * day + 4 * hour, "Pedro", "completed"),
      stage("producer-review", "May 12, 2026 · 9:00 AM", now - 8 * day - 13 * hour, "19h", 19 * hour, "Kyle", "completed"),
      stage("client-sent", "May 13, 2026 · 11:00 AM", now - 7 * day - 11 * hour, "1d 2h", day + 2 * hour, "Kyle", "completed"),
      stage("bound", "May 19, 2026 · 4:00 PM", now - day, "6d 5h", 6 * day + 5 * hour, "Kyle", "current"),
    ],
  },
  {
    id: "clk-pacific",
    submissionId: "SUB-2055",
    clientName: "Atlas Roofing",
    currentStage: "Submitted to Market",
    currentStageKey: "submitted-to-market",
    totalAge: "3d 8h",
    totalAgeMs: 3 * day + 8 * hour,
    currentStageAge: "3d 8h",
    currentStageAgeMs: 3 * day + 8 * hour,
    assignedVa: "Hamad",
    assignedProducer: "Eva",
    carrier: "ICW",
    priority: "High",
    slaStatus: "Overdue",
    bindProbability: 45,
    slaPaused: false,
    internalNotes: ["Stuck at market submit — no carrier response."],
    stages: [
      stage("intake-started", "May 17, 2026 · 7:00 AM", now - 3 * day - 8 * hour, "1h 30m", 90 * 60 * 1000, "Hamad", "completed"),
      stage("docs-completed", "May 17, 2026 · 2:00 PM", now - 3 * day - 1 * hour, "7h", 7 * hour, "Hamad", "completed"),
      stage("submitted-to-market", "May 17, 2026 · 4:00 PM", now - 3 * day + 1 * hour, "3d 8h", 3 * day + 8 * hour, "Hamad", "delayed", true),
      stage("carrier-response", null, null, "—", null, "Hamad", "pending"),
      stage("producer-review", null, null, "—", null, "Eva", "pending"),
      stage("client-sent", null, null, "—", null, "Eva", "pending"),
      stage("bound", null, null, "—", null, "Eva", "pending"),
    ],
  },
  {
    id: "clk-harbor",
    submissionId: "SUB-2058",
    clientName: "Greenline Logistics",
    currentStage: "Client Sent",
    currentStageKey: "client-sent",
    totalAge: "5d 12h",
    totalAgeMs: 5 * day + 12 * hour,
    currentStageAge: "18h",
    currentStageAgeMs: 18 * hour,
    assignedVa: "JoJo",
    assignedProducer: "Eva",
    carrier: "Zurich",
    priority: "Medium",
    slaStatus: "Healthy",
    bindProbability: 88,
    slaPaused: false,
    internalNotes: ["Awaiting client signature on bind order."],
    stages: [
      stage("intake-started", "May 15, 2026 · 10:00 AM", now - 5 * day - 12 * hour, "50m", 50 * 60 * 1000, "JoJo", "completed"),
      stage("docs-completed", "May 15, 2026 · 4:00 PM", now - 5 * day - 6 * hour, "6h", 6 * hour, "JoJo", "completed"),
      stage("submitted-to-market", "May 16, 2026 · 9:00 AM", now - 4 * day - 13 * hour, "17h", 17 * hour, "JoJo", "completed"),
      stage("carrier-response", "May 17, 2026 · 11:00 AM", now - 3 * day - 11 * hour, "1d 2h", day + 2 * hour, "JoJo", "completed"),
      stage("producer-review", "May 18, 2026 · 10:00 AM", now - 2 * day - 12 * hour, "23h", 23 * hour, "Eva", "completed"),
      stage("client-sent", "May 20, 2026 · 6:00 PM", now - 18 * hour, "18h", 18 * hour, "Eva", "current"),
      stage("bound", null, null, "—", null, "Eva", "pending"),
    ],
  },
];

export const clockComplianceAlerts: ClockComplianceAlert[] = [
  {
    id: "ca-1",
    title: "Submission stuck > 3 days",
    detail: "Atlas Roofing has been at Submitted to Market for 3+ days with no carrier response.",
    severity: "critical",
    recordId: "clk-pacific",
    timestamp: "30m ago",
  },
  {
    id: "ca-2",
    title: "Producer review delayed > 1 hour",
    detail: "Greenline Logistics producer review approaching SLA limit — 1h 45m elapsed.",
    severity: "warning",
    recordId: "clk-seoul",
    timestamp: "1h ago",
  },
  {
    id: "ca-3",
    title: "Missing docs > 24h",
    detail: "Kim Auto Shop docs stage blocked — signed app and loss runs outstanding for 42 hours.",
    severity: "critical",
    recordId: "clk-kim",
    timestamp: "2h ago",
  },
  {
    id: "ca-4",
    title: "Carrier response delayed > SLA",
    detail: "Martinez Landscaping Markel response exceeds 48-hour carrier SLA.",
    severity: "warning",
    recordId: "clk-martinez",
    timestamp: "4h ago",
  },
];

export const CLOCK_STORAGE_KEY = "agency-ops-submission-clock";

export type ClockRecordOverrides = Record<
  string,
  Partial<Pick<SubmissionClockRecord, "assignedVa" | "assignedProducer" | "currentStage" | "currentStageKey" | "slaStatus" | "internalNotes" | "slaPaused" | "stages">>
>;

export function loadClockOverrides(): ClockRecordOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CLOCK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ClockRecordOverrides) : {};
  } catch {
    return {};
  }
}

export function saveClockOverrides(overrides: ClockRecordOverrides): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLOCK_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    /* ignore */
  }
}

export function mergeClockRecords(base: SubmissionClockRecord[], overrides: ClockRecordOverrides): SubmissionClockRecord[] {
  return base.map((r) => {
    const o = overrides[r.id];
    if (!o) return r;
    return {
      ...r,
      ...o,
      internalNotes: o.internalNotes ?? r.internalNotes,
      stages: o.stages ?? r.stages,
    };
  });
}

export function formatDurationMs(ms: number): string {
  if (ms < 0) return "—";
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const mins = Math.floor((ms % hour) / (60 * 1000));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function matchesClockSearch(record: SubmissionClockRecord, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [record.clientName, record.submissionId, record.carrier, record.assignedVa, record.assignedProducer]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function matchesClockFilters(record: SubmissionClockRecord, filters: ClockFilters): boolean {
  if (filters.stage !== "All Stages" && record.currentStage !== filters.stage) return false;
  if (filters.slaStatus !== "All SLA Statuses" && record.slaStatus !== filters.slaStatus) return false;
  if (filters.assignedVa !== "All VAs" && record.assignedVa !== filters.assignedVa) return false;
  if (filters.assignedProducer !== "All Producers" && record.assignedProducer !== filters.assignedProducer) return false;
  if (filters.carrier !== "All Carriers" && record.carrier !== filters.carrier) return false;
  if (filters.priority !== "All Priorities" && record.priority !== filters.priority) return false;

  if (filters.age === "0–2 Days" && record.totalAgeMs > 2 * day) return false;
  if (filters.age === "3–5 Days" && (record.totalAgeMs <= 2 * day || record.totalAgeMs > 5 * day)) return false;
  if (filters.age === "6–10 Days" && (record.totalAgeMs <= 5 * day || record.totalAgeMs > 10 * day)) return false;
  if (filters.age === "11+ Days" && record.totalAgeMs <= 10 * day) return false;

  return true;
}

export function applyClockSummaryFilter(
  records: SubmissionClockRecord[],
  filterKey: ClockSummaryCard["filterKey"],
): SubmissionClockRecord[] {
  switch (filterKey) {
    case "slaBreaches":
      return records.filter((r) => r.slaStatus === "Overdue" || r.slaStatus === "Delayed");
    case "pendingReview":
      return records.filter((r) => r.currentStageKey === "producer-review");
    case "slowest":
      return [...records].sort((a, b) => b.totalAgeMs - a.totalAgeMs).slice(0, 3);
    case "fastestBind":
      return records.filter((r) => r.currentStageKey === "bound");
    default:
      return records;
  }
}

export function computeClockSummaryCards(records: SubmissionClockRecord[]): ClockSummaryCard[] {
  const bound = records.filter((r) => r.currentStageKey === "bound");
  const avgMs = records.length ? records.reduce((s, r) => s + r.totalAgeMs, 0) / records.length : 0;
  const slowest = records.reduce((max, r) => (r.totalAgeMs > max.totalAgeMs ? r : max), records[0]);
  const fastestBind = bound.length
    ? bound.reduce((min, r) => (r.totalAgeMs < min.totalAgeMs ? r : min), bound[0])
    : null;
  const breaches = records.filter((r) => r.slaStatus === "Overdue" || r.slaStatus === "Delayed").length;
  const pendingReview = records.filter((r) => r.currentStageKey === "producer-review");
  const pendingReviewAvg = pendingReview.length
    ? pendingReview.reduce((s, r) => s + r.currentStageAgeMs, 0) / pendingReview.length
    : 0;
  const timeToBindAvg = bound.length ? bound.reduce((s, r) => s + r.totalAgeMs, 0) / bound.length : 0;

  return [
    { id: "avg-age", label: "Average Submission Age", value: formatDurationMs(avgMs), filterKey: "avgAge" },
    { id: "fastest", label: "Fastest Bound Time", value: fastestBind ? formatDurationMs(fastestBind.totalAgeMs) : "—", filterKey: "fastestBind" },
    { id: "slowest", label: "Slowest Submission", value: slowest ? slowest.clientName.split(" ")[0] : "—", filterKey: "slowest" },
    { id: "breaches", label: "SLA Breaches", value: String(breaches), filterKey: "slaBreaches" },
    { id: "review", label: "Pending Review Time", value: pendingReview.length ? formatDurationMs(pendingReviewAvg) : "—", filterKey: "pendingReview" },
    { id: "ttb", label: "Time-to-Bind Average", value: bound.length ? formatDurationMs(timeToBindAvg) : "—", filterKey: "timeToBind" },
  ];
}

export function getStageProgress(stages: ClockStageEntry[]): ClockStageKey[] {
  return stages.filter((s) => s.state === "completed" || s.state === "current" || s.state === "delayed" || s.state === "blocked").map((s) => s.key);
}

export function getNextStageKey(current: ClockStageKey): ClockStageKey | null {
  const idx = clockStageOrder.indexOf(current);
  return idx >= 0 && idx < clockStageOrder.length - 1 ? clockStageOrder[idx + 1] : null;
}
