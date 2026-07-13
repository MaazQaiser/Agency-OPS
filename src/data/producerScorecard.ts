import type { KpiItem, Producer } from "@/types";
import type { KpiPolarity, KpiTrendData } from "@/lib/kpiTrend";
import { buildKpiTrendFromPoints } from "@/lib/kpiTrend";

export const productionHeader = {
  tag: "Agency OS · Producer Performance · Prototype Reference",
  title: "Producer Scorecard",
  titleEmphasis: "Scorecard",
  meta: [
    { label: "Owner", value: "Eva Chong · Insurance Town · California" },
    { label: "Purpose", value: "Visual reference for Hassan: replaces ISL entirely" },
    { label: "Date", value: "May 29, 2026" },
  ],
  patent: "Patent Pending · USPTO #64/053,057",
  confBanner: "⚠ Confidential: Insurance Town: Producer Scorecard Prototype: For Hassan Reference Only",
  footer: "Insurance Town | Agency OS · Producer Scorecard Prototype · For Hassan Reference · Patent Pending USPTO #64/053,057 · May 29, 2026",
};

export const producers: Producer[] = [
  { id: "sarah", name: "Sarah", role: "Personal Lines + Life", score: "$6.6k" },
  { id: "jazmin", name: "Jazmín", role: "SDR / Commercial", score: "42 dials" },
  { id: "pedro", name: "Pedro", role: "Brokerage VA2", score: "8 follow-ups" },
  { id: "zahra", name: "Zahra", role: "Farmers VA", score: "3 COIs" },
];

export const hassanAlert = {
  title: "How This Works for Hassan",
  body: "Each producer card reads from Kyle's Sales_Scorecard Sheets tab. Adding a new producer = Eva adds one Tab 11 row. Dashboard auto-generates a new KPI card. Zero developer involvement per addition. Sarah = Personal Lines + Life only: commercial CPA never appears on her view.",
};

export const sarahKpis: KpiItem[] = [
  { label: "Premium Written", value: "$6,600", sub: "Target $30,000 · Need $805/day · Folio period May 20–Jun 18", color: "primary", featured: true, progress: { width: "22%", color: "amber" } },
  { label: "Close Rate", value: "18%", sub: "Goal: 25%", color: "amber", progress: { width: "72%", color: "amber" } },
  { label: "Contact Rate", value: "44%", sub: "Goal: 40% · On track", color: "green", progress: { width: "100%", color: "green" } },
  { label: "New Conversations", value: "22", sub: "Goal: 10/day · Ahead", color: "blue", progress: { width: "100%", color: "green" } },
  { label: "Policies / HH", value: "2.0", sub: "Goal: 1.5 · Exceeding", color: "green", progress: { width: "100%", color: "green" } },
  { label: "Households Closed", value: "3", sub: "Target: 8/month", color: "white", progress: { width: "38%", color: "amber" } },
  { label: "Life Apps", value: "1", sub: "Target: 1/month · Met", color: "green", progress: { width: "100%", color: "green" } },
  { label: "Referrals", value: "0", sub: "Quoted: 0 · Closed: 0", color: "red", progress: { width: "0%", color: "red" } },
];

export const sarahLobTable = [
  { line: "Auto", lineType: "personal" as const, quoted: 8, bound: 2, closeRate: "25%", premium: "$2,100" },
  { line: "Home", lineType: "personal" as const, quoted: 5, bound: 1, closeRate: "20%", premium: "$1,800" },
  { line: "Bundle", lineType: "personal" as const, quoted: 4, bound: 2, closeRate: "50%", premium: "$2,700" },
  { line: "Life", lineType: "life" as const, quoted: 3, bound: 1, closeRate: "33%", premium: "-" },
];

import type { SpeedToLeadSlaState } from "@/lib/speedToLead";

export type SpeedToLeadEntry = {
  id: string;
  name: string;
  source: string;
  detail: string;
  slaWindowSeconds: number;
  secondsSinceLastLead: number;
  lastResponseSeconds: number;
  avgResponseSeconds: number;
};

