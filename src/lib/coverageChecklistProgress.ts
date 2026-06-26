import type { SubmissionDocument, CoverageCheckItem, TrackerSubmission } from "@/data/submissionTracker";

export type CoverageChecklistRiskState = "low" | "medium" | "high" | "blocked";

export type CoverageChecklistProgress = {
  requiredDocs: string[];
  missingDocs: string[];
  pendingDocs: string[];
  receivedDocs: string[];
  completionPercent: number;
  riskState: CoverageChecklistRiskState;
  receivedCount: number;
  requiredCount: number;
};

export const coverageChecklistRiskLabels: Record<CoverageChecklistRiskState, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  blocked: "Blocked",
};

type ChecklistItem = { label: string; status: "complete" | "pending" | "missing" };

const DEFAULT_REQUIRED_DOCS = [
  "Signed Application",
  "Loss Runs",
  "Payroll Report",
];

function partitionChecklistItems(items: ChecklistItem[]) {
  const requiredDocs = items.map((item) => item.label);
  const missingDocs = items.filter((item) => item.status === "missing").map((item) => item.label);
  const pendingDocs = items.filter((item) => item.status === "pending").map((item) => item.label);
  const receivedDocs = items.filter((item) => item.status === "complete").map((item) => item.label);
  const receivedCount = receivedDocs.length;
  const requiredCount = items.length;
  const completionPercent =
    requiredCount === 0 ? 100 : Math.round((receivedCount / requiredCount) * 100);

  return {
    requiredDocs,
    missingDocs,
    pendingDocs,
    receivedDocs,
    receivedCount,
    requiredCount,
    completionPercent,
  };
}

export function computeCoverageChecklistRiskState(input: {
  missingCount: number;
  pendingCount: number;
  completionPercent: number;
}): CoverageChecklistRiskState {
  const { missingCount, pendingCount, completionPercent } = input;

  if (missingCount >= 2 || (missingCount >= 1 && completionPercent < 50)) {
    return "blocked";
  }
  if (missingCount >= 1) {
    return "high";
  }
  if (pendingCount >= 1 || completionPercent < 100) {
    return "medium";
  }
  return "low";
}

export function buildCoverageChecklistProgress(items: ChecklistItem[]): CoverageChecklistProgress {
  const partitioned = partitionChecklistItems(items);
  const riskState = computeCoverageChecklistRiskState({
    missingCount: partitioned.missingDocs.length,
    pendingCount: partitioned.pendingDocs.length,
    completionPercent: partitioned.completionPercent,
  });

  return {
    ...partitioned,
    riskState,
  };
}

export function progressFromTrackerSubmission(submission: TrackerSubmission): CoverageChecklistProgress {
  const docItems: ChecklistItem[] = submission.documents.map((doc) => ({
    label: doc.label,
    status: doc.status,
  }));

  const coverageItems: ChecklistItem[] = (submission.coverageChecklist ?? []).map((item) => ({
    label: item.label,
    status: item.status,
  }));

  return buildCoverageChecklistProgress([...docItems, ...coverageItems]);
}

export function progressFromDocumentList(
  documents: SubmissionDocument[],
  coverageChecklist: CoverageCheckItem[] = [],
): CoverageChecklistProgress {
  const items: ChecklistItem[] = [
    ...documents.map((doc) => ({ label: doc.label, status: doc.status })),
    ...coverageChecklist.map((item) => ({ label: item.label, status: item.status })),
  ];
  return buildCoverageChecklistProgress(items);
}

export function progressFromMissingDocsField(
  missingDocs: string,
  requiredDocs: string[] = DEFAULT_REQUIRED_DOCS,
): CoverageChecklistProgress {
  const missing =
    missingDocs === "None" || missingDocs === "N/A" || !missingDocs.trim()
      ? []
      : missingDocs.split(",").map((part) => part.trim()).filter(Boolean);

  const normalizedMissing = missing.map((doc) => doc.toLowerCase());
  const items: ChecklistItem[] = requiredDocs.map((label) => {
    const isMissing = normalizedMissing.some(
      (m) => label.toLowerCase().includes(m) || m.includes(label.toLowerCase()),
    );
    return {
      label,
      status: isMissing ? "missing" : "complete",
    };
  });

  for (const doc of missing) {
    const alreadyListed = items.some(
      (item) =>
        item.label.toLowerCase().includes(doc.toLowerCase())
        || doc.toLowerCase().includes(item.label.toLowerCase()),
    );
    if (!alreadyListed) {
      items.push({ label: doc, status: "missing" });
    }
  }

  return buildCoverageChecklistProgress(items);
}

export function progressFromHubMissingDocs(
  missingDocs: string[],
  requiredDocs: string[] = DEFAULT_REQUIRED_DOCS,
): CoverageChecklistProgress {
  const missingField = missingDocs.length === 0 ? "None" : missingDocs.join(", ");
  const mergedRequired = [
    ...requiredDocs,
    ...missingDocs.filter(
      (doc) => !requiredDocs.some((r) => r.toLowerCase() === doc.toLowerCase()),
    ),
  ];
  return progressFromMissingDocsField(missingField, mergedRequired);
}

export function findTrackerProgressByClient(
  client: string,
  submissions: TrackerSubmission[],
): CoverageChecklistProgress | null {
  const match = submissions.find((row) => row.client === client);
  return match ? progressFromTrackerSubmission(match) : null;
}
