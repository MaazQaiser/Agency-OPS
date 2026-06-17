import {
  executiveAlerts,
  executiveKpis,
  weeklyProductivity,
} from "@/data/commercialSubmissions";
import { producers, sarahKpis, speedToLead } from "@/data/producerScorecard";
import { combinedExecutiveTable } from "@/data/retentionScorecard";

export const dashboardHeader = {
  tag: "Agency OS · Executive Command Center",
  title: "Unified Dashboard — Agency Overview",
  titleEmphasis: "Dashboard",
  meta: [
    { label: "Owner", value: "Eva Chong · Insurance Town · California" },
    { label: "Scope", value: "Production · Retention · Commercial · Prime Agency" },
    { label: "Updated", value: "May 29, 2026" },
  ],
  patent: "Patent Pending · USPTO #64/053,057",
};

export const dashboardExecutiveKpis = [
  {
    label: "Premium Written",
    value: sarahKpis[0].value,
    sub: sarahKpis[0].sub,
    variant: "primary" as const,
    module: "Producer",
  },
  {
    label: "Combined Retention %",
    value: combinedExecutiveTable[0].combined,
    sub: combinedExecutiveTable[0].goal,
    variant: "green" as const,
    module: "Retention",
  },
  {
    label: "Cross-Sell Points",
    value: combinedExecutiveTable[3].combined,
    sub: combinedExecutiveTable[3].goal,
    variant: "primary" as const,
    module: "Retention",
  },
  {
    label: "Active Pipeline",
    value: executiveKpis[0].value,
    sub: executiveKpis[0].sub,
    variant: "primary" as const,
    module: "Commercial",
  },
  {
    label: "Follow-Up Due",
    value: executiveKpis[2].value,
    sub: executiveKpis[2].sub,
    variant: "yellow" as const,
    module: "Commercial",
  },
  {
    label: "Overdue (48h+)",
    value: executiveKpis[3].value,
    sub: executiveKpis[3].sub,
    variant: "red" as const,
    module: "Commercial",
  },
  {
    label: "Cancellation Saves",
    value: combinedExecutiveTable[2].combined,
    sub: combinedExecutiveTable[2].goal,
    variant: "blue" as const,
    module: "Retention",
  },
  {
    label: "Pipeline Premium",
    value: executiveKpis[7].value,
    sub: executiveKpis[7].sub,
    variant: "primary" as const,
    module: "Commercial",
  },
];

export const dashboardAlerts = [
  ...executiveAlerts.map((a) => ({ ...a, source: "Commercial" as const })),
  {
    variant: "red" as const,
    title: "Speed-to-Lead — Past Window",
    body: speedToLead.find((s) => s.variant === "red")?.text ?? "",
    source: "Producer" as const,
  },
  {
    variant: "yellow" as const,
    title: "Speed-to-Lead — Approaching Limit",
    body: speedToLead.find((s) => s.variant === "amber")?.text ?? "",
    source: "Producer" as const,
  },
];

export const dashboardTeamSnapshots = {
  production: producers.map((p) => ({
    name: p.name,
    role: p.role,
    metric: p.score,
  })),
  retention: [
    { name: "Valerie", role: "English Retention", metric: "94.2% retention" },
    { name: "Tracie", role: "Korean Retention", metric: "91.8% retention" },
  ],
  commercial: weeklyProductivity.map((v) => ({
    name: v.name,
    role: v.role,
    metric: `${v.subsOpened} subs · ${v.pace}`,
    paceVariant: v.paceVariant,
  })),
};

export const dashboardMetricHighlights = [
  { label: "Close Rate (Sarah)", value: sarahKpis[1].value, goal: sarahKpis[1].sub },
  { label: "PIF Combined", value: combinedExecutiveTable[1].combined, goal: combinedExecutiveTable[1].goal },
  { label: "Quote Rate", value: executiveKpis[5].value, goal: executiveKpis[5].sub },
  { label: "Bind Rate", value: executiveKpis[6].value, goal: executiveKpis[6].sub },
];
