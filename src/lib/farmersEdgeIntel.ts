import type { ViewId } from "@/data/farmersEdge";

export type FarmersEdgeIntelMode =
  | "submission-analysis"
  | "coverage-gap"
  | "risk-exposure"
  | "cross-sell";

export type FarmersEdgeIntelRequest = {
  mode: FarmersEdgeIntelMode;
  client?: string;
  submissionId?: string;
  coverage?: string;
  verticalId?: string;
  initialView?: ViewId;
  contextLine?: string;
  missingDocs?: string[];
  coverageGaps?: string[];
};

const modeLabels: Record<FarmersEdgeIntelMode, string> = {
  "submission-analysis": "Submission Intelligence",
  "coverage-gap": "Coverage Gap Analysis",
  "risk-exposure": "Risk Exposure Review",
  "cross-sell": "Cross-Sell Intelligence",
};

const modeDescriptions: Record<FarmersEdgeIntelMode, string> = {
  "submission-analysis":
    "Advisory context for this submission — gaps, objections, and recommended coverage stack.",
  "coverage-gap":
    "Compare quoted coverage against Farmers recommended stack for this vertical.",
  "risk-exposure":
    "Surface E&O and bind risk from missing documentation or incomplete coverage.",
  "cross-sell":
    "Upsell opportunities before bind — umbrella, cyber, EPLI, inland marine, and more.",
};

export function farmersEdgeIntelModeLabel(mode: FarmersEdgeIntelMode): string {
  return modeLabels[mode];
}

export function farmersEdgeIntelModeDescription(mode: FarmersEdgeIntelMode): string {
  return modeDescriptions[mode];
}

export function inferVerticalFromContext(client?: string, coverage?: string): string {
  const c = (client ?? "").toLowerCase();
  if (c.includes("landscap") || c.includes("lawn") || c.includes("garden")) return "landscapers";
  if (c.includes("roof") || c.includes("construct") || c.includes("contract")) return "contractors";
  if (c.includes("restaurant") || c.includes("grill") || c.includes("cafe") || c.includes("diner")) {
    return "restaurants";
  }
  if (c.includes("clean") || c.includes("janitorial")) return "cleaning";
  if (c.includes("truck") || c.includes("tow") || c.includes("fleet")) return "trucking";
  if (c.includes("beauty") || c.includes("salon") || c.includes("nail") || c.includes("spa")) return "beauty";
  if (coverage?.toLowerCase().includes("auto")) return "trucking";
  return "all";
}

function defaultViewForMode(mode: FarmersEdgeIntelMode): ViewId {
  if (mode === "cross-sell") return "playbook";
  if (mode === "coverage-gap") return "playbook";
  return "playbook";
}

export function buildFarmersEdgeIntelRequest(
  partial: Omit<FarmersEdgeIntelRequest, "verticalId" | "initialView"> &
    Partial<Pick<FarmersEdgeIntelRequest, "verticalId" | "initialView">>,
): FarmersEdgeIntelRequest {
  const verticalId =
    partial.verticalId ??
    inferVerticalFromContext(partial.client, partial.coverage);
  const initialView = partial.initialView ?? defaultViewForMode(partial.mode);
  const contextLine =
    partial.contextLine ??
    (partial.client
      ? `${farmersEdgeIntelModeLabel(partial.mode)} · ${partial.client}`
      : farmersEdgeIntelModeLabel(partial.mode));

  return {
    ...partial,
    verticalId,
    initialView,
    contextLine,
  };
}

export function buildSubmissionAnalysisRequest(submission: {
  id: string;
  client: string;
  coverage: string;
  coverageChecklist?: { label: string; status: string }[];
}): FarmersEdgeIntelRequest {
  const coverageGaps =
    submission.coverageChecklist
      ?.filter((item) => item.status !== "complete")
      .map((item) => item.label) ?? [];

  return buildFarmersEdgeIntelRequest({
    mode: "submission-analysis",
    client: submission.client,
    submissionId: submission.id,
    coverage: submission.coverage,
    coverageGaps,
  });
}
