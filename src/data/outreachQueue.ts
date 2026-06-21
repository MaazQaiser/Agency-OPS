export const outreachQueueHeader = {
  title: "Outreach Queue",
  subtitle: "Commercial follow-up — quote decisions, pending responses, and objection handling.",
  quickActions: [
    { id: "add-follow-up", label: "Add Follow-Up", icon: "plus" as const },
    { id: "create-reminder", label: "Create Reminder", icon: "bell" as const },
    { id: "send-quote-reminder", label: "Send Quote Reminder", icon: "send" as const },
    { id: "assign-producer", label: "Assign Producer", icon: "user-plus" as const },
  ],
};

export const outreachKpis = [
  {
    label: "Follow-up Queue",
    value: "8",
    sub: "Tasks + quote follow-ups",
    helper: "Active client momentum",
    color: "primary" as const,
  },
  {
    label: "Decision Queue",
    value: "11",
    sub: "Quotes sent, waiting",
    helper: "Client response needed",
    color: "yellow" as const,
  },
  {
    label: "Objections Queue",
    value: "4",
    sub: "Need producer input",
    helper: "Negotiation in progress",
    color: "red" as const,
  },
  {
    label: "Stale Quotes",
    value: "3",
    sub: "No contact 5+ days",
    helper: "Requires escalation",
    color: "yellow" as const,
  },
];

export type OutreachPriority = "High" | "Medium" | "Low";

export type ActiveFollowUp = {
  id: string;
  client: string;
  type: string;
  coverage: string;
  assigned: string;
  due: string;
  priority: OutreachPriority;
  nextAction: string;
  cta: string;
  drawer: OutreachClientProfile;
};

export type UpcomingRenewal = {
  id: string;
  client: string;
  renewalDate: string;
  coverage: string;
  status: string;
};

export type QuoteFollowUp = {
  id: string;
  client: string;
  carrier: string;
  premium: string;
  sent: string;
  lastContact: string;
  status: string;
  nextStep: string;
};

export type ClientDecisionItem = {
  id: string;
  client: string;
  sentDate: string;
  lastContact: string;
  decisionStatus: "Waiting" | "Negotiating" | "Accepted" | "Declined";
};

export const clientDecisionQueue: ClientDecisionItem[] = [
  {
    id: "cd-martinez",
    client: "Martinez Landscaping",
    sentDate: "May 18, 2026",
    lastContact: "Yesterday",
    decisionStatus: "Waiting",
  },
  {
    id: "cd-seoul",
    client: "Greenline Logistics",
    sentDate: "May 17, 2026",
    lastContact: "Today",
    decisionStatus: "Negotiating",
  },
  {
    id: "cd-pacific",
    client: "Atlas Roofing",
    sentDate: "May 15, 2026",
    lastContact: "Today",
    decisionStatus: "Accepted",
  },
  {
    id: "cd-kim",
    client: "Kim Auto Shop",
    sentDate: "May 14, 2026",
    lastContact: "3 days ago",
    decisionStatus: "Declined",
  },
];
export type ClientObjection = {
  id: string;
  client: string;
  objection: string;
  suggestedAction: string;
};

export type RecoveryOpportunity = {
  id: string;
  client: string;
  reasonLost: string;
  lastContact: string;
  recoveryStrategy: string;
  cta: string;
  drawer: OutreachClientProfile;
};

export type OutreachActivity = {
  id: string;
  message: string;
  timeAgo: string;
};

export type OutreachReminder = {
  id: string;
  reminderType: string;
  date: string;
  time: string;
  assignedTo: string;
  message: string;
};

export type ProducerQueueItem = {
  id: string;
  client: string;
  producer: string;
  priority: OutreachPriority;
  notes: string;
  assignedAt: string;
};

export type OutreachClientProfile = {
  businessType: string;
  coverage: string;
  producer: string;
  assignedVa: string;
  renewalDate: string;
  quoteHistory: { carrier: string; premium: string; status: string }[];
  renewalData: { policy: string; expires: string; premium: string };
  objections: string[];
  notes: string[];
  contactHistory: { action: string; date: string; by: string }[];
};

