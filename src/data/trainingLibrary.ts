import type { AssignmentStatus, DepartmentId, ResourceType } from "./trainingHub";
import { routes } from "@/lib/routes";

export const trainingLibraryHeader = {
  title: "Training Library",
  subtitle: "Browse and access training resources across your department.",
  quickActions: [
    { id: "assign", label: "Assign Training", icon: "user-plus" as const },
    { id: "categories", label: "Manage Categories", icon: "clipboard" as const },
  ],
};

export const librarySearchPlaceholder = "Search training by title, keyword, or tag";

export const libraryFilterOptions = {
  department: [
    "All Departments",
    "Dialer Team",
    "Research Team",
    "Brokerage Team",
    "Sales Team",
    "Automation Team",
    "Admin / Compliance",
  ],
  contentType: ["All Types", "Loom", "Doc", "Scribe"],
  tags: [
    "All Tags",
    "Quoting",
    "Follow-Up",
    "Commercial",
    "Lead Qualification",
    "Objection Handling",
    "Carrier Follow-Up",
    "Submission Workflow",
    "Renewals",
    "Retention",
  ],
  completionStatus: ["All Status", "Completed", "Pending", "In Progress"],
  assignedTo: ["All Assignees", "Pedro", "Kat", "Jaffer", "JoJo", "Eva", "Hamad", "Kyle"],
};

export const departmentIdToName: Record<DepartmentId, string> = {
  dialer: "Dialer Team",
  research: "Research Team",
  brokerage: "Brokerage Team",
  sales: "Sales Team",
  automation: "Automation Team",
  admin: "Admin / Compliance",
};

export const trainingLibraryKpis = [
  {
    label: "Total Resources",
    value: "146",
    sub: "All available content",
    helper: "Full training library",
    color: "primary" as const,
  },
  {
    label: "Assigned to Me",
    value: "8",
    sub: "Pending completion",
    helper: "My learning queue",
    color: "yellow" as const,
  },
  {
    label: "Completed",
    value: "31",
    sub: "This month",
    helper: "Finished training",
    color: "green" as const,
  },
  {
    label: "Recently Updated",
    value: "9",
    sub: "Freshly revised",
    helper: "New content to review",
    color: "primary" as const,
  },
];

export type ResourceCompletionStatus = "Completed" | "Pending" | "In Progress";

export type ResourceDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type TrainingResource = {
  id: string;
  title: string;
  department: string;
  departmentId: DepartmentId;
  type: ResourceType;
  duration: string;
  tags: string[];
  assignedTo: string;
  completionStatus: ResourceCompletionStatus;
  lastUpdated: string;
  difficulty: ResourceDifficulty;
  drawer: {
    description: string;
    assignedUsers: string[];
    completionLogs: { user: string; date: string; status: string }[];
    relatedResources: string[];
  };
};

