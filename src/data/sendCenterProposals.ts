import {
  communicationLogEntries,
  type CommLogEventType,
  type CommunicationLogEntry,
} from "./sendCenter";

export type ProposalSourceTab = "draft-queue" | "approved" | "sent";

export type ProposalLifecycleStatus =
  | "Draft"
  | "Pending Review"
  | "Approved"
  | "Sent"
  | "Negotiating"
  | "Bound";

export type WorkflowStepKey =
  | "draft"
  | "review"
  | "approved"
  | "sent"
  | "opened"
  | "negotiation"
  | "bound";

export const workflowStepLabels: Record<WorkflowStepKey, string> = {
  draft: "Drafted",
  review: "Submitted",
  approved: "Approved",
  sent: "Sent",
  opened: "Opened",
  negotiation: "Negotiating",
  bound: "Bound",
};

export const workflowStepOrder: WorkflowStepKey[] = [
  "draft",
  "review",
  "approved",
  "sent",
  "opened",
  "negotiation",
  "bound",
];

export type EngagementScore = "Hot" | "Warm" | "Cold";

export type ProposalSummary = {
  carrier: string;
  productType: string;
  coverageLimit: string;
  deductible: string;
  premium: string;
  brokerFee: string;
  taxes: string;
  totalCost: string;
  effectiveDate: string;
  expirationDate: string;
};

export type ProposalEngagement = {
  delivered: boolean;
  openCount: number;
  lastViewed: string;
  linkClicks: number;
  attachmentDownloads: number;
  responseTime: string;
  replied: boolean;
};

export type ProposalInternalNotes = {
  notes: string;
  conditions: string;
  objections: string;
  clientRequests: string;
};

export type ProposalStatusStep = {
  key: WorkflowStepKey;
  label: string;
  timestamp: string;
};

export type ProposalCommunicationEvent = {
  id: string;
  label: string;
  eventType: string;
  actor: string;
  timestamp: string;
  detail: string;
};

export type ProposalAiInsight = {
  id: string;
  title: string;
  detail: string;
};

export type ProposalDetail = {
  id: string;
  proposalNumber: string;
  client: string;
  businessName: string;
  policyType: string;
  producer: string;
  currentStatus: string;
  lifecycleStatus: ProposalLifecycleStatus;
  sentDate: string | null;
  createdDate: string;
  lastUpdated: string;
  lastActivity: string;
  sourceTab: ProposalSourceTab;
  summary: ProposalSummary;
  statusTimeline: ProposalStatusStep[];
  engagement: ProposalEngagement;
  internalNotes: ProposalInternalNotes;
  communications: ProposalCommunicationEvent[];
  aiInsights: ProposalAiInsight[];
  workflowProgress: WorkflowStepKey[];
};

