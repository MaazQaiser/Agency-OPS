export const submissionTrackerExportAction = {
  id: "export-list",
  label: "Export List",
  icon: "download" as const,
};

export const submissionTrackerSearchPlaceholder =
  "Search by client, producer, carrier, or coverage";

export const trackerFilterOptions = {
  coverage: ["Coverage Type", "BOP", "Workers Comp", "Commercial Auto", "General Liability", "GL"],
  producer: ["Producer", "Eva", "Pedro", "Sarah"],
  va: ["Assigned VA", "JoJo", "Valerie", "Tracie"],
  status: [
    "Current Stage",
    "New Intake",
    "Reviewing",
    "Marketed",
    "Quoted",
    "Negotiation",
    "Pending Producer Approval",
    "Pending Docs",
    "Ready to Bind",
    "Bound",
    "Declined",
  ],
  carrier: ["Carrier", "Markel", "Travelers", "CNA", "ICW", "Kingsway"],
  state: ["State", "CA", "TX", "NY", "WA"],
  daysOpen: ["Days Open", "0–2 Days", "3–5 Days", "6–10 Days", "11+ Days"],
};

export type TrackerStatus =
  | "New Intake"
  | "Reviewing"
  | "Marketed"
  | "Quoted"
  | "Negotiation"
  | "Pending Producer Approval"
  | "Pending Docs"
  | "Ready to Bind"
  | "Bound"
  | "Declined";

export type SlaInfo = {
  label: string;
  overdue: boolean;
};

export type DocumentStatus = "complete" | "pending" | "missing";

export type SubmissionDocument = {
  label: string;
  status: DocumentStatus;
};

export type BindingStatus = {
  quoteSelected: boolean;
  producerApproved: boolean;
  clientApproved: boolean;
  docsComplete: boolean;
  paymentReady: boolean;
  selectedCarrier?: string;
  selectedPremium?: string;
  brokerFee?: string;
  approvalStatus: string;
};

export type TimelineStep = {
  label: string;
  timestamp?: string;
  complete: boolean;
};

export type CoverageCheckStatus = "complete" | "pending" | "missing";

export type CoverageCheckItem = {
  label: string;
  status: CoverageCheckStatus;
};

export type CarrierListItem = {
  carrier: string;
  status: string;
};

export type QuoteOption = {
  id: string;
  carrier: string;
  premium: string;
  deductible: string;
  coverageLimits: string;
  exclusions: string;
  brokerFee: string;
  notes: string;
};

export type TrackerSubmission = {
  id: string;
  client: string;
  producer: string;
  va: string;
  coverage: string;
  submissionDate: string;
  marketsSubmitted: number;
  quotesReceived: number;
  declines: number;
  premiumValue: string;
  followUpDate: string;
  daysOpen: number;
  status: TrackerStatus;
  missingDocs: string;
  nextAction: string;
  state: string;
  carriers: CarrierListItem[];
  documents: SubmissionDocument[];
  coverageChecklist: CoverageCheckItem[];
  brokerNotes: string[];
  producerNotes: string[];
  quotes: QuoteOption[];
  binding?: BindingStatus;
  selectedQuoteId?: string;
};

