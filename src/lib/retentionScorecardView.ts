import { kpiToneFromColor, type KpiStatusTone } from "@/lib/kpiTone";

/** Presentation-only: read an existing percentage string such as "94.2%". */
export function parseExistingPercent(value: string): number | null {
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*%/);
  if (!match) return null;
  return Number.parseFloat(match[1]);
}

/** Presentation-only: map existing KPI color tokens to a visible status label. */
export function retentionStatusFromColor(color?: string): {
  label: "Healthy" | "Watch" | "At Risk";
  tone: KpiStatusTone;
} {
  const tone = kpiToneFromColor(color);
  if (tone === "positive") return { label: "Healthy", tone };
  if (tone === "danger") return { label: "At Risk", tone };
  return { label: "Watch", tone: "warning" };
}

export function findPercentKpi<T extends { value: string }>(kpis: T[]): T | undefined {
  return kpis.find((kpi) => parseExistingPercent(kpi.value) != null);
}