const proposalDetails: ProposalDetail[] = [
  {
    id: "prop-martinez",
    proposalNumber: "PROP-2026-0142",
    client: "Martinez Landscaping",
    businessName: "Martinez Landscaping LLC",
    policyType: "BOP + Workers Comp",
    producer: "Eva Chong",
    currentStatus: "Negotiating",
    lifecycleStatus: "Negotiating",
    sentDate: "Jun 15, 2026",
    createdDate: "Jun 12, 2026",
    lastUpdated: "Jun 16, 2026 · 9:10 AM",
    lastActivity: "Jun 16, 2026 · Client replied",
    sourceTab: "sent",
    summary: {
      carrier: "Travelers BOP · Hartford WC",
      productType: "Multi-line Package",
      coverageLimit: "BOP $1M / $2M · WC Statutory",
      deductible: "$1,000 BOP · $500 WC",
      premium: "$18,420",
      brokerFee: "$925",
      taxes: "$1,104",
      totalCost: "$20,449",
      effectiveDate: "Jul 1, 2026",
      expirationDate: "Jul 1, 2027",
    },
    statusTimeline: [
      { key: "draft", label: "Drafted", timestamp: "Jun 12, 2026 · 8:00 AM" },
      { key: "review", label: "Submitted", timestamp: "Jun 13, 2026 · 10:15 AM" },
      { key: "approved", label: "Approved", timestamp: "Jun 14, 2026 · 2:30 PM" },
      { key: "sent", label: "Sent", timestamp: "Jun 15, 2026 · 10:22 AM" },
      { key: "opened", label: "Opened", timestamp: "Jun 15, 2026 · 2:45 PM" },
      { key: "negotiation", label: "Negotiating", timestamp: "Jun 16, 2026 · 9:10 AM" },
      { key: "bound", label: "Bound", timestamp: "—" },
    ],
    engagement: {
      delivered: true,
      openCount: 4,
      lastViewed: "Jun 16, 2026 · 9:10 AM",
      linkClicks: 3,
      attachmentDownloads: 2,
      responseTime: "18h 48m",
      replied: true,
    },
    internalNotes: {
      notes: "Client asked for broker fee breakdown — Eva responded same day.\nWC payroll schedule pending final audit numbers.",
      conditions: "Subject to final payroll audit and signed ACORD 125.",
      objections: "Broker fee line item questioned — preparing revised schedule.",
      clientRequests: "Wants itemized fee breakdown and WC class code confirmation.",
    },
    communications: [
      { id: "c1", label: "Proposal sent", eventType: "Sent", actor: "Eva Chong", timestamp: "Jun 15, 2026 · 10:22 AM", detail: "Proposal sent via email with payment link." },
      { id: "c2", label: "Client opened", eventType: "Viewed", actor: "Client", timestamp: "Jun 15, 2026 · 2:45 PM", detail: "Proposal opened — 4 min read time." },
      { id: "c3", label: "Client replied", eventType: "Replied", actor: "Client", timestamp: "Jun 16, 2026 · 9:10 AM", detail: "Client asked about broker fee breakdown." },
      { id: "c4", label: "Follow-up sent", eventType: "Follow-up", actor: "JoJo", timestamp: "Jun 17, 2026 · 11:00 AM", detail: "Fee schedule follow-up email sent." },
      { id: "c5", label: "Producer note added", eventType: "Note", actor: "Eva Chong", timestamp: "Jun 16, 2026 · 11:30 AM", detail: "Internal note: prepare revised fee schedule." },
      { id: "c6", label: "Revision requested", eventType: "Revision", actor: "Client", timestamp: "Jun 16, 2026 · 9:10 AM", detail: "Client requested broker fee itemization." },
    ],
    aiInsights: [
      { id: "ai1", title: "High engagement detected", detail: "Client opened 4 times and replied — prioritize follow-up today." },
      { id: "ai2", title: "Best follow-up time is now", detail: "Peak response window based on prior opens: 9–11 AM." },
      { id: "ai3", title: "Proposal expires in 2 days", detail: "Quote validity ends Jun 18 — confirm bind timeline." },
    ],
    workflowProgress: ["draft", "review", "approved", "sent", "opened", "negotiation"],
  },
  {
    id: "prop-kim",
    proposalNumber: "PROP-2026-0138",
    client: "Kim Auto Shop",
    businessName: "Kim Auto Shop Inc.",
    policyType: "Commercial Auto",
    producer: "Pedro",
    currentStatus: "Draft — In Progress",
    lifecycleStatus: "Draft",
    sentDate: null,
    createdDate: "Jun 19, 2026",
    lastUpdated: "Jun 19, 2026 · 2:40 PM",
    lastActivity: "Jun 19, 2026 · Draft updated",
    sourceTab: "draft-queue",
    summary: {
      carrier: "Travelers",
      productType: "Quote Summary",
      coverageLimit: "Liability $1M CSL",
      deductible: "$500 comp / $1,000 coll",
      premium: "$9,860",
      brokerFee: "$495",
      taxes: "$592",
      totalCost: "$10,947",
      effectiveDate: "Aug 1, 2026",
      expirationDate: "Aug 1, 2027",
    },
    statusTimeline: [
      { key: "draft", label: "Drafted", timestamp: "Jun 19, 2026 · 2:40 PM" },
      { key: "review", label: "Submitted", timestamp: "—" },
      { key: "approved", label: "Approved", timestamp: "—" },
      { key: "sent", label: "Sent", timestamp: "—" },
      { key: "opened", label: "Opened", timestamp: "—" },
      { key: "negotiation", label: "Negotiating", timestamp: "—" },
      { key: "bound", label: "Bound", timestamp: "—" },
    ],
    engagement: {
      delivered: false,
      openCount: 0,
      lastViewed: "—",
      linkClicks: 0,
      attachmentDownloads: 0,
      responseTime: "—",
      replied: false,
    },
    internalNotes: {
      notes: "Missing vehicle schedule attachment for unit #4.",
      conditions: "",
      objections: "",
      clientRequests: "",
    },
    communications: [],
    aiInsights: [
      { id: "ai1", title: "Missing documents", detail: "Vehicle schedule required before licensed review submission." },
      { id: "ai2", title: "Carrier quote is above market average", detail: "Travelers quote is 12% above comparable fleet accounts." },
    ],
    workflowProgress: ["draft"],
  },
  {
    id: "prop-greenline",
    proposalNumber: "PROP-2026-0135",
    client: "Greenline Logistics",
    businessName: "Greenline Logistics LLC",
    policyType: "BOP Package",
    producer: "Eva",
    currentStatus: "Sent — Opened",
    lifecycleStatus: "Sent",
    sentDate: "Jun 12, 2026",
    createdDate: "Jun 8, 2026",
    lastUpdated: "Jun 12, 2026 · 3:15 PM",
    lastActivity: "Jun 12, 2026 · Proposal opened",
    sourceTab: "sent",
    summary: {
      carrier: "CNA",
      productType: "Renewal Proposal",
      coverageLimit: "GL $2M / $4M · Property $500K",
      deductible: "$2,500",
      premium: "$14,500",
      brokerFee: "$750",
      taxes: "$870",
      totalCost: "$16,120",
      effectiveDate: "Sep 1, 2026",
      expirationDate: "Sep 1, 2027",
    },
    statusTimeline: [
      { key: "draft", label: "Drafted", timestamp: "Jun 8, 2026 · 9:00 AM" },
      { key: "review", label: "Submitted", timestamp: "Jun 9, 2026 · 11:00 AM" },
      { key: "approved", label: "Approved", timestamp: "Jun 10, 2026 · 4:00 PM" },
      { key: "sent", label: "Sent", timestamp: "Jun 12, 2026 · 10:00 AM" },
      { key: "opened", label: "Opened", timestamp: "Jun 12, 2026 · 3:15 PM" },
      { key: "negotiation", label: "Negotiating", timestamp: "—" },
      { key: "bound", label: "Bound", timestamp: "—" },
    ],
    engagement: {
      delivered: true,
      openCount: 1,
      lastViewed: "Jun 12, 2026 · 3:15 PM",
      linkClicks: 1,
      attachmentDownloads: 0,
      responseTime: "5h 15m",
      replied: false,
    },
    internalNotes: {
      notes: "Renewal — premium up 8% vs prior term.",
      conditions: "Cargo sub-limits per carrier manuscript.",
      objections: "",
      clientRequests: "Asked about payment plan options.",
    },
    communications: [
      { id: "c1", label: "Proposal sent", eventType: "Sent", actor: "Eva Chong", timestamp: "Jun 12, 2026 · 10:00 AM", detail: "Renewal proposal delivered." },
      { id: "c2", label: "Client opened", eventType: "Viewed", actor: "Client", timestamp: "Jun 12, 2026 · 3:15 PM", detail: "Opened once — 2 min read time." },
    ],
    aiInsights: [
      { id: "ai1", title: "Best follow-up time is now", detail: "Single open with no reply — follow up within 48 hours." },
      { id: "ai2", title: "Proposal expires in 5 days", detail: "Renewal quote valid through Jun 17." },
    ],
    workflowProgress: ["draft", "review", "approved", "sent", "opened"],
  },
  {
    id: "prop-rivera",
    proposalNumber: "PROP-2026-0128",
    client: "Rivera Construction",
    businessName: "Rivera Construction Inc.",
    policyType: "Workers Comp",
    producer: "Sarah",
    currentStatus: "Bound",
    lifecycleStatus: "Bound",
    sentDate: "Jun 8, 2026",
    createdDate: "Jun 1, 2026",
    lastUpdated: "Jun 10, 2026 · 4:00 PM",
    lastActivity: "Jun 10, 2026 · Policy bound",
    sourceTab: "sent",
    summary: {
      carrier: "ICW",
      productType: "Bind Request",
      coverageLimit: "WC Statutory · EL $1M / $1M / $1M",
      deductible: "N/A",
      premium: "$42,600",
      brokerFee: "$2,130",
      taxes: "$2,556",
      totalCost: "$47,286",
      effectiveDate: "Jun 15, 2026",
      expirationDate: "Jun 15, 2027",
    },
    statusTimeline: [
      { key: "draft", label: "Drafted", timestamp: "Jun 1, 2026 · 8:00 AM" },
      { key: "review", label: "Submitted", timestamp: "Jun 2, 2026 · 9:30 AM" },
      { key: "approved", label: "Approved", timestamp: "Jun 5, 2026 · 1:00 PM" },
      { key: "sent", label: "Sent", timestamp: "Jun 8, 2026 · 1:15 PM" },
      { key: "opened", label: "Opened", timestamp: "Jun 9, 2026 · 8:40 AM" },
      { key: "negotiation", label: "Negotiating", timestamp: "Jun 9, 2026 · 2:00 PM" },
      { key: "bound", label: "Bound", timestamp: "Jun 10, 2026 · 4:00 PM" },
    ],
    engagement: {
      delivered: true,
      openCount: 3,
      lastViewed: "Jun 9, 2026 · 8:40 AM",
      linkClicks: 5,
      attachmentDownloads: 3,
      responseTime: "21h 25m",
      replied: true,
    },
    internalNotes: {
      notes: "Bind confirmed — COI requested for GC contract.",
      conditions: "Payroll audit within 60 days of effective date.",
      objections: "",
      clientRequests: "COI naming general contractor as additional insured.",
    },
    communications: [
      { id: "c1", label: "Proposal sent", eventType: "Sent", actor: "Sarah", timestamp: "Jun 8, 2026 · 1:15 PM", detail: "Bind proposal delivered to client portal." },
      { id: "c2", label: "Client opened", eventType: "Viewed", actor: "Client", timestamp: "Jun 9, 2026 · 8:40 AM", detail: "Full proposal reviewed." },
      { id: "c3", label: "Client replied", eventType: "Replied", actor: "Client", timestamp: "Jun 9, 2026 · 2:00 PM", detail: "Accepted terms — requested bind." },
    ],
    aiInsights: [
      { id: "ai1", title: "Policy bound successfully", detail: "All workflow steps complete — archive or mark complete." },
    ],
    workflowProgress: ["draft", "review", "approved", "sent", "opened", "negotiation", "bound"],
  },
  {
    id: "prop-atlas",
    proposalNumber: "PROP-2026-0140",
    client: "Atlas Roofing",
    businessName: "Atlas Roofing PA",
    policyType: "BOP Package",
    producer: "Pedro",
    currentStatus: "Approved — Ready to Send",
    lifecycleStatus: "Approved",
    sentDate: null,
    createdDate: "Jun 15, 2026",
    lastUpdated: "Jun 19, 2026 · 11:00 AM",
    lastActivity: "Jun 19, 2026 · Licensed approval",
    sourceTab: "approved",
    summary: {
      carrier: "Kingsway",
      productType: "General Liability",
      coverageLimit: "GL $1M / $2M",
      deductible: "$1,000",
      premium: "$5,600",
      brokerFee: "$560",
      taxes: "$336",
      totalCost: "$6,496",
      effectiveDate: "Jul 15, 2026",
      expirationDate: "Jul 15, 2027",
    },
    statusTimeline: [
      { key: "draft", label: "Drafted", timestamp: "Jun 15, 2026 · 9:00 AM" },
      { key: "review", label: "Submitted", timestamp: "Jun 16, 2026 · 10:00 AM" },
      { key: "approved", label: "Approved", timestamp: "Jun 19, 2026 · 11:00 AM" },
      { key: "sent", label: "Sent", timestamp: "—" },
      { key: "opened", label: "Opened", timestamp: "—" },
      { key: "negotiation", label: "Negotiating", timestamp: "—" },
      { key: "bound", label: "Bound", timestamp: "—" },
    ],
    engagement: {
      delivered: false,
      openCount: 0,
      lastViewed: "—",
      linkClicks: 0,
      attachmentDownloads: 0,
      responseTime: "—",
      replied: false,
    },
    internalNotes: {
      notes: "Scheduled send for Jun 22 morning.",
      conditions: "Roofing class subject to signed application.",
      objections: "",
      clientRequests: "Wants coverage summary attached.",
    },
    communications: [],
    aiInsights: [
      { id: "ai1", title: "Ready to send", detail: "Licensed approval complete — schedule send for optimal open rates." },
    ],
    workflowProgress: ["draft", "review", "approved"],
  },
];