export const trackerSubmissions: TrackerSubmission[] = [
  {
    id: "trk-martinez",
    client: "Martinez Landscaping",
    producer: "Eva",
    va: "JoJo",
    coverage: "BOP",
    submissionDate: "May 12, 2026",
    marketsSubmitted: 2,
    quotesReceived: 3,
    declines: 0,
    premiumValue: "$4,200",
    followUpDate: "Today",
    daysOpen: 32,
    status: "Quoted",
    missingDocs: "Loss runs, Signed app",
    nextAction: "Add Market",
    state: "CA",
    carriers: [
      { carrier: "Markel", status: "Declined" },
      { carrier: "Travelers", status: "Declined" },
    ],
    documents: [
      { label: "Signed Application", status: "missing" },
      { label: "Loss Runs", status: "missing" },
      { label: "Payroll Report", status: "complete" },
      { label: "Certificate of Insurance", status: "complete" },
    ],
    coverageChecklist: [
      { label: "General Liability", status: "complete" },
      { label: "Workers Comp", status: "complete" },
      { label: "Commercial Auto", status: "complete" },
      { label: "Property", status: "complete" },
    ],
    brokerNotes: ["Only 2 of 3 required markets — add CNA or Nationwide.", "No UW update from Markel in 3 days."],
    producerNotes: ["Needs quote by Friday.", "Comparing against State Farm renewal."],
    quotes: [
      {
        id: "q-martinez-markel",
        carrier: "Markel",
        premium: "$4,200",
        deductible: "$1,000",
        coverageLimits: "$1M / $2M",
        exclusions: "None",
        brokerFee: "$500",
        notes: "Best overall terms — recommended",
      },
      {
        id: "q-martinez-cna",
        carrier: "CNA",
        premium: "$3,900",
        deductible: "$1,500",
        coverageLimits: "$1M / $2M",
        exclusions: "Flood excluded",
        brokerFee: "$500",
        notes: "Lower premium option",
      },
      {
        id: "q-martinez-travelers",
        carrier: "Travelers",
        premium: "$4,650",
        deductible: "$2,500",
        coverageLimits: "$1M / $2M",
        exclusions: "Tree work excluded",
        brokerFee: "$500",
        notes: "Pending final UW review",
      },
    ],
  },
  {
    id: "trk-kim",
    client: "Kim Auto Shop",
    producer: "Pedro",
    va: "Tracie",
    coverage: "Commercial Auto",
    submissionDate: "May 14, 2026",
    marketsSubmitted: 3,
    quotesReceived: 1,
    declines: 1,
    premiumValue: "$5,800",
    followUpDate: "Tomorrow",
    daysOpen: 6,
    status: "Reviewing",
    missingDocs: "Signed App, Loss Runs",
    nextAction: "Upload Docs",
    state: "CA",
    carriers: [
      { carrier: "Travelers", status: "Quoted" },
      { carrier: "Markel", status: "Pending" },
    ],
    documents: [
      { label: "Signed Application", status: "missing" },
      { label: "Loss Runs", status: "missing" },
      { label: "Payroll Report", status: "complete" },
    ],
    coverageChecklist: [
      { label: "General Liability", status: "complete" },
      { label: "Garagekeepers", status: "pending" },
      { label: "Commercial Auto", status: "complete" },
    ],
    brokerNotes: ["GL limits at minimum — client aware."],
    producerNotes: ["Referred by JoJo — bind target after docs."],
    quotes: [
      {
        id: "q-kim-travelers",
        carrier: "Travelers",
        premium: "$5,800",
        deductible: "$1,500",
        coverageLimits: "Auto $1M CSL",
        exclusions: "Racing excluded",
        brokerFee: "$600",
        notes: "Awaiting signed app to bind",
      },
    ],
  },
  {
    id: "trk-greenline",
    client: "Greenline Logistics",
    producer: "Eva",
    va: "JoJo",
    coverage: "BOP",
    submissionDate: "May 16, 2026",
    marketsSubmitted: 4,
    quotesReceived: 2,
    declines: 0,
    premiumValue: "$14,500",
    followUpDate: "Today",
    daysOpen: 4,
    status: "Pending Producer Approval",
    missingDocs: "None",
    nextAction: "Producer Approval",
    state: "TX",
    carriers: [
      { carrier: "Markel", status: "Quoted" },
      { carrier: "CNA", status: "Quoted" },
    ],
    documents: [
      { label: "Signed Application", status: "complete" },
      { label: "Loss Runs", status: "complete" },
      { label: "Operating Authority", status: "complete" },
    ],
    coverageChecklist: [
      { label: "General Liability", status: "complete" },
      { label: "Property", status: "complete" },
      { label: "Business Income", status: "complete" },
    ],
    brokerNotes: ["Fleet logistics account — present both quotes Friday."],
    producerNotes: ["Client wants cargo coverage emphasized."],
    quotes: [
      {
        id: "q-greenline-cna",
        carrier: "CNA",
        premium: "$14,500",
        deductible: "$2,500",
        coverageLimits: "BOP $2M aggregate",
        exclusions: "Over-the-road hazmat excluded",
        brokerFee: "$750",
        notes: "Broader cargo coverage",
      },
      {
        id: "q-greenline-markel",
        carrier: "Markel",
        premium: "$14,200",
        deductible: "$2,500",
        coverageLimits: "BOP $2M aggregate",
        exclusions: "Standard logistics",
        brokerFee: "$750",
        notes: "Lower premium option",
      },
    ],
    selectedQuoteId: "q-greenline-cna",
    binding: {
      quoteSelected: true,
      producerApproved: false,
      clientApproved: false,
      docsComplete: true,
      paymentReady: false,
      selectedCarrier: "CNA",
      selectedPremium: "$14,500",
      brokerFee: "$750",
      approvalStatus: "Pending Producer Approval",
    },
  },
  {
    id: "trk-rivera",
    client: "Rivera Construction",
    producer: "Sarah",
    va: "Valerie",
    coverage: "Workers Comp",
    submissionDate: "May 11, 2026",
    marketsSubmitted: 3,
    quotesReceived: 1,
    declines: 1,
    premiumValue: "$18,900",
    followUpDate: "Today",
    daysOpen: 9,
    status: "Ready to Bind",
    missingDocs: "Signed App",
    nextAction: "Bind Policy",
    state: "CA",
    carriers: [{ carrier: "ICW", status: "Quoted" }],
    documents: [
      { label: "Signed Application", status: "missing" },
      { label: "Loss Runs", status: "complete" },
      { label: "Payroll Report", status: "complete" },
    ],
    coverageChecklist: [
      { label: "Workers Comp", status: "complete" },
      { label: "General Liability", status: "pending" },
    ],
    brokerNotes: ["Client verbally accepted ICW terms."],
    producerNotes: ["High-value WC — priority bind this week."],
    quotes: [
      {
        id: "q-rivera-icw",
        carrier: "ICW",
        premium: "$18,900",
        deductible: "N/A",
        coverageLimits: "Statutory WC",
        exclusions: "Height work over 3 stories excluded",
        brokerFee: "$1,200",
        notes: "Ready to bind pending signed app",
      },
    ],
    selectedQuoteId: "q-rivera-icw",
    binding: {
      quoteSelected: true,
      producerApproved: true,
      clientApproved: true,
      docsComplete: false,
      paymentReady: true,
      selectedCarrier: "ICW",
      selectedPremium: "$18,900",
      brokerFee: "$1,200",
      approvalStatus: "Producer approved — pending signed app",
    },
  },
  {
    id: "trk-atlas",
    client: "Atlas Roofing",
    producer: "Pedro",
    va: "Tracie",
    coverage: "General Liability",
    submissionDate: "May 15, 2026",
    marketsSubmitted: 4,
    quotesReceived: 3,
    declines: 1,
    premiumValue: "$5,600",
    followUpDate: "May 20",
    daysOpen: 5,
    status: "Quoted",
    missingDocs: "None",
    nextAction: "Review Quote",
    state: "WA",
    carriers: [
      { carrier: "Travelers", status: "Quoted" },
      { carrier: "Markel", status: "Quoted" },
      { carrier: "Kingsway", status: "Quoted" },
    ],
    documents: [
      { label: "Signed Application", status: "complete" },
      { label: "Loss Runs", status: "complete" },
    ],
    coverageChecklist: [
      { label: "General Liability", status: "complete" },
      { label: "Tools & Equipment", status: "complete" },
    ],
    brokerNotes: ["Travelers best quote — presenting to client."],
    producerNotes: ["Standard GL renewal opportunity."],
    quotes: [
      {
        id: "q-atlas-travelers",
        carrier: "Travelers",
        premium: "$5,600",
        deductible: "$1,000",
        coverageLimits: "GL $1M / $2M",
        exclusions: "Standard",
        brokerFee: "$400",
        notes: "Recommended option",
      },
    ],
  },
];

