export const vaOperationsTabs = [
  { id: "overview", label: "Overview" },
  { id: "dialer", label: "Dialer VA" },
  { id: "research", label: "Research VA" },
  { id: "brokerage", label: "Brokerage Team" },
  { id: "sales", label: "Sales", private: true as const },
  { id: "automation", label: "Automation Builder" },
] as const;

export type VaOperationsTabId = (typeof vaOperationsTabs)[number]["id"];

export const vaOperationsHeader = {
  title: "VA Operations",
  subtitle: "Manage team activity, workload, and daily priorities",
  searchPlaceholder: "Search tasks, clients, VAs, notes, or leads",
  folioTracker: "12 days left in current folio",
  notificationCount: 4,
};

export const vaOperationsKpis = [
  {
    label: "Active Team Members",
    value: "8",
    sub: "6 active · 2 away",
    helper: "Live team availability",
    color: "primary" as const,
  },
  {
    label: "Tasks Due Today",
    value: "24",
    sub: "8 overdue",
    helper: "Tasks requiring attention today",
    color: "yellow" as const,
  },
  {
    label: "Leads Waiting",
    value: "16",
    sub: "Average response: 3m 22s",
    helper: "Unworked leads in queue",
    color: "green" as const,
  },
  {
    label: "Pending Approvals",
    value: "9",
    sub: "Requires producer review",
    helper: "Drafts awaiting approval",
    color: "red" as const,
  },
];

export type TeamMemberStatus = "active" | "away" | "offline";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  status: TeamMemberStatus;
  stats: {
    calls: number;
    tasksCompleted: number;
    leadsAssigned: number;
    followUpsDue: number;
  };
  recentNotes: string[];
  recentActions: { text: string; time: string }[];
};

export const teamMembers: TeamMember[] = [
  {
    id: "kat",
    name: "Kat",
    role: "Dialer VA",
    status: "active",
    stats: { calls: 18, tasksCompleted: 7, leadsAssigned: 4, followUpsDue: 2 },
    recentNotes: ["Follow-up scheduled for Martinez Landscaping at 11:30 AM.", "Inbound lead from Ricochet — callback completed."],
    recentActions: [
      { text: "Called new inbound lead", time: "2 minutes ago" },
      { text: "Logged follow-up task", time: "18 minutes ago" },
    ],
  },
  {
    id: "jaffer",
    name: "Jaffer",
    role: "Research VA",
    status: "active",
    stats: { calls: 6, tasksCompleted: 4, leadsAssigned: 8, followUpsDue: 1 },
    recentNotes: ["Added 4 commercial prospects from Meta campaign.", "Loss run request pending for Kim Auto Shop."],
    recentActions: [
      { text: "Added 4 new commercial prospects", time: "5 minutes ago" },
      { text: "Updated prospect research sheet", time: "22 minutes ago" },
    ],
  },
  {
    id: "jojo",
    name: "JoJo",
    role: "Brokerage Team",
    status: "active",
    stats: { calls: 12, tasksCompleted: 6, leadsAssigned: 3, followUpsDue: 3 },
    recentNotes: ["Carrier documents uploaded for Seoul Restaurant Group.", "Renewal reminder draft awaiting approval."],
    recentActions: [
      { text: "Uploaded carrier documents", time: "11 minutes ago" },
      { text: "Submitted renewal reminder draft", time: "27 minutes ago" },
    ],
  },
  {
    id: "pedro",
    name: "Pedro",
    role: "Brokerage Team",
    status: "active",
    stats: { calls: 14, tasksCompleted: 8, leadsAssigned: 5, followUpsDue: 4 },
    recentNotes: ["BOP quote request submitted for Kim Auto Shop.", "Missing loss runs flagged for follow-up."],
    recentActions: [
      { text: "Submitted BOP quote request", time: "8 minutes ago" },
      { text: "Requested loss runs from client", time: "31 minutes ago" },
    ],
  },
  {
    id: "kyle",
    name: "Kyle",
    role: "Automation Builder",
    status: "away",
    stats: { calls: 0, tasksCompleted: 3, leadsAssigned: 0, followUpsDue: 0 },
    recentNotes: ["Workflow update deployed for lead routing.", "Testing Ricochet webhook integration."],
    recentActions: [
      { text: "Updated automation workflow", time: "18 minutes ago" },
      { text: "Fixed webhook retry logic", time: "45 minutes ago" },
    ],
  },
  {
    id: "hassan",
    name: "Hassan",
    role: "Developer",
    status: "away",
    stats: { calls: 0, tasksCompleted: 2, leadsAssigned: 0, followUpsDue: 1 },
    recentNotes: ["API endpoint for lead sync in progress.", "Bug fix deployed for document upload."],
    recentActions: [
      { text: "Pushed lead sync API update", time: "1 hour ago" },
      { text: "Resolved upload timeout issue", time: "2 hours ago" },
    ],
  },
];