export const speedToLead: SpeedToLeadEntry[] = [
  {
    id: "stl-sarah",
    name: "Sarah",
    source: "RingCentral lead vendor call",
    detail: "Personal lines · vendor drop",
    slaWindowSeconds: 180,
    secondsSinceLastLead: 72,
    lastResponseSeconds: 72,
    avgResponseSeconds: 105,
  },
  {
    id: "stl-jazmin",
    name: "Jazmín",
    source: "Ricochet auto-dial",
    detail: "Personal lines drops",
    slaWindowSeconds: 180,
    secondsSinceLastLead: 168,
    lastResponseSeconds: 168,
    avgResponseSeconds: 142,
  },
  {
    id: "stl-jaffer",
    name: "Jaffer",
    source: "Meta commercial lead",
    detail: "Commercial researcher queue",
    slaWindowSeconds: 300,
    secondsSinceLastLead: 442,
    lastResponseSeconds: 442,
    avgResponseSeconds: 248,
  },
  {
    id: "stl-eva",
    name: "Eva",
    source: "Direct line",
    detail: "Owner line · immediate routing",
    slaWindowSeconds: 60,
    secondsSinceLastLead: 45,
    lastResponseSeconds: 45,
    avgResponseSeconds: 38,
  },
];

/** @deprecated Use SpeedToLeadEntry + live card: kept for export PDF compatibility */
export type SpeedToLeadLegacyRow = {
  name: string;
  variant: "green" | "amber" | "red";
  text: string;
};

export function toLegacySpeedToLeadRow(entry: SpeedToLeadEntry, slaState: SpeedToLeadSlaState): SpeedToLeadLegacyRow {
  const variant = slaState === "breached" ? "red" : slaState === "warning" ? "amber" : "green";
  return {
    name: entry.name,
    variant,
    text: `Last lead: ${entry.secondsSinceLastLead}s ago · ${entry.source}`,
  };
}

export const contactWindowRules = [
  { member: "Jazmín", source: "Personal lines drops via Ricochet", window: "3 minutes", missed: "Disposition logged, recycled to queue" },
  { member: "Jaffer (Researcher)", source: "Meta + LinkedIn commercial leads", window: "5 minutes", missed: "Slack alert to Eva" },
  { member: "Sarah", source: "RingCentral lead vendor calls", window: "Immediate", missed: "Auto SMS within 60 seconds" },
  { member: "Eva", source: "Direct line", window: "Immediate", missed: "Auto SMS within 60 seconds" },
];

export const roiDefaults = {
  spend: { min: 100, max: 5000, value: 500, step: 50 },
  cpl: { min: 5, max: 100, value: 25, step: 1 },
  closeRate: { min: 1, max: 50, value: 18, step: 1 },
  prem: { min: 500, max: 5000, value: 1500, step: 100 },
  comm: { min: 5, max: 25, value: 12, step: 1 },
};

export const weeklyRaceGoal = 300;

export type WeeklyRaceMomentum = "surging" | "steady" | "cooling";

export type WeeklyRaceEntry = {
  id: string;
  initial: string;
  name: string;
  points: number;
  width: string;
  color: "primary" | "blue" | "purple" | "green";
  rank: number;
  previousRank: number;
  isWeeklyWinner: boolean;
  momentum: WeeklyRaceMomentum;
  weeklyPoints: number[];
  trend: KpiTrendData;
};

export const weeklyRace: WeeklyRaceEntry[] = [
  {
    id: "sarah",
    initial: "S",
    name: "Sarah",
    points: 125,
    width: "42%",
    color: "primary",
    rank: 1,
    previousRank: 2,
    isWeeklyWinner: true,
    momentum: "surging",
    weeklyPoints: [42, 58, 72, 88, 98, 112, 125],
    trend: buildKpiTrendFromPoints([42, 58, 72, 88, 98, 112, 125], "higher-better"),
  },
  {
    id: "jazmin",
    initial: "J",
    name: "Jazmín",
    points: 115,
    width: "38%",
    color: "blue",
    rank: 2,
    previousRank: 1,
    isWeeklyWinner: false,
    momentum: "cooling",
    weeklyPoints: [52, 70, 86, 98, 108, 114, 115],
    trend: buildKpiTrendFromPoints([52, 70, 86, 98, 108, 114, 115], "higher-better"),
  },
  {
    id: "pedro",
    initial: "P",
    name: "Pedro",
    points: 60,
    width: "20%",
    color: "purple",
    rank: 3,
    previousRank: 4,
    isWeeklyWinner: false,
    momentum: "surging",
    weeklyPoints: [6, 12, 20, 28, 38, 50, 60],
    trend: buildKpiTrendFromPoints([6, 12, 20, 28, 38, 50, 60], "higher-better"),
  },
  {
    id: "zahra",
    initial: "Z",
    name: "Zahra",
    points: 24,
    width: "8%",
    color: "green",
    rank: 4,
    previousRank: 3,
    isWeeklyWinner: false,
    momentum: "steady",
    weeklyPoints: [4, 8, 11, 14, 17, 21, 24],
    trend: buildKpiTrendFromPoints([4, 8, 11, 14, 17, 21, 24], "higher-better"),
  },
];

