import type { ChecklistClient } from "@/data/coverageChecklist";
import {
  getBindBlockers,
  getCoverageCompletion,
  getDocumentsStatus,
} from "@/data/coverageChecklist";

export type MarketReadinessTone = "green" | "amber" | "red";

export type MarketReadinessFactor = {
  id: string;
  label: string;
  complete: boolean;
};

export type MarketReadinessScore = {
  percent: number;
  tone: MarketReadinessTone;
  label: string;
  factors: MarketReadinessFactor[];
};

function readinessTone(percent: number): MarketReadinessTone {
  if (percent > 80) return "green";
  if (percent >= 50) return "amber";
  return "red";
}

export function computeMarketReadiness(client: ChecklistClient): MarketReadinessScore {
  const coverage = getCoverageCompletion(client);
  const docs = getDocumentsStatus(client);
  const blockers = getBindBlockers(client);
  const riskAcceptable = client.riskOverview.riskScore.score >= 50;
  const producerAssigned = Boolean(client.assignedProducer?.trim());

  const factors: MarketReadinessFactor[] = [
    {
      id: "coverage",
      label: "Required coverage complete",
      complete: coverage.percent === 100,
    },
    {
      id: "docs",
      label: "Documents uploaded",
      complete: docs.received === docs.total,
    },
    {
      id: "risk",
      label: "Risk score acceptable",
      complete: riskAcceptable,
    },
    {
      id: "producer",
      label: "Producer assigned",
      complete: producerAssigned,
    },
    {
      id: "blockers",
      label: "Bind blockers resolved",
      complete: blockers.length === 0,
    },
  ];

  const completeCount = factors.filter((f) => f.complete).length;
  const percent = Math.round((completeCount / factors.length) * 100);
  const tone = readinessTone(percent);

  return {
    percent,
    tone,
    label: `${percent}% Ready`,
    factors,
  };
}