export const trainingResources: TrainingResource[] = [
  {
    id: "lib-quote-script",
    title: "Commercial Quote Follow-Up Script",
    department: "Brokerage Team",
    departmentId: "brokerage",
    type: "Loom",
    duration: "8 min",
    tags: ["Quoting", "Follow-Up", "Commercial"],
    assignedTo: "Pedro",
    completionStatus: "Completed",
    lastUpdated: "2 days ago",
    difficulty: "Intermediate",
    drawer: {
      description: "Step-by-step script for following up on commercial quotes with clients and carriers.",
      assignedUsers: ["Pedro", "JoJo"],
      completionLogs: [
        { user: "Pedro", date: "May 18, 2026", status: "Completed" },
        { user: "JoJo", date: "May 17, 2026", status: "In Progress" },
      ],
      relatedResources: ["Carrier Submission SOP", "Quote Comparison Guide"],
    },
  },
  {
    id: "lib-objection",
    title: "New Lead Objection Handling",
    department: "Dialer Team",
    departmentId: "dialer",
    type: "Loom",
    duration: "12 min",
    tags: ["Objection Handling", "Lead Qualification"],
    assignedTo: "Kat",
    completionStatus: "Pending",
    lastUpdated: "Today",
    difficulty: "Beginner",
    drawer: {
      description: "Handle common objections on new lead calls including price, timing, and incumbent carrier.",
      assignedUsers: ["Kat", "Hamad"],
      completionLogs: [{ user: "Hamad", date: "May 16, 2026", status: "Completed" }],
      relatedResources: ["Cold Call Opener Script", "Call Objection Basics"],
    },
  },
  {
    id: "lib-carrier-sop",
    title: "Carrier Submission SOP",
    department: "Brokerage Team",
    departmentId: "brokerage",
    type: "Doc",
    duration: "15 min",
    tags: ["Submission Workflow", "Carrier Follow-Up", "Commercial"],
    assignedTo: "Pedro",
    completionStatus: "In Progress",
    lastUpdated: "Yesterday",
    difficulty: "Advanced",
    drawer: {
      description: "Standard operating procedure for submitting to carriers and tracking responses.",
      assignedUsers: ["Pedro", "JoJo", "Hamad"],
      completionLogs: [
        { user: "JoJo", date: "May 19, 2026", status: "Completed" },
        { user: "Pedro", date: "In progress", status: "In Progress" },
      ],
      relatedResources: ["Commercial Quote Follow-Up Script", "Missing Docs Checklist"],
    },
  },
  {
    id: "lib-prospect-research",
    title: "Commercial Prospect Research",
    department: "Research Team",
    departmentId: "research",
    type: "Scribe",
    duration: "10 min",
    tags: ["Lead Qualification", "Commercial"],
    assignedTo: "Jaffer",
    completionStatus: "Pending",
    lastUpdated: "2 days ago",
    difficulty: "Intermediate",
    drawer: {
      description: "Research workflow for qualifying commercial prospects before handoff to producers.",
      assignedUsers: ["Jaffer", "Tracie"],
      completionLogs: [],
      relatedResources: ["Lead Qualification Workflow", "Enrichment Checklist"],
    },
  },
  {
    id: "lib-renewal",
    title: "Policy Renewal Workflow",
    department: "Sales Team",
    departmentId: "sales",
    type: "Doc",
    duration: "14 min",
    tags: ["Renewals", "Retention", "Client Communication"],
    assignedTo: "Eva",
    completionStatus: "Completed",
    lastUpdated: "3 days ago",
    difficulty: "Intermediate",
    drawer: {
      description: "End-to-end renewal process from review to client presentation and bind.",
      assignedUsers: ["Eva", "Tracie"],
      completionLogs: [
        { user: "Eva", date: "May 15, 2026", status: "Completed" },
        { user: "Tracie", date: "May 14, 2026", status: "Completed" },
      ],
      relatedResources: ["Producer Closing Process", "Renewal Handling Training"],
    },
  },
  {
    id: "lib-closing",
    title: "Producer Closing Process",
    department: "Sales Team",
    departmentId: "sales",
    type: "Loom",
    duration: "18 min",
    tags: ["Client Communication", "Commercial"],
    assignedTo: "Eva",
    completionStatus: "In Progress",
    lastUpdated: "1 week ago",
    difficulty: "Advanced",
    drawer: {
      description: "Producer-led closing techniques for commercial and personal lines opportunities.",
      assignedUsers: ["Eva", "Sarah"],
      completionLogs: [{ user: "Sarah", date: "May 10, 2026", status: "Completed" }],
      relatedResources: ["Policy Renewal Workflow", "Objection Handling Refresher"],
    },
  },
  {
    id: "lib-lead-qual",
    title: "Lead Qualification SOP",
    department: "Research Team",
    departmentId: "research",
    type: "Scribe",
    duration: "9 min",
    tags: ["Lead Qualification", "Commercial"],
    assignedTo: "Jaffer",
    completionStatus: "Pending",
    lastUpdated: "Today",
    difficulty: "Beginner",
    drawer: {
      description: "Qualification criteria and scoring for inbound and outbound leads.",
      assignedUsers: ["Jaffer", "Pedro"],
      completionLogs: [],
      relatedResources: ["Commercial Prospect Research", "Lead Qualification Workflow"],
    },
  },
  {
    id: "lib-compliance",
    title: "E&O Compliance Checklist",
    department: "Admin / Compliance",
    departmentId: "admin",
    type: "Doc",
    duration: "7 min",
    tags: ["Compliance"],
    assignedTo: "All Team",
    completionStatus: "Completed",
    lastUpdated: "1 day ago",
    difficulty: "Advanced",
    drawer: {
      description: "Required compliance checks before binding and document retention standards.",
      assignedUsers: ["All Team"],
      completionLogs: [
        { user: "Eva", date: "May 19, 2026", status: "Completed" },
        { user: "Tracie", date: "May 18, 2026", status: "Completed" },
      ],
      relatedResources: ["Document Retention Policy", "Approval Workflows"],
    },
  },
  {
    id: "lib-slack-setup",
    title: "Slack Integration Setup",
    department: "Automation Team",
    departmentId: "automation",
    type: "Scribe",
    duration: "20 min",
    tags: ["Submission Workflow"],
    assignedTo: "Kyle",
    completionStatus: "Completed",
    lastUpdated: "Today",
    difficulty: "Intermediate",
    drawer: {
      description: "Configure Slack webhooks and channel routing for intake and commercial alerts.",
      assignedUsers: ["Kyle", "Hamad"],
      completionLogs: [{ user: "Kyle", date: "May 20, 2026", status: "Completed" }],
      relatedResources: ["Monday Integration Walkthrough", "Automation Trigger Logic"],
    },
  },
];

export const libraryAssignedTraining = [
  {
    id: "lib-assign-kat",
    assignee: "Kat",
    training: "New Lead Objection Handling",
    due: "Tomorrow",
    status: "Pending" as AssignmentStatus,
  },
  {
    id: "lib-assign-pedro",
    assignee: "Pedro",
    training: "Carrier Submission SOP",
    due: "Today",
    status: "In Progress" as AssignmentStatus,
  },
  {
    id: "lib-assign-jaffer",
    assignee: "Jaffer",
    training: "Lead Qualification SOP",
    due: "3 days",
    status: "Pending" as AssignmentStatus,
  },
];

