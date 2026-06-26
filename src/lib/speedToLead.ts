export type SpeedToLeadSlaState = "within" | "warning" | "breached";

export type SpeedToLeadVariant = "green" | "amber" | "red";

export function formatStlDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatResponseTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const r = seconds % 60;
  return r > 0 ? `${m}m ${r}s` : `${m}m`;
}

export function computeSlaState(elapsedSeconds: number, windowSeconds: number): SpeedToLeadSlaState {
  if (elapsedSeconds > windowSeconds) return "breached";
  if (elapsedSeconds >= windowSeconds * 0.8) return "warning";
  return "within";
}

export function slaStateToVariant(state: SpeedToLeadSlaState): SpeedToLeadVariant {
  switch (state) {
    case "warning":
      return "amber";
    case "breached":
      return "red";
    default:
      return "green";
  }
}

export const slaStateLabels: Record<SpeedToLeadSlaState, string> = {
  within: "Within SLA",
  warning: "Approaching Limit",
  breached: "SLA Breached",
};
