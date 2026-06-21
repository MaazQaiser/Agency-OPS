import type { ResourceType } from "./trainingHub";
import {
  findResourceByTitle,
  resourceCompletionClass,
  trainingResources,
  type ResourceCompletionStatus,
  type TrainingResource,
} from "./trainingLibrary";

export const trainingDetailHeader = {
  title: "Training Detail",
  subtitle: "Review the resource, complete steps, and track progress.",
  quickActions: [
    { id: "complete", label: "Mark Complete", icon: "check" as const },
    { id: "assign", label: "Assign to Team", icon: "user-plus" as const },
    { id: "save", label: "Save for Later", icon: "star" as const },
    { id: "share", label: "Share Resource", icon: "send" as const },
  ],
};

export type SopStep = {
  id: string;
  label: string;
  complete: boolean;
};

export type KnowledgeQuestion = {
  id: string;
  question: string;
  answer: "yes" | "no" | "";
};

export type RelatedTrainingItem = {
  id: string;
  title: string;
  department: string;
  type: ResourceType;
  duration: string;
  summary: string;
  tags: string[];
  assignedUsers: string[];
};

export type CompletionHistoryItem = {
  id: string;
  message: string;
  timeAgo: string;
};

export type ScribeStep = {
  id: string;
  title: string;
  body: string;
};

export type TrainingDetail = {
  resource: TrainingResource;
  createdBy: string;
  skillLevel: string;
  requiredFor: string;
  estimatedCompletionTime: string;
  playbackProgress?: number;
  scribeSteps?: ScribeStep[];
  documentSections?: string[];
  sopSteps: SopStep[];
  knowledgeCheck: KnowledgeQuestion[];
  relatedTraining: RelatedTrainingItem[];
  completionHistory: CompletionHistoryItem[];
  nextTrainingId?: string;
};

const defaultSopSteps: SopStep[] = [
  { id: "step-1", label: "Review client coverage", complete: true },
  { id: "step-2", label: "Confirm all required documents", complete: true },
  { id: "step-3", label: "Compare carrier quotes", complete: false },
  { id: "step-4", label: "Prepare producer notes", complete: false },
  { id: "step-5", label: "Schedule follow-up", complete: false },
  { id: "step-6", label: "Finalize next action", complete: false },
];

const defaultKnowledgeCheck: KnowledgeQuestion[] = [
  { id: "kq-1", question: "Do you understand the quote review process?", answer: "" },
  { id: "kq-2", question: "Can you identify missing documents before submission?", answer: "" },
  { id: "kq-3", question: "Do you know when to escalate to a producer?", answer: "" },
];

const relatedTrainingCatalog: RelatedTrainingItem[] = [
  {
    id: "rel-checklist",
    title: "Carrier Submission Checklist",
    department: "Brokerage Team",
    type: "Doc",
    duration: "5 min",
    summary: "Pre-submission checklist for carrier packages and required attachments.",
    tags: ["Submission Workflow", "Commercial"],
    assignedUsers: ["Pedro", "JoJo"],
  },
  {
    id: "rel-broker-fee",
    title: "Broker Fee Workflow",
    department: "Brokerage Team",
    type: "Loom",
    duration: "7 min",
    summary: "How to disclose, collect, and document broker fees on commercial submissions.",
    tags: ["Quoting", "Commercial"],
    assignedUsers: ["Eva", "Pedro"],
  },
  {
    id: "rel-bind",
    title: "Commercial Bind Process",
    department: "Brokerage Team",
    type: "Scribe",
    duration: "9 min",
    summary: "Step-by-step bind workflow from client approval through policy delivery.",
    tags: ["Submission Workflow", "Carrier Follow-Up"],
    assignedUsers: ["JoJo", "Hamad"],
  },
];

