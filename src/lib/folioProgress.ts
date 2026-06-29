export type FolioUrgency = "safe" | "watch" | "critical";

export type FolioState = "healthy" | "warning" | "critical" | "closed";

export type FolioPeriod = {
  number: number;
  startDate: string;
  endDate: string;
  targetPremium: number;
  currentWritten: number;
};

export type PreviousFolioSummary = {
  number: number;
  targetPremium: number;
  written: number;
  pacePct: number;
};

export const currentFolioPeriod: FolioPeriod = {
  number: 18,
  startDate: "2026-05-20",
  endDate: "2026-06-29",
  targetPremium: 30_000,
  currentWritten: 18_200,
};

export const previousFolioPeriod: PreviousFolioSummary = {
  number: 17,
  targetPremium: 30_000,
  written: 23_400,
  pacePct: 78,
};

const DAY_MS = 86_400_000;

function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function inclusiveDaySpan(start: Date, end: Date): number {
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_MS) + 1;
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatFolioDateRange(startDate: string, endDate: string): string {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function getFolioUrgency(timeRemainingPct: number): FolioUrgency {
  if (timeRemainingPct > 0.4) return "safe";
  if (timeRemainingPct >= 0.15) return "watch";
  return "critical";
}

export const folioRiskStateLabels: Record<FolioUrgency, string> = {
  safe: "Healthy",
  watch: "At Risk",
  critical: "Period Ending",
};

export const folioStateLabels: Record<FolioState, string> = {
  healthy: "Healthy",
  warning: "Behind Target",
  critical: "Critical",
  closed: "Closed",
};

export type FolioProgressMetrics = {
  folioNumber: number;
  dateRangeLabel: string;
  daysTotal: number;
  daysElapsed: number;
  daysRemaining: number;
  daysRemainingLabel: string;
  timeRemainingPct: number;
  timeElapsedPct: number;
  goalProgressPct: number;
  pacePct: number;
  performancePacePct: number;
  urgency: FolioUrgency;
  folioState: FolioState;
  riskStateLabel: string;
  completionLabel: string;
  daysRemainingShortLabel: string;
  targetPremium: number;
  currentWritten: number;
  targetLabel: string;
  writtenLabel: string;
  paceLabel: string;
  previousFolio: PreviousFolioSummary;
  previousFolioDeltaPct: number;
  remainingPremium: number;
  remainingLabel: string;
};

export function resolveFolioState(
  metrics: Pick<
    FolioProgressMetrics,
    "daysRemaining" | "timeRemainingPct" | "performancePacePct" | "goalProgressPct" | "daysTotal" | "daysElapsed"
  >,
  asOf: Date,
  endDate: string,
  hasBlockers = true,
): FolioState {
  const end = startOfDay(parseLocalDate(endDate));
  const today = startOfDay(asOf);
  const periodEnded = today > end || (metrics.daysRemaining === 0 && metrics.goalProgressPct >= 100);

  if (periodEnded || metrics.goalProgressPct >= 100) return "closed";

  const onPace = metrics.performancePacePct >= 98;
  const finalDays = metrics.timeRemainingPct <= 0.15;

  if (finalDays && (!onPace || hasBlockers)) return "critical";
  if (!onPace) return "warning";
  return "healthy";
}

export function urgencyFromFolioState(state: FolioState): FolioUrgency {
  if (state === "healthy" || state === "closed") return "safe";
  if (state === "warning") return "watch";
  return "critical";
}

export function getFolioProgressMetrics(
  folio: FolioPeriod = currentFolioPeriod,
  previous: PreviousFolioSummary = previousFolioPeriod,
  asOf: Date = new Date(),
): FolioProgressMetrics {
  const start = startOfDay(parseLocalDate(folio.startDate));
  const end = startOfDay(parseLocalDate(folio.endDate));
  const today = startOfDay(asOf);

  const daysTotal = inclusiveDaySpan(start, end);
  const rawDaysRemaining = Math.round((end.getTime() - today.getTime()) / DAY_MS);
  const daysRemaining = Math.max(0, rawDaysRemaining);
  const daysElapsed = Math.min(daysTotal, Math.max(0, inclusiveDaySpan(start, today) - 1));

  const timeRemainingPct = daysTotal > 0 ? daysRemaining / daysTotal : 0;
  const timeElapsedPct = daysTotal > 0 ? Math.min(1, daysElapsed / daysTotal) : 1;
  const goalProgressPct = folio.targetPremium > 0 ? (folio.currentWritten / folio.targetPremium) * 100 : 0;
  const expectedWritten = folio.targetPremium * timeElapsedPct;
  const performancePacePct =
    expectedWritten > 0 ? (folio.currentWritten / expectedWritten) * 100 : goalProgressPct;

  const urgency = getFolioUrgency(timeRemainingPct);
  const previousFolioDeltaPct = goalProgressPct - previous.pacePct;
  const remainingPremium = Math.max(0, folio.targetPremium - folio.currentWritten);

  const partialMetrics = {
    daysRemaining,
    timeRemainingPct,
    performancePacePct,
    goalProgressPct,
    daysTotal,
    daysElapsed,
  };
  const folioState = resolveFolioState(partialMetrics, today, folio.endDate);
  const resolvedUrgency = urgencyFromFolioState(folioState);

  return {
    folioNumber: folio.number,
    dateRangeLabel: formatFolioDateRange(folio.startDate, folio.endDate),
    daysTotal,
    daysElapsed,
    daysRemaining,
    daysRemainingLabel:
      daysRemaining === 0 && today > end
        ? "Period ended"
        : daysRemaining === 0
          ? "Final day"
          : daysRemaining === 1
            ? "1 day left"
            : `${daysRemaining} days left`,
    daysRemainingShortLabel:
      daysRemaining === 0 && today > end
        ? "ENDED"
        : daysRemaining === 0
          ? "FINAL DAY"
          : daysRemaining === 1
            ? "1 DAY LEFT"
            : `${daysRemaining} DAYS LEFT`,
    timeRemainingPct,
    timeElapsedPct,
    goalProgressPct,
    pacePct: goalProgressPct,
    performancePacePct,
    urgency: resolvedUrgency,
    folioState,
    riskStateLabel: folioStateLabels[folioState],
    completionLabel: `${Math.round(goalProgressPct)}% COMPLETE`,
    targetPremium: folio.targetPremium,
    currentWritten: folio.currentWritten,
    targetLabel: formatCompactCurrency(folio.targetPremium),
    writtenLabel: formatCompactCurrency(folio.currentWritten),
    paceLabel: `${Math.round(performancePacePct)}%`,
    previousFolio: previous,
    previousFolioDeltaPct,
    remainingPremium,
    remainingLabel: formatCompactCurrency(remainingPremium),
  };
}
