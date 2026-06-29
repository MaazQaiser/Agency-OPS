import { formatCompactCurrency } from "@/lib/folioProgress";

export type FolioUrgencyIndicator = {
  id: string;
  label: string;
  tone: "amber" | "red" | "slate";
};

export const folioUrgencyIndicators: FolioUrgencyIndicator[] = [
  { id: "approvals", label: "3 approvals overdue", tone: "amber" },
  { id: "binds", label: "2 binds pending", tone: "amber" },
  { id: "revenue", label: "$4.2K revenue at risk", tone: "red" },
  { id: "docs", label: "5 docs blocking bind", tone: "red" },
];

export type FolioDrawerApproval = {
  id: string;
  client: string;
  owner: string;
  overdueDays: number;
};

export type FolioDrawerBind = {
  id: string;
  client: string;
  carrier: string;
  premium: number;
};

export type FolioDrawerBlockedAccount = {
  id: string;
  client: string;
  missing: string;
};

export type FolioDrawerRiskAccount = {
  id: string;
  client: string;
  exposure: string;
  issue: string;
};

export type FolioDrawerTeamLoad = {
  id: string;
  name: string;
  load: string;
  status: "overloaded" | "at-risk" | "on-track";
};

export const folioDrawerApprovals: FolioDrawerApproval[] = [
  { id: "fa-1", client: "Harbor Logistics", owner: "Eva", overdueDays: 1 },
  { id: "fa-2", client: "Martinez Landscaping", owner: "Pedro", overdueDays: 2 },
  { id: "fa-3", client: "Kim Auto Shop", owner: "Tracie", overdueDays: 1 },
];

export const folioDrawerBinds: FolioDrawerBind[] = [
  { id: "fb-1", client: "Rivera Construction", carrier: "CNA", premium: 12_400 },
  { id: "fb-2", client: "Atlas Roofing", carrier: "ICW", premium: 18_900 },
];

export const folioDrawerBlockedDocs: FolioDrawerBlockedAccount[] = [
  { id: "fd-1", client: "Martinez Landscaping", missing: "Loss Runs" },
  { id: "fd-2", client: "Kim Auto Shop", missing: "Driver List" },
  { id: "fd-3", client: "Greenline Logistics", missing: "Signed Application" },
  { id: "fd-4", client: "Rivera Construction", missing: "Payroll Report" },
  { id: "fd-5", client: "Harbor Logistics", missing: "COI Request" },
];

export const folioDrawerRiskAccounts: FolioDrawerRiskAccount[] = [
  { id: "fr-1", client: "Martinez Landscaping", exposure: "Score 6", issue: "Coverage gap — Umbrella" },
  { id: "fr-2", client: "Kim Auto Shop", exposure: "Score 7", issue: "Overdue doc review" },
  { id: "fr-3", client: "Greenline Logistics", exposure: "Score 5", issue: "Overdue payment" },
];

export const folioDrawerTeamLoad: FolioDrawerTeamLoad[] = [
  { id: "ft-1", name: "JoJo", load: "11 open submissions", status: "overloaded" },
  { id: "ft-2", name: "Pedro", load: "8 quote reviews", status: "at-risk" },
  { id: "ft-3", name: "Tracie", load: "6 missing-doc chases", status: "at-risk" },
  { id: "ft-4", name: "Valerie", load: "4 renewals", status: "on-track" },
];

export const folioOperationalMetrics = {
  pendingBinds: folioDrawerBinds.length,
  pendingApprovals: folioDrawerApprovals.length,
  revenueAtRisk: 4_200,
  docsBlockingBind: folioDrawerBlockedDocs.length,
};

export function formatRevenueAtRisk(value: number): string {
  return formatCompactCurrency(value);
}