export const activeFollowUps: ActiveFollowUp[] = [
  {
    id: "ofu-martinez",
    client: "Martinez Landscaping",
    type: "Quote Follow-Up",
    coverage: "BOP",
    assigned: "JoJo",
    due: "Today",
    priority: "High",
    nextAction: "Call Client",
    cta: "Open",
    drawer: {
      businessType: "Contractor",
      coverage: "BOP + Workers Comp",
      producer: "Eva",
      assignedVa: "JoJo",
      renewalDate: "July 12, 2026",
      quoteHistory: [
        { carrier: "Markel", premium: "$4,200", status: "Presented" },
        { carrier: "Travelers", premium: "$4,650", status: "Pending UW" },
      ],
      renewalData: { policy: "BOP GL/WC", expires: "July 12, 2026", premium: "$8,400" },
      objections: ["Comparing against State Farm renewal"],
      notes: ["Client prefers lower deductible.", "Needs quote decision by Friday."],
      contactHistory: [
        { action: "Called client — left voicemail", date: "Yesterday", by: "JoJo" },
        { action: "Sent quote comparison email", date: "2 days ago", by: "JoJo" },
      ],
    },
  },
  {
    id: "ofu-kim",
    client: "Kim Auto Shop",
    type: "Renewal Reminder",
    coverage: "Commercial Auto",
    assigned: "Pedro",
    due: "Tomorrow",
    priority: "Medium",
    nextAction: "Send Renewal Review",
    cta: "Review",
    drawer: {
      businessType: "Auto Repair",
      coverage: "Commercial Auto + GL",
      producer: "Eva",
      assignedVa: "Pedro",
      renewalDate: "July 20, 2026",
      quoteHistory: [{ carrier: "Travelers", premium: "$5,800", status: "Awaiting docs" }],
      renewalData: { policy: "Commercial Auto", expires: "July 20, 2026", premium: "$5,800" },
      objections: [],
      notes: ["Bind blocked on signed application."],
      contactHistory: [
        { action: "Sent renewal reminder email", date: "Today", by: "Pedro" },
      ],
    },
  },
  {
    id: "ofu-seoul",
    client: "Greenline Logistics",
    type: "Pending Decision",
    coverage: "BOP",
    assigned: "JoJo",
    due: "Today",
    priority: "High",
    nextAction: "Review objections",
    cta: "View Notes",
    drawer: {
      businessType: "Restaurant",
      coverage: "BOP",
      producer: "Tracie",
      assignedVa: "JoJo",
      renewalDate: "August 15, 2026",
      quoteHistory: [
        { carrier: "CNA", premium: "$14,500", status: "Presented" },
        { carrier: "Markel", premium: "$14,200", status: "Presented" },
      ],
      renewalData: { policy: "BOP Multi-location", expires: "August 15, 2026", premium: "$14,500" },
      objections: ["Premium too high", "Wants food spoilage emphasized"],
      notes: ["Present both quotes Friday.", "Producer reviewing objection handling."],
      contactHistory: [
        { action: "Logged objection — premium too high", date: "1 hour ago", by: "JoJo" },
        { action: "Presented quote options", date: "Yesterday", by: "Tracie" },
      ],
    },
  },
  {
    id: "ofu-pacific",
    client: "Atlas Roofing",
    type: "Quote Follow-Up",
    coverage: "Workers Comp",
    assigned: "Pedro",
    due: "May 22",
    priority: "Medium",
    nextAction: "Follow up on bind",
    cta: "Open",
    drawer: {
      businessType: "Contractor",
      coverage: "Workers Comp",
      producer: "Eva",
      assignedVa: "Pedro",
      renewalDate: "August 3, 2026",
      quoteHistory: [{ carrier: "ICW", premium: "$18,900", status: "Ready to bind" }],
      renewalData: { policy: "Workers Comp", expires: "August 3, 2026", premium: "$18,900" },
      objections: ["Needs time to decide"],
      notes: ["Client verbally accepted ICW terms."],
      contactHistory: [
        { action: "Requested signed app", date: "Today", by: "Pedro" },
      ],
    },
  },
];

export const upcomingRenewals: UpcomingRenewal[] = [
  { id: "ren-martinez", client: "Martinez Landscaping", renewalDate: "July 12", coverage: "BOP", status: "Review Needed" },
  { id: "ren-kim", client: "Kim Auto Shop", renewalDate: "July 20", coverage: "Commercial Auto", status: "Waiting Docs" },
  { id: "ren-pacific", client: "Atlas Roofing", renewalDate: "August 3", coverage: "Workers Comp", status: "Quoted" },
  { id: "ren-seoul", client: "Greenline Logistics", renewalDate: "August 15", coverage: "BOP", status: "Negotiation" },
  { id: "ren-greenscape", client: "Atlas Roofing", renewalDate: "August 22", coverage: "General Liability", status: "Marketed" },
];