export const proposalIdByRowId: Record<string, string> = {
  "dq-1": "prop-martinez",
  "dq-2": "prop-kim",
  "dq-3": "prop-greenline",
  "dq-5": "prop-atlas",
  "ad-1": "prop-martinez",
  "ad-2": "prop-atlas",
  "ad-3": "prop-kim",
  "ad-4": "prop-greenline",
  "sp-1": "prop-martinez",
  "sp-2": "prop-greenline",
  "sp-3": "prop-rivera",
  "sp-4": "prop-kim",
  "sp-5": "prop-atlas",
};

export const sourceTabLabels: Record<ProposalSourceTab, string> = {
  "draft-queue": "Draft Queue",
  approved: "Approved Drafts",
  sent: "Sent Proposals",
};

export function getProposalDetail(id: string): ProposalDetail | undefined {
  const resolved = proposalIdByRowId[id] ?? id;
  return proposalDetails.find((p) => p.id === resolved);
}

export function getProposalCommunications(client: string): CommunicationLogEntry[] {
  return communicationLogEntries.filter((e) => e.client === client);
}

export function computeEngagementScore(engagement: ProposalEngagement): EngagementScore {
  if (engagement.replied || engagement.openCount >= 2) return "Hot";
  if (engagement.openCount >= 1 || engagement.delivered) return "Warm";
  return "Cold";
}

