import type { KpiItem, Producer } from "@/types";

export const productionHeader = {
  tag: "Agency OS · Producer Performance · Prototype Reference",
  title: "Producer Scorecard",
  titleEmphasis: "Scorecard",
  meta: [
    { label: "Owner", value: "Eva Chong · Insurance Town · California" },
    { label: "Purpose", value: "Visual reference for Hassan — replaces ISL entirely" },
    { label: "Date", value: "May 29, 2026" },
  ],
  patent: "Patent Pending · USPTO #64/053,057",
  confBanner: "⚠ Confidential — Insurance Town — Producer Scorecard Prototype — For Hassan Reference Only",
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
  body: "Each producer card reads from Kyle's Sales_Scorecard Sheets tab. Adding a new producer = Eva adds one Tab 11 row. Dashboard auto-generates a new KPI card. Zero developer involvement per addition. Sarah = Personal Lines + Life only — commercial CPA never appears on her view.",
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
  { line: "Life", lineType: "life" as const, quoted: 3, bound: 1, closeRate: "33%", premium: "—" },
];

export const speedToLead = [
  { name: "Sarah", variant: "green" as const, text: "Last lead: 1 min 12 sec ago · Within 3-min window · RingCentral lead vendor call" },
  { name: "Jazmín", variant: "amber" as const, text: "Last lead: 2 min 48 sec ago · Approaching 3-min limit · Ricochet auto-dial" },
  { name: "Jaffer", variant: "red" as const, text: "Last lead: 7 min 22 sec ago · Past 5-min window · Meta commercial lead" },
  { name: "Eva", variant: "green" as const, text: "Last lead: 45 sec ago · Immediate · Direct line" },
];

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

export const weeklyRace = [
  { initial: "S", name: "Sarah", points: 125, width: "42%", color: "primary" },
  { initial: "J", name: "Jazmín", points: 115, width: "38%", color: "blue" },
  { initial: "P", name: "Pedro", points: 60, width: "20%", color: "purple" },
  { initial: "Z", name: "Zahra", points: 24, width: "8%", color: "green" },
];

export const weeklyRaceRules = "Points: 1pt/dial · 3pts/conversation · 5pts/quote · 10pts/bind · 5pts/Life app. Configured in Kyle's Points Config Sheets tab — Eva edits.";

export const pipelineKpi = [
  { pipeline: "1 New Personal Leads", line: "Personal", lineType: "personal" as const, newLeads: 20, contacted: 11, quoted: 7, bound: 2, contactPct: "55%", closePct: "18%", cpa: "$250" },
  { pipeline: "Home/Auto Bundle", line: "Personal", lineType: "personal" as const, newLeads: 14, contacted: 9, quoted: 6, bound: 3, contactPct: "64%", closePct: "33%", cpa: "$133" },
  { pipeline: "Commercial New", line: "Commercial", lineType: "commercial" as const, newLeads: 24, contacted: 9, quoted: 5, bound: 1, contactPct: "38%", closePct: "14%", cpa: "$350" },
  { pipeline: "Life / FFS", line: "Life", lineType: "life" as const, newLeads: 8, contacted: 6, quoted: 4, bound: 1, contactPct: "75%", closePct: "13%", cpa: "—" },
  { pipeline: "Korean Department", line: "Personal", lineType: "personal" as const, newLeads: 4, contacted: 3, quoted: 2, bound: 1, contactPct: "75%", closePct: "25%", cpa: "—" },
];

export const pipelineKpiTotals = { newLeads: 70, contacted: 38, quoted: 24, bound: 8, contactPct: "54%", closePct: "21%", cpa: "$236" };

export const productionTabs = [
  { id: "scorecard", label: "Producer Scorecard" },
  { id: "speed", label: "Speed-to-Lead" },
  { id: "roi", label: "ROI Calculator" },
  { id: "race", label: "Weekly Race" },
  { id: "pipeline", label: "Pipeline KPI" },
];
