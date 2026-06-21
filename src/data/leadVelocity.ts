export type LeadVelocityStatus =
  | "New"
  | "Contacted"
  | "Intake Started"
  | "Quoted"
  | "Proposal Sent"
  | "Negotiating"
  | "Bound"
  | "Lost";

export type SpeedRating = "Fast" | "Normal" | "Slow" | "At Risk";

export type VelocityStageKey =
  | "lead-created"
  | "assigned"
  | "first-contact"
  | "follow-up"
  | "intake-started"
  | "marketed"
  | "quote-received"
  | "proposal-sent"
  | "bound-lost";

export type VelocityStageState = "completed" | "current" | "pending" | "lost";

export type VelocityStageEntry = {
  key: VelocityStageKey;
  label: string;
  timestamp: string | null;
  timestampMs: number | null;
  gapFromPrev: string;
  gapFromPrevMs: number | null;
  owner: string;
  state: VelocityStageState;
  isSlowest?: boolean;
};

export type LeadVelocityRecord = {
  id: string;
  leadName: string;
  businessName: string;
  assignedVa: string;
  assignedProducer: string;
  leadSource: string;
  industry: string;
  state: string;
  firstResponseTime: string;
  firstResponseMs: number;
  timeToIntake: string;
  timeToIntakeMs: number;
  timeToQuote: string;
  timeToQuoteMs: number;
  timeToProposal: string;
  timeToProposalMs: number;
  totalCycleTime: string;
  totalCycleMs: number;
  currentStatus: LeadVelocityStatus;
  conversionProbability: number;
  responseSpeed: SpeedRating;
  priority: "High" | "Medium" | "Low";
  createdMs: number;
  stages: VelocityStageEntry[];
  internalNotes: string[];
  escalated: boolean;
};

export type VelocitySummaryCard = {
  id: string;
  label: string;
  value: string;
  filterKey:
    | "all"
    | "firstContact"
    | "timeToQuote"
    | "timeToProposal"
    | "timeToBind"
    | "conversionRate"
    | "lostRate";
};

export type VelocityBottleneckInsight = {
  id: string;
  title: string;
  detail: string;
  severity: "critical" | "warning" | "info";
};

export type VelocityTrendPoint = {
  label: string;
  value: number;
  target?: number;
};

export type VelocityFilters = {
  leadSource: string;
  assignedVa: string;
  assignedProducer: string;
  status: string;
  responseSpeed: string;
  dateRange: string;
  industry: string;
  state: string;
};

export const defaultVelocityFilters: VelocityFilters = {
  leadSource: "All Sources",
  assignedVa: "All VAs",
  assignedProducer: "All Producers",
  status: "All Statuses",
  responseSpeed: "All Speeds",
  dateRange: "Last 30 Days",
  industry: "All Industries",
  state: "All States",
};

export const velocityStageLabels: Record<VelocityStageKey, string> = {
  "lead-created": "Lead Created",
  assigned: "Assigned",
  "first-contact": "First Contact",
  "follow-up": "Follow-up",
  "intake-started": "Intake Started",
  marketed: "Marketed",
  "quote-received": "Quote Received",
  "proposal-sent": "Proposal Sent",
  "bound-lost": "Bound / Lost",
};

export const velocityStageOrder: VelocityStageKey[] = [
  "lead-created",
  "assigned",
  "first-contact",
  "follow-up",
  "intake-started",
  "marketed",
  "quote-received",
  "proposal-sent",
  "bound-lost",
];

export const velocityBenchmarksMs = {
  firstContact: 15 * 60 * 1000,
  intakeStart: 2 * 60 * 60 * 1000,
  quoteRequest: 24 * 60 * 60 * 1000,
  proposalSent: 48 * 60 * 60 * 1000,
  bind: 7 * 24 * 60 * 60 * 1000,
};

export const velocityStatusOptions = [
  "All Statuses",
  "New",
  "Contacted",
  "Intake Started",
  "Quoted",
  "Proposal Sent",
  "Negotiating",
  "Bound",
  "Lost",
];

