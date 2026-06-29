export const trainingHubTabs = [
  { id: "departments", label: "Department Overview" },
  { id: "library", label: "Training Library" },
] as const;

export type TrainingHubTabId = (typeof trainingHubTabs)[number]["id"];

export type TrainingDetailFrom = "departments" | "library";

export const trainingHubHeader = {
  title: "Training Hub",
  subtitle: "PL knowledge · Farmers benefits · 6 departments",
  quickActions: [
    { id: "upload", label: "Upload Training", icon: "upload" as const },
    { id: "add-resource", label: "Add New Resource", icon: "plus" as const },
    { id: "manage-tags", label: "Manage Tags", icon: "clipboard" as const },
  ],
};

export const trainingHubKpis = [
  {
    label: "Pending Assignments",
    value: "18",
    sub: "Need review or completion",
    helper: "Open training tasks",
    color: "yellow" as const,
    tier: "primary" as const,
  },
  {
    label: "Overdue Certifications",
    value: "5",
    sub: "Require immediate action",
    helper: "Compliance risk",
    color: "red" as const,
    tier: "primary" as const,
  },
  {
    label: "Completed This Week",
    value: "32",
    sub: "Team completions logged",
    helper: "Learning progress",
    color: "green" as const,
    tier: "secondary" as const,
  },
  {
    label: "New Resources",
    value: "9",
    sub: "Added in last 7 days",
    helper: "Fresh training content",
    color: "primary" as const,
    tier: "secondary" as const,
  },
];

export type DepartmentId =
  | "dialer"
  | "research"
  | "brokerage"
  | "sales"
  | "automation"
  | "admin";

export type CertificationHealth = "Active" | "Expiring" | "Missing";

export type TrainingDepartment = {
  id: DepartmentId;
  title: string;
  description: string;
  resources: number;
  completion: number;
  lastUpdated: string;
  icon: "phone" | "telescope" | "clipboard" | "trophy" | "rocket" | "shield";
  assignedTrainingCount: number;
  overdueTrainingCount: number;
  lastActivity: string;
  certificationHealth: CertificationHealth;
  drawer: {
    summary: string;
    teamMembers: string[];
    recentUpdates: string[];
    pendingAssignments: { name: string; training: string; due: string }[];
    completionStats: { label: string; value: string }[];
  };
};