export const agingBuckets = [
  { id: "age-0-2", label: "0–2 Days", count: 5, tone: "green" as const },
  { id: "age-3-5", label: "3–5 Days", count: 4, tone: "yellow" as const },
  { id: "age-6-10", label: "6–10 Days", count: 2, tone: "orange" as const },
  { id: "age-11", label: "11+ Days", count: 1, tone: "red" as const },
];

export function getAgingBucketTone(bucketId: string): "green" | "yellow" | "orange" | "red" {
  const bucket = agingBuckets.find((b) => b.id === bucketId);
  return bucket?.tone ?? "green";
}

export function formatCarrierAging(daysSinceSent: number, followUpCount: number): string {
  const dayLabel = daysSinceSent === 1 ? "1 day" : `${daysSinceSent} days`;
  return `Marketed ${dayLabel} ago · Follow-up #${followUpCount}`;
}

export type DocUrgency = "critical" | "waiting-client" | "follow-up-sent";

export type GranularDocStatus = "Pending" | "Received" | "Overdue";

export type GranularDocumentItem = {
  id: string;
  name: string;
  requestedDate: string;
  lastReminder: string;
  status: GranularDocStatus;
};

export type DocumentBlocker = {
  id: string;
  client: string;
  missing: string;
  requested: string;
  assigned: string;
  action: string;
  urgency: DocUrgency;
  documents: GranularDocumentItem[];
};