export const velocitySourceOptions = [
  "All Sources",
  "Referral",
  "Website",
  "Ricochet",
  "Cold Call",
  "Partner",
  "Walk-in",
];

export const velocityVaOptions = ["All VAs", "JoJo", "Pedro", "Hamad", "Tracie"];

export const velocityProducerOptions = ["All Producers", "Eva", "Tracie", "Sarah", "Kyle"];

export const velocitySpeedOptions = ["All Speeds", "Fast", "Normal", "Slow", "At Risk"];

export const velocityDateRangeOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];

export const velocityIndustryOptions = [
  "All Industries",
  "Contractors",
  "Restaurant",
  "Auto",
  "Logistics",
  "Retail",
  "Manufacturing",
];

export const velocityStateOptions = ["All States", "CA", "TX", "NY", "FL", "WA", "IL"];

export const velocityStatusClass: Record<LeadVelocityStatus, string> = {
  New: "badge-gray",
  Contacted: "badge-blue",
  "Intake Started": "badge-yellow",
  Quoted: "badge-blue",
  "Proposal Sent": "badge-blue",
  Negotiating: "badge-yellow",
  Bound: "badge-green",
  Lost: "badge-red",
};

export const speedRatingClass: Record<SpeedRating, string> = {
  Fast: "badge-green",
  Normal: "badge-blue",
  Slow: "badge-yellow",
  "At Risk": "badge-red",
};

export const velocityStageStateClass: Record<VelocityStageState, string> = {
  completed: "completed",
  current: "current",
  pending: "pending",
  lost: "lost",
};

export const insightSeverityClass = {
  critical: "badge-red",
  warning: "badge-yellow",
  info: "badge-blue",
};

const now = Date.now();
const min = 60 * 1000;
const hour = 60 * min;
const day = 24 * hour;