export const trainingDepartments: TrainingDepartment[] = [
  {
    id: "dialer",
    title: "Dialer Team",
    description: "Scripts, call handling, objection training.",
    resources: 24,
    completion: 82,
    lastUpdated: "2 days ago",
    assignedTrainingCount: 4,
    overdueTrainingCount: 1,
    lastActivity: "Kat completed Call Objection Basics · 12 min ago",
    certificationHealth: "Active",
    icon: "phone",
    drawer: {
      summary: "Outbound call training, scripts, and objection handling for dialer VAs.",
      teamMembers: ["Kat", "Pedro", "Hamad", "JoJo"],
      recentUpdates: ["Commercial Quote Follow-Up Script added", "Cold call opener refreshed"],
      pendingAssignments: [
        { name: "Kat", training: "New Lead Objection Handling", due: "Tomorrow" },
      ],
      completionStats: [
        { label: "Team completion", value: "82%" },
        { label: "Resources completed", value: "19 / 24" },
        { label: "Avg time to complete", value: "18 min" },
      ],
    },
  },
  {
    id: "research",
    title: "Research Team",
    description: "Prospecting, enrichment, qualification SOPs.",
    resources: 18,
    completion: 74,
    lastUpdated: "Today",
    assignedTrainingCount: 3,
    overdueTrainingCount: 0,
    lastActivity: "Jaffer viewed Lead Qualification SOP · 1 hr ago",
    certificationHealth: "Expiring",
    icon: "telescope",
    drawer: {
      summary: "Lead research, enrichment workflows, and qualification standards.",
      teamMembers: ["Jaffer", "Tracie", "Pedro"],
      recentUpdates: ["Lead Qualification Workflow updated", "Enrichment checklist added"],
      pendingAssignments: [
        { name: "Jaffer", training: "Commercial Prospect Research", due: "3 days" },
      ],
      completionStats: [
        { label: "Team completion", value: "74%" },
        { label: "Resources completed", value: "13 / 18" },
        { label: "Avg time to complete", value: "22 min" },
      ],
    },
  },
  {
    id: "brokerage",
    title: "Brokerage Team",
    description: "Submissions, carrier workflows, quoting.",
    resources: 31,
    completion: 69,
    lastUpdated: "Yesterday",
    assignedTrainingCount: 5,
    overdueTrainingCount: 2,
    lastActivity: "Pedro started Carrier Submission SOP · 34 min ago",
    certificationHealth: "Expiring",
    icon: "clipboard",
    drawer: {
      summary: "Commercial submission workflows, carrier outreach, and quoting SOPs.",
      teamMembers: ["JoJo", "Pedro", "Hamad", "Eva"],
      recentUpdates: ["Carrier Submission SOP added", "Quote comparison guide updated"],
      pendingAssignments: [
        { name: "Pedro", training: "Carrier Follow-Up SOP", due: "Today" },
      ],
      completionStats: [
        { label: "Team completion", value: "69%" },
        { label: "Resources completed", value: "21 / 31" },
        { label: "Avg time to complete", value: "25 min" },
      ],
    },
  },
  {
    id: "sales",
    title: "Sales Team",
    description: "Producer workflows, closing, retention.",
    resources: 27,
    completion: 88,
    lastUpdated: "3 days ago",
    assignedTrainingCount: 2,
    overdueTrainingCount: 0,
    lastActivity: "Eva uploaded Producer Script · 2 hr ago",
    certificationHealth: "Active",
    icon: "trophy",
    drawer: {
      summary: "Producer sales workflows, closing techniques, and retention playbooks.",
      teamMembers: ["Eva", "Tracie", "Sarah"],
      recentUpdates: ["Producer renewal script updated", "Objection handling refresher"],
      pendingAssignments: [],
      completionStats: [
        { label: "Team completion", value: "88%" },
        { label: "Resources completed", value: "24 / 27" },
        { label: "Avg time to complete", value: "20 min" },
      ],
    },
  },
  {
    id: "automation",
    title: "Automation Team",
    description: "Workflow logic, triggers, integrations.",
    resources: 22,
    completion: 71,
    lastUpdated: "Today",
    assignedTrainingCount: 1,
    overdueTrainingCount: 0,
    lastActivity: "Kyle completed Slack Integration Setup · 3 hr ago",
    certificationHealth: "Active",
    icon: "rocket",
    drawer: {
      summary: "Automation builder training, trigger logic, and integration setup.",
      teamMembers: ["Kyle", "Hamad"],
      recentUpdates: ["Slack webhook setup guide", "Monday integration walkthrough"],
      pendingAssignments: [],
      completionStats: [
        { label: "Team completion", value: "71%" },
        { label: "Resources completed", value: "16 / 22" },
        { label: "Avg time to complete", value: "30 min" },
      ],
    },
  },
  {
    id: "admin",
    title: "Admin / Compliance",
    description: "Policies, approvals, compliance procedures.",
    resources: 24,
    completion: 91,
    lastUpdated: "1 day ago",
    assignedTrainingCount: 6,
    overdueTrainingCount: 2,
    lastActivity: "Tracie renewed E&O compliance · Yesterday",
    certificationHealth: "Missing",
    icon: "shield",
    drawer: {
      summary: "Agency policies, compliance procedures, and approval workflows.",
      teamMembers: ["Admin Team", "Eva", "Tracie"],
      recentUpdates: ["E&O compliance checklist", "Document retention policy"],
      pendingAssignments: [],
      completionStats: [
        { label: "Team completion", value: "91%" },
        { label: "Resources completed", value: "22 / 24" },
        { label: "Avg time to complete", value: "15 min" },
      ],
    },
  },
];

export type ResourceType = "Loom" | "Doc" | "Scribe";

export const recentlyAddedResources = [
  {
    id: "res-quote-script",
    title: "Commercial Quote Follow-Up Script",
    department: "Dialer Team",
    type: "Loom" as ResourceType,
    added: "Today",
  },
  {
    id: "res-carrier-sop",
    title: "Carrier Submission SOP",
    department: "Brokerage Team",
    type: "Doc" as ResourceType,
    added: "Yesterday",
  },
  {
    id: "res-lead-qual",
    title: "Lead Qualification Workflow",
    department: "Research Team",
    type: "Scribe" as ResourceType,
    added: "2 days ago",
  },
  {
    id: "res-producer-script",
    title: "Producer Renewal Script",
    department: "Sales Team",
    type: "Loom" as ResourceType,
    added: "3 days ago",
  },
];

