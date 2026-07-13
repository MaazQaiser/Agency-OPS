export const salesVAHeader = {
  title: "Sales",
  subtitle: "Private owner workspace for approvals and revenue decisions.",
  quickActions: [
    { id: "review-quotes", label: "Review Quotes", icon: "clipboard" as const },
    { id: "approve-drafts", label: "Approve Drafts", icon: "check" as const },
    { id: "open-pipeline", label: "Open Pipeline", icon: "bar-chart" as const },
    { id: "producer-note", label: "Create Producer Note", icon: "plus" as const },
  ],
};

export const salesKpis = [
  {
    label: "Pipeline Value",
    value: "$184,000",
    sub: "Current open opportunities",
    helper: "Revenue in motion",
    color: "primary" as const,
  },
  {
    label: "Ready for Approval",
    value: "9",
    sub: "Awaiting review",
    helper: "Pending decisions",
    color: "yellow" as const,
  },
  {
    label: "Pending Binds",
    value: "4",
    sub: "Finalized quotes ready",
    helper: "Ready to issue",
    color: "green" as const,
  },
  {
    label: "Producer Close Rate",
    value: "41%",
    sub: "This folio period",
    helper: "Current conversion pace",
    color: "red" as const,
  },
];

export type ApprovalDraftType = "email" | "sms";

export type SalesApproval = {
  id: string;
  title: string;
  preparedBy: string;
  client: string;
  type: ApprovalDraftType;
  typeLabel: string;
  submitted: string;
  cta: string;
  quoteDetails: string;
  carrierComparison: { carrier: string; premium: string; notes: string }[];
  brokerNotes: string[];
  draftCommunication: string;
  complianceChecklist: { id: string; label: string; checked: boolean }[];
};

export const approvalQueue: SalesApproval[] = [
  {
    id: "appr-1",
    title: "Commercial Quote Follow-up",
    preparedBy: "Pedro",
    client: "Kim Auto Shop",
    type: "email",
    typeLabel: "Email Draft",
    submitted: "15 min ago",
    cta: "Approve Draft",
    quoteDetails: "General Liability + Garagekeepers: Travelers quote at $5,800/yr with $600 broker fee.",
    carrierComparison: [
      { carrier: "Travelers", premium: "$5,800/yr", notes: "Recommended: best GL limits" },
      { carrier: "Markel", premium: "$6,200/yr", notes: "Higher premium, broader garagekeepers" },
    ],
    brokerNotes: [
      "Client requested quote comparison before binding.",
      "Pedro confirmed decision maker is Michael Kim (owner).",
    ],
    draftCommunication:
      "Hi Michael, following up on the GL quote we prepared for Kim Auto Shop. The Travelers option at $5,800 provides the coverage limits we discussed. Let me know if you'd like to proceed or review alternatives.",
    complianceChecklist: [
      { id: "c1", label: "Licensed producer review completed", checked: false },
      { id: "c2", label: "No binding language in draft", checked: true },
      { id: "c3", label: "Client identity verified", checked: true },
      { id: "c4", label: "E&O disclaimer included", checked: true },
    ],
  },
  {
    id: "appr-2",
    title: "Policy Renewal Reminder",
    preparedBy: "JoJo",
    client: "Greenline Logistics",
    type: "sms",
    typeLabel: "SMS Draft",
    submitted: "27 min ago",
    cta: "Review",
    quoteDetails: "BOP renewal: current policy expires in 45 days. Renewal premium est. $14,500/yr.",
    carrierComparison: [
      { carrier: "Hartford", premium: "$14,500/yr", notes: "Incumbent carrier: renewal terms" },
    ],
    brokerNotes: [
      "Long-standing client: prefer SMS for quick response.",
      "Renewal docs pending from carrier.",
    ],
    draftCommunication:
      "Hi: this is Insurance Town. Your BOP policy for Greenline Logistics renews in 45 days. Reply YES to schedule a renewal review or call us at (555) 012-3456.",
    complianceChecklist: [
      { id: "c1", label: "Licensed producer review completed", checked: false },
      { id: "c2", label: "Opt-out language included", checked: true },
      { id: "c3", label: "Client identity verified", checked: true },
      { id: "c4", label: "No coverage guarantees stated", checked: true },
    ],
  },
];

export type BindStatus = "approved" | "waiting";

export type BindQueueItem = {
  id: string;
  client: string;
  carrier: string;
  premium: string;
  brokerFee: string;
  status: BindStatus;
  statusLabel: string;
  cta: string;
};

export const bindQueue: BindQueueItem[] = [
  {
    id: "bind-1",
    client: "Martinez Landscaping",
    carrier: "Markel",
    premium: "$4,200",
    brokerFee: "$500",
    status: "approved",
    statusLabel: "Approved",
    cta: "Bind Policy",
  },
  {
    id: "bind-2",
    client: "Kim Auto Shop",
    carrier: "Travelers",
    premium: "$5,800",
    brokerFee: "$600",
    status: "waiting",
    statusLabel: "Waiting",
    cta: "Review",
  },
];

export type ProducerPerformance = {
  id: string;
  name: string;
  quotes: number;
  binds: number;
  premium: string;
  closeRate: string;
};

export const producerPerformance: ProducerPerformance[] = [
  { id: "prod-sarah", name: "Sarah", quotes: 18, binds: 7, premium: "$24,000", closeRate: "39%" },
  { id: "prod-eva", name: "Eva", quotes: 11, binds: 5, premium: "$31,000", closeRate: "45%" },
];

export type PipelineStage = "quoted" | "negotiation" | "proposal" | "bound";

export type HighValueOpportunity = {
  id: string;
  client: string;
  coverage: string;
  estimatedPremium: string;
  stage: PipelineStage;
  stageLabel: string;
  assigned: string;
  nextStep: string;
};

export const highValuePipeline: HighValueOpportunity[] = [
  {
    id: "hvo-1",
    client: "Atlas Roofing",
    coverage: "Workers Comp",
    estimatedPremium: "$18,000",
    stage: "quoted",
    stageLabel: "Quoted",
    assigned: "Pedro",
    nextStep: "Review with client",
  },
  {
    id: "hvo-2",
    client: "Greenline Logistics",
    coverage: "BOP",
    estimatedPremium: "$14,500",
    stage: "negotiation",
    stageLabel: "Negotiation",
    assigned: "JoJo",
    nextStep: "Waiting on signature",
  },
];

export const revenueForecast = {
  thisWeek: "$12,400",
  thisMonth: "$48,700",
  pendingPremium: "$184,000",
  projectedCommission: "$22,600",
};

export type DecisionTimelineItem = {
  id: string;
  text: string;
  time: string;
  variant?: "approved" | "bound" | "rejected" | "revision";
};

export const decisionTimeline: DecisionTimelineItem[] = [
  { id: "dt-1", text: "Approved Kim Auto quote", time: "18 minutes ago", variant: "approved" },
  { id: "dt-2", text: "Bound Martinez Landscaping policy", time: "34 minutes ago", variant: "bound" },
  { id: "dt-3", text: "Rejected draft due to compliance issue", time: "1 hour ago", variant: "rejected" },
  { id: "dt-4", text: "Requested revision on Greenline Logistics quote", time: "2 hours ago", variant: "revision" },
];
