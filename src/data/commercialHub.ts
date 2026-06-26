export const commercialHubTabs = [
  { id: "executive", label: "Executive Dashboard" },
  { id: "submissions", label: "Submission Tracker" },
  { id: "checklist", label: "Coverage Checklist" },
  { id: "missing-docs", label: "Missing Docs" },
  { id: "follow-ups", label: "Carrier Follow-Up" },
  { id: "quote-review", label: "Quote Review" },
  { id: "ready-to-bind", label: "Ready to Bind" },
  { id: "outreach", label: "Outreach Queue" },
  { id: "submission-clock", label: "Submission Clock" },
  { id: "lead-velocity", label: "Lead Velocity" },
] as const;

export type CommercialHubTabId = (typeof commercialHubTabs)[number]["id"];

export const commercialHubHeader = {
  title: "Commercial Hub",
  subtitle: "Track commercial submissions, quote progress, and pipeline performance.",
  quickActions: [
    { id: "new-submission", label: "New Submission", icon: "plus" as const },
    { id: "add-market", label: "Add Market", icon: "target" as const },
    { id: "export-pipeline", label: "Export Pipeline", icon: "download" as const },
  ],
};

export const commercialHubKpis = [
  {
    label: "Active Pipeline",
    value: "18",
    sub: "Open commercial cases",
    helper: "Intake → bind in progress",
    color: "primary" as const,
    tier: "primary" as const,
  },
  {
    label: "Pipeline Premium",
    value: "$184,000",
    sub: "Quoted but not bound",
    helper: "Total premium in pipeline",
    color: "primary" as const,
    tier: "secondary" as const,
  },
  {
    label: "Quotes Received",
    value: "11",
    sub: "This week",
    helper: "Awaiting producer review",
    color: "green" as const,
    tier: "secondary" as const,
  },
  {
    label: "Ready to Bind",
    value: "3",
    sub: "Final stage queue",
    helper: "Quote selected + approved",
    color: "green" as const,
    tier: "primary" as const,
  },
  {
    label: "Stalled Submissions",
    value: "4",
    sub: "No movement 5+ days",
    helper: "Needs broker escalation",
    color: "yellow" as const,
    tier: "secondary" as const,
  },
  {
    label: "Missing Documents",
    value: "7",
    sub: "Blocking progress",
    helper: "Doc validation queue",
    color: "red" as const,
    tier: "primary" as const,
  },
];

export type PipelineStage = {
  id: string;
  name: string;
  count: number;
  premium: string;
};

export const pipelineStages: PipelineStage[] = [
  { id: "stage-intake", name: "Intake", count: 3, premium: "$22,000" },
  { id: "stage-review", name: "Reviewing", count: 4, premium: "$38,000" },
  { id: "stage-marketed", name: "Marketed", count: 5, premium: "$52,000" },
  { id: "stage-quoted", name: "Quoted", count: 4, premium: "$48,000" },
  { id: "stage-negotiation", name: "Negotiation", count: 2, premium: "$28,000" },
  { id: "stage-bind", name: "Ready to Bind", count: 3, premium: "$38,000" },
  { id: "stage-bound", name: "Bound", count: 6, premium: "$96,000" },
];

export type OperationalAlert = {
  id: string;
  client: string;
  message: string;
  variant: "red" | "yellow" | "blue";
  linkTab: CommercialHubTabId;
};

export const operationalAlerts: OperationalAlert[] = [
  {
    id: "alert-1",
    client: "Kim Auto Shop",
    message: "Missing docs — loss runs required",
    variant: "red",
    linkTab: "missing-docs",
  },
  {
    id: "alert-2",
    client: "Martinez Landscaping",
    message: "No carrier response from Markel in 3 days",
    variant: "yellow",
    linkTab: "follow-ups",
  },
  {
    id: "alert-3",
    client: "Atlas Roofing",
    message: "Only 2 of 3 required markets submitted",
    variant: "red",
    linkTab: "submissions",
  },
  {
    id: "alert-4",
    client: "Atlas Roofing",
    message: "Submission aging — 9 days open",
    variant: "yellow",
    linkTab: "submissions",
  },
  {
    id: "alert-5",
    client: "Atlas Roofing",
    message: "Missing signed application",
    variant: "red",
    linkTab: "ready-to-bind",
  },
];

export type HubSubmissionStatus = "Quoted" | "Pending" | "Overdue" | "Negotiation" | "Ready to Bind";

export type HubSubmission = {
  id: string;
  client: string;
  producer: string;
  va: string;
  coverage: string;
  marketsSubmitted: number;
  quotesReceived: number;
  premium: string;
  daysOpen: number;
  status: HubSubmissionStatus;
  nextAction: string;
  stage: string;
  carrierSubmissions: { carrier: string; status: string; premium?: string }[];
  quoteComparison: { carrier: string; premium: string; notes: string }[];
  missingDocs: string[];
  producerNotes: string[];
  brokerNotes: string[];
  coverageRequested: string;
};