export const documentBlockers: DocumentBlocker[] = [
  {
    id: "doc-1",
    client: "Martinez Landscaping",
    missing: "Loss Runs, Signed Application",
    requested: "2 days ago",
    assigned: "JoJo",
    action: "Send Reminder",
    urgency: "critical",
    documents: [
      { id: "d1-loss", name: "Loss Runs", requestedDate: "May 18, 2026", lastReminder: "Today", status: "Overdue" },
      { id: "d1-driver", name: "Driver Schedule", requestedDate: "May 19, 2026", lastReminder: "Yesterday", status: "Received" },
      { id: "d1-app", name: "Signed Application", requestedDate: "May 18, 2026", lastReminder: "Today", status: "Overdue" },
      { id: "d1-payroll", name: "Payroll Report", requestedDate: "May 15, 2026", lastReminder: "—", status: "Received" },
      { id: "d1-vehicles", name: "Vehicle List", requestedDate: "May 17, 2026", lastReminder: "2 days ago", status: "Pending" },
    ],
  },
  {
    id: "doc-2",
    client: "Kim Auto Shop",
    missing: "Signed Application",
    requested: "Today",
    assigned: "Pedro",
    action: "Follow Up",
    urgency: "waiting-client",
    documents: [
      { id: "d2-loss", name: "Loss Runs", requestedDate: "May 20, 2026", lastReminder: "—", status: "Received" },
      { id: "d2-driver", name: "Driver Schedule", requestedDate: "May 20, 2026", lastReminder: "—", status: "Received" },
      { id: "d2-app", name: "Signed Application", requestedDate: "May 21, 2026", lastReminder: "Today", status: "Pending" },
      { id: "d2-payroll", name: "Payroll Report", requestedDate: "May 19, 2026", lastReminder: "Yesterday", status: "Received" },
      { id: "d2-vehicles", name: "Vehicle List", requestedDate: "May 20, 2026", lastReminder: "—", status: "Received" },
    ],
  },
  {
    id: "doc-3",
    client: "Atlas Roofing",
    missing: "Signed Application",
    requested: "Today",
    assigned: "Pedro",
    action: "Follow Up",
    urgency: "follow-up-sent",
    documents: [
      { id: "d3-loss", name: "Loss Runs", requestedDate: "May 17, 2026", lastReminder: "2 days ago", status: "Received" },
      { id: "d3-driver", name: "Driver Schedule", requestedDate: "May 18, 2026", lastReminder: "Yesterday", status: "Pending" },
      { id: "d3-app", name: "Signed Application", requestedDate: "May 19, 2026", lastReminder: "Today", status: "Pending" },
      { id: "d3-payroll", name: "Payroll Report", requestedDate: "May 16, 2026", lastReminder: "3 days ago", status: "Received" },
      { id: "d3-vehicles", name: "Vehicle List", requestedDate: "May 18, 2026", lastReminder: "Yesterday", status: "Received" },
    ],
  },
];

export type CarrierSlaStatus = "Healthy" | "At Risk" | "Breached";

export type CarrierFollowUpItem = {
  id: string;
  client: string;
  carrier: string;
  due: string;
  assigned: string;
  status: string;
  action: string;
  daysSinceSent: number;
  followUpCount: number;
  slaTargetHours: number;
  slaElapsedHours: number;
  slaStatus: CarrierSlaStatus;
};

