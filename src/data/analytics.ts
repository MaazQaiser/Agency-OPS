/* ─────────────────────────────────────────────────────────────────────────────
   Analytics Hub — Executive Performance Intelligence Data
   Cyan identity. In production: AgencyZoom + Google Sheets folio ranges.
───────────────────────────────────────────────────────────────────────────── */

export const analyticsHeader = {
  title: "Analytics",
  subtitle: "Executive performance intelligence · Pipeline trends · Producer scorecards",
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

export const analyticsTimeFilters = [
  { id: "mtd", label: "MTD" },
  { id: "last30", label: "Last 30 days" },
  { id: "quarter", label: "Quarter" },
  { id: "ytd", label: "YTD" },
  { id: "custom", label: "Custom" },
] as const;

export type AnalyticsTimeFilterId = (typeof analyticsTimeFilters)[number]["id"];

export function getAnalyticsPeriodLabel(id: AnalyticsTimeFilterId): string {
  return analyticsTimeFilters.find((f) => f.id === id)?.label ?? "MTD";
}

export type KpiTrend = "positive" | "negative" | "neutral";

export type AnalyticsKpi = {
  id: string;
  label: string;
  value: string;
  sub: string;
  trend: KpiTrend;
  delta: string;
  trendDirection: "up" | "down" | "flat";
  benchmark?: string;
  sparkline: number[];
};

export const overviewKpis: AnalyticsKpi[] = [
  {
    id: "kpi-written-premium",
    label: "Written Premium",
    value: "$312,400",
    sub: "All lines · commercial + personal",
    trend: "positive",
    trendDirection: "up",
    delta: "+14% vs last month",
    benchmark: "Target: $350k (89% complete)",
    sparkline: [44, 52, 48, 61, 58, 73, 78],
  },
  {
    id: "kpi-new-policies",
    label: "New Policies Written",
    value: "62",
    sub: "New business count",
    trend: "positive",
    trendDirection: "up",
    delta: "+8 vs last month",
    benchmark: "Target: 70 (89% complete)",
    sparkline: [32, 38, 42, 44, 50, 58, 62],
  },
  {
    id: "kpi-retention",
    label: "Retention Rate",
    value: "91.4%",
    sub: "Renewal book health",
    trend: "positive",
    trendDirection: "up",
    delta: "+1.2pp vs last folio",
    benchmark: "Target: 90% (exceeded)",
    sparkline: [88, 89, 90, 91, 90.5, 91, 91.4],
  },
  {
    id: "kpi-commercial-bind",
    label: "Commercial Bind Rate",
    value: "34%",
    sub: "Quoted → Bound",
    trend: "negative",
    trendDirection: "down",
    delta: "-3pp vs last month",
    benchmark: "Target: 38% (89% of goal)",
    sparkline: [42, 40, 38, 37, 36, 35, 34],
  },
  {
    id: "kpi-avg-premium",
    label: "Avg Premium per Policy",
    value: "$5,039",
    sub: "All lines combined",
    trend: "positive",
    trendDirection: "up",
    delta: "+$320 vs last folio",
    benchmark: "Benchmark: $4,800 (+5%)",
    sparkline: [4200, 4400, 4600, 4720, 4900, 4980, 5039],
  },
  {
    id: "kpi-quote-velocity",
    label: "Quote Turnaround",
    value: "2.3 days",
    sub: "Intake → First quote",
    trend: "negative",
    trendDirection: "down",
    delta: "+0.4 days vs target",
    benchmark: "Target: 1.9 days (behind)",
    sparkline: [1.8, 2.0, 2.1, 2.2, 2.1, 2.3, 2.3],
  },
];

export type ExecutiveSummaryItem = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "positive" | "negative" | "neutral" | "warning";
};

export const executiveSummary: ExecutiveSummaryItem[] = [
  {
    id: "exec-top-producer",
    label: "Top producer this month",
    value: "Eva Martinez",
    detail: "$84,200 written · 14 policies",
    tone: "positive",
  },
  {
    id: "exec-most-improved",
    label: "Most improved producer",
    value: "James Okonkwo",
    detail: "+22% premium vs last month",
    tone: "positive",
  },
  {
    id: "exec-lost-opp",
    label: "Biggest lost opportunity",
    value: "Rivera Construction",
    detail: "$48k WC quote — declined by 2 carriers",
    tone: "negative",
  },
  {
    id: "exec-bind-ratio",
    label: "Highest bind ratio",
    value: "Employers WC",
    detail: "52% bind rate · 1.5-day turnaround",
    tone: "positive",
  },
  {
    id: "exec-slowest-quote",
    label: "Slowest quote cycle",
    value: "Commercial Auto",
    detail: "3.1 days avg · +0.8 days vs benchmark",
    tone: "warning",
  },
];