export const activeSubmissions: HubSubmission[] = [
  {
    id: "sub-martinez",
    client: "Martinez Landscaping",
    producer: "Eva",
    va: "Pedro",
    coverage: "BOP",
    marketsSubmitted: 4,
    quotesReceived: 1,
    premium: "$8,700",
    daysOpen: 32,
    status: "Overdue",
    nextAction: "Escalate carrier follow-up",
    stage: "Quoted",
    coverageRequested: "BOP — landscaping operations, 12 employees",
    carrierSubmissions: [
      { carrier: "Markel", status: "Declined" },
      { carrier: "Kingsway", status: "Declined" },
      { carrier: "Travelers", status: "Declined" },
    ],
    quoteComparison: [],
    missingDocs: ["Loss runs", "Signed application"],
    producerNotes: ["Client comparing against incumbent State Farm renewal."],
    brokerNotes: ["Stalled at Markel — no UW update in 3 days."],
  },
  {
    id: "sub-kim",
    client: "Kim Auto Shop",
    producer: "Eva",
    va: "Pedro",
    coverage: "Comm Auto + GL",
    marketsSubmitted: 3,
    quotesReceived: 1,
    premium: "$6,200",
    daysOpen: 7,
    status: "Pending",
    nextAction: "Collect loss runs",
    stage: "Marketed",
    coverageRequested: "Commercial auto fleet + garagekeepers GL",
    carrierSubmissions: [
      { carrier: "Travelers", status: "Quoted", premium: "$5,800" },
      { carrier: "Bristol West", status: "Pending" },
    ],
    quoteComparison: [{ carrier: "Travelers", premium: "$5,800", notes: "GL limits at minimum" }],
    missingDocs: ["5-year loss runs"],
    producerNotes: ["Referred by JoJo — existing brokerage relationship."],
    brokerNotes: ["Final chase on loss runs today."],
  },
  {
    id: "sub-seoul",
    client: "Greenline Logistics",
    producer: "Tracie",
    va: "JoJo",
    coverage: "BOP",
    marketsSubmitted: 4,
    quotesReceived: 2,
    premium: "$14,500",
    daysOpen: 4,
    status: "Negotiation",
    nextAction: "Review quote options with client",
    stage: "Negotiation",
    coverageRequested: "BOP — multi-location restaurant group",
    carrierSubmissions: [
      { carrier: "Markel", status: "Quoted", premium: "$14,200" },
      { carrier: "CNA", status: "Quoted", premium: "$14,500" },
    ],
    quoteComparison: [
      { carrier: "CNA", premium: "$14,500", notes: "Broader food spoilage coverage" },
      { carrier: "Markel", premium: "$14,200", notes: "Lower premium, tighter limits" },
    ],
    missingDocs: ["Health permit copy"],
    producerNotes: ["Renewal — incumbent Hartford at $14,500."],
    brokerNotes: ["Presenting both quotes Friday."],
  },
  {
    id: "sub-pacific",
    client: "Atlas Roofing",
    producer: "Eva",
    va: "JoJo",
    coverage: "Workers Comp",
    marketsSubmitted: 3,
    quotesReceived: 1,
    premium: "$18,900",
    daysOpen: 9,
    status: "Ready to Bind",
    nextAction: "Obtain signed application",
    stage: "Ready to Bind",
    coverageRequested: "Workers comp — 28 employees, CA contractor class",
    carrierSubmissions: [{ carrier: "ICW", status: "Quoted", premium: "$18,900" }],
    quoteComparison: [{ carrier: "ICW", premium: "$18,900", notes: "Ready to bind pending signed app" }],
    missingDocs: ["Signed application"],
    producerNotes: ["High-value WC opportunity — bind target this week."],
    brokerNotes: ["Client verbally accepted ICW terms."],
  },
];

export type QuoteActivityItem = {
  id: string;
  text: string;
  time: string;
  variant?: "success" | "declined" | "quoted";
};

export const quoteActivity: QuoteActivityItem[] = [
  { id: "qa-1", text: "Markel returned quote for Martinez Landscaping", time: "18 minutes ago", variant: "quoted" },
  { id: "qa-2", text: "Travelers declined Kim Auto Shop", time: "34 minutes ago", variant: "declined" },
  { id: "qa-3", text: "CNA quoted Greenline Logistics", time: "52 minutes ago", variant: "success" },
];

export type CarrierPerformance = {
  id: string;
  carrier: string;
  submissions: number;
  quotesReturned: number;
  avgResponseTime: string;
  bindWins: number;
};

export const carrierPerformance: CarrierPerformance[] = [
  { id: "cp-markel", carrier: "Markel", submissions: 8, quotesReturned: 5, avgResponseTime: "2.4 days", bindWins: 3 },
  { id: "cp-travelers", carrier: "Travelers", submissions: 6, quotesReturned: 3, avgResponseTime: "3.1 days", bindWins: 2 },
  { id: "cp-cna", carrier: "CNA", submissions: 5, quotesReturned: 4, avgResponseTime: "1.8 days", bindWins: 1 },
];

export type FollowUpItem = {
  id: string;
  client: string;
  carrier: string;
  dueDate: string;
  assignedVa: string;
  status: "due-today" | "due-tomorrow" | "overdue";
  statusLabel: string;
};

export const followUpQueue: FollowUpItem[] = [
  { id: "fu-1", client: "Martinez Landscaping", carrier: "Markel", dueDate: "Today", assignedVa: "Pedro", status: "due-today", statusLabel: "Due Today" },
  { id: "fu-2", client: "Kim Auto Shop", carrier: "Travelers", dueDate: "Tomorrow", assignedVa: "Pedro", status: "due-tomorrow", statusLabel: "Tomorrow" },
  { id: "fu-3", client: "Greenline Logistics", carrier: "CNA", dueDate: "Today", assignedVa: "JoJo", status: "due-today", statusLabel: "Due Today" },
];

export const submissionTrackerPlaceholder = {
  title: "Submission Tracker",
  description: "Full operational table view for managing every commercial submission, market, and follow-up.",
};