export const weeklyRaceRules = "Points: 1pt/dial · 3pts/conversation · 5pts/quote · 10pts/bind · 5pts/Life app. Configured in Kyle's Points Config Sheets tab: Eva edits.";

export const pipelineKpi = [
  { pipeline: "1 New Personal Leads", line: "Personal", lineType: "personal" as const, newLeads: 20, contacted: 11, quoted: 7, bound: 2, contactPct: "55%", closePct: "18%", cpa: "$250" },
  { pipeline: "Home/Auto Bundle", line: "Personal", lineType: "personal" as const, newLeads: 14, contacted: 9, quoted: 6, bound: 3, contactPct: "64%", closePct: "33%", cpa: "$133" },
  { pipeline: "Commercial New", line: "Commercial", lineType: "commercial" as const, newLeads: 24, contacted: 9, quoted: 5, bound: 1, contactPct: "38%", closePct: "14%", cpa: "$350" },
  { pipeline: "Life / FFS", line: "Life", lineType: "life" as const, newLeads: 8, contacted: 6, quoted: 4, bound: 1, contactPct: "75%", closePct: "13%", cpa: "-" },
  { pipeline: "Korean Department", line: "Personal", lineType: "personal" as const, newLeads: 4, contacted: 3, quoted: 2, bound: 1, contactPct: "75%", closePct: "25%", cpa: "-" },
];

export const pipelineKpiTotals = { newLeads: 70, contacted: 38, quoted: 24, bound: 8, contactPct: "54%", closePct: "21%", cpa: "$236" };

export type PipelineSummaryKpi = {
  id: string;
  label: string;
  value: string;
  sub: string;
  color: KpiItem["color"];
  polarity?: KpiPolarity;
  weeklyPoints: number[];
  trend: KpiTrendData;
};

export const pipelineSummaryKpis: PipelineSummaryKpi[] = [
  {
    id: "quote-count",
    label: "Quote Count",
    value: String(pipelineKpiTotals.quoted),
    sub: "All pipelines · +5 vs prior folio week",
    color: "blue",
    polarity: "higher-better",
    weeklyPoints: [14, 16, 17, 19, 20, 22, 24],
    trend: buildKpiTrendFromPoints([14, 16, 17, 19, 20, 22, 24], "higher-better"),
  },
  {
    id: "policies-bound",
    label: "Policies Bound",
    value: String(pipelineKpiTotals.bound),
    sub: "8 binds · Personal 5 · Commercial 1 · Life 2",
    color: "primary",
    polarity: "higher-better",
    weeklyPoints: [3, 4, 4, 5, 6, 7, 8],
    trend: buildKpiTrendFromPoints([3, 4, 4, 5, 6, 7, 8], "higher-better"),
  },
  {
    id: "close-rate",
    label: "Close Rate",
    value: pipelineKpiTotals.closePct,
    sub: "Goal 25% · Blended all lines",
    color: "amber",
    polarity: "higher-better",
    weeklyPoints: [15, 16, 17, 18, 19, 20, 21],
    trend: buildKpiTrendFromPoints([15, 16, 17, 18, 19, 20, 21], "higher-better"),
  },
  {
    id: "households-closed",
    label: "Households Closed",
    value: "6",
    sub: "Target 8 this folio · Bundle + home wins",
    color: "green",
    polarity: "higher-better",
    weeklyPoints: [2, 2, 3, 3, 4, 5, 6],
    trend: buildKpiTrendFromPoints([2, 2, 3, 3, 4, 5, 6], "higher-better"),
  },
  {
    id: "life-applications",
    label: "Life Applications",
    value: "2",
    sub: "Life / FFS pipeline · 1 bound",
    color: "green",
    polarity: "higher-better",
    weeklyPoints: [0, 1, 1, 1, 1, 2, 2],
    trend: buildKpiTrendFromPoints([0, 1, 1, 1, 1, 2, 2], "higher-better"),
  },
];

export const productionTabs = [
  { id: "scorecard", label: "Producer Scorecard" },
  { id: "speed", label: "Speed-to-Lead" },
  { id: "roi", label: "ROI Calculator" },
  { id: "race", label: "Weekly Race" },
  { id: "pipeline", label: "Pipeline KPI" },
];