export type TrendChartSeries = {
  id: string;
  title: string;
  subtitle: string;
  unit: string;
  labels: string[];
  values: number[];
  trend: KpiTrend;
  formatValue?: (v: number) => string;
};

export const overviewTrendCharts: TrendChartSeries[] = [
  {
    id: "chart-premium",
    title: "Premium Trend",
    subtitle: "Monthly written premium",
    unit: "$",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [198000, 224000, 241000, 268000, 289000, 312400],
    trend: "positive",
    formatValue: (v) => `$${(v / 1000).toFixed(0)}k`,
  },
  {
    id: "chart-policies",
    title: "Policies Written",
    subtitle: "New policies per month",
    unit: "",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [38, 42, 45, 51, 58, 62],
    trend: "positive",
  },
  {
    id: "chart-bind-rate",
    title: "Bind Rate Trend",
    subtitle: "Quoted → Bound conversion",
    unit: "%",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [41, 39, 38, 37, 36, 34],
    trend: "negative",
    formatValue: (v) => `${v}%`,
  },
  {
    id: "chart-quote-turnaround",
    title: "Quote Turnaround",
    subtitle: "Avg days intake → first quote",
    unit: "days",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [1.9, 2.0, 2.1, 2.0, 2.2, 2.3],
    trend: "negative",
    formatValue: (v) => `${v}d`,
  },
];

export type ProducerLeaderboardRow = {
  id: string;
  producer: string;
  writtenPremium: string;
  policies: number;
  avgDealSize: string;
  bindRatio: string;
  closeRate: string;
  rankMovement: number;
  rank: number;
};

export const producerLeaderboard: ProducerLeaderboardRow[] = [
  {
    id: "prod-eva",
    producer: "Eva Martinez",
    writtenPremium: "$84,200",
    policies: 14,
    avgDealSize: "$6,014",
    bindRatio: "42%",
    closeRate: "38%",
    rankMovement: 0,
    rank: 1,
  },
  {
    id: "prod-james",
    producer: "James Okonkwo",
    writtenPremium: "$72,400",
    policies: 11,
    avgDealSize: "$6,582",
    bindRatio: "39%",
    closeRate: "35%",
    rankMovement: 2,
    rank: 2,
  },
  {
    id: "prod-sarah",
    producer: "Sarah Chen",
    writtenPremium: "$58,100",
    policies: 12,
    avgDealSize: "$4,842",
    bindRatio: "36%",
    closeRate: "31%",
    rankMovement: -1,
    rank: 3,
  },
  {
    id: "prod-mike",
    producer: "Mike Torres",
    writtenPremium: "$48,600",
    policies: 9,
    avgDealSize: "$5,400",
    bindRatio: "33%",
    closeRate: "28%",
    rankMovement: 1,
    rank: 4,
  },
  {
    id: "prod-lisa",
    producer: "Lisa Park",
    writtenPremium: "$49,100",
    policies: 16,
    avgDealSize: "$3,069",
    bindRatio: "29%",
    closeRate: "24%",
    rankMovement: -2,
    rank: 5,
  },
];

export type PipelineStage = {
  id: string;
  label: string;
  count: number;
  premium: string;
};

export const pipelineBreakdown: PipelineStage[] = [
  { id: "pipe-submitted", label: "Submitted", count: 84, premium: "$412k" },
  { id: "pipe-quoted", label: "Quoted", count: 62, premium: "$318k" },
  { id: "pipe-bound", label: "Bound", count: 38, premium: "$198k" },
  { id: "pipe-lost", label: "Lost", count: 24, premium: "$120k" },
];