export type AssignmentStatus = "Pending" | "In Progress" | "Completed";

export const assignedTraining = [
  {
    id: "assign-kat",
    assignee: "Kat",
    training: "New Lead Objection Handling",
    due: "Tomorrow",
    status: "Pending" as AssignmentStatus,
  },
  {
    id: "assign-pedro",
    assignee: "Pedro",
    training: "Carrier Follow-Up SOP",
    due: "Today",
    status: "In Progress" as AssignmentStatus,
  },
  {
    id: "assign-jaffer",
    assignee: "Jaffer",
    training: "Commercial Prospect Research",
    due: "3 days",
    status: "Pending" as AssignmentStatus,
  },
  {
    id: "assign-joJo",
    assignee: "JoJo",
    training: "Submission Tracker Walkthrough",
    due: "Friday",
    status: "In Progress" as AssignmentStatus,
  },
];

export const contentFormatCards = [
  { id: "format-loom", title: "Loom Videos", count: 52, icon: "folder" as const },
  { id: "format-scribe", title: "Scribe Guides", count: 39, icon: "clipboard" as const },
  { id: "format-docs", title: "Documents", count: 55, icon: "folder" as const },
];

export const trainingActivity = [
  { id: "act-1", message: "Kat completed Call Objection Basics", timeAgo: "12 min ago" },
  { id: "act-2", message: "Pedro started Carrier Submission Workflow", timeAgo: "34 min ago" },
  { id: "act-3", message: "Jaffer viewed Lead Qualification SOP", timeAgo: "1 hour ago" },
  { id: "act-4", message: "Eva uploaded new Producer Script", timeAgo: "2 hours ago" },
  { id: "act-5", message: "Kyle completed Slack Integration Setup", timeAgo: "3 hours ago" },
];

export const resourceTypeClass: Record<ResourceType, string> = {
  Loom: "badge-blue",
  Doc: "badge-violet",
  Scribe: "badge-teal",
};

export const resourceTypeCardClass: Record<ResourceType, string> = {
  Loom: "training-resource-card--loom",
  Doc: "training-resource-card--doc",
  Scribe: "training-resource-card--scribe",
};

export const resourceTypeIconClass: Record<ResourceType, string> = {
  Loom: "training-resource-type-icon--loom",
  Doc: "training-resource-type-icon--doc",
  Scribe: "training-resource-type-icon--scribe",
};

export const resourceTypeLabel: Record<ResourceType, string> = {
  Loom: "Video",
  Doc: "SOP / Policy",
  Scribe: "Checklist / Script",
};

export const assignmentStatusClass: Record<AssignmentStatus, string> = {
  Pending: "badge-amber",
  "In Progress": "badge-blue",
  Completed: "badge-green",
};

export type CertificationStatus = "Active" | "Expiring Soon" | "Expired" | "Required";

export type TeamCertification = {
  id: string;
  name: string;
  holder: string;
  department: string;
  status: CertificationStatus;
  expires?: string;
  required: boolean;
};

export const teamCertifications: TeamCertification[] = [
  { id: "cert-eo", name: "E&O Compliance", holder: "All Team", department: "Admin / Compliance", status: "Required", required: true },
  { id: "cert-carrier", name: "Carrier Submission", holder: "Pedro", department: "Brokerage Team", status: "Expiring Soon", expires: "Jun 30, 2026", required: true },
  { id: "cert-dialer", name: "Outbound Dialer", holder: "Kat", department: "Dialer Team", status: "Active", expires: "Dec 2026", required: false },
  { id: "cert-research", name: "Lead Research", holder: "Jaffer", department: "Research Team", status: "Expired", expires: "May 15, 2026", required: true },
  { id: "cert-sales", name: "Producer Closing", holder: "Eva", department: "Sales Team", status: "Active", expires: "Jan 2027", required: false },
  { id: "cert-az", name: "AZ E-Sign Disclosure", holder: "JoJo", department: "Brokerage Team", status: "Expiring Soon", expires: "Jul 5, 2026", required: true },
];

export const certificationStatusClass: Record<CertificationStatus, string> = {
  Active: "badge-green",
  "Expiring Soon": "badge-amber",
  Expired: "badge-rose",
  Required: "badge-violet",
};

export const certificationHealthClass: Record<CertificationHealth, string> = {
  Active: "badge-green",
  Expiring: "badge-amber",
  Missing: "badge-rose",
};