export type PriorityTaskStatus = "urgent" | "pending" | "critical";

export type PriorityTask = {
  id: string;
  title: string;
  assignedTo: string;
  due: string;
  type: string;
  status: PriorityTaskStatus;
  cta: string;
};

export const priorityQueue: PriorityTask[] = [
  {
    id: "task-1",
    title: "Follow up with Martinez Landscaping",
    assignedTo: "JoJo",
    due: "11:30 AM",
    type: "Client Follow-up",
    status: "urgent",
    cta: "Open Task",
  },
  {
    id: "task-2",
    title: "Collect missing loss runs",
    assignedTo: "Pedro",
    due: "2:00 PM",
    type: "Document Collection",
    status: "pending",
    cta: "Review",
  },
  {
    id: "task-3",
    title: "Return inbound lead callback",
    assignedTo: "Kat",
    due: "In 10 minutes",
    type: "Lead Response",
    status: "critical",
    cta: "Call Now",
  },
];

export type ActivityItem = {
  id: string;
  text: string;
  time: string;
};

export const liveActivity: ActivityItem[] = [
  { id: "act-1", text: "Kat called new inbound lead", time: "2 minutes ago" },
  { id: "act-2", text: "Jaffer added 4 new commercial prospects", time: "5 minutes ago" },
  { id: "act-3", text: "Pedro submitted BOP quote request", time: "8 minutes ago" },
  { id: "act-4", text: "JoJo uploaded carrier documents", time: "11 minutes ago" },
  { id: "act-5", text: "Kyle updated automation workflow", time: "18 minutes ago" },
];

export type SlaStatus = "within" | "near" | "breached";

export type LeadResponseRow = {
  id: string;
  name: string;
  source: string;
  responseTime: string;
  status: SlaStatus;
};

export const leadResponseTracker: LeadResponseRow[] = [
  { id: "lead-1", name: "Kat", source: "Ricochet", responseTime: "2m 11s", status: "within" },
  { id: "lead-2", name: "Jaffer", source: "Meta Leads", responseTime: "4m 48s", status: "near" },
  { id: "lead-3", name: "JoJo", source: "Referral", responseTime: "7m 02s", status: "breached" },
];

export type WorkloadRow = {
  id: string;
  name: string;
  openTasks: number;
  completedToday: number;
  pendingApprovals: number;
};

export const workloadDistribution: WorkloadRow[] = [
  { id: "wl-kat", name: "Kat", openTasks: 8, completedToday: 5, pendingApprovals: 0 },
  { id: "wl-jaffer", name: "Jaffer", openTasks: 6, completedToday: 4, pendingApprovals: 1 },
  { id: "wl-pedro", name: "Pedro", openTasks: 12, completedToday: 8, pendingApprovals: 2 },
  { id: "wl-jojo", name: "JoJo", openTasks: 9, completedToday: 6, pendingApprovals: 1 },
];

export type ApprovalDraft = {
  id: string;
  title: string;
  preparedBy: string;
  client: string;
  submitted: string;
  cta: string;
};

export const approvalQueue: ApprovalDraft[] = [
  {
    id: "draft-1",
    title: "Commercial Quote Follow-up",
    preparedBy: "Pedro",
    client: "Kim Auto Shop",
    submitted: "15 min ago",
    cta: "Approve Draft",
  },
  {
    id: "draft-2",
    title: "Policy Renewal Reminder",
    preparedBy: "JoJo",
    client: "Seoul Restaurant Group",
    submitted: "27 min ago",
    cta: "Review Draft",
  },
];

export type PlaceholderTabId = "brokerage";

export const tabPlaceholders: Record<PlaceholderTabId, { title: string; description: string }> = {
  brokerage: {
    title: "Brokerage Team",
    description: "JoJo and Pedro's brokerage workspace — quotes, documents, and client follow-ups.",
  },
};
