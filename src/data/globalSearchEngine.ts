import type { AppIconName } from "@/components/ui/AppIcon";
import { routes } from "@/lib/routes";
import {
  searchResults,
  findSearchResultById,
  type GlobalSearchFilterState,
  type GlobalSearchResult,
  type SearchResultType,
} from "./globalSearch";

export type SearchCategory =
  | "all"
  | "clients"
  | "submissions"
  | "carriers"
  | "invoices"
  | "training"
  | "documents"
  | "users";

export const searchCategories: { id: SearchCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "clients", label: "Clients" },
  { id: "submissions", label: "Submissions" },
  { id: "carriers", label: "Carriers" },
  { id: "invoices", label: "Invoices" },
  { id: "training", label: "Training" },
  { id: "documents", label: "Documents" },
  { id: "users", label: "Users" },
];

export type QuickAction = {
  id: string;
  label: string;
  href: string;
  icon: AppIconName;
  keywords: string[];
};

export const quickActions: QuickAction[] = [
  { id: "open-commercial", label: "Open Commercial Hub", href: routes.commercialHub, icon: "bar-chart", keywords: ["commercial", "hub", "pipeline", "submissions"] },
  { id: "open-send", label: "Open Send Center", href: routes.sendCenter, icon: "send", keywords: ["send", "proposal", "draft"] },
  { id: "open-retention", label: "Open Retention", href: routes.retention, icon: "users", keywords: ["retention", "renewal", "churn"] },
  { id: "open-va-ops", label: "Open VA Operations", href: routes.vaOperations, icon: "users", keywords: ["va", "operations", "tasks"] },
  { id: "review-approvals", label: "Review Pending Approvals", href: `${routes.vaOperations}?view=approvals`, icon: "shield", keywords: ["approve", "approval", "pending", "review"] },
  { id: "high-risk", label: "Show High Risk Submissions", href: `${routes.commercialHub}?view=executive`, icon: "triangle-alert", keywords: ["e&o", "exposure", "risk", "critical", "high risk"] },
  { id: "create-note", label: "Create AZ Note", href: `${routes.commercialHub}?view=submissions`, icon: "file-text", keywords: ["create", "note", "az", "internal"] },
  { id: "ping-pedro", label: "Ping Pedro", href: `${routes.vaOperations}?view=activity`, icon: "bell", keywords: ["ping", "pedro", "notify", "va"] },
  { id: "flag-followup", label: "Flag Follow-Up", href: `${routes.commercialHub}?view=follow-ups`, icon: "flag", keywords: ["flag", "follow", "follow-up", "urgent"] },
  { id: "new-submission", label: "New Submission", href: `${routes.intakeForms}?view=new-submission`, icon: "plus", keywords: ["intake", "form", "submit", "create"] },
  { id: "new-invoice", label: "New Invoice", href: `${routes.epayPolicy}?view=builder`, icon: "dollar", keywords: ["invoice", "payment", "epay", "new"] },
  { id: "add-carrier", label: "Add Carrier", href: routes.carrierLibrary, icon: "shield", keywords: ["carrier", "market"] },
  { id: "upload-training", label: "Upload Training", href: routes.trainingHub, icon: "upload", keywords: ["training", "resource"] },
  { id: "review-quotes", label: "Review Quotes", href: `${routes.commercialHub}?view=quote-review`, icon: "clipboard", keywords: ["quote", "review"] },
  { id: "missing-docs", label: "Open Missing Docs", href: `${routes.commercialHub}?view=missing-docs`, icon: "folder", keywords: ["documents", "missing"] },
  { id: "reconcile", label: "Reconcile Funds", href: `${routes.epayPolicy}?view=trust`, icon: "check", keywords: ["trust", "reconcile"] },
  { id: "pending-binds", label: "View Pending Binds", href: `${routes.commercialHub}?view=ready-to-bind`, icon: "check", keywords: ["bind", "pending"] },
];

export type CommandAlert = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  level: "critical" | "warning";
};

export const commandCriticalAlerts: CommandAlert[] = [
  {
    id: "alert-eo",
    title: "E&O exposure critical",
    subtitle: "Martinez Landscaping · score 6",
    href: `${routes.commercialHub}?view=executive`,
    level: "critical",
  },
  {
    id: "alert-approval",
    title: "Approval missed",
    subtitle: "Harbor Logistics GL + Umbrella",
    href: routes.commercialHub,
    level: "critical",
  },
  {
    id: "alert-folio",
    title: "Folio nearing close",
    subtitle: "61% pace · 7 days left",
    href: routes.vaOperations,
    level: "warning",
  },
];

