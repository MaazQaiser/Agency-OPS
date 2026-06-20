export const dialerVAHeader = {
  title: "Dialer VA",
  subtitle: "Manage outbound calls, callback queue, and lead activity.",
  quickActions: [
    { id: "assign-lead", label: "Assign Lead", icon: "user-plus" as const },
    { id: "add-callback", label: "Add Callback", icon: "plus" as const },
    { id: "view-scripts", label: "View Scripts", icon: "clipboard" as const },
  ],
};

export const dialerKpis = [
  {
    label: "Calls Made Today",
    value: "42",
    sub: "Daily target: 60",
    helper: "Call productivity",
    color: "primary" as const,
  },
  {
    label: "Connected Calls",
    value: "18",
    sub: "43% connection rate",
    helper: "Successful contact rate",
    color: "green" as const,
  },
  {
    label: "Pending Callbacks",
    value: "11",
    sub: "4 overdue",
    helper: "Needs follow-up",
    color: "yellow" as const,
  },
  {
    label: "Unworked Leads",
    value: "9",
    sub: "3 high priority",
    helper: "Waiting to be called",
    color: "red" as const,
  },
];

export type LeadPriority = "high" | "medium" | "low";

export type DialerLead = {
  id: string;
  name: string;
  source: string;
  type: string;
  assignedTo: string;
  timeAdded: string;
  priority: LeadPriority;
  cta: string;
  phone?: string;
  email?: string;
  contactHistory: { action: string; time: string }[];
  notes: string[];
  lastInteraction: string;
};

export const leadQueue: DialerLead[] = [
  {
    id: "lead-john-martinez",
    name: "John Martinez",
    source: "Google Ads",
    type: "Commercial Auto",
    assignedTo: "Kat",
    timeAdded: "8 minutes ago",
    priority: "high",
    cta: "Call Lead",
    phone: "(512) 555-0142",
    email: "john@martinezlandscaping.com",
    contactHistory: [
      { action: "Lead assigned to Kat", time: "8 minutes ago" },
      { action: "Auto-routed from Google Ads form", time: "8 minutes ago" },
    ],
    notes: ["Interested in fleet coverage for 3 vehicles.", "Prefers morning callbacks."],
    lastInteraction: "No contact yet",
  },
  {
    id: "lead-michael-kim",
    name: "Michael Kim",
    source: "Referral",
    type: "General Liability",
    assignedTo: "Kat",
    timeAdded: "14 minutes ago",
    priority: "medium",
    cta: "View Details",
    phone: "(713) 555-0198",
    email: "michael@kimautoshop.com",
    contactHistory: [
      { action: "Lead assigned to Kat", time: "14 minutes ago" },
      { action: "Referral from JoJo — existing client", time: "14 minutes ago" },
    ],
    notes: ["Referred by Seoul Restaurant Group.", "Needs GL quote for auto shop."],
    lastInteraction: "No contact yet",
  },
];

export type CallSessionStatus = "on-call" | "wrap-up" | "idle";

export type LiveCallSession = {
  id: string;
  agent: string;
  status: CallSessionStatus;
  statusLabel: string;
  duration: string;
  client: string;
};

export const liveCallSessions: LiveCallSession[] = [
  {
    id: "call-1",
    agent: "Kat",
    status: "on-call",
    statusLabel: "On Call",
    duration: "03:24",
    client: "John Martinez",
  },
  {
    id: "call-2",
    agent: "Sarah",
    status: "wrap-up",
    statusLabel: "Wrap-up",
    duration: "01:12",
    client: "Seoul Restaurant Group",
  },
];

export type CallbackStatus = "due-now" | "upcoming" | "overdue";

export type CallbackItem = {
  id: string;
  client: string;
  reason: string;
  due: string;
  assignedTo: string;
  status: CallbackStatus;
  statusLabel: string;
  cta: string;
};

export const callbackQueue: CallbackItem[] = [
  {
    id: "cb-1",
    client: "Martinez Landscaping",
    reason: "Requested quote review",
    due: "11:30 AM",
    assignedTo: "Kat",
    status: "due-now",
    statusLabel: "Due Now",
    cta: "Call Back",
  },
  {
    id: "cb-2",
    client: "Kim Auto Shop",
    reason: "Missed first call",
    due: "2:00 PM",
    assignedTo: "Kat",
    status: "upcoming",
    statusLabel: "Upcoming",
    cta: "Schedule",
  },
];

export type CallScript = {
  id: string;
  title: string;
  description: string;
  cta: string;
};

export const callScripts: CallScript[] = [
  {
    id: "script-intro",
    title: "New Lead Intro",
    description: "Opening script for first contact.",
    cta: "Open Script",
  },
  {
    id: "script-followup",
    title: "Quote Follow-up",
    description: "Used for quote follow-up.",
    cta: "Open Script",
  },
  {
    id: "script-renewal",
    title: "Renewal Reminder",
    description: "Used for expiring policy reminders.",
    cta: "Open Script",
  },
];

export type CallTimelineItem = {
  id: string;
  time: string;
  action: string;
  outcome: string;
};

export const callTimeline: CallTimelineItem[] = [
  {
    id: "tl-1",
    time: "9:15 AM",
    action: "Called John Martinez",
    outcome: "No answer",
  },
  {
    id: "tl-2",
    time: "10:02 AM",
    action: "Connected with Michael Kim",
    outcome: "Quote discussion",
  },
  {
    id: "tl-3",
    time: "10:45 AM",
    action: "Callback completed for Seoul Restaurant Group",
    outcome: "Follow-up scheduled",
  },
];

export type MissedSlaStatus = "missed" | "critical";

export type MissedSlaLead = {
  id: string;
  name: string;
  waitTime: string;
  assignedTo: string;
  status: MissedSlaStatus;
  statusLabel: string;
};

export const missedSlaLeads: MissedSlaLead[] = [
  {
    id: "miss-1",
    name: "David Chen",
    waitTime: "9 min",
    assignedTo: "Kat",
    status: "missed",
    statusLabel: "Missed SLA",
  },
  {
    id: "miss-2",
    name: "Brian Cooper",
    waitTime: "12 min",
    assignedTo: "Sarah",
    status: "critical",
    statusLabel: "Critical",
  },
];