export const quoteFollowUps: QuoteFollowUp[] = [
  {
    id: "qf-martinez",
    client: "Martinez Landscaping",
    carrier: "Markel",
    premium: "$4,200",
    sent: "2 days ago",
    lastContact: "Yesterday",
    status: "Waiting",
    nextStep: "Call Today",
  },
  {
    id: "qf-kim",
    client: "Kim Auto Shop",
    carrier: "Travelers",
    premium: "$5,800",
    sent: "Today",
    lastContact: "Today",
    status: "Fresh",
    nextStep: "Wait 24h",
  },
  {
    id: "qf-seoul",
    client: "Greenline Logistics",
    carrier: "CNA",
    premium: "$14,500",
    sent: "3 days ago",
    lastContact: "Yesterday",
    status: "Waiting",
    nextStep: "Review objections",
  },
];

export const clientObjections: ClientObjection[] = [
  {
    id: "obj-seoul",
    client: "Greenline Logistics",
    objection: "Premium too high",
    suggestedAction: "Review lower deductible option",
  },
  {
    id: "obj-pacific",
    client: "Atlas Roofing",
    objection: "Needs time to decide",
    suggestedAction: "Follow-up in 3 days",
  },
  {
    id: "obj-martinez",
    client: "Martinez Landscaping",
    objection: "Comparing against incumbent",
    suggestedAction: "Highlight broker service value",
  },
];

export const recoveryOpportunities: RecoveryOpportunity[] = [
  {
    id: "rec-kim",
    client: "Kim Auto Shop",
    reasonLost: "Went with competitor",
    lastContact: "30 days ago",
    recoveryStrategy: "Check renewal timing",
    cta: "Reopen",
    drawer: {
      businessType: "Auto Repair",
      coverage: "Commercial Auto",
      producer: "Pedro",
      assignedVa: "Tracie",
      renewalDate: "September 1, 2026",
      quoteHistory: [{ carrier: "Travelers", premium: "$5,800", status: "Lost" }],
      renewalData: { policy: "Commercial Auto", expires: "September 1, 2026", premium: "—" },
      objections: ["Price — competitor $400 lower"],
      notes: ["Competitor bound at lower limits.", "Revisit at renewal."],
      contactHistory: [
        { action: "Lost to competitor — logged", date: "30 days ago", by: "Tracie" },
      ],
    },
  },
  {
    id: "rec-atlas",
    client: "Atlas Roofing",
    reasonLost: "Budget issue",
    lastContact: "45 days ago",
    recoveryStrategy: "Offer lower limit options",
    cta: "Contact",
    drawer: {
      businessType: "Roofing Contractor",
      coverage: "General Liability",
      producer: "Pedro",
      assignedVa: "Tracie",
      renewalDate: "October 15, 2026",
      quoteHistory: [{ carrier: "Kingsway", premium: "$5,600", status: "Lost" }],
      renewalData: { policy: "GL", expires: "October 15, 2026", premium: "—" },
      objections: ["Budget constraints — project slowdown"],
      notes: ["Client may re-engage Q3 when projects resume."],
      contactHistory: [
        { action: "Final follow-up — no response", date: "45 days ago", by: "Tracie" },
      ],
    },
  },
  {
    id: "rec-greenline",
    client: "Greenline Logistics",
    reasonLost: "Delayed decision",
    lastContact: "21 days ago",
    recoveryStrategy: "Send updated market options",
    cta: "Reopen",
    drawer: {
      businessType: "Logistics",
      coverage: "BOP",
      producer: "Eva",
      assignedVa: "JoJo",
      renewalDate: "November 8, 2026",
      quoteHistory: [{ carrier: "CNA", premium: "$14,500", status: "Stale" }],
      renewalData: { policy: "BOP", expires: "November 8, 2026", premium: "—" },
      objections: ["Internal approval delay"],
      notes: ["Fleet expansion delayed — need updated vehicle count."],
      contactHistory: [
        { action: "Quote expired — no decision", date: "21 days ago", by: "JoJo" },
      ],
    },
  },
];

export const outreachActivity: OutreachActivity[] = [
  { id: "act-1", message: "JoJo called Martinez Landscaping", timeAgo: "18 min ago" },
  { id: "act-2", message: "Pedro sent renewal reminder to Kim Auto Shop", timeAgo: "42 min ago" },
  { id: "act-3", message: "JoJo logged objection for Greenline Logistics", timeAgo: "1 hour ago" },
  { id: "act-4", message: "Producer reviewed quote objections", timeAgo: "2 hours ago" },
  { id: "act-5", message: "Tracie reopened Kim Auto Shop recovery case", timeAgo: "3 hours ago" },
  { id: "act-6", message: "JoJo assigned follow-up to Eva for Greenline Logistics", timeAgo: "4 hours ago" },
];

