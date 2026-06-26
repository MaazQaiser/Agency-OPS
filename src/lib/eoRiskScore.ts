import type { HubSubmission } from "@/data/commercialHub";
import type { TrackerSubmission } from "@/data/submissionTracker";
import type { Submission } from "@/types/submission";

export type EoRiskLevel = "safe" | "watch" | "critical";

export type EoRiskFactor = {
  id: string;
  label: string;
  points: number;
};

export type EoRiskScore = {
  total: number;
  level: EoRiskLevel;
  label: string;
  factors: EoRiskFactor[];
  daysOpen: number;
  missingDocsCount: number;
  hasCarrier: boolean;
};

export type EoRiskInput = {
  daysOpen: number;
  missingDocsCount: number;
  hasCarrier: boolean;
};

export type EoExposureSort = "highest" | "lowest" | "oldest" | "newest";

const LEVEL_LABELS: Record<EoRiskLevel, string> = {
  safe: "Safe",
  watch: "Watch",
  critical: "Critical",
};

export function scoreDaysOpen(daysOpen: number): number {
  if (daysOpen <= 10) return 0;
  if (daysOpen <= 20) return 1;
  if (daysOpen <= 30) return 2;
  return 3;
}

export function scoreMissingDocs(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  return 3;
}

export function scoreCarrierMissing(hasCarrier: boolean): number {
  return hasCarrier ? 0 : 2;
}

export function getEoRiskLevel(total: number): EoRiskLevel {
  if (total <= 1) return "safe";
  if (total <= 3) return "watch";
  return "critical";
}

export function parseMissingDocsCount(value: string): number {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === "none" || normalized === "n/a" || normalized === "—") return 0;
  if (normalized.includes(",")) {
    return normalized.split(",").filter((part) => part.trim().length > 0).length;
  }
  return 1;
}

export function hasActiveCarrierFromList(
  carriers: { carrier: string; status?: string }[],
): boolean {
  if (carriers.length === 0) return false;
  return carriers.some((entry) => {
    const status = (entry.status ?? "").toLowerCase();
    return status !== "declined" && entry.carrier.trim().length > 0;
  });
}

export function computeEoRiskScore(input: EoRiskInput): EoRiskScore {
  const daysPoints = scoreDaysOpen(input.daysOpen);
  const carrierPoints = scoreCarrierMissing(input.hasCarrier);
  const docsPoints = scoreMissingDocs(input.missingDocsCount);

  const factors: EoRiskFactor[] = [];

  if (daysPoints > 0) {
    factors.push({
      id: "days-open",
      label: `${input.daysOpen} days open (+${daysPoints})`,
      points: daysPoints,
    });
  }

  if (carrierPoints > 0) {
    factors.push({
      id: "no-carrier",
      label: `No carrier (+${carrierPoints})`,
      points: carrierPoints,
    });
  }

  if (docsPoints > 0) {
    const docLabel =
      input.missingDocsCount === 1
        ? "Missing 1 document"
        : `Missing ${input.missingDocsCount} documents`;
    factors.push({
      id: "missing-docs",
      label: `${docLabel} (+${docsPoints})`,
      points: docsPoints,
    });
  }

  const total = daysPoints + carrierPoints + docsPoints;
  const level = getEoRiskLevel(total);

  return {
    total,
    level,
    label: LEVEL_LABELS[level],
    factors,
    daysOpen: input.daysOpen,
    missingDocsCount: input.missingDocsCount,
    hasCarrier: input.hasCarrier,
  };
}

export function eoRiskFromSubmission(submission: Submission): EoRiskScore {
  return computeEoRiskScore({
    daysOpen: submission.daysOpen,
    missingDocsCount: parseMissingDocsCount(submission.missingDocs),
    hasCarrier: Boolean(submission.carrier?.trim()),
  });
}

export function eoRiskFromHubSubmission(submission: HubSubmission): EoRiskScore {
  return computeEoRiskScore({
    daysOpen: submission.daysOpen,
    missingDocsCount: submission.missingDocs.length,
    hasCarrier: hasActiveCarrierFromList(submission.carrierSubmissions),
  });
}

export function eoRiskFromTrackerSubmission(submission: TrackerSubmission): EoRiskScore {
  const missingDocsCount = submission.documents.filter((doc) => doc.status === "missing").length;
  return computeEoRiskScore({
    daysOpen: submission.daysOpen,
    missingDocsCount,
    hasCarrier: hasActiveCarrierFromList(submission.carriers),
  });
}

export function sortByEoExposure<T extends { daysOpen: number }>(
  items: T[],
  getScore: (item: T) => EoRiskScore,
  sort: EoExposureSort = "highest",
): T[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const scoreA = getScore(a);
    const scoreB = getScore(b);
    if (sort === "highest") return scoreB.total - scoreA.total || b.daysOpen - a.daysOpen;
    if (sort === "lowest") return scoreA.total - scoreB.total || a.daysOpen - b.daysOpen;
    if (sort === "oldest") return b.daysOpen - a.daysOpen;
    return a.daysOpen - b.daysOpen;
  });
  return copy;
}

export function formatEoRiskBadge(score: EoRiskScore): string {
  return `E&O: ${score.total} · ${score.label}`;
}
