import type { AppNotification } from "@/data/notifications";
import type { GlobalSearchResult } from "@/data/globalSearch";
import {
  CLIENT_TO_INVOICE_CLIENT_ID,
  CLIENT_TO_PAYMENT_ID,
  CLIENT_TO_PROPOSAL_ID,
  CLIENT_TO_SUBMISSION_ID,
  LEAD_NAME_TO_DNC_ID,
  LEAD_NAME_TO_SUBMISSION_ID,
  LEGACY_ID_ALIASES,
  resolveCanonicalId,
  resolveLeadDncId,
} from "@/data/demoEntities";
import { routes } from "@/lib/routes";

export const HANDOFF_STORAGE_KEY = "agency-ops-cross-module-handoff";

export type HandoffType =
  | "quote-to-draft"
  | "revise-proposal"
  | "intake-to-submission"
  | "proposal-to-invoice"
  | "carrier-to-followup"
  | "carrier-rules-to-checklist";

export type CrossModuleHandoff = {
  type: HandoffType;
  sourcePath: string;
  returnLabel?: string;
  payload: Record<string, string | undefined>;
};

export type ReturnContext = {
  href: string;
  label: string;
};

export {
  CLIENT_TO_PROPOSAL_ID,
  CLIENT_TO_SUBMISSION_ID,
  CLIENT_TO_INVOICE_CLIENT_ID,
  CLIENT_TO_PAYMENT_ID,
  LEAD_NAME_TO_SUBMISSION_ID,
  LEAD_NAME_TO_DNC_ID,
};

export const USER_SEARCH_TO_PROFILE: Record<string, string> = {
  "Pedro Ramirez": "pedro-alvarez",
  "JoJo Martinez": "jojo-martinez",
  Pedro: "pedro-alvarez",
  JoJo: "jojo-martinez",
  Eva: "eva-chong",
  Sarah: "sarah-chen",
  Valerie: "valerie-martinez",
  Tracie: "tracie-wong",
};

function withParams(base: string, params?: Record<string, string | undefined>): string {
  if (!params) return base;
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== "") as [string, string][];
  if (entries.length === 0) return base;
  const qs = new URLSearchParams(entries).toString();
  return `${base}${base.includes("?") ? "&" : "?"}${qs}`;
}

export function appendReturnContext(href: string, returnTo?: ReturnContext): string {
  if (!returnTo) return href;
  return withParams(href, {
    returnTo: encodeURIComponent(returnTo.href),
    returnLabel: returnTo.label,
  });
}

export function parseReturnContext(searchParams: URLSearchParams | { get: (k: string) => string | null }): ReturnContext | null {
  const raw = searchParams.get("returnTo");
  const label = searchParams.get("returnLabel");
  if (!raw || !label) return null;
  try {
    return { href: decodeURIComponent(raw), label };
  } catch {
    return { href: raw, label };
  }
}

export function saveHandoff(handoff: CrossModuleHandoff): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(HANDOFF_STORAGE_KEY, JSON.stringify(handoff));
  } catch {
    /* ignore */
  }
}

export function loadHandoff(expectedType?: HandoffType): CrossModuleHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(HANDOFF_STORAGE_KEY);
    if (!raw) return null;
    const handoff = JSON.parse(raw) as CrossModuleHandoff;
    if (expectedType && handoff.type !== expectedType) return null;
    return handoff;
  } catch {
    return null;
  }
}