export type OutreachDrawerSelection = {
  client: string;
  profile: OutreachClientProfile;
};

export function findFollowUpByClient(client: string): ActiveFollowUp | undefined {
  return activeFollowUps.find((item) => item.client === client);
}

export function findRecoveryByClient(client: string): RecoveryOpportunity | undefined {
  return recoveryOpportunities.find((item) => item.client === client);
}

export const FOLLOW_UP_TYPES = [
  "Quote Follow-Up",
  "Objection Review",
  "Renewal Reminder",
  "Missing Decision",
  "Re-quote",
] as const;

export const REMINDER_TYPES = [
  "Call client tomorrow",
  "Follow-up after 48h",
  "Send revised quote",
  "Check client decision",
  "Producer review needed",
] as const;

export const PRODUCER_OPTIONS = ["Eva", "Tracie", "Sarah"] as const;

export const OUTREACH_ASSIGNEES = ["JoJo", "Pedro", "Valerie", "Tracie", "Eva"] as const;

export type AddFollowUpPayload = {
  client: string;
  followUpType: string;
  dueDate: string;
  priority: OutreachPriority;
  notes: string;
};

export type CreateReminderPayload = {
  reminderType: string;
  date: string;
  time: string;
  assignedTo: string;
  message: string;
};

export type SendQuoteReminderPayload = {
  client: string;
  channel: "email" | "sms";
};

export type AssignProducerPayload = {
  producer: string;
  client: string;
  notes: string;
  priority: OutreachPriority;
};

export function getOutreachClientOptions(snapshot: {
  quoteFollowUps: QuoteFollowUp[];
  activeFollowUps: ActiveFollowUp[];
  clientDecisionQueue: ClientDecisionItem[];
}): string[] {
  const names = new Set<string>();
  snapshot.quoteFollowUps.forEach((row) => names.add(row.client));
  snapshot.activeFollowUps.forEach((row) => names.add(row.client));
  snapshot.clientDecisionQueue.forEach((row) => names.add(row.client));
  return Array.from(names).sort();
}

export function computeOutreachKpis(snapshot: {
  quoteFollowUps: QuoteFollowUp[];
  clientDecisionQueue: ClientDecisionItem[];
  clientObjections: ClientObjection[];
  activeFollowUps: ActiveFollowUp[];
}) {
  const pendingDecisions = snapshot.clientDecisionQueue.filter(
    (row) => row.decisionStatus === "Waiting" || row.decisionStatus === "Negotiating",
  ).length;
  const followUpTotal = snapshot.activeFollowUps.length + snapshot.quoteFollowUps.length;
  const staleQuotes = snapshot.quoteFollowUps.filter((row) => row.status === "Stale" || row.status === "Waiting").length;

  return [
    {
      label: "Follow-up Queue",
      value: String(followUpTotal),
      sub: "Tasks + quote follow-ups",
      helper: "Active client momentum",
      color: "primary" as const,
    },
    {
      label: "Decision Queue",
      value: String(pendingDecisions),
      sub: "Quotes sent, waiting",
      helper: "Client response needed",
      color: "yellow" as const,
    },
    {
      label: "Objections Queue",
      value: String(snapshot.clientObjections.length),
      sub: "Need producer input",
      helper: "Negotiation in progress",
      color: "red" as const,
    },
    {
      label: "Stale Quotes",
      value: String(staleQuotes),
      sub: "No contact 5+ days",
      helper: "Requires escalation",
      color: "yellow" as const,
    },
  ];
}

export function defaultDrawer(client: string): OutreachClientProfile {
  return {
    businessType: "Commercial",
    coverage: "Commercial Lines",
    producer: "Eva",
    assignedVa: "JoJo",
    renewalDate: "TBD",
    quoteHistory: [],
    renewalData: { policy: "Commercial", expires: "TBD", premium: "—" },
    objections: [],
    notes: [],
    contactHistory: [],
  };
}

export function buildQuoteReminderTemplate(client: string) {
  return {
    subject: "Reminder: Your Insurance Quote Review",
    body: `Hi ${client},\n\nJust following up on the quote we sent for your review.\nLet us know if you have any questions or would like to discuss options.\n\nThanks.`,
  };
}
