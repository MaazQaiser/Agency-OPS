import type { Submission } from "@/types/submission";

export const submissions: Submission[] = [
  { id: "CS-001", client: "Martinez Landscaping", producer: "Eva", va: "JoJo", lob: "BOP", subDate: "2026-04-30", markets: 4, quotes: 1, declines: 2, carrier: "", premium: 8700, followUp: "2026-05-11", daysOpen: 32, status: "Overdue", missingDocs: "Loss runs, Signed app", uw: "M. Torres", notes: "Stalled at Markel: escalate", binding: "" },
  { id: "CS-002", client: "Kim Auto Shop", producer: "Pedro", va: "Tracie", lob: "Comm Auto", subDate: "2026-05-07", markets: 3, quotes: 1, declines: 1, carrier: "Travelers", premium: 5800, followUp: "2026-05-14", daysOpen: 7, status: "Pending", missingDocs: "5yr loss runs", uw: "A. Nguyen", notes: "Final chase today", binding: "" },
  { id: "CS-003", client: "Rivera Construction", producer: "Sarah", va: "Valerie", lob: "WC", subDate: "2026-05-05", markets: 3, quotes: 1, declines: 1, carrier: "ICW", premium: 18900, followUp: "2026-05-14", daysOpen: 9, status: "Pending", missingDocs: "Signed app", uw: "R. Park", notes: "Needs signed app to bind", binding: "" },
  { id: "CS-004", client: "Greenline Logistics", producer: "Eva", va: "JoJo", lob: "BOP", subDate: "2026-05-10", markets: 4, quotes: 2, declines: 1, carrier: "CNA", premium: 14500, followUp: "2026-05-14", daysOpen: 4, status: "Quoted", missingDocs: "None", uw: "J. Kim", notes: "Quote received, pending producer approval", binding: "" },
  { id: "CS-005", client: "Atlas Roofing", producer: "Pedro", va: "Tracie", lob: "GL", subDate: "2026-05-08", markets: 4, quotes: 3, declines: 1, carrier: "Kingsway", premium: 5600, followUp: "2026-05-15", daysOpen: 6, status: "Quoted", missingDocs: "None", uw: "L. Chen", notes: "Best quote from Travelers: presenting to client", binding: "" },
];

export const executiveKpis = [
  { label: "Active Pipeline", value: "5", sub: "open submissions", variant: "primary" as const },
  { label: "Quoted This Week", value: "3", sub: "awaiting decision", variant: "green" as const },
  { label: "Follow-Up Due", value: "3", sub: "today or overdue", variant: "yellow" as const },
  { label: "Overdue (48h+)", value: "1", sub: "stale: needs action", variant: "red" as const },
  { label: "Avg Days Open", value: "8.0", sub: "across open subs", variant: "default" as const },
  { label: "Quote Rate", value: "73%", sub: "markets → quote", variant: "default" as const },
  { label: "Bind Rate", value: "41%", sub: "quoted → bound", variant: "default" as const },
  { label: "Pipeline Premium", value: "$54K", sub: "quoted, unbounded", variant: "primary" as const, small: true },
];

export const chartStatusData = {
  labels: ["Quoted", "Pending", "Overdue", "Declined", "Bound"],
  data: [2, 2, 1, 0, 0],
  colors: ["#10B981", "#F59E0B", "#F43F5E", "#8B5CF6", "#3B82F6"],
  legend: [
    { label: "Quoted 2", color: "#10B981" },
    { label: "Pending 2", color: "#F59E0B" },
    { label: "Overdue 1", color: "#F43F5E" },
  ],
};

export const chartLobData = {
  labels: ["BOP", "GL", "WC", "Comm Auto"],
  data: [2, 1, 1, 1],
};

export const chartAgingData = {
  labels: ["0–2 Days", "3–5 Days", "6–10 Days", "11–14 Days", "15+ Days"],
  data: [1, 1, 2, 1, 0],
  colors: ["#10B981", "#F59E0B", "#F59E0B", "#F43F5E", "#8B5CF6"],
};