export const productionKpis: AnalyticsKpi[] = [
  {
    id: "prod-kpi-premium",
    label: "Total Written Premium",
    value: "$312,400",
    sub: "All producers combined",
    trend: "positive",
    trendDirection: "up",
    delta: "+14% vs last month",
    benchmark: "Target: $350k (89%)",
    sparkline: [44, 52, 48, 61, 58, 73, 78],
  },
  {
    id: "prod-kpi-policies",
    label: "Policies Bound",
    value: "38",
    sub: "New + renewal binds",
    trend: "positive",
    trendDirection: "up",
    delta: "+6 vs last month",
    benchmark: "Target: 45 (84%)",
    sparkline: [22, 26, 28, 30, 32, 35, 38],
  },
  {
    id: "prod-kpi-close",
    label: "Close Rate",
    value: "31%",
    sub: "Quoted → Bound",
    trend: "negative",
    trendDirection: "down",
    delta: "-2pp vs last month",
    benchmark: "Target: 35%",
    sparkline: [36, 35, 34, 33, 32, 31, 31],
  },
];

export type RetentionRiskLevel = "Low" | "Medium" | "High";

export const retentionKpis: AnalyticsKpi[] = [
  {
    id: "ret-kpi-due",
    label: "Renewals Due",
    value: "47",
    sub: "This month",
    trend: "neutral",
    trendDirection: "flat",
    delta: "12 due this week",
    benchmark: "Target save rate: 92%",
    sparkline: [38, 40, 42, 44, 45, 46, 47],
  },
  {
    id: "ret-kpi-save",
    label: "Save Rate",
    value: "88.2%",
    sub: "Renewals retained",
    trend: "negative",
    trendDirection: "down",
    delta: "-1.8pp vs target",
    benchmark: "Target: 92%",
    sparkline: [92, 91, 90, 89.5, 89, 88.5, 88.2],
  },
  {
    id: "ret-kpi-at-risk",
    label: "At-Risk Renewals",
    value: "14",
    sub: "Requires intervention",
    trend: "negative",
    trendDirection: "up",
    delta: "+4 vs last month",
    benchmark: "8 high-risk accounts",
    sparkline: [8, 9, 10, 11, 12, 13, 14],
  },
];

export type RetentionByProducer = {
  id: string;
  producer: string;
  renewalsDue: number;
  saved: number;
  lost: number;
  saveRate: string;
  riskLevel: RetentionRiskLevel;
};

export const retentionByProducer: RetentionByProducer[] = [
  { id: "ret-eva", producer: "Eva Martinez", renewalsDue: 12, saved: 11, lost: 1, saveRate: "92%", riskLevel: "Low" },
  { id: "ret-james", producer: "James Okonkwo", renewalsDue: 10, saved: 8, lost: 2, saveRate: "80%", riskLevel: "Medium" },
  { id: "ret-sarah", producer: "Sarah Chen", renewalsDue: 9, saved: 8, lost: 1, saveRate: "89%", riskLevel: "Low" },
  { id: "ret-mike", producer: "Mike Torres", renewalsDue: 8, saved: 5, lost: 3, saveRate: "63%", riskLevel: "High" },
  { id: "ret-lisa", producer: "Lisa Park", renewalsDue: 8, saved: 7, lost: 1, saveRate: "88%", riskLevel: "Low" },
];

export type AtRiskRenewal = {
  id: string;
  account: string;
  producer: string;
  premium: string;
  renewalDate: string;
  riskLevel: RetentionRiskLevel;
  reason: string;
};

export const atRiskRenewals: AtRiskRenewal[] = [
  {
    id: "risk-1",
    account: "Rivera Construction",
    producer: "Mike Torres",
    premium: "$18,400",
    renewalDate: "Jun 28",
    riskLevel: "High",
    reason: "Rate increase >15% · competitor quote received",
  },
  {
    id: "risk-2",
    account: "Metro Auto Repair",
    producer: "James Okonkwo",
    premium: "$12,200",
    renewalDate: "Jul 2",
    riskLevel: "Medium",
    reason: "Claims activity on prior term",
  },
  {
    id: "risk-3",
    account: "Coastal Bistro Group",
    producer: "Eva Martinez",
    premium: "$9,800",
    renewalDate: "Jul 5",
    riskLevel: "Medium",
    reason: "Liquor liability exposure change",
  },
];

export type LostAccount = {
  id: string;
  account: string;
  producer: string;
  premium: string;
  lostDate: string;
  reason: string;
};