export function clearHandoff(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(HANDOFF_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function resolveProposalId(client: string): string | undefined {
  return CLIENT_TO_PROPOSAL_ID[client] ?? CLIENT_TO_PROPOSAL_ID[client.replace(/'/g, "'")];
}

export function resolveSubmissionId(client: string): string | undefined {
  return CLIENT_TO_SUBMISSION_ID[client];
}

export function resolvePaymentId(client: string): string | undefined {
  return CLIENT_TO_PAYMENT_ID[client];
}

export function resolveInvoiceClientId(client: string): string | undefined {
  return CLIENT_TO_INVOICE_CLIENT_ID[client];
}

export function resolveUserProfileId(name: string): string | undefined {
  return USER_SEARCH_TO_PROFILE[name];
}

export const crossModuleRoutes = {
  commercialHub: (view: string, params?: Record<string, string | undefined>, returnTo?: ReturnContext) =>
    appendReturnContext(withParams(`${routes.commercialHub}?view=${view}`, params), returnTo),

  sendCenterDraftQueue: (params?: Record<string, string | undefined>, returnTo?: ReturnContext) =>
    appendReturnContext(withParams(routes.sendCenter, { handoff: params?.handoff, ...params }), returnTo),

  sendCenterPendingReview: (returnTo?: ReturnContext) =>
    appendReturnContext(`${routes.sendCenter}?view=pending-review`, returnTo),

  sendCenterProposal: (proposalId: string, from = "draft-queue", returnTo?: ReturnContext) =>
    appendReturnContext(`${routes.sendCenterProposal(resolveCanonicalId(proposalId))}?from=${from}`, returnTo),

  epayInvoiceBuilder: (params?: Record<string, string | undefined>, returnTo?: ReturnContext) =>
    appendReturnContext(withParams(`${routes.epayPolicy}?view=builder`, params), returnTo),

  epayPaymentTracker: (paymentId?: string, returnTo?: ReturnContext) =>
    appendReturnContext(
      withParams(`${routes.epayPolicy}?view=tracker`, paymentId ? { payment: resolveCanonicalId(paymentId) } : undefined),
      returnTo,
    ),

  intakeDrafts: (draftId?: string, returnTo?: ReturnContext) =>
    appendReturnContext(
      withParams(`${routes.intakeForms}?view=drafts`, draftId ? { draft: draftId } : undefined),
      returnTo,
    ),

  intakeHistory: (returnTo?: ReturnContext) =>
    appendReturnContext(`${routes.intakeForms}?view=history`, returnTo),

  vaOpsDncLog: (dncId?: string, returnTo?: ReturnContext) =>
    appendReturnContext(
      withParams(`${routes.vaOperations}?view=dnc-log`, dncId ? { dnc: resolveCanonicalId(dncId) } : undefined),
      returnTo,
    ),

  trainingDetail: (resourceId: string, returnTo?: ReturnContext) =>
    appendReturnContext(`${routes.trainingHub}?view=detail&resource=${resourceId}`, returnTo),

  systemHealth: (returnTo?: ReturnContext) => appendReturnContext(routes.systemHealth, returnTo),

  carrierFollowUp: (params?: Record<string, string | undefined>, returnTo?: ReturnContext) =>
    crossModuleRoutes.commercialHub("follow-ups", params, returnTo),

  coverageChecklist: (params?: Record<string, string | undefined>, returnTo?: ReturnContext) =>
    crossModuleRoutes.commercialHub("checklist", params, returnTo),

  submissionTracker: (submissionId?: string, returnTo?: ReturnContext) =>
    crossModuleRoutes.commercialHub(
      "submissions",
      submissionId ? { submission: resolveCanonicalId(submissionId) } : undefined,
      returnTo,
    ),

  readyToBind: (returnTo?: ReturnContext) => crossModuleRoutes.commercialHub("ready-to-bind", undefined, returnTo),

  submissionClock: (returnTo?: ReturnContext) =>
    crossModuleRoutes.commercialHub("submission-clock", undefined, returnTo),

  missingDocs: (returnTo?: ReturnContext) => crossModuleRoutes.commercialHub("missing-docs", undefined, returnTo),

  quoteReview: (returnTo?: ReturnContext) => crossModuleRoutes.commercialHub("quote-review", undefined, returnTo),

  recentActivity: (returnTo?: ReturnContext) =>
    appendReturnContext(`${routes.vaOperations}?view=activity`, returnTo),
};

export function resolveDncId(leadName: string): string | undefined {
  return resolveLeadDncId(leadName) ?? LEGACY_ID_ALIASES[leadName];
}

export function navigateWithHandoff(
  router: { push: (href: string, opts?: { scroll?: boolean }) => void },
  targetHref: string,
  handoff: CrossModuleHandoff,
  returnTo?: ReturnContext,
): void {
  saveHandoff(handoff);
  const url = appendReturnContext(withParams(targetHref, { handoff: handoff.type }), returnTo);
  router.push(url, { scroll: false });
}

export function getNotificationRoute(notification: AppNotification): string {
  const map: Record<string, string> = {
    "n-urg-1": crossModuleRoutes.submissionTracker("trk-martinez"),
    "n-urg-2": crossModuleRoutes.missingDocs(),
    "n-urg-3": crossModuleRoutes.sendCenterPendingReview(),
    "n-urg-4": crossModuleRoutes.carrierFollowUp(),
    "n-apr-1": `${routes.sendCenter}?view=pending-review`,
    "n-apr-2": crossModuleRoutes.quoteReview(),
    "n-apr-3": crossModuleRoutes.epayPaymentTracker("pay-martinez"),
    "n-pay-1": crossModuleRoutes.epayPaymentTracker("pay-greenline"),
    "n-pay-2": crossModuleRoutes.epayPaymentTracker("pay-kim"),
    "n-pay-3": crossModuleRoutes.epayPaymentTracker("pay-rivera"),
    "n-pay-4": crossModuleRoutes.epayPaymentTracker("pay-atlas"),
    "n-trn-1": crossModuleRoutes.trainingDetail("lib-compliance"),
    "n-trn-2": crossModuleRoutes.trainingDetail("lib-compliance"),
    "n-trn-3": crossModuleRoutes.trainingDetail("lib-carrier-sop"),
    "n-trn-4": crossModuleRoutes.trainingDetail("lib-carrier-sop"),
    "n-sys-1": crossModuleRoutes.systemHealth(),
    "n-sys-2": crossModuleRoutes.systemHealth(),
    "n-sys-3": crossModuleRoutes.systemHealth(),
    "n-sys-4": crossModuleRoutes.systemHealth(),
  };
  return map[notification.id] ?? notification.moduleRoute;
}

export type SearchNavigation =
  | { kind: "route"; href: string }
  | { kind: "profile"; userId: string }
  | { kind: "submission"; submissionId: string; client?: string };

export function resolveSearchNavigation(result: GlobalSearchResult): SearchNavigation {
  if (result.type === "user") {
    const userId = resolveUserProfileId(result.title);
    if (userId) return { kind: "profile", userId };
  }

  if (result.type === "submission") {
    const clientName = result.title.split(": ")[0] ?? result.title;
    const submissionId = resolveSubmissionId(clientName);
    if (submissionId) {
      return { kind: "submission", submissionId, client: clientName };
    }
  }

  if (result.type === "client") {
    const submissionId = resolveSubmissionId(result.title);
    if (submissionId) {
      return { kind: "route", href: crossModuleRoutes.submissionTracker(submissionId) };
    }
  }

  if (result.type === "invoice") {
    const clientFromDetail = result.drawer.details[0]?.value ?? "";
    const paymentId =
      result.id === "sr-inv-greenline"
        ? "pay-greenline"
        : resolvePaymentId(clientFromDetail);
    return { kind: "route", href: crossModuleRoutes.epayPaymentTracker(paymentId ?? undefined) };
  }

  if (result.id.startsWith("sr-") && result.title.includes("Proposal")) {
    const proposalId = resolveProposalId(result.title.split(": ")[0] ?? "");
    if (proposalId) {
      return { kind: "route", href: crossModuleRoutes.sendCenterProposal(proposalId, "sent") };
    }
  }

  return { kind: "route", href: result.href };
}

export function fixSearchResultHref(result: GlobalSearchResult): string {
  const nav = resolveSearchNavigation(result);
  if (nav.kind === "route") return nav.href;
  if (nav.kind === "submission") return crossModuleRoutes.submissionTracker(nav.submissionId);
  if (nav.kind === "profile") return withParams(routes.vaOperations, { openProfile: nav.userId });
  return result.href;
}