export const engagementScoreClass: Record<EngagementScore, string> = {
  Hot: "badge-red",
  Warm: "badge-yellow",
  Cold: "badge-gray",
};

export function getWorkflowStepState(
  progress: WorkflowStepKey[],
  step: WorkflowStepKey,
): "completed" | "current" | "pending" {
  const last = progress[progress.length - 1];
  if (progress.includes(step) && step === last) return "current";
  if (progress.includes(step)) return "completed";
  return "pending";
}

export const commEventTypeClass: Record<string, string> = {
  Sent: "badge-blue",
  Viewed: "badge-green",
  Replied: "badge-yellow",
  "Follow-up": "badge-yellow",
  Note: "badge-blue",
  Revision: "badge-yellow",
  Escalated: "badge-red",
};

export const commLogTypeClass: Record<CommLogEventType, string> = {
  Sent: "badge-blue",
  Viewed: "badge-green",
  Replied: "badge-yellow",
  Escalated: "badge-red",
  "Follow-up": "badge-yellow",
};

export function getDynamicNextActions(status: ProposalLifecycleStatus): string[] {
  switch (status) {
    case "Draft":
      return ["Submit for Review"];
    case "Pending Review":
      return ["Edit Draft", "Cancel Review"];
    case "Approved":
      return ["Send Proposal", "Schedule Send"];
    case "Sent":
      return ["Follow-up", "Resend", "Revise Proposal"];
    case "Negotiating":
      return ["Update Terms", "Add Note"];
    case "Bound":
      return ["Mark Complete", "Archive"];
    default:
      return [];
  }
}

export function getStickyBarActions(status: ProposalLifecycleStatus): {
  primary: string;
  secondary: string[];
} {
  switch (status) {
    case "Bound":
      return { primary: "Save Changes", secondary: ["Archive", "Mark Bound"] };
    default:
      return { primary: "Save Changes", secondary: ["Send / Resend", "Follow-up", "Archive", "Mark Bound"] };
  }
}

export const PROPOSAL_DETAIL_STORAGE_KEY = "send-center-proposal-overrides";

export type ProposalDetailOverrides = {
  lifecycleStatus?: ProposalLifecycleStatus;
  internalNotes?: ProposalInternalNotes;
  lastUpdated?: string;
};

export function loadProposalOverrides(proposalId: string): ProposalDetailOverrides | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROPOSAL_DETAIL_STORAGE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, ProposalDetailOverrides>;
    return all[proposalId] ?? null;
  } catch {
    return null;
  }
}

export function saveProposalOverrides(proposalId: string, overrides: ProposalDetailOverrides): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PROPOSAL_DETAIL_STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, ProposalDetailOverrides>) : {};
    all[proposalId] = { ...all[proposalId], ...overrides };
    localStorage.setItem(PROPOSAL_DETAIL_STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