function fmt(ms: number): string {
  if (ms < 0) return "—";
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const mins = Math.floor((ms % hour) / min);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function stage(
  key: VelocityStageKey,
  timestamp: string | null,
  timestampMs: number | null,
  gapFromPrev: string,
  gapFromPrevMs: number | null,
  owner: string,
  state: VelocityStageState,
  isSlowest = false,
): VelocityStageEntry {
  return {
    key,
    label: velocityStageLabels[key],
    timestamp,
    timestampMs,
    gapFromPrev,
    gapFromPrevMs,
    owner,
    state,
    isSlowest,
  };
}

function rateFirstContact(ms: number): SpeedRating {
  if (ms <= velocityBenchmarksMs.firstContact) return "Fast";
  if (ms <= velocityBenchmarksMs.firstContact * 2) return "Normal";
  if (ms <= velocityBenchmarksMs.firstContact * 4) return "Slow";
  return "At Risk";
}

export const seedLeadVelocityRecords: LeadVelocityRecord[] = [
  {
    id: "lv-martinez",
    leadName: "Carlos Martinez",
    businessName: "Martinez Landscaping",
    assignedVa: "JoJo",
    assignedProducer: "Eva",
    leadSource: "Referral",
    industry: "Contractors",
    state: "CA",
    firstResponseTime: "8m",
    firstResponseMs: 8 * min,
    timeToIntake: "1h 45m",
    timeToIntakeMs: 105 * min,
    timeToQuote: "3d 2h",
    timeToQuoteMs: 3 * day + 2 * hour,
    timeToProposal: "4d 6h",
    timeToProposalMs: 4 * day + 6 * hour,
    totalCycleTime: "8d 4h",
    totalCycleMs: 8 * day + 4 * hour,
    currentStatus: "Negotiating",
    conversionProbability: 72,
    responseSpeed: "Fast",
    priority: "High",
    createdMs: now - 8 * day - 4 * hour,
    escalated: false,
    internalNotes: ["Strong referral from existing client."],
    stages: [
      stage("lead-created", "May 12, 2026 · 8:55 AM", now - 8 * day - 4 * hour, "—", null, "System", "completed"),
      stage("assigned", "May 12, 2026 · 8:58 AM", now - 8 * day - 4 * hour + 3 * min, "3m", 3 * min, "JoJo", "completed"),
      stage("first-contact", "May 12, 2026 · 9:03 AM", now - 8 * day - 4 * hour + 8 * min, "8m", 8 * min, "JoJo", "completed"),
      stage("follow-up", "May 12, 2026 · 11:00 AM", now - 8 * day - 2 * hour, "1h 57m", 117 * min, "JoJo", "completed"),
      stage("intake-started", "May 12, 2026 · 10:40 AM", now - 8 * day - 3 * hour - 15 * min, "1h 45m", 105 * min, "JoJo", "completed"),
      stage("marketed", "May 13, 2026 · 10:00 AM", now - 7 * day - 14 * hour, "23h 20m", 23 * hour + 20 * min, "Pedro", "completed"),
      stage("quote-received", "May 15, 2026 · 2:00 PM", now - 5 * day - 10 * hour, "2d 4h", 2 * day + 4 * hour, "JoJo", "completed", true),
      stage("proposal-sent", "May 16, 2026 · 4:00 PM", now - 4 * day - 8 * hour, "1d 2h", day + 2 * hour, "Eva", "completed"),
      stage("bound-lost", null, null, "—", null, "Eva", "pending"),
    ],
  },
  {
    id: "lv-kim",
    leadName: "David Kim",
    businessName: "Kim Auto Shop",
    assignedVa: "Pedro",
    assignedProducer: "Eva",
    leadSource: "Ricochet",
    industry: "Auto",
    state: "TX",
    firstResponseTime: "22m",
    firstResponseMs: 22 * min,
    timeToIntake: "—",
    timeToIntakeMs: 0,
    timeToQuote: "—",
    timeToQuoteMs: 0,
    timeToProposal: "—",
    timeToProposalMs: 0,
    totalCycleTime: "2d 6h",
    totalCycleMs: 2 * day + 6 * hour,
    currentStatus: "Intake Started",
    conversionProbability: 38,
    responseSpeed: "Slow",
    priority: "High",
    createdMs: now - 2 * day - 6 * hour,
    escalated: true,
    internalNotes: ["Missing docs blocking intake completion."],
    stages: [
      stage("lead-created", "May 18, 2026 · 2:00 PM", now - 2 * day - 6 * hour, "—", null, "System", "completed"),
      stage("assigned", "May 18, 2026 · 2:05 PM", now - 2 * day - 6 * hour + 5 * min, "5m", 5 * min, "Pedro", "completed"),
      stage("first-contact", "May 18, 2026 · 2:22 PM", now - 2 * day - 6 * hour + 22 * min, "22m", 22 * min, "Pedro", "completed", true),
      stage("follow-up", "May 19, 2026 · 9:00 AM", now - day - 9 * hour, "18h 38m", 18 * hour + 38 * min, "Pedro", "completed"),
      stage("intake-started", "May 19, 2026 · 11:30 AM", now - day - 6 * hour - 30 * min, "2h 30m", 150 * min, "Pedro", "current"),
      stage("marketed", null, null, "—", null, "Pedro", "pending"),
      stage("quote-received", null, null, "—", null, "Pedro", "pending"),
      stage("proposal-sent", null, null, "—", null, "Eva", "pending"),
      stage("bound-lost", null, null, "—", null, "Eva", "pending"),
    ],
  },
  {
    id: "lv-seoul",
    leadName: "Min Park",
    businessName: "Greenline Logistics",
    assignedVa: "JoJo",
    assignedProducer: "Tracie",
    leadSource: "Website",
    industry: "Restaurant",
    state: "NY",
    firstResponseTime: "12m",
    firstResponseMs: 12 * min,
    timeToIntake: "55m",
    timeToIntakeMs: 55 * min,
    timeToQuote: "2d 8h",
    timeToQuoteMs: 2 * day + 8 * hour,
    timeToProposal: "3d 4h",
    timeToProposalMs: 3 * day + 4 * hour,
    totalCycleTime: "4d 6h",
    totalCycleMs: 4 * day + 6 * hour,
    currentStatus: "Proposal Sent",
    conversionProbability: 81,
    responseSpeed: "Fast",
    priority: "Medium",
    createdMs: now - 4 * day - 6 * hour,
    escalated: false,
    internalNotes: [],
    stages: [
      stage("lead-created", "May 16, 2026 · 8:00 AM", now - 4 * day - 6 * hour, "—", null, "System", "completed"),
      stage("assigned", "May 16, 2026 · 8:02 AM", now - 4 * day - 6 * hour + 2 * min, "2m", 2 * min, "JoJo", "completed"),
      stage("first-contact", "May 16, 2026 · 8:12 AM", now - 4 * day - 6 * hour + 12 * min, "12m", 12 * min, "JoJo", "completed"),
      stage("follow-up", "May 16, 2026 · 9:00 AM", now - 4 * day - 5 * hour, "48m", 48 * min, "JoJo", "completed"),
      stage("intake-started", "May 16, 2026 · 8:55 AM", now - 4 * day - 5 * hour - 5 * min, "55m", 55 * min, "JoJo", "completed"),
      stage("marketed", "May 17, 2026 · 9:00 AM", now - 3 * day - 14 * hour, "1d 14m", day + 14 * min, "JoJo", "completed"),
      stage("quote-received", "May 18, 2026 · 5:00 PM", now - 2 * day - 6 * hour, "1d 8h", day + 8 * hour, "JoJo", "completed"),
      stage("proposal-sent", "May 19, 2026 · 12:00 PM", now - day - 10 * hour, "19h", 19 * hour, "Tracie", "current"),
      stage("bound-lost", null, null, "—", null, "Tracie", "pending"),
    ],
  },
  {
    id: "lv-westside",
    leadName: "Angela Lopez",
    businessName: "Rivera Construction",
    assignedVa: "Pedro",
    assignedProducer: "Kyle",
    leadSource: "Partner",
    industry: "Contractors",
    state: "CA",
    firstResponseTime: "6m",
    firstResponseMs: 6 * min,
    timeToIntake: "1h 10m",
    timeToIntakeMs: 70 * min,
    timeToQuote: "2d 4h",
    timeToQuoteMs: 2 * day + 4 * hour,
    timeToProposal: "3d 2h",
    timeToProposalMs: 3 * day + 2 * hour,
    totalCycleTime: "5d 8h",
    totalCycleMs: 5 * day + 8 * hour,
    currentStatus: "Bound",
    conversionProbability: 100,
    responseSpeed: "Fast",
    priority: "Medium",
    createdMs: now - 12 * day,
    escalated: false,
    internalNotes: ["Bound — fastest cycle this quarter."],
    stages: [
      stage("lead-created", "May 8, 2026 · 7:30 AM", now - 12 * day, "—", null, "System", "completed"),
      stage("assigned", "May 8, 2026 · 7:32 AM", now - 12 * day + 2 * min, "2m", 2 * min, "Pedro", "completed"),
      stage("first-contact", "May 8, 2026 · 7:36 AM", now - 12 * day + 6 * min, "6m", 6 * min, "Pedro", "completed"),
      stage("follow-up", "May 8, 2026 · 10:00 AM", now - 11 * day - 21 * hour, "2h 24m", 144 * min, "Pedro", "completed"),
      stage("intake-started", "May 8, 2026 · 8:40 AM", now - 11 * day - 22 * hour - 50 * min, "1h 10m", 70 * min, "Pedro", "completed"),
      stage("marketed", "May 9, 2026 · 10:00 AM", now - 11 * day - 12 * hour, "1d 1h", day + hour, "Pedro", "completed"),
      stage("quote-received", "May 11, 2026 · 2:00 PM", now - 9 * day - 8 * hour, "2d 4h", 2 * day + 4 * hour, "Pedro", "completed"),
      stage("proposal-sent", "May 12, 2026 · 9:00 AM", now - 8 * day - 13 * hour, "19h", 19 * hour, "Kyle", "completed"),
      stage("bound-lost", "May 13, 2026 · 4:00 PM", now - 7 * day - 11 * hour, "1d 7h", day + 7 * hour, "Kyle", "completed"),
    ],
  },
  {
    id: "lv-pacific",
    leadName: "Robert Chen",
    businessName: "Atlas Roofing",
    assignedVa: "Hamad",
    assignedProducer: "Eva",
    leadSource: "Cold Call",
    industry: "Contractors",
    state: "WA",
    firstResponseTime: "35m",
    firstResponseMs: 35 * min,
    timeToIntake: "3h 20m",
    timeToIntakeMs: 200 * min,
    timeToQuote: "—",
    timeToQuoteMs: 0,
    timeToProposal: "—",
    timeToProposalMs: 0,
    totalCycleTime: "3d 8h",
    totalCycleMs: 3 * day + 8 * hour,
    currentStatus: "Quoted",
    conversionProbability: 45,
    responseSpeed: "At Risk",
    priority: "High",
    createdMs: now - 3 * day - 8 * hour,
    escalated: false,
    internalNotes: ["Carrier response pending — follow-up scheduled."],
    stages: [
      stage("lead-created", "May 17, 2026 · 6:00 AM", now - 3 * day - 8 * hour, "—", null, "System", "completed"),
      stage("assigned", "May 17, 2026 · 6:10 AM", now - 3 * day - 8 * hour + 10 * min, "10m", 10 * min, "Hamad", "completed"),
      stage("first-contact", "May 17, 2026 · 6:35 AM", now - 3 * day - 8 * hour + 35 * min, "35m", 35 * min, "Hamad", "completed", true),
      stage("follow-up", "May 17, 2026 · 2:00 PM", now - 3 * day - 2 * hour, "7h 25m", 7 * hour + 25 * min, "Hamad", "completed"),
      stage("intake-started", "May 17, 2026 · 9:20 AM", now - 3 * day - 4 * hour - 40 * min, "3h 20m", 200 * min, "Hamad", "completed"),
      stage("marketed", "May 17, 2026 · 4:00 PM", now - 3 * day + 1 * hour, "6h 40m", 6 * hour + 40 * min, "Hamad", "completed"),
      stage("quote-received", "May 18, 2026 · 10:00 AM", now - 2 * day - 4 * hour, "18h", 18 * hour, "Hamad", "current"),
      stage("proposal-sent", null, null, "—", null, "Eva", "pending"),
      stage("bound-lost", null, null, "—", null, "Eva", "pending"),
    ],
  },
  {
    id: "lv-harbor",
    leadName: "James Rivera",
    businessName: "Greenline Logistics",
    assignedVa: "JoJo",
    assignedProducer: "Eva",
    leadSource: "Walk-in",
    industry: "Logistics",
    state: "FL",
    firstResponseTime: "4m",
    firstResponseMs: 4 * min,
    timeToIntake: "50m",
    timeToIntakeMs: 50 * min,
    timeToQuote: "1d 6h",
    timeToQuoteMs: day + 6 * hour,
    timeToProposal: "2d 2h",
    timeToProposalMs: 2 * day + 2 * hour,
    totalCycleTime: "5d 12h",
    totalCycleMs: 5 * day + 12 * hour,
    currentStatus: "Negotiating",
    conversionProbability: 88,
    responseSpeed: "Fast",
    priority: "Medium",
    createdMs: now - 5 * day - 12 * hour,
    escalated: false,
    internalNotes: ["Awaiting client signature on bind order."],
    stages: [
      stage("lead-created", "May 15, 2026 · 9:30 AM", now - 5 * day - 12 * hour, "—", null, "System", "completed"),
      stage("assigned", "May 15, 2026 · 9:31 AM", now - 5 * day - 12 * hour + min, "1m", min, "JoJo", "completed"),
      stage("first-contact", "May 15, 2026 · 9:34 AM", now - 5 * day - 12 * hour + 4 * min, "4m", 4 * min, "JoJo", "completed"),
      stage("follow-up", "May 15, 2026 · 11:00 AM", now - 5 * day - 10 * hour - 30 * min, "1h 26m", 86 * min, "JoJo", "completed"),
      stage("intake-started", "May 15, 2026 · 10:20 AM", now - 5 * day - 11 * hour - 10 * min, "50m", 50 * min, "JoJo", "completed"),
      stage("marketed", "May 16, 2026 · 9:00 AM", now - 4 * day - 13 * hour, "22h 40m", 22 * hour + 40 * min, "JoJo", "completed"),
      stage("quote-received", "May 17, 2026 · 3:00 PM", now - 3 * day - 7 * hour, "1d 6h", day + 6 * hour, "JoJo", "completed"),
      stage("proposal-sent", "May 18, 2026 · 5:00 PM", now - 2 * day - 5 * hour, "1d 2h", day + 2 * hour, "Eva", "completed"),
      stage("bound-lost", null, null, "—", null, "Eva", "pending"),
    ],
  },
  {
    id: "lv-lost",
    leadName: "Sarah Nguyen",
    businessName: "Nguyen Retail Group",
    assignedVa: "Tracie",
    assignedProducer: "Sarah",
    leadSource: "Website",
    industry: "Retail",
    state: "IL",
    firstResponseTime: "18m",
    firstResponseMs: 18 * min,
    timeToIntake: "2h 10m",
    timeToIntakeMs: 130 * min,
    timeToQuote: "4d 12h",
    timeToQuoteMs: 4 * day + 12 * hour,
    timeToProposal: "—",
    timeToProposalMs: 0,
    totalCycleTime: "6d 2h",
    totalCycleMs: 6 * day + 2 * hour,
    currentStatus: "Lost",
    conversionProbability: 0,
    responseSpeed: "Normal",
    priority: "Low",
    createdMs: now - 6 * day - 2 * hour,
    escalated: false,
    internalNotes: ["Lost to competitor — price gap on GL premium."],
    stages: [
      stage("lead-created", "May 14, 2026 · 10:00 AM", now - 6 * day - 2 * hour, "—", null, "System", "completed"),
      stage("assigned", "May 14, 2026 · 10:03 AM", now - 6 * day - 2 * hour + 3 * min, "3m", 3 * min, "Tracie", "completed"),
      stage("first-contact", "May 14, 2026 · 10:18 AM", now - 6 * day - 2 * hour + 18 * min, "18m", 18 * min, "Tracie", "completed"),
      stage("follow-up", "May 14, 2026 · 2:00 PM", now - 6 * day + 2 * hour, "3h 42m", 222 * min, "Tracie", "completed"),
      stage("intake-started", "May 14, 2026 · 12:10 PM", now - 6 * day - 10 * min, "2h 10m", 130 * min, "Tracie", "completed"),
      stage("marketed", "May 15, 2026 · 9:00 AM", now - 5 * day - 13 * hour, "20h 50m", 20 * hour + 50 * min, "Tracie", "completed"),
      stage("quote-received", "May 18, 2026 · 10:00 PM", now - 2 * day, "3d 13h", 3 * day + 13 * hour, "Tracie", "completed", true),
      stage("proposal-sent", null, null, "—", null, "Sarah", "pending"),
      stage("bound-lost", "May 20, 2026 · 12:00 PM", now - day - 10 * hour, "—", null, "Sarah", "lost"),
    ],
  },
  {
    id: "lv-new",
    leadName: "Michael Torres",
    businessName: "Torres Manufacturing",
    assignedVa: "Hamad",
    assignedProducer: "Eva",
    leadSource: "Ricochet",
    industry: "Manufacturing",
    state: "TX",
    firstResponseTime: "—",
    firstResponseMs: 0,
    timeToIntake: "—",
    timeToIntakeMs: 0,
    timeToQuote: "—",
    timeToQuoteMs: 0,
    timeToProposal: "—",
    timeToProposalMs: 0,
    totalCycleTime: "45m",
    totalCycleMs: 45 * min,
    currentStatus: "New",
    conversionProbability: 55,
    responseSpeed: "At Risk",
    priority: "High",
    createdMs: now - 45 * min,
    escalated: false,
    internalNotes: [],
    stages: [
      stage("lead-created", "May 20, 2026 · 9:15 AM", now - 45 * min, "—", null, "System", "current"),
      stage("assigned", null, null, "—", null, "Hamad", "pending"),
      stage("first-contact", null, null, "—", null, "Hamad", "pending"),
      stage("follow-up", null, null, "—", null, "Hamad", "pending"),
      stage("intake-started", null, null, "—", null, "Hamad", "pending"),
      stage("marketed", null, null, "—", null, "Hamad", "pending"),
      stage("quote-received", null, null, "—", null, "Hamad", "pending"),
      stage("proposal-sent", null, null, "—", null, "Eva", "pending"),
      stage("bound-lost", null, null, "—", null, "Eva", "pending"),
    ],
  },
];

export const velocityBottleneckInsights: VelocityBottleneckInsight[] = [
  {
    id: "bi-1",
    title: "Average first response is 22 mins",
    detail: "7 mins above the 15-minute target — Ricochet and cold call leads driving delay.",
    severity: "warning",
  },
  {
    id: "bi-2",
    title: "5 leads stalled in intake",
    detail: "Missing docs and unsigned applications blocking progression to market submit.",
    severity: "critical",
  },
  {
    id: "bi-3",
    title: "Producer reviews slowing bind rate",
    detail: "Average producer review time is 19h — 18h above the 1-hour SLA on active submissions.",
    severity: "warning",
  },
  {
    id: "bi-4",
    title: "Carrier response causing delays",
    detail: "3 submissions waiting 48h+ for carrier quotes — impacting time-to-proposal metrics.",
    severity: "info",
  },
];

export const dailyLeadSpeedTrend: VelocityTrendPoint[] = [
  { label: "Mon", value: 18, target: 15 },
  { label: "Tue", value: 14, target: 15 },
  { label: "Wed", value: 22, target: 15 },
  { label: "Thu", value: 12, target: 15 },
  { label: "Fri", value: 16, target: 15 },
  { label: "Sat", value: 28, target: 15 },
  { label: "Sun", value: 19, target: 15 },
];

export const weeklyConversionTrend: VelocityTrendPoint[] = [
  { label: "W1", value: 42 },
  { label: "W2", value: 38 },
  { label: "W3", value: 51 },
  { label: "W4", value: 47 },
  { label: "W5", value: 55 },
  { label: "W6", value: 49 },
];

export const monthlyBindSpeedTrend: VelocityTrendPoint[] = [
  { label: "Jan", value: 8.2 },
  { label: "Feb", value: 7.5 },
  { label: "Mar", value: 6.8 },
  { label: "Apr", value: 7.1 },
  { label: "May", value: 5.9, target: 7 },
  { label: "Jun", value: 5.4, target: 7 },
];

export const VELOCITY_STORAGE_KEY = "agency-ops-lead-velocity";

export type VelocityRecordOverrides = Record<
  string,
  Partial<
    Pick<
      LeadVelocityRecord,
      | "assignedVa"
      | "assignedProducer"
      | "currentStatus"
      | "conversionProbability"
      | "responseSpeed"
      | "priority"
      | "escalated"
      | "internalNotes"
      | "stages"
    >
  >
>;

export function loadVelocityOverrides(): VelocityRecordOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VELOCITY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VelocityRecordOverrides) : {};
  } catch {
    return {};
  }
}

