export type KpiTrendState = "positive" | "neutral" | "warning" | "negative";

export type KpiPolarity = "higher-better" | "lower-better";

export type KpiTrendData = {
  points: number[];
  dayLabels: string[];
  deltaPct: number;
  deltaLabel: string;
  direction: "up" | "down" | "stable";
  state: KpiTrendState;
  best: number;
  worst: number;
  average: number;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const LOWER_BETTER_LABELS = new Set(
  [
    "sla breaches",
    "overdue",
    "stalled submissions",
    "stalled",
    "failed",
    "missed",
    "due today",
    "follow-up due",
    "high-risk submissions",
    "high risk",
    "avg response time",
    "response time",
    "speed-to-lead",
    "speed to lead",
    "leads waiting",
    "tasks due today",
    "pending approvals",
    "declining",
    "cancellations",
    "dnc flags",
    "overdue invoices",
    "outstanding balance",
    "failed payments",
    "aging 30+",
    "aging 60+",
    "aging 90+",
    "escalated",
    "unpaid",
    "past due",
    "referrals",
  ].map((s) => s.toLowerCase()),
);

function hashLabel(label: string): number {
  let h = 0;
  for (let i = 0; i < label.length; i += 1) {
    h = (h << 5) - h + label.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function resolvePolarity(label: string): KpiPolarity {
  const key = label.toLowerCase();
  for (const term of LOWER_BETTER_LABELS) {
    if (key.includes(term)) return "lower-better";
  }
  return "higher-better";
}

function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function generateKpiTrendSeries(label: string, polarity: KpiPolarity): number[] {
  const seed = hashLabel(label);
  const base = 40 + (seed % 50);
  const drift = polarity === "higher-better" ? 1.04 + (seed % 7) * 0.01 : 0.97 - (seed % 5) * 0.008;
  const volatility = 0.06 + (seed % 5) * 0.02;

  const points: number[] = [];
  let value = base * (0.82 + seededRandom(seed, 0) * 0.2);

  for (let i = 0; i < 7; i += 1) {
    const noise = (seededRandom(seed, i + 1) - 0.5) * base * volatility;
    value = value * drift + noise;
    points.push(Math.max(1, Math.round(value * 10) / 10));
  }

  return points;
}

function stdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function computeTrendState(
  points: number[],
  rawDeltaPct: number,
  polarity: KpiPolarity,
): KpiTrendState {
  const mean = points.reduce((a, b) => a + b, 0) / points.length;
  const volatility = mean > 0 ? stdDev(points) / mean : 0;

  const effectiveDelta =
    polarity === "lower-better" ? -rawDeltaPct : rawDeltaPct;

  if (Math.abs(effectiveDelta) < 2) return "neutral";
  if (volatility > 0.28 && Math.abs(effectiveDelta) < 8) return "warning";

  if (effectiveDelta >= 5) return "positive";
  if (effectiveDelta <= -5) return "negative";
  if (effectiveDelta >= 2) return "warning";
  if (effectiveDelta <= -2) return "warning";
  return "neutral";
}

function formatDeltaLabel(deltaPct: number): { label: string; direction: "up" | "down" | "stable" } {
  if (Math.abs(deltaPct) < 2) {
    return { label: "Stable", direction: "stable" };
  }
  const sign = deltaPct > 0 ? "+" : "";
  return {
    label: `${sign}${deltaPct.toFixed(1)}%`,
    direction: deltaPct > 0 ? "up" : "down",
  };
}

export function buildKpiTrend(label: string, polarityOverride?: KpiPolarity): KpiTrendData {
  const polarity = polarityOverride ?? resolvePolarity(label);
  const points = generateKpiTrendSeries(label, polarity);
  return buildKpiTrendFromPoints(points, polarity);
}

export function buildKpiTrendFromPoints(
  points: number[],
  polarity: KpiPolarity = "higher-better",
): KpiTrendData {
  const first = points[0] ?? 0;
  const last = points[points.length - 1] ?? first;
  const rawDeltaPct = first === 0 ? 0 : ((last - first) / first) * 100;

  const displayDelta = polarity === "lower-better" ? -rawDeltaPct : rawDeltaPct;
  const { label: deltaLabel, direction } = formatDeltaLabel(displayDelta);
  const state = computeTrendState(points, rawDeltaPct, polarity);

  return {
    points,
    dayLabels: WEEKDAY_LABELS,
    deltaPct: displayDelta,
    deltaLabel,
    direction,
    state,
    best: Math.max(...points),
    worst: Math.min(...points),
    average: Math.round((points.reduce((a, b) => a + b, 0) / points.length) * 10) / 10,
  };
}

const trendCache = new Map<string, KpiTrendData>();

export function getKpiTrend(label: string, polarityOverride?: KpiPolarity): KpiTrendData {
  const key = `${label}:${polarityOverride ?? "auto"}`;
  const cached = trendCache.get(key);
  if (cached) return cached;
  const trend = buildKpiTrend(label, polarityOverride);
  trendCache.set(key, trend);
  return trend;
}

export function trendStateColorVar(state: KpiTrendState): string {
  switch (state) {
    case "positive":
      return "var(--success-green)";
    case "warning":
      return "var(--warning-amber)";
    case "negative":
      return "var(--critical-rose)";
    default:
      return "var(--metric-blue)";
  }
}