export const trackerFollowUpQueue: CarrierFollowUpItem[] = [
  {
    id: "tfu-1",
    client: "Martinez Landscaping",
    carrier: "Markel",
    due: "Today",
    assigned: "JoJo",
    status: "Stale",
    action: "Call Underwriter",
    daysSinceSent: 4,
    followUpCount: 2,
    slaTargetHours: 48,
    slaElapsedHours: 62,
    slaStatus: "Breached",
  },
  {
    id: "tfu-2",
    client: "Kim Auto Shop",
    carrier: "Travelers",
    due: "Tomorrow",
    assigned: "Pedro",
    status: "Due Tomorrow",
    action: "Request Update",
    daysSinceSent: 2,
    followUpCount: 1,
    slaTargetHours: 48,
    slaElapsedHours: 18,
    slaStatus: "Healthy",
  },
  {
    id: "tfu-3",
    client: "Greenline Logistics",
    carrier: "CNA",
    due: "Today",
    assigned: "JoJo",
    status: "Due Today",
    action: "Review Quote Options",
    daysSinceSent: 3,
    followUpCount: 1,
    slaTargetHours: 24,
    slaElapsedHours: 22,
    slaStatus: "At Risk",
  },
  {
    id: "tfu-4",
    client: "Atlas Roofing",
    carrier: "Kingsway",
    due: "Today",
    assigned: "JoJo",
    status: "No Response",
    action: "Escalate Follow-Up",
    daysSinceSent: 6,
    followUpCount: 3,
    slaTargetHours: 48,
    slaElapsedHours: 71,
    slaStatus: "Breached",
  },
];

export function formatCarrierResponseSla(item: CarrierFollowUpItem): string {
  return `${item.slaTargetHours}h target / ${item.slaElapsedHours}h elapsed`;
}

export const carrierSlaStatusClass: Record<CarrierSlaStatus, string> = {
  Healthy: "badge-green",
  "At Risk": "badge-yellow",
  Breached: "badge-red",
};

export function getGranularDocsCompletion(documents: GranularDocumentItem[]): number {
  if (documents.length === 0) return 0;
  const received = documents.filter((doc) => doc.status === "Received").length;
  return Math.round((received / documents.length) * 100);
}

export type ReadyToBindState =
  | "awaiting-signed-app"
  | "awaiting-payment"
  | "awaiting-producer-check"
  | "ready-to-issue";

export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Not Sent";

export type ReadyToBindItem = {
  id: string;
  submissionId: string;
  client: string;
  carrier: string;
  premium: string;
  brokerFee: string;
  approvalStatus: string;
  producerApproved: boolean;
  va: string;
  bindState: ReadyToBindState;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
};

export const readyToBindStateLabels: Record<ReadyToBindState, string> = {
  "awaiting-signed-app": "Awaiting signed app",
  "awaiting-payment": "Awaiting payment",
  "awaiting-producer-check": "Awaiting producer final check",
  "ready-to-issue": "Ready to issue",
};

export const readyToBindQueue: ReadyToBindItem[] = [
  {
    id: "rtb-pacific",
    submissionId: "trk-rivera",
    client: "Atlas Roofing",
    carrier: "ICW",
    premium: "$18,900",
    brokerFee: "$1,200",
    approvalStatus: "Producer approved — pending signed app",
    producerApproved: true,
    va: "Pedro",
    bindState: "awaiting-signed-app",
    paymentStatus: "Not Sent",
  },
  {
    id: "rtb-seoul",
    submissionId: "trk-greenline",
    client: "Greenline Logistics",
    carrier: "CNA",
    premium: "$14,200",
    brokerFee: "$850",
    approvalStatus: "Awaiting payment confirmation",
    producerApproved: true,
    va: "JoJo",
    bindState: "awaiting-payment",
    paymentStatus: "Pending",
    paymentMethod: "ACH · Invoice #4821",
  },
  {
    id: "rtb-martinez",
    submissionId: "trk-martinez",
    client: "Martinez Landscaping",
    carrier: "Markel",
    premium: "$9,800",
    brokerFee: "$600",
    approvalStatus: "Producer final review in progress",
    producerApproved: false,
    va: "JoJo",
    bindState: "awaiting-producer-check",
    paymentStatus: "Not Sent",
  },
  {
    id: "rtb-kim",
    submissionId: "trk-kim",
    client: "Kim Auto Shop",
    carrier: "Travelers",
    premium: "$11,400",
    brokerFee: "$725",
    approvalStatus: "All checks complete — ready to issue",
    producerApproved: true,
    va: "Pedro",
    bindState: "ready-to-issue",
    paymentStatus: "Paid",
    paymentMethod: "Card · Visa ···· 4242",
  },
];