export const lostAccounts: LostAccount[] = [
  { id: "lost-1", account: "Summit Landscaping", producer: "Lisa Park", premium: "$6,400", lostDate: "Jun 12", reason: "Price — moved to competitor" },
  { id: "lost-2", account: "QuickRoute Delivery", producer: "Mike Torres", premium: "$11,200", lostDate: "Jun 8", reason: "Coverage gap — fleet size" },
];

export type VelocityStage = {
  id: string;
  label: string;
  avgDays: number;
  benchmark: number;
  trend: KpiTrend;
};

export const velocityStages: VelocityStage[] = [
  { id: "vel-intake-quote", label: "Intake → Quote", avgDays: 2.3, benchmark: 1.9, trend: "negative" },
  { id: "vel-quote-approval", label: "Quote → Approval", avgDays: 1.4, benchmark: 1.2, trend: "negative" },
  { id: "vel-approval-bind", label: "Approval → Bind", avgDays: 0.8, benchmark: 0.7, trend: "neutral" },
  { id: "vel-total", label: "Total Cycle Time", avgDays: 4.5, benchmark: 3.8, trend: "negative" },
];

export type VelocityBottleneck = {
  id: string;
  segment: string;
  message: string;
  delta: string;
  severity: "Low" | "Medium" | "High";
};

export const velocityBottlenecks: VelocityBottleneck[] = [
  {
    id: "bn-auto",
    segment: "Commercial Auto",
    message: "Commercial Auto avg +2.4 days slower than benchmark",
    delta: "+2.4 days",
    severity: "High",
  },
  {
    id: "bn-wc",
    segment: "Workers Comp",
    message: "WC quote stage +0.6 days vs target — payroll doc delays",
    delta: "+0.6 days",
    severity: "Medium",
  },
  {
    id: "bn-restaurant",
    segment: "Restaurant BOP",
    message: "Restaurant BOP intake → quote within benchmark",
    delta: "-0.2 days",
    severity: "Low",
  },
];