export type PopularTopic = {
  tag: string;
  usageCount: number;
};

export const popularTopics: PopularTopic[] = [
  { tag: "Lead Qualification", usageCount: 24 },
  { tag: "Objection Handling", usageCount: 19 },
  { tag: "Carrier Follow-Up", usageCount: 16 },
  { tag: "Submission Workflow", usageCount: 14 },
  { tag: "Renewals", usageCount: 12 },
  { tag: "Retention", usageCount: 11 },
  { tag: "Client Communication", usageCount: 9 },
  { tag: "Compliance", usageCount: 7 },
];

/** @deprecated Use popularTopics */
export const popularTags = popularTopics.map((t) => t.tag);

export const recentlyViewed = [
  { id: "view-1", title: "Commercial Prospect Research", viewed: "Today" },
  { id: "view-2", title: "Carrier Submission SOP", viewed: "Yesterday" },
  { id: "view-3", title: "New Lead Objection Handling", viewed: "Yesterday" },
  { id: "view-4", title: "Policy Renewal Workflow", viewed: "2 days ago" },
];

export type LibraryActivityItem = {
  id: string;
  actor: string;
  message: string;
  timeAgo: string;
};

export const libraryActivity: LibraryActivityItem[] = [
  { id: "lib-act-1", actor: "Kat", message: "Kat completed Renewal Handling Training", timeAgo: "14 min ago" },
  { id: "lib-act-2", actor: "Pedro", message: "Pedro started Carrier Submission SOP", timeAgo: "28 min ago" },
  { id: "lib-act-3", actor: "Jaffer", message: "Jaffer viewed Prospect Qualification Workflow", timeAgo: "1 hr ago" },
  { id: "lib-act-4", actor: "Eva", message: "Eva uploaded Producer Closing Guide", timeAgo: "3 hr ago" },
];

export const resourceCompletionClass: Record<ResourceCompletionStatus, string> = {
  Completed: "badge-green",
  Pending: "badge-amber",
  "In Progress": "badge-blue",
};

export type LibraryFilterState = {
  department: string;
  contentType: string;
  tags: string;
  completionStatus: string;
  assignedTo: string;
};

export const defaultLibraryFilters: LibraryFilterState = {
  department: libraryFilterOptions.department[0],
  contentType: libraryFilterOptions.contentType[0],
  tags: libraryFilterOptions.tags[0],
  completionStatus: libraryFilterOptions.completionStatus[0],
  assignedTo: libraryFilterOptions.assignedTo[0],
};

export function getInitialLibraryFilters(deptParam: string | null): LibraryFilterState {
  if (deptParam && deptParam in departmentIdToName) {
    return {
      ...defaultLibraryFilters,
      department: departmentIdToName[deptParam as DepartmentId],
    };
  }
  return defaultLibraryFilters;
}

export function matchesLibraryFilters(
  resource: TrainingResource,
  search: string,
  filters: LibraryFilterState,
) {
  const q = search.trim().toLowerCase();
  if (q) {
    const haystack = [
      resource.title,
      resource.department,
      resource.type,
      resource.assignedTo,
      ...resource.tags,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filters.department !== "All Departments" && resource.department !== filters.department) {
    return false;
  }
  if (filters.contentType !== "All Types" && resource.type !== filters.contentType) return false;
  if (filters.tags !== "All Tags" && !resource.tags.includes(filters.tags)) return false;
  if (filters.completionStatus !== "All Status" && resource.completionStatus !== filters.completionStatus) {
    return false;
  }
  if (filters.assignedTo !== "All Assignees" && resource.assignedTo !== filters.assignedTo) {
    return false;
  }

  return true;
}

export function findResourceByTitle(title: string): TrainingResource | undefined {
  return trainingResources.find((r) => r.title === title);
}

export function findResourceByTitleLoose(title: string): TrainingResource | undefined {
  const exact = findResourceByTitle(title);
  if (exact) return exact;

  const normalized = title.trim().toLowerCase();
  return trainingResources.find((resource) => {
    const resourceTitle = resource.title.toLowerCase();
    return resourceTitle.includes(normalized) || normalized.includes(resourceTitle);
  });
}

export function findResourceFromActivityMessage(message: string): TrainingResource | undefined {
  const sorted = [...trainingResources].sort((a, b) => b.title.length - a.title.length);
  return sorted.find((resource) => message.includes(resource.title));
}

export type TrainingDetailLinkOptions = {
  from?: "departments" | "library";
  dept?: string | null;
};

export function getTrainingDetailHref(
  resourceId: string,
  options: TrainingDetailLinkOptions = {},
): string {
  const params = new URLSearchParams({
    view: "detail",
    resource: resourceId,
  });

  if (options.from) params.set("from", options.from);
  if (options.dept) params.set("dept", options.dept);

  return `${routes.trainingHub}?${params.toString()}`;
}
