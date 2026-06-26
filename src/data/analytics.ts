/* ─────────────────────────────────────────────────────────────────────────────
   Analytics Hub — Static Data
   Cyan identity. KPI sparkline signature element (7-point, shifts rose on negative trend).
   In production: all KPIs sourced from AgencyZoom + Google Sheets folio ranges.
───────────────────────────────────────────────────────────────────────────── */

export const analyticsHeader = {
  title: "Analytics",
  subtitle: "Agency-wide performance metrics by folio period — premium pace, retention, conversion, and velocity.",
  helpId: "analytics" as const,
};

export const analyticsTabIds = ["overview", "production", "retention", "velocity", "carriers"] as const;
export type AnalyticsTabId = (typeof analyticsTabIds)[number];

export const analyticsTabs: { id: AnalyticsTabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "production", label: "Production" },
  { id: "retention", label: "Retention" },
  { id: "velocity", label: "Sales Velocity" },
  { id: "carriers", label: "Carrier Mix" },
];

export type KpiTrend = "positive" | "negative" | "neutral";

export type AnalyticsKpi = {
  id: string;
  label: string;
  value: string;
  sub: string;
  trend: KpiTrend;
  delta: string;
  sparkline: number[];
};

export const overviewKpis: AnalyticsKpi[] = [
  {
    id: "kpi-written-premium",
    label: "Written Premium (MTD)",
    value: "$312,400",
    sub: "Monthly pace: 88%",
    trend: "positive",
    delta: "+14% vs last month",
    sparkline: [44, 52, 48, 61, 58, 73, 78],
  },
  {
    id: "kpi-new-policies",
    label: "New Policies Written",
    value: "62",
    sub: "Target: 70",
    trend: "positive",
    delta: "+8 vs last month",
    sparkline: [32, 38, 42, 44, 50, 58, 62],
  },
  {
    id: "kpi-retention",
    label: "Retention Rate",
    value: "91.4%",
    sub: "Target: 90%",
    trend: "positive",
    delta: "+1.2pp vs last folio",
    sparkline: [88, 89, 90, 91, 90.5, 91, 91.4],
  },
  {
    id: "kpi-commercial-bind",
    label: "Commercial Bind Rate",
    value: "34%",
    sub: "Quoted → Bound",
    trend: "negative",
    delta: "-3pp vs last month",
    sparkline: [42, 40, 38, 37, 36, 35, 34],
  },
  {
    id: "kpi-avg-premium",
    label: "Avg Premium per Policy",
    value: "$5,039",
    sub: "All lines combined",
    trend: "positive",
    delta: "+$320 vs last folio",
    sparkline: [4200, 4400, 4600, 4720, 4900, 4980, 5039],
  },
  {
    id: "kpi-quote-velocity",
    label: "Quote Turnaround",
    value: "2.3 days",
    sub: "Intake → First quote",
    trend: "negative",
    delta: "+0.4 days vs target",
    sparkline: [1.8, 2.0, 2.1, 2.2, 2.1, 2.3, 2.3],
  },
];

export type CarrierKpi = {
  id: string;
  carrier: string;
  premium: string;
  policies: number;
  bindRate: string;
  avgDays: string;
};

export const carrierMixData: CarrierKpi[] = [
  { id: "c-farmers", carrier: "Farmers", premium: "$142,000", policies: 28, bindRate: "45%", avgDays: "1.8" },
  { id: "c-employers", carrier: "Employers", premium: "$68,000", policies: 14, bindRate: "38%", avgDays: "2.4" },
  { id: "c-guard", carrier: "Guard Insurance", premium: "$44,000", policies: 9, bindRate: "32%", avgDays: "3.1" },
  { id: "c-progressive", carrier: "Progressive Comm.", premium: "$34,000", policies: 7, bindRate: "29%", avgDays: "2.8" },
  { id: "c-kraft", carrier: "KraftLake", premium: "$24,400", policies: 4, bindRate: "25%", avgDays: "4.2" },
];