export const velocityKpis: AnalyticsKpi[] = [
  {
    id: "vel-kpi-cycle",
    label: "Avg Cycle Time",
    value: "4.5 days",
    sub: "Intake → Bind",
    trend: "negative",
    trendDirection: "down",
    delta: "+0.7 days vs benchmark",
    benchmark: "Target: 3.8 days",
    sparkline: [3.8, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
  },
  {
    id: "vel-kpi-quote",
    label: "Quote Stage",
    value: "2.3 days",
    sub: "Intake → First quote",
    trend: "negative",
    trendDirection: "down",
    delta: "+0.4 days vs target",
    benchmark: "Target: 1.9 days",
    sparkline: [1.9, 2.0, 2.1, 2.2, 2.1, 2.3, 2.3],
  },
  {
    id: "vel-kpi-bind",
    label: "Bind Stage",
    value: "0.8 days",
    sub: "Approval → Bind",
    trend: "neutral",
    trendDirection: "flat",
    delta: "+0.1 days vs target",
    benchmark: "Target: 0.7 days",
    sparkline: [0.7, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8],
  },
];

export type AppetiteTrend = "Up" | "Stable" | "Tightening";

export type CarrierKpi = {
  id: string;
  carrier: string;
  premium: string;
  premiumPct: number;
  policies: number;
  submissions: number;
  declineRatio: string;
  bindRate: number;
  bindRateLabel: string;
  avgDays: string;
  appetiteTrend: AppetiteTrend;
};

export const carrierMixData: CarrierKpi[] = [
  {
    id: "c-farmers",
    carrier: "Farmers",
    premium: "$142,000",
    premiumPct: 45,
    policies: 28,
    submissions: 62,
    declineRatio: "12%",
    bindRate: 45,
    bindRateLabel: "45%",
    avgDays: "1.8",
    appetiteTrend: "Stable",
  },
  {
    id: "c-employers",
    carrier: "Employers",
    premium: "$68,000",
    premiumPct: 22,
    policies: 14,
    submissions: 36,
    declineRatio: "8%",
    bindRate: 38,
    bindRateLabel: "38%",
    avgDays: "2.4",
    appetiteTrend: "Up",
  },
  {
    id: "c-guard",
    carrier: "Guard Insurance",
    premium: "$44,000",
    premiumPct: 14,
    policies: 9,
    submissions: 28,
    declineRatio: "18%",
    bindRate: 32,
    bindRateLabel: "32%",
    avgDays: "3.1",
    appetiteTrend: "Tightening",
  },
  {
    id: "c-progressive",
    carrier: "Progressive Comm.",
    premium: "$34,000",
    premiumPct: 11,
    policies: 7,
    submissions: 24,
    declineRatio: "22%",
    bindRate: 29,
    bindRateLabel: "29%",
    avgDays: "2.8",
    appetiteTrend: "Stable",
  },
  {
    id: "c-kraft",
    carrier: "KraftLake",
    premium: "$24,400",
    premiumPct: 8,
    policies: 4,
    submissions: 16,
    declineRatio: "25%",
    bindRate: 25,
    bindRateLabel: "25%",
    avgDays: "4.2",
    appetiteTrend: "Tightening",
  },
];

export const carrierDependencyData = carrierMixData.map((c) => ({
  id: c.id,
  carrier: c.carrier,
  premiumPct: c.premiumPct,
  premium: c.premium,
}));

export type AnalyticsAiInsight = {
  id: string;
  title: string;
  detail: string;
};

export const analyticsAiInsights: Record<AnalyticsTabId, AnalyticsAiInsight[]> = {
  overview: [
    { id: "ai-ov-1", title: "Retention risk rising in contractors segment", detail: "Contractor renewals down 2.1pp — 6 accounts flagged at-risk this week." },
    { id: "ai-ov-2", title: "Producer Eva outperforming by 18%", detail: "Eva Martinez leads written premium with 42% bind ratio — 8pp above team avg." },
    { id: "ai-ov-3", title: "Commercial Auto cycle time slowing", detail: "Auto quote stage +0.8 days vs benchmark — MVR collection delays detected." },
  ],
  production: [
    { id: "ai-prod-1", title: "Pipeline conversion dropping at quote stage", detail: "24% of quoted deals lost post-quote — review carrier mix on WC submissions." },
    { id: "ai-prod-2", title: "James Okonkwo fastest rank climb", detail: "+2 positions this month driven by higher avg deal size ($6,582)." },
    { id: "ai-prod-3", title: "Bound premium pacing behind target", detail: "At current close rate, team will miss June premium goal by ~$38k." },
  ],
  retention: [
    { id: "ai-ret-1", title: "Mike Torres save rate below threshold", detail: "63% save rate — 3 lost accounts this month. Schedule renewal review calls." },
    { id: "ai-ret-2", title: "High-risk renewals concentrated in WC", detail: "8 of 14 at-risk accounts are workers comp — rate pressure primary driver." },
    { id: "ai-ret-3", title: "Save rate trending down 1.8pp", detail: "Team save rate 88.2% vs 92% target — intervention needed on 14 accounts." },
  ],
  velocity: [
    { id: "ai-vel-1", title: "Commercial Auto avg +2.4 days slower than benchmark", detail: "Driver list and MVR delays account for 68% of auto cycle time variance." },
    { id: "ai-vel-2", title: "Quote stage is primary bottleneck", detail: "Intake → Quote at 2.3 days — 51% of total cycle time spent here." },
    { id: "ai-vel-3", title: "Bind stage performing within target", detail: "Approval → Bind at 0.8 days — only +0.1 days over benchmark." },
  ],
  carriers: [
    { id: "ai-car-1", title: "Travelers bind rate dropped 9%", detail: "Travelers commercial bind rate fell from 41% to 32% — appetite tightening in TX." },
    { id: "ai-car-2", title: "Farmers concentration risk", detail: "45% of written premium with Farmers — diversification recommended." },
    { id: "ai-car-3", title: "Guard decline ratio elevated", detail: "Guard at 18% decline ratio — review submission quality on restaurant risks." },
  ],
};

export const appetiteTrendClass: Record<AppetiteTrend, string> = {
  Up: "badge-green",
  Stable: "badge-blue",
  Tightening: "badge-amber",
};

export const retentionRiskClass: Record<RetentionRiskLevel, string> = {
  Low: "analytics-risk--low",
  Medium: "analytics-risk--medium",
  High: "analytics-risk--high",
};

export const velocityBottleneckClass: Record<VelocityBottleneck["severity"], string> = {
  Low: "analytics-bottleneck--low",
  Medium: "analytics-bottleneck--medium",
  High: "analytics-bottleneck--high",
};
