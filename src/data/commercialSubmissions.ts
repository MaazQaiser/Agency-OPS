import type { Submission } from "@/types/submission";

export const submissions: Submission[] = [
  { id: "CS-001", client: "Seoul Restaurant Group", producer: "Tracie", va: "Tracie", lob: "BOP", subDate: "2026-05-10", markets: 4, quotes: 2, declines: 1, carrier: "Markel", premium: 12400, followUp: "2026-05-14", daysOpen: 4, status: "Quoted", missingDocs: "Health permit", uw: "J. Kim", notes: "Quote received, need signed app", binding: "" },
  { id: "CS-002", client: "Martinez Landscaping", producer: "Eva", va: "Hamad", lob: "BOP", subDate: "2026-04-30", markets: 4, quotes: 1, declines: 2, carrier: "Kingsway", premium: 8700, followUp: "2026-05-11", daysOpen: 14, status: "Overdue", missingDocs: "None", uw: "M. Torres", notes: "Stalled at Markel — escalate", binding: "" },
  { id: "CS-003", client: "Kim's Auto Shop", producer: "Eva", va: "Hamad", lob: "Comm Auto", subDate: "2026-05-07", markets: 3, quotes: 1, declines: 1, carrier: "Bristol West", premium: 6200, followUp: "2026-05-14", daysOpen: 7, status: "Pending", missingDocs: "5yr loss runs", uw: "A. Nguyen", notes: "Final chase today", binding: "" },
  { id: "CS-004", client: "Pacific Rim Contractors", producer: "Eva", va: "JoJo", lob: "WC", subDate: "2026-05-05", markets: 3, quotes: 1, declines: 1, carrier: "ICW", premium: 18900, followUp: "2026-05-14", daysOpen: 9, status: "Pending", missingDocs: "Signed app", uw: "R. Park", notes: "Needs signed app to bind", binding: "" },
  { id: "CS-005", client: "Pak's Janitorial", producer: "Eva", va: "JoJo", lob: "GL", subDate: "2026-05-12", markets: 2, quotes: 0, declines: 0, carrier: "—", premium: 0, followUp: "2026-05-15", daysOpen: 2, status: "Pending", missingDocs: "None", uw: "—", notes: "Need 3rd market — violation", binding: "" },
  { id: "CS-006", client: "H&J Plumbing LLC", producer: "Eva", va: "Hamad", lob: "Contractors", subDate: "2026-05-13", markets: 3, quotes: 2, declines: 0, carrier: "Employers", premium: 9400, followUp: "2026-05-16", daysOpen: 1, status: "Quoted", missingDocs: "None", uw: "T. Smith", notes: "2 quotes — presenting Friday", binding: "" },
  { id: "CS-007", client: "Greenscape Gardens", producer: "Eva", va: "Hamad", lob: "GL", subDate: "2026-05-08", markets: 4, quotes: 3, declines: 1, carrier: "Travelers", premium: 5600, followUp: "2026-05-15", daysOpen: 6, status: "Quoted", missingDocs: "None", uw: "L. Chen", notes: "Best quote from Travelers", binding: "" },
  { id: "CS-008", client: "Golden Gate Cleaning", producer: "Tracie", va: "Tracie", lob: "BOP", subDate: "2026-05-01", markets: 3, quotes: 0, declines: 3, carrier: "—", premium: 0, followUp: "", daysOpen: 13, status: "Declined", missingDocs: "N/A", uw: "—", notes: "All 3 markets declined. Revisit in 6mo.", binding: "Declined" },
  { id: "CS-009", client: "Bay Area Bistro", producer: "Tracie", va: "Tracie", lob: "BOP", subDate: "2026-04-25", markets: 5, quotes: 3, declines: 1, carrier: "Markel", premium: 14200, followUp: "", daysOpen: 0, status: "Bound", missingDocs: "None", uw: "J. Kim", notes: "Bound with Markel", binding: "Bound — Markel $14,200" },
  { id: "CS-010", client: "ProClean Services", producer: "Eva", va: "JoJo", lob: "GL", subDate: "2026-05-11", markets: 3, quotes: 1, declines: 1, carrier: "Kingsway", premium: 3900, followUp: "2026-05-16", daysOpen: 3, status: "Pending", missingDocs: "W9", uw: "P. Reyes", notes: "One quote back, waiting 2 more", binding: "" },
];

export const executiveKpis = [
  { label: "Active Pipeline", value: "12", sub: "open submissions", variant: "primary" as const },
  { label: "Quoted This Week", value: "7", sub: "awaiting decision", variant: "green" as const },
  { label: "Follow-Up Due", value: "4", sub: "today or overdue", variant: "yellow" as const },
  { label: "Overdue (48h+)", value: "2", sub: "stale — needs action", variant: "red" as const },
  { label: "Avg Days Open", value: "8.3", sub: "across open subs", variant: "default" as const },
  { label: "Quote Rate", value: "73%", sub: "markets → quote", variant: "default" as const },
  { label: "Bind Rate", value: "41%", sub: "quoted → bound", variant: "default" as const },
  { label: "Pipeline Premium", value: "$184K", sub: "quoted, unbounded", variant: "primary" as const, small: true },
];

export const chartStatusData = {
  labels: ["Quoted", "Pending", "Overdue", "Declined", "Bound"],
  data: [3, 4, 2, 1, 1],
  colors: ["#10B981", "#F59E0B", "#F43F5E", "#6C7A89", "#3B82F6"],
  legend: [
    { label: "Quoted 7", color: "#10B981" },
    { label: "Pending 4", color: "#F59E0B" },
    { label: "Overdue 2", color: "#F43F5E" },
    { label: "Declined 3", color: "#6C7A89" },
  ],
};

