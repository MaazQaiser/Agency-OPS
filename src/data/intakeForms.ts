export const intakeFormsTabs = [
  { id: "selector", label: "Form Selector" },
  { id: "new-submission", label: "New Submission" },
  { id: "drafts", label: "Drafts" },
  { id: "history", label: "Submission History" },
] as const;

export type IntakeFormsTabId = (typeof intakeFormsTabs)[number]["id"];

export const intakeFormsHeader = {
  title: "Intake Forms",
  subtitle: "Start and manage insurance intake submissions.",
  quickActions: [
    { id: "import", label: "Import Submission", icon: "upload" as const },
  ],
};

export const intakeFormsKpis = [
  {
    label: "Total Submissions",
    value: "84",
    sub: "This month",
    helper: "All intake forms submitted",
    color: "primary" as const,
  },
  {
    label: "Pending Review",
    value: "12",
    sub: "Awaiting processing",
    helper: "Needs team review",
    color: "yellow" as const,
  },
  {
    label: "Completed",
    value: "63",
    sub: "Successfully routed",
    helper: "Sent to system",
    color: "green" as const,
  },
  {
    label: "Failed Routes",
    value: "3",
    sub: "Needs retry",
    helper: "Submission issue detected",
    color: "red" as const,
  },
];

export type IntakeFormType = "contractors" | "restaurants" | "personal-lines";

export type IntakeFormCard = {
  id: IntakeFormType;
  title: string;
  description: string;
  submissionsThisMonth: number;
  lastSubmitted: string;
  avgCompletionTime: string;
  icon: "clipboard" | "folder" | "shield";
  drawer: {
    overview: string;
    requiredDocuments: string[];
    estimatedCompletionTime: string;
    whoCanSubmit: string;
    routingDestination: string[];
  };
};

export const intakeFormCards: IntakeFormCard[] = [
  {
    id: "contractors",
    title: "Contractors Intake",
    description:
      "Collect business details, payroll, subcontractor info, and coverage needs.",
    submissionsThisMonth: 28,
    lastSubmitted: "2 hours ago",
    avgCompletionTime: "9 min",
    icon: "clipboard",
    drawer: {
      overview:
        "Full commercial intake for contractors including GL, WC, auto, and umbrella coverage needs.",
      requiredDocuments: [
        "Signed application",
        "Loss runs (5 years)",
        "Payroll report",
        "Subcontractor agreement",
        "Business license",
      ],
      estimatedCompletionTime: "9 minutes",
      whoCanSubmit: "Producers, VAs, and intake team",
      routingDestination: ["AgencyZoom", "Slack #commercial-intake", "Monday — New Submissions"],
    },
  },
  {
    id: "restaurants",
    title: "Restaurants Intake",
    description:
      "Capture restaurant operations, liquor exposure, payroll, and property details.",
    submissionsThisMonth: 21,
    lastSubmitted: "5 hours ago",
    avgCompletionTime: "11 min",
    icon: "folder",
    drawer: {
      overview:
        "Restaurant-specific intake covering BOP, liquor liability, property, and workers comp.",
      requiredDocuments: [
        "Signed application",
        "Menu / revenue breakdown",
        "Liquor license",
        "Payroll report",
        "Property schedule",
      ],
      estimatedCompletionTime: "11 minutes",
      whoCanSubmit: "Producers, VAs, and intake team",
      routingDestination: ["AgencyZoom", "Slack #commercial-intake", "Monday — Restaurant Pipeline"],
    },
  },
  {
    id: "personal-lines",
    title: "Personal Lines Intake",
    description: "Collect personal auto, home, and bundled policy details.",
    submissionsThisMonth: 35,
    lastSubmitted: "45 min ago",
    avgCompletionTime: "6 min",
    icon: "shield",
    drawer: {
      overview:
        "Personal lines intake for auto, home, renters, and bundled personal policies.",
      requiredDocuments: [
        "Driver information",
        "Current dec pages",
        "Property details",
        "Prior carrier info",
      ],
      estimatedCompletionTime: "6 minutes",
      whoCanSubmit: "Producers, VAs, and CSRs",
      routingDestination: ["AgencyZoom", "Slack #personal-intake", "Monday — Personal Lines"],
    },
  },
];

export type SubmissionStatus = "Routed" | "Pending Review" | "Completed" | "Failed";

export const recentSubmissions = [
  {
    id: "sub-martinez",
    client: "Martinez Landscaping",
    form: "Contractors",
    submittedBy: "Pedro",
    time: "22 min ago",
    status: "Routed" as SubmissionStatus,
  },
  {
    id: "sub-kim",
    client: "Kim Auto Shop",
    form: "Contractors",
    submittedBy: "JoJo",
    time: "1 hour ago",
    status: "Pending Review" as SubmissionStatus,
  },
  {
    id: "sub-greenline",
    client: "Greenline Logistics",
    form: "Contractors",
    submittedBy: "Eva",
    time: "2 hours ago",
    status: "Completed" as SubmissionStatus,
  },
  {
    id: "sub-rivera",
    client: "Rivera Construction",
    form: "Contractors",
    submittedBy: "Valerie",
    time: "3 hours ago",
    status: "Routed" as SubmissionStatus,
  },
  {
    id: "sub-atlas",
    client: "Atlas Roofing",
    form: "Contractors",
    submittedBy: "Tracie",
    time: "45 min ago",
    status: "Completed" as SubmissionStatus,
  },
];

export const routingStatus = [
  { id: "route-az", system: "AgencyZoom", status: "Connected", lastSync: "2 min ago" },
  { id: "route-slack", system: "Slack", status: "Connected", lastSync: "1 min ago" },
  { id: "route-monday", system: "Monday", status: "Connected", lastSync: "4 min ago" },
];

export type IntakeDraftStatus = "Draft" | "In Progress";

export type IntakeDraft = {
  id: string;
  client: string;
  form: string;
  formType: IntakeFormType;
  lastEdited: string;
  progress: number;
  status: IntakeDraftStatus;
  assignedOwner: string;
};

export const savedDrafts: IntakeDraft[] = [
  {
    id: "draft-rivera",
    client: "Rivera Construction",
    form: "Contractors",
    lastEdited: "Today, 2:14 PM",
    progress: 60,
    formType: "contractors",
    status: "In Progress",
    assignedOwner: "JoJo",
  },
  {
    id: "draft-greenline",
    client: "Greenline Logistics",
    form: "Contractors",
    lastEdited: "Yesterday, 4:30 PM",
    progress: 40,
    formType: "contractors",
    status: "Draft",
    assignedOwner: "Pedro",
  },
  {
    id: "draft-kim",
    client: "Kim Auto Shop",
    form: "Contractors",
    lastEdited: "Yesterday, 11:05 AM",
    progress: 25,
    formType: "contractors",
    status: "Draft",
    assignedOwner: "Tracie",
  },
  {
    id: "draft-atlas",
    client: "Atlas Roofing",
    form: "Contractors",
    lastEdited: "2 days ago",
    progress: 15,
    formType: "contractors",
    status: "Draft",
    assignedOwner: "Valerie",
  },
];