export const paymentStatusClass: Record<PaymentStatus, string> = {
  Paid: "badge-green",
  Pending: "badge-yellow",
  Failed: "badge-red",
  "Not Sent": "badge-gray",
};

export type TrackerFilterKey = keyof typeof trackerFilterOptions;

export const requiredMarketCount = 3;

export const marketCarrierOptions = [
  "Markel",
  "Travelers",
  "CNA",
  "ICW",
  "Kingsway",
  "Bristol West",
  "Berkshire Hathaway",
  "Nationwide",
  "Employers",
  "Hartford",
] as const;

export type AddMarketDocItem = {
  id: string;
  label: string;
  complete: boolean;
};

export type AddMarketPayload = {
  carrier: string;
  notes: string;
  docsConfirmed: Record<string, boolean>;
};

export type AddMarketValidation = {
  ok: boolean;
  error?: string;
};

const standardMarketDocs = [
  { id: "signedApp", label: "Signed Application" },
  { id: "lossRuns", label: "Loss Runs" },
  { id: "coi", label: "Certificate of Insurance" },
  { id: "payrollReport", label: "Payroll Report" },
];

export function getAvailableCarriers(submission: TrackerSubmission): string[] {
  const existing = new Set(submission.carriers.map((c) => c.carrier));
  return marketCarrierOptions.filter((carrier) => !existing.has(carrier));
}

export function getAddMarketDocChecklist(submission: TrackerSubmission): AddMarketDocItem[] {
  const missing = submission.missingDocs === "None"
    ? []
    : submission.missingDocs.split(",").map((item) => item.trim());

  return standardMarketDocs.map((doc) => ({
    ...doc,
    complete: !missing.some(
      (item) =>
        doc.label.toLowerCase().includes(item.toLowerCase())
        || item.toLowerCase().includes(doc.label.toLowerCase())
        || (doc.id === "signedApp" && item.toLowerCase().includes("signed")),
    ),
  }));
}

export function validateAddMarket(
  submission: TrackerSubmission,
  carrier: string,
  docsConfirmed: Record<string, boolean>,
): AddMarketValidation {
  if (!carrier.trim()) {
    return { ok: false, error: "Select a carrier to add." };
  }

  if (submission.carriers.some((c) => c.carrier === carrier)) {
    return { ok: false, error: "This carrier has already been added to this submission." };
  }

  const ineligibleCoverage = submission.coverageChecklist.filter((item) => item.status === "missing");
  if (ineligibleCoverage.length > 0) {
    return {
      ok: false,
      error: `Coverage not eligible — resolve missing items: ${ineligibleCoverage.map((i) => i.label).join(", ")}.`,
    };
  }

  const checklist = getAddMarketDocChecklist(submission);
  const incompleteDocs = checklist.filter((doc) => !doc.complete && !docsConfirmed[doc.id]);
  if (incompleteDocs.length > 0) {
    return {
      ok: false,
      error: `Required documents incomplete: ${incompleteDocs.map((d) => d.label).join(", ")}.`,
    };
  }

  return { ok: true };
}

export function applyAddMarket(
  submission: TrackerSubmission,
  carrier: string,
  notes: string,
): TrackerSubmission {
  const nextCarriers = [...submission.carriers, { carrier, status: "New Submission" }];
  const nextNotes = notes.trim()
    ? [...submission.brokerNotes, `Add Market — ${carrier}: ${notes.trim()}`]
    : submission.brokerNotes;

  const marketsSubmitted = nextCarriers.length;

  return {
    ...submission,
    carriers: nextCarriers,
    marketsSubmitted,
    status: submission.status === "New Intake" ? "Marketed" : submission.status,
    brokerNotes: nextNotes,
    nextAction: marketsSubmitted >= requiredMarketCount ? submission.nextAction : "Add Market",
  };
}

export function computeCarrierSla(submission: TrackerSubmission): SlaInfo {
  const pending = submission.carriers.filter(
    (carrier) => carrier.status === "Pending" || carrier.status === "New Submission",
  );
  if (pending.length === 0) {
    return { label: "On track", overdue: false };
  }

  const waitingHours = submission.daysOpen * 5 + 4;
  const days = Math.floor(waitingHours / 24);
  const hours = waitingHours % 24;
  const overdue = submission.daysOpen >= 5 && pending.length > 0;

  return {
    label: `${days}d ${hours}h waiting`,
    overdue,
  };
}