export const chartLobData = {
  labels: ["BOP", "GL", "WC", "Comm Auto", "Contractors"],
  data: [4, 3, 1, 1, 1],
};

export const chartAgingData = {
  labels: ["0–2 Days", "3–5 Days", "6–10 Days", "11–14 Days", "15+ Days"],
  data: [5, 4, 2, 1, 0],
  colors: ["#10B981", "#F59E0B", "#F59E0B", "#F43F5E", "#6366F1"],
};

export const executiveAlerts = [
  { variant: "red" as const, title: "Overdue — No Update in 48h+", body: "Martinez Landscaping (Hamad · BOP) — 3 days no update · Follow-up was May 11 · Markets: 4 submitted, 1 quoted" },
  { variant: "red" as const, title: "Market Minimum Not Met", body: "Pak's Janitorial (JoJo · GL) — Only 2 markets submitted. Minimum required: 3. Needs immediate action." },
  { variant: "yellow" as const, title: "Follow-Up Due Today", body: "3 submissions have follow-up dates of May 14. Seoul Restaurant Group (Tracie), Kim's Auto Shop (Hamad), Pacific Rim Contractors (JoJo)" },
  { variant: "blue" as const, title: "Missing Documents", body: "2 submissions have open doc requirements: Kim's Auto Shop (Loss runs 5yr), Pacific Rim Contractors (Signed app). Cannot bind without these." },
];

export const weeklyProductivity = [
  { name: "Hamad", role: "Broker VA2", subsOpened: 4, marketsHit: 13, quotesBack: 6, followUpsDone: 9, binds: 2, docsCollected: "7/8", pace: "On Track", paceVariant: "green" as const },
  { name: "JoJo", role: "Broker VA1", subsOpened: 3, marketsHit: 9, quotesBack: 4, followUpsDone: 6, binds: 1, docsCollected: "4/6", pace: "Watch", paceVariant: "yellow" as const },
  { name: "Tracie", role: "Korean Dept", subsOpened: 2, marketsHit: 8, quotesBack: 3, followUpsDone: 5, binds: 1, docsCollected: "3/4", pace: "On Track", paceVariant: "green" as const },
];

export const vaLeaderboard = [
  { name: "Hamad", actions: 17, width: "85%" },
  { name: "Tracie", actions: 13, width: "65%", color: "green" },
  { name: "JoJo", actions: 10, width: "50%", color: "yellow" },
];

export const vaKpis = {
  open: 9,
  due: 3,
  overdue: 1,
  quoted: 5,
};

export const agingKpis = [
  { label: "0–2 Days", value: "5", sub: "fresh", variant: "green" as const },
  { label: "3–5 Days", value: "4", sub: "monitor", variant: "yellow" as const },
  { label: "6–10 Days", value: "2", sub: "escalate", variant: "default" as const },
  { label: "11+ Days", value: "1", sub: "critical", variant: "red" as const },
];

export const agingBuckets = [
  {
    header: "Client",
    headerStyle: "",
    rows: [
      { client: "Martinez Landscaping", detail: "BOP · Hamad", days: "14 days", daysColor: "red", va: "Hamad", status: "Overdue", statusVariant: "red" as const, action: "Escalate to Eva", rowClass: "row-red" },
    ],
  },
  {
    header: "Client (6–10 Days)",
    headerStyle: "yellow",
    rows: [
      { client: "Pacific Rim Contractors", detail: "WC · JoJo", days: "9 days", daysColor: "yellow", va: "JoJo", status: "Pending", statusVariant: "yellow" as const, action: "Chase UW today", rowClass: "row-yellow" },
      { client: "Kim's Auto Shop", detail: "Comm Auto · Hamad", days: "7 days", daysColor: "yellow", va: "Hamad", status: "Pending", statusVariant: "yellow" as const, action: "Need loss runs", rowClass: "row-yellow" },
    ],
  },
];

export const dailyAccountability = [
  { name: "Hamad", subsTouched: 5, marketsHit: 4, followUpsDone: 3, docsCollected: 2, overdueCleared: 0, overdueColor: "red", badge: "Active", badgeVariant: "green" as const },
  { name: "JoJo", subsTouched: 3, marketsHit: 2, followUpsDone: 2, docsCollected: 1, overdueCleared: 0, overdueColor: "default", badge: "Watch", badgeVariant: "yellow" as const },
  { name: "Tracie", subsTouched: 2, marketsHit: 3, followUpsDone: 3, docsCollected: 2, overdueCleared: 1, overdueColor: "green", badge: "Active", badgeVariant: "green" as const },
];

export const priorityQueue = [
  { variant: "red" as const, title: "P1 — Martinez Landscaping (Hamad)", body: "14 days open · Escalate to Eva if no UW response by 2pm today. BOP quote stalled at Markel." },
  { variant: "red" as const, title: "P1 — Pak's Janitorial (JoJo) — Market Minimum Violation", body: "Only 2 of 3 required markets submitted. Must add a 3rd market today. GL — check Kingsway or Employers." },
  { variant: "yellow" as const, title: "P2 — Seoul Restaurant Group (Tracie) — Follow-Up Due", body: "BOP renewal — Markel quote received. Need signed app and health permit copy. Follow up with client." },
  { variant: "yellow" as const, title: "P2 — Kim's Auto Shop (Hamad) — Missing Loss Runs", body: "5-year loss runs still outstanding. Cannot bind without them. Send final request email to client today." },
];
