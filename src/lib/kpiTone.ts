export type KpiStatusTone =
  | "positive"
  | "warning"
  | "danger"
  | "info"
  | "draft"
  | "commercial"
  | "neutral";

const TONE_ALIASES: Record<string, KpiStatusTone> = {
  green: "positive",
  good: "positive",
  success: "positive",
  healthy: "positive",
  amber: "warning",
  yellow: "warning",
  orange: "warning",
  watch: "warning",
  red: "danger",
  rose: "danger",
  danger: "danger",
  critical: "danger",
  blue: "info",
  primary: "info",
  aqua: "info",
  info: "info",
  violet: "draft",
  purple: "draft",
  draft: "draft",
  teal: "commercial",
  commercial: "commercial",
  gray: "neutral",
  grey: "neutral",
  white: "neutral",
  neutral: "neutral",
};

/** Maps existing color/status class names to the shared KPI tone. Presentation only. */
export function kpiToneFromColor(color?: string | null): KpiStatusTone {
  if (!color) return "info";
  return TONE_ALIASES[color.trim().toLowerCase()] ?? "info";
}

export function progressToneFromColor(color?: string | null): KpiStatusTone {
  const tone = kpiToneFromColor(color);
  return tone === "neutral" ? "info" : tone;
}