export function saveVelocityOverrides(overrides: VelocityRecordOverrides): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VELOCITY_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    /* ignore */
  }
}

export function mergeVelocityRecords(
  base: LeadVelocityRecord[],
  overrides: VelocityRecordOverrides,
): LeadVelocityRecord[] {
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
  return fmt(ms);
}

export function matchesVelocitySearch(record: LeadVelocityRecord, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [record.leadName, record.businessName, record.leadSource, record.assignedVa, record.assignedProducer]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function matchesVelocityFilters(record: LeadVelocityRecord, filters: VelocityFilters): boolean {
  if (filters.leadSource !== "All Sources" && record.leadSource !== filters.leadSource) return false;
  if (filters.assignedVa !== "All VAs" && record.assignedVa !== filters.assignedVa) return false;
  if (filters.assignedProducer !== "All Producers" && record.assignedProducer !== filters.assignedProducer) return false;
  if (filters.status !== "All Statuses" && record.currentStatus !== filters.status) return false;
  if (filters.responseSpeed !== "All Speeds" && record.responseSpeed !== filters.responseSpeed) return false;
  if (filters.industry !== "All Industries" && record.industry !== filters.industry) return false;
  if (filters.state !== "All States" && record.state !== filters.state) return false;

  const ageMs = Date.now() - record.createdMs;
  if (filters.dateRange === "Last 7 Days" && ageMs > 7 * day) return false;
  if (filters.dateRange === "Last 30 Days" && ageMs > 30 * day) return false;
  if (filters.dateRange === "Last 90 Days" && ageMs > 90 * day) return false;

  return true;
}

export function applyVelocitySummaryFilter(
  records: LeadVelocityRecord[],
  filterKey: VelocitySummaryCard["filterKey"],
): LeadVelocityRecord[] {
  switch (filterKey) {
    case "firstContact":
      return records.filter((r) => r.firstResponseMs > velocityBenchmarksMs.firstContact);
    case "timeToQuote":
      return records.filter((r) => r.timeToQuoteMs > velocityBenchmarksMs.quoteRequest);
    case "timeToProposal":
      return records.filter((r) => r.timeToProposalMs > velocityBenchmarksMs.proposalSent);
    case "timeToBind":
      return records.filter((r) => r.currentStatus === "Bound" || r.currentStatus === "Negotiating");
    case "conversionRate":
      return records.filter((r) => r.currentStatus === "Bound" || r.conversionProbability >= 70);
    case "lostRate":
      return records.filter((r) => r.currentStatus === "Lost");
    default:
      return records;
  }
}

export function computeVelocitySummaryCards(records: LeadVelocityRecord[]): VelocitySummaryCard[] {
  const withResponse = records.filter((r) => r.firstResponseMs > 0);
  const withQuote = records.filter((r) => r.timeToQuoteMs > 0);
  const withProposal = records.filter((r) => r.timeToProposalMs > 0);
  const bound = records.filter((r) => r.currentStatus === "Bound");
  const lost = records.filter((r) => r.currentStatus === "Lost");
  const closed = bound.length + lost.length;

  const avgFirst = withResponse.length
    ? withResponse.reduce((s, r) => s + r.firstResponseMs, 0) / withResponse.length
    : 0;
  const avgQuote = withQuote.length ? withQuote.reduce((s, r) => s + r.timeToQuoteMs, 0) / withQuote.length : 0;
  const avgProposal = withProposal.length
    ? withProposal.reduce((s, r) => s + r.timeToProposalMs, 0) / withProposal.length
    : 0;
  const avgBind = bound.length ? bound.reduce((s, r) => s + r.totalCycleMs, 0) / bound.length : 0;
  const conversionRate = closed > 0 ? Math.round((bound.length / closed) * 100) : 0;
  const lostRate = closed > 0 ? Math.round((lost.length / closed) * 100) : 0;

  return [
    {
      id: "first-contact",
      label: "Average Speed to First Contact",
      value: withResponse.length ? fmt(avgFirst) : "—",
      filterKey: "firstContact",
    },
    {
      id: "time-quote",
      label: "Average Time to Quote",
      value: withQuote.length ? fmt(avgQuote) : "—",
      filterKey: "timeToQuote",
    },
    {
      id: "time-proposal",
      label: "Average Time to Proposal",
      value: withProposal.length ? fmt(avgProposal) : "—",
      filterKey: "timeToProposal",
    },
    {
      id: "time-bind",
      label: "Average Time to Bind",
      value: bound.length ? fmt(avgBind) : "—",
      filterKey: "timeToBind",
    },
    {
      id: "conversion",
      label: "Lead Conversion Rate",
      value: closed > 0 ? `${conversionRate}%` : "—",
      filterKey: "conversionRate",
    },
    {
      id: "lost",
      label: "Lost Lead Rate",
      value: closed > 0 ? `${lostRate}%` : "—",
      filterKey: "lostRate",
    },
  ];
}

export function getSlowestStage(stages: VelocityStageEntry[]): VelocityStageKey | null {
  let maxMs = 0;
  let key: VelocityStageKey | null = null;
  for (const s of stages) {
    if (s.gapFromPrevMs && s.gapFromPrevMs > maxMs) {
      maxMs = s.gapFromPrevMs;
      key = s.key;
    }
  }
  return key;
}

export { rateFirstContact };
