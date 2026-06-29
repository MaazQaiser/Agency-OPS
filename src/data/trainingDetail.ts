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

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  selectedOptionId?: string;
};

/** @deprecated Use QuizQuestion for multiple-choice quizzes */
export type KnowledgeQuestion = {
  id: string;
  question: string;
  answer: "yes" | "no" | "";
};

export type LeaderboardEntry = {
  id: string;
  member: string;
  completionPercent: number;
  avgQuizScore: number;
  lastCompleted: string;
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
  readProgress?: number;
  resumeLabel?: string;
  scribeSteps?: ScribeStep[];
  documentSections?: string[];
  sopSteps: SopStep[];
  quiz: QuizQuestion[];
  relatedTraining: RelatedTrainingItem[];
  teamLeaderboard: LeaderboardEntry[];
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

const defaultQuiz: QuizQuestion[] = [
  {
    id: "q-1",
    question: "When should you escalate a quote to a licensed producer?",
    options: [
      { id: "q-1-a", label: "Before comparing carrier quotes" },
      { id: "q-1-b", label: "When coverage limits exceed VA authority" },
      { id: "q-1-c", label: "After the client pays in full" },
    ],
    correctOptionId: "q-1-b",
  },
  {
    id: "q-2",
    question: "Which documents are required before carrier submission?",
    options: [
      { id: "q-2-a", label: "Signed application and loss runs only" },
      { id: "q-2-b", label: "Signed app, loss runs, and ACORD forms" },
      { id: "q-2-c", label: "Marketing brochure only" },
    ],
    correctOptionId: "q-2-b",
  },
  {
    id: "q-3",
    question: "How should broker fees appear on a client invoice?",
    options: [
      { id: "q-3-a", label: "Bundled into premium" },
      { id: "q-3-b", label: "Separate line item from premium" },
      { id: "q-3-c", label: "Omitted until bind" },
    ],
    correctOptionId: "q-3-b",
  },
];

const defaultLeaderboard: LeaderboardEntry[] = [
  { id: "lb-1", member: "Eva", completionPercent: 94, avgQuizScore: 92, lastCompleted: "Producer Closing Process" },
  { id: "lb-2", member: "Kat", completionPercent: 88, avgQuizScore: 85, lastCompleted: "Call Objection Basics" },
  { id: "lb-3", member: "Pedro", completionPercent: 81, avgQuizScore: 78, lastCompleted: "Carrier Submission SOP" },
  { id: "lb-4", member: "Jaffer", completionPercent: 72, avgQuizScore: 74, lastCompleted: "Lead Qualification SOP" },
  { id: "lb-5", member: "JoJo", completionPercent: 69, avgQuizScore: 71, lastCompleted: "Submission Tracker Walkthrough" },
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
    readProgress: 45,
    resumeLabel: "Resume at 3:36 — Follow-up call structure",
    sopSteps: defaultSopSteps,
    quiz: defaultQuiz,
    relatedTraining: relatedTrainingCatalog,
    teamLeaderboard: defaultLeaderboard,
    nextTrainingId: "lib-carrier-sop",
  },
  "lib-carrier-sop": {
    createdBy: "Eva",
    skillLevel: "Intermediate",
    requiredFor: "Brokerage Team",
    estimatedCompletionTime: "15 min",
    readProgress: 58,
    resumeLabel: "Resume at Section 4 — Log submission in AgencyZoom",
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
    quiz: defaultQuiz,
    relatedTraining: relatedTrainingCatalog,
    teamLeaderboard: defaultLeaderboard,
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
    quiz: defaultQuiz,
    relatedTraining: relatedTrainingCatalog.slice(0, 2),
    teamLeaderboard: defaultLeaderboard,
    readProgress: 25,
    resumeLabel: "Resume at Step 3 — Check red flags",
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
    readProgress: resource.type === "Doc" ? 0 : resource.type === "Scribe" ? 0 : undefined,
    scribeSteps: resource.type === "Scribe"
      ? [{ id: "s-1", title: "Overview", body: resource.drawer.description }]
      : undefined,
    documentSections: resource.type === "Doc"
      ? [resource.drawer.description, "Review all sections before marking complete."]
      : undefined,
    sopSteps: defaultSopSteps,
    quiz: defaultQuiz.map((q) => ({ ...q, options: q.options.map((o) => ({ ...o })) })),
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
    teamLeaderboard: defaultLeaderboard,
    nextTrainingId: trainingResources.find((r) => r.id !== resourceId)?.id,
  };

  return { ...base, ...override, resource };
}

export function scoreQuiz(questions: QuizQuestion[]): { score: number; passed: boolean; confidence: number } {
  const answered = questions.filter((q) => q.selectedOptionId);
  if (answered.length === 0) return { score: 0, passed: false, confidence: 0 };
  const correct = answered.filter((q) => q.selectedOptionId === q.correctOptionId).length;
  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= 80;
  const confidence = Math.round((correct / answered.length) * 100);
  return { score, passed, confidence };
}

export function getTypeDisplayLabel(type: ResourceType): string {
  if (type === "Loom") return "Loom Video";
  if (type === "Doc") return "Document";
  return "Scribe Guide";
}

export { resourceCompletionClass, type ResourceCompletionStatus };