export function computeClientSla(submission: TrackerSubmission): SlaInfo {
  if (submission.binding?.clientApproved) {
    return { label: "Responded", overdue: false };
  }

  if (submission.quotesReceived === 0) {
    return { label: "—", overdue: false };
  }

  const overdue =
    (submission.status === "Negotiation" || submission.status === "Pending Producer Approval")
    && submission.daysOpen > 4;

  return {
    label: overdue ? "Blocked — overdue" : "18h waiting",
    overdue,
  };
}

export function computeHealthScore(submission: TrackerSubmission): number {
  const docTotal = submission.documents.length || 1;
  const docComplete = submission.documents.filter((doc) => doc.status === "complete").length;
  const docScore = (docComplete / docTotal) * 30;
  const marketScore = Math.min(submission.marketsSubmitted / requiredMarketCount, 1) * 25;
  const quoteScore = Math.min(submission.quotesReceived / 3, 1) * 20;
  const selectedBonus = submission.selectedQuoteId ? 10 : 0;
  const producerBonus = submission.binding?.producerApproved ? 10 : 0;
  const blockerPenalty = submission.documents.filter((doc) => doc.status === "missing").length * 8;
  const agingPenalty =
    submission.daysOpen > 7 ? 12 : submission.daysOpen > 5 ? 6 : 0;
  const score =
    docScore + marketScore + quoteScore + selectedBonus + producerBonus - blockerPenalty - agingPenalty;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getHealthClass(score: number): string {
  if (score >= 80) return "submission-health-high";
  if (score >= 60) return "submission-health-mid";
  return "submission-health-low";
}

export function getSubmissionTimeline(submission: TrackerSubmission): TimelineStep[] {
  const docsComplete = submission.documents.every((doc) => doc.status === "complete");
  const coverageReviewed = submission.coverageChecklist.every((item) => item.status !== "missing");
  const marketsAdded = submission.marketsSubmitted >= requiredMarketCount;
  const carrierResponses = submission.quotesReceived > 0;
  const quoteSelected = Boolean(submission.selectedQuoteId);
  const producerApproved = Boolean(submission.binding?.producerApproved);
  const readyToBind = submission.status === "Ready to Bind" || submission.status === "Bound";
  const bound = submission.status === "Bound";

  return [
    { label: "Intake Submitted", timestamp: submission.submissionDate, complete: true },
    {
      label: "Coverage Reviewed",
      timestamp: coverageReviewed ? submission.submissionDate : undefined,
      complete: coverageReviewed,
    },
    {
      label: "Documents Collected",
      timestamp: docsComplete ? "Complete" : undefined,
      complete: docsComplete,
    },
    {
      label: "Markets Added",
      timestamp: marketsAdded ? `${submission.marketsSubmitted} markets` : undefined,
      complete: marketsAdded,
    },
    {
      label: "Carrier Responses",
      timestamp: carrierResponses ? `${submission.quotesReceived} quotes` : undefined,
      complete: carrierResponses,
    },
    {
      label: "Quote Selected",
      timestamp: quoteSelected ? submission.binding?.selectedCarrier : undefined,
      complete: quoteSelected,
    },
    {
      label: "Producer Approved",
      timestamp: producerApproved ? "Approved" : undefined,
      complete: producerApproved,
    },
    {
      label: "Ready to Bind",
      timestamp: readyToBind ? submission.binding?.approvalStatus : undefined,
      complete: readyToBind,
    },
    { label: "Bound", timestamp: bound ? "Issued" : undefined, complete: bound },
  ];
}

export function canAdvanceToQuoteReview(submission: TrackerSubmission): boolean {
  return submission.marketsSubmitted >= requiredMarketCount && submission.quotesReceived > 0;
}

export function canMoveToReadyToBind(submission: TrackerSubmission): boolean {
  return Boolean(
    submission.binding?.quoteSelected
    && submission.binding?.producerApproved
    && submission.binding?.clientApproved
    && submission.binding?.docsComplete
    && submission.binding?.paymentReady,
  );
}