export const suggestedRecords: { id: string; resultId: string }[] = [
  { id: "sug-1", resultId: "sr-martinez-client" },
  { id: "sug-2", resultId: "sr-user-pedro" },
  { id: "sug-3", resultId: "sr-markel-carrier" },
  { id: "sug-4", resultId: "sr-martinez-proposal" },
];

export type AiInsight = {
  id: string;
  summary: string;
  links: { label: string; href: string }[];
  action?: { label: string; href: string };
};

const categoryTypeMap: Record<SearchCategory, SearchResultType[] | null> = {
  all: null,
  clients: ["client"],
  submissions: ["submission"],
  carriers: ["carrier"],
  invoices: ["invoice"],
  training: ["training"],
  documents: ["document"],
  users: ["user"],
};

function tokenize(query: string) {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreResult(result: GlobalSearchResult, tokens: string[]): number {
  if (tokens.length === 0) return 1;
  const haystack = [
    result.title,
    result.group,
    result.hub,
    result.status,
    result.owner ?? "",
    result.lastUpdated,
    ...result.fields.flatMap((f) => [f.label, f.value]),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (result.title.toLowerCase().includes(token)) score += 10;
    if (result.title.toLowerCase().startsWith(token)) score += 5;
    if (haystack.includes(token)) score += 3;
    // fuzzy partial
    if (token.length >= 3 && haystack.split(/\s+/).some((word) => word.startsWith(token))) score += 2;
  }
  return score;
}

export function searchGlobalResults(
  query: string,
  filters: GlobalSearchFilterState,
  category: SearchCategory = "all",
): GlobalSearchResult[] {
  const tokens = tokenize(query);
  const types = categoryTypeMap[category];

  return searchResults
    .filter((result) => {
      if (types && !types.includes(result.type)) return false;
      return matchesGlobalSearchEnhanced(result, query, filters);
    })
    .map((result) => ({ result, score: scoreResult(result, tokens) }))
    .filter(({ score }) => score > 0 || tokens.length === 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result);
}

export function groupResultsByCategory(results: GlobalSearchResult[], limitPerGroup = 3) {
  const groups: Record<string, GlobalSearchResult[]> = {};
  for (const result of results) {
    const key = result.group;
    if (!groups[key]) groups[key] = [];
    if (groups[key].length < limitPerGroup) groups[key].push(result);
  }
  return groups;
}

/** Group search hits by originating hub for the command palette. */
export function groupResultsByHub(results: GlobalSearchResult[], limitPerHub = 5) {
  const groups: Record<string, GlobalSearchResult[]> = {};
  for (const result of results) {
    const key = result.hub;
    if (!groups[key]) groups[key] = [];
    if (groups[key].length < limitPerHub) groups[key].push(result);
  }
  return groups;
}

export function matchesGlobalSearchEnhanced(
  result: GlobalSearchResult,
  query: string,
  filters: GlobalSearchFilterState,
): boolean {
  const tokens = tokenize(query);
  if (tokens.length > 0) {
    const haystack = [
      result.title,
      result.group,
      result.hub,
      result.status,
      result.owner ?? "",
      ...result.fields.map((f) => `${f.label} ${f.value}`),
    ]
      .join(" ")
      .toLowerCase();
    const matched = tokens.every(
      (token) =>
        haystack.includes(token) ||
        haystack.split(/\s+/).some((word) => word.startsWith(token)),
    );
    if (!matched) return false;
  }

  if (filters.hubType !== "All Modules" && result.hub !== filters.hubType) return false;

  const assignedField = result.fields.find((f) => f.label === "Assigned" || f.label === "Owner");
  if (filters.assignedTo !== "All Assignees" && assignedField && assignedField.value !== filters.assignedTo) {
    return false;
  }

  if (filters.client !== "All Clients") {
    const clientMatch =
      result.title === filters.client ||
      result.fields.some((f) => f.value === filters.client);
    if (!clientMatch) return false;
  }

  const carrierField = result.fields.find((f) => f.label === "Carrier");
  if (filters.carrier !== "All Carriers" && carrierField && !carrierField.value.includes(filters.carrier)) {
    return false;
  }

  if (filters.status !== "All Statuses" && !result.status.toLowerCase().includes(filters.status.toLowerCase())) {
    return false;
  }

  if (filters.coverageType !== "All Coverage" && result.type === "submission") {
    const cov = result.fields.find((f) => f.label === "Coverage");
    if (cov && !cov.value.includes(filters.coverageType)) return false;
  }

  if (filters.priority !== "All Priorities") {
    const pri = result.fields.find((f) => f.label === "Priority");
    if (pri && pri.value !== filters.priority) return false;
  }

  return true;
}

export function resolveAiInsight(query: string): AiInsight | null {
  const q = query.trim().toLowerCase();
  if (q.length < 8) return null;

  if (q.includes("overdue invoice")) {
    return {
      id: "ai-overdue",
      summary: "3 invoices are overdue totaling $14,250. Greenline Logistics is highest priority.",
      links: [
        { label: "Payment Tracker", href: `${routes.epayPolicy}?view=tracker` },
        { label: "INV-2042", href: `${routes.epayPolicy}?view=tracker` },
      ],
      action: { label: "Send Reminders", href: `${routes.epayPolicy}?view=tracker` },
    };
  }

  if (q.includes("missing loss run") || q.includes("loss runs")) {
    return {
      id: "ai-loss-runs",
      summary: "2 submissions are blocked due to missing loss runs — Kim Auto Shop and Martinez Landscaping.",
      links: [
        { label: "Missing Docs Queue", href: `${routes.commercialHub}?view=missing-docs` },
        { label: "Submission Tracker", href: `${routes.commercialHub}?view=submissions` },
      ],
      action: { label: "Request Documents", href: `${routes.commercialHub}?view=missing-docs` },
    };
  }

  if (q.includes("contractor") && q.includes("california")) {
    return {
      id: "ai-contractor-ca",
      summary: "Markel, Travelers, and CNA accept contractor risks in California for BOP and Workers Comp.",
      links: [
        { label: "Markel Profile", href: `${routes.carrierLibrary}?view=profile&carrier=car-markel-bop&from=search` },
        { label: "Carrier Search", href: routes.carrierLibrary },
      ],
      action: { label: "View Markets", href: routes.carrierLibrary },
    };
  }

  if (q.includes("bind") && q.includes("producer")) {
    return {
      id: "ai-bind-producer",
      summary: "2 binds are pending producer review — Martinez Landscaping and Rivera Construction.",
      links: [
        { label: "Ready to Bind", href: `${routes.commercialHub}?view=ready-to-bind` },
        { label: "Quote Review", href: `${routes.commercialHub}?view=quotes` },
      ],
      action: { label: "Review Binds", href: `${routes.commercialHub}?view=ready-to-bind` },
    };
  }

  if (q.includes("korean")) {
    return {
      id: "ai-korean",
      summary: "Greenline Logistics is tagged Korean-speaking. Producer Eva is assigned.",
      links: [
        { label: "Open Client", href: `${routes.commercialHub}?view=submissions` },
        { label: "Outreach Queue", href: `${routes.commercialHub}?view=outreach` },
      ],
    };
  }

  if (q.includes("payroll report")) {
    return {
      id: "ai-payroll",
      summary: "3 submissions are blocked due to missing payroll reports.",
      links: [
        { label: "Missing Docs", href: `${routes.commercialHub}?view=missing-docs` },
      ],
      action: { label: "Follow Up", href: `${routes.commercialHub}?view=missing-docs` },
    };
  }

  return null;
}

export function highlightMatch(text: string, query: string): { text: string; match: boolean }[] {
  const trimmed = query.trim();
  if (!trimmed) return [{ text, match: false }];
  const lower = text.toLowerCase();
  const token = trimmed.toLowerCase();
  const index = lower.indexOf(token);
  if (index === -1) return [{ text, match: false }];
  return [
    { text: text.slice(0, index), match: false },
    { text: text.slice(index, index + token.length), match: true },
    { text: text.slice(index + token.length), match: false },
  ].filter((part) => part.text.length > 0);
}

export function filterQuickActions(query: string): QuickAction[] {
  const q = query.trim().toLowerCase();
  if (!q) return quickActions;
  return quickActions.filter(
    (action) =>
      action.label.toLowerCase().includes(q) ||
      action.keywords.some((kw) => kw.includes(q) || q.includes(kw) || q.split(/\s+/).every((t) => kw.includes(t) || action.label.toLowerCase().includes(t))),
  );
}

/** @deprecated Prefer filterPaletteActions from commandPalette.ts */
export { filterPaletteActions as filterCommandPaletteActions } from "./commandPalette";

export function getSuggestedSearchResults(): GlobalSearchResult[] {
  return suggestedRecords
    .map((s) => findSearchResultById(s.resultId))
    .filter((r): r is GlobalSearchResult => Boolean(r));
}