export const executiveAlerts = [
  { variant: "red" as const, title: "Overdue: No Update in 48h+", body: "Martinez Landscaping (JoJo · BOP): 3 days no update · Follow-up was May 11 · Markets: 4 submitted, 1 quoted" },
  { variant: "yellow" as const, title: "Follow-Up Due Today", body: "3 submissions have follow-up dates of May 14. Greenline Logistics (JoJo), Kim Auto Shop (Tracie), Rivera Construction (Valerie)" },
  { variant: "blue" as const, title: "Missing Documents", body: "2 submissions have open doc requirements: Kim Auto Shop (Loss runs 5yr), Rivera Construction (Signed app). Cannot bind without these." },
];

export const weeklyProductivity = [
  { name: "JoJo", role: "Broker VA", subsOpened: 2, marketsHit: 8, quotesBack: 3, followUpsDone: 6, binds: 1, docsCollected: "4/5", pace: "On Track", paceVariant: "green" as const },
  { name: "Valerie", role: "Broker VA", subsOpened: 1, marketsHit: 3, quotesBack: 1, followUpsDone: 4, binds: 0, docsCollected: "2/3", pace: "On Track", paceVariant: "green" as const },
  { name: "Tracie", role: "Broker VA", subsOpened: 2, marketsHit: 6, quotesBack: 2, followUpsDone: 5, binds: 1, docsCollected: "3/4", pace: "Watch", paceVariant: "yellow" as const },
];

export const vaLeaderboard = [
  { name: "JoJo", actions: 14, width: "85%" },
  { name: "Tracie", actions: 11, width: "65%", color: "green" },
  { name: "Valerie", actions: 8, width: "50%", color: "yellow" },
];

export const vaKpis = {
  open: 5,
  due: 3,
  overdue: 1,
  quoted: 3,
};

export const agingKpis = [
  { label: "0–2 Days", value: "1", sub: "fresh", variant: "green" as const },
  { label: "3–5 Days", value: "1", sub: "monitor", variant: "yellow" as const },
  { label: "6–10 Days", value: "2", sub: "escalate", variant: "default" as const },
  { label: "11+ Days", value: "1", sub: "critical", variant: "red" as const },
];

export const agingBuckets = [
  {
    header: "Client",
    headerStyle: "",
    rows: [
      { client: "Martinez Landscaping", detail: "BOP · JoJo", days: "14 days", daysColor: "red", va: "JoJo", status: "Overdue", statusVariant: "red" as const, action: "Escalate to Eva", rowClass: "row-red" },
    ],
  },
  {
    header: "Client (6–10 Days)",
    headerStyle: "yellow",
    rows: [
      { client: "Rivera Construction", detail: "WC · Valerie", days: "9 days", daysColor: "yellow", va: "Valerie", status: "Pending", statusVariant: "yellow" as const, action: "Chase UW today", rowClass: "row-yellow" },
      { client: "Kim Auto Shop", detail: "Comm Auto · Tracie", days: "7 days", daysColor: "yellow", va: "Tracie", status: "Pending", statusVariant: "yellow" as const, action: "Need loss runs", rowClass: "row-yellow" },
    ],
  },
];

export const dailyAccountability = [
  { name: "JoJo", subsTouched: 2, marketsHit: 3, followUpsDone: 2, docsCollected: 1, overdueCleared: 0, overdueColor: "default", badge: "Active", badgeVariant: "green" as const },
  { name: "Valerie", subsTouched: 1, marketsHit: 2, followUpsDone: 2, docsCollected: 1, overdueCleared: 0, overdueColor: "default", badge: "Active", badgeVariant: "green" as const },
  { name: "Tracie", subsTouched: 2, marketsHit: 2, followUpsDone: 2, docsCollected: 2, overdueCleared: 0, overdueColor: "yellow", badge: "Watch", badgeVariant: "yellow" as const },
];

export const priorityQueue = [
  { variant: "red" as const, title: "P1: Martinez Landscaping (JoJo)", body: "14 days open · Escalate to Eva if no UW response by 2pm today. BOP quote stalled at Markel." },
  { variant: "yellow" as const, title: "P2: Greenline Logistics (JoJo): Follow-Up Due", body: "BOP renewal: CNA quote received. Pending producer approval. Follow up with client." },
  { variant: "yellow" as const, title: "P2: Kim Auto Shop (Tracie): Missing Loss Runs", body: "5-year loss runs still outstanding. Cannot bind without them. Send final request email to client today." },
];