const detailOverrides: Partial<Record<string, Partial<Omit<TrainingDetail, "resource">>>> = {
  "lib-quote-script": {
    createdBy: "Eva",
    skillLevel: "Intermediate",
    requiredFor: "Brokerage Team",
    estimatedCompletionTime: "8 min",
    playbackProgress: 45,
    sopSteps: defaultSopSteps,
    knowledgeCheck: defaultKnowledgeCheck,
    relatedTraining: relatedTrainingCatalog,
    completionHistory: [
      { id: "ch-1", message: "Kat completed this training", timeAgo: "2 days ago" },
      { id: "ch-2", message: "Pedro started this training", timeAgo: "Today" },
      { id: "ch-3", message: "Jaffer bookmarked this training", timeAgo: "Yesterday" },
    ],
    nextTrainingId: "lib-carrier-sop",
  },
  "lib-carrier-sop": {
    createdBy: "Eva",
    skillLevel: "Intermediate",
    requiredFor: "Brokerage Team",
    estimatedCompletionTime: "15 min",
    documentSections: [
      "Gather client and coverage information",
      "Select appropriate markets (minimum 3)",
      "Complete carrier-specific applications",
      "Upload required documents to submission folder",
      "Log submission in AgencyZoom and Monday",
      "Set follow-up reminders for carrier responses",
    ],
    sopSteps: [
      { id: "cs-1", label: "Verify signed application on file", complete: true },
      { id: "cs-2", label: "Confirm 3+ markets selected", complete: true },
      { id: "cs-3", label: "Submit to carriers via portal", complete: false },
      { id: "cs-4", label: "Log in AgencyZoom", complete: false },
      { id: "cs-5", label: "Notify producer of submission", complete: false },
    ],
    knowledgeCheck: defaultKnowledgeCheck,
    relatedTraining: relatedTrainingCatalog,
    completionHistory: [
      { id: "ch-1", message: "JoJo completed this training", timeAgo: "3 days ago" },
      { id: "ch-2", message: "Pedro started this training", timeAgo: "Today" },
      { id: "ch-3", message: "Hamad bookmarked this training", timeAgo: "Yesterday" },
    ],
    nextTrainingId: "lib-quote-script",
  },
  "lib-prospect-research": {
    createdBy: "Tracie",
    skillLevel: "Beginner",
    requiredFor: "Research Team",
    estimatedCompletionTime: "10 min",
    scribeSteps: [
      { id: "sr-1", title: "Identify business entity", body: "Search SOS filings, website, and LinkedIn for legal name and ownership." },
      { id: "sr-2", title: "Verify operations", body: "Confirm NAICS, employee count, and revenue indicators." },
      { id: "sr-3", title: "Check red flags", body: "Review complaints, litigation, and prior carrier history." },
      { id: "sr-4", title: "Score and handoff", body: "Complete qualification scorecard and route to producer." },
    ],
    sopSteps: defaultSopSteps.map((s, i) => ({ ...s, complete: i < 2 })),
    knowledgeCheck: defaultKnowledgeCheck,
    relatedTraining: relatedTrainingCatalog.slice(0, 2),
    completionHistory: [
      { id: "ch-1", message: "Jaffer started this training", timeAgo: "Today" },
    ],
    nextTrainingId: "lib-lead-qual",
  },
};

export function findResourceById(id: string): TrainingResource | undefined {
  return trainingResources.find((r) => r.id === id);
}

export function getTrainingDetail(resourceId: string): TrainingDetail | null {
  const resource = findResourceById(resourceId);
  if (!resource) return null;

  const override = detailOverrides[resourceId] ?? {};

  const base: TrainingDetail = {
    resource,
    createdBy: "Eva",
    skillLevel: "Intermediate",
    requiredFor: resource.department,
    estimatedCompletionTime: resource.duration,
    playbackProgress: resource.type === "Loom" ? 0 : undefined,
    scribeSteps: resource.type === "Scribe"
      ? [{ id: "s-1", title: "Overview", body: resource.drawer.description }]
      : undefined,
    documentSections: resource.type === "Doc"
      ? [resource.drawer.description, "Review all sections before marking complete."]
      : undefined,
    sopSteps: defaultSopSteps,
    knowledgeCheck: defaultKnowledgeCheck.map((q) => ({ ...q })),
    relatedTraining: resource.drawer.relatedResources.map((title, i) => {
      const match = findResourceByTitle(title);
      return {
        id: `rel-${i}`,
        title,
        department: match?.department ?? resource.department,
        type: match?.type ?? "Doc",
        duration: match?.duration ?? "5 min",
        summary: match?.drawer.description ?? `Related training: ${title}`,
        tags: match?.tags ?? resource.tags,
        assignedUsers: match?.drawer.assignedUsers ?? resource.drawer.assignedUsers,
      };
    }),
    completionHistory: resource.drawer.completionLogs.map((log, i) => ({
      id: `hist-${i}`,
      message: `${log.user} ${log.status === "Completed" ? "completed" : log.status === "In Progress" ? "started" : "viewed"} this training`,
      timeAgo: log.date,
    })),
    nextTrainingId: trainingResources.find((r) => r.id !== resourceId)?.id,
  };

  return { ...base, ...override, resource };
}

export function getTypeDisplayLabel(type: ResourceType): string {
  if (type === "Loom") return "Loom Video";
  if (type === "Doc") return "Document";
  return "Scribe Guide";
}

export { resourceCompletionClass, type ResourceCompletionStatus };
