import { commercialHubTabs } from "@/data/commercialHub";
import { findCarrierById } from "@/data/carrierLibrary";
import { getCarrierProfile } from "@/data/carrierProfile";
import { checklistClients } from "@/data/coverageChecklist";
import { intakeFormsTabs } from "@/data/intakeForms";
import { epayPolicyTabs } from "@/data/epayPolicy";
import { findPaymentById } from "@/data/paymentTracker";
import { getProposalDetail, sourceTabLabels } from "@/data/sendCenterProposals";
import { sendCenterTabs } from "@/data/sendCenter";
import { getTrackerSubmission } from "@/data/commercialHubStore";
import { seedDncRecords } from "@/data/dncLog";
import { getTrainingDetail } from "@/data/trainingDetail";
import { trainingHubTabs } from "@/data/trainingHub";
import { carrierLibraryTabs } from "@/data/carrierLibrary";
import { vaOperationsTabs } from "@/data/vaOperations";
import { seedLeadVelocityRecords } from "@/data/leadVelocity";
import { trustLedgerEntries } from "@/data/trustReference";
import { parseReturnContext } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const DETAIL_PARAMS = [
  "detail",
  "client",
  "submission",
  "lead",
  "payment",
  "trust",
  "dnc",
  "task",
  "approval",
  "workflow",
  "draft",
  "history",
  "template",
  "error",
  "entity",
  "resource",
  "carrier",
  "product",
  "step",
  "invoice",
  "proposal",
  "system",
  "notification",
  "result",
] as const;

const PRESERVE_PARAMS = [
  "view",
  "role",
  "dept",
  "form",
  "q",
  "from",
  "handoff",
  "returnTo",
  "returnLabel",
  "openProfile",
  "ownerAction",
  "tab",
  "product",
] as const;

function tabLabel<T extends { id: string; label: string }>(
  tabs: readonly T[],
  id: string | null,
  fallback: string,
): string {
  if (!id) return fallback;
  return tabs.find((t) => t.id === id)?.label ?? fallback;
}

type BuildHrefOptions = {
  keep?: readonly string[];
  drop?: readonly string[];
  keepExtra?: readonly string[];
};

export function buildHref(
  base: string,
  searchParams: URLSearchParams,
  options?: BuildHrefOptions,
): string {
  const params = new URLSearchParams();
  const keep = new Set([...(options?.keep ?? PRESERVE_PARAMS), ...(options?.keepExtra ?? [])]);
  const drop = new Set(options?.drop ?? []);

  searchParams.forEach((value, key) => {
    if (drop.has(key)) return;
    if (keep.has(key) || key.startsWith("filter.")) {
      params.set(key, value);
    }
  });

  if (base.includes("?")) {
    const [path, existing] = base.split("?");
    const merged = new URLSearchParams(existing);
    params.forEach((v, k) => merged.set(k, v));
    const qs = merged.toString();
    return qs ? `${path}?${qs}` : path;
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function resolveDetailLabel(searchParams: URLSearchParams): string | null {
  const explicit = searchParams.get("detail");
  if (explicit) return explicit;

  const submissionId = searchParams.get("submission");
  if (submissionId) {
    const sub = getTrackerSubmission(submissionId);
    if (sub) return sub.client;
  }

  const clientId = searchParams.get("client");
  if (clientId) {
    const client = checklistClients.find((c) => c.id === clientId);
    if (client) return client.clientName;
  }

  const leadId = searchParams.get("lead");
  if (leadId) {
    const lead = seedLeadVelocityRecords.find((r) => r.id === leadId);
    if (lead) return lead.leadName;
  }

  const paymentId = searchParams.get("payment");
  if (paymentId) {
    const payment = findPaymentById(paymentId);
    if (payment) return payment.invoiceNumber;
  }

  const trustId = searchParams.get("trust");
  if (trustId) {
    const entry = trustLedgerEntries.find((e) => e.id === trustId);
    if (entry) return entry.referenceNumber;
    return trustId;
  }

  const dncId = searchParams.get("dnc");
  if (dncId) {
    const record = seedDncRecords.find((r) => r.id === dncId);
    if (record) return record.leadName;
  }

  const resourceId = searchParams.get("resource");
  if (resourceId) {
    const detail = getTrainingDetail(resourceId);
    if (detail) return detail.resource.title;
  }

  const carrierId = searchParams.get("carrier");
  if (carrierId) {
    const profile = getCarrierProfile(carrierId);
    if (profile) return profile.name;
    const record = findCarrierById(carrierId);
    if (record) return record.name;
  }

  const draftId = searchParams.get("draft");
  if (draftId) return draftId;

  const historyId = searchParams.get("history");
  if (historyId) return historyId;

  const templateId = searchParams.get("template");
  if (templateId) return templateId;

  const taskId = searchParams.get("task");
  if (taskId) return taskId;

  const approvalId = searchParams.get("approval");
  if (approvalId) return approvalId;

  const workflowId = searchParams.get("workflow");
  if (workflowId) return workflowId;

  const errorId = searchParams.get("error");
  if (errorId) return errorId;

  const entityId = searchParams.get("entity") ?? searchParams.get("result");
  if (entityId) return entityId;

  const systemId = searchParams.get("system");
  if (systemId) return systemId;

  const notificationType = searchParams.get("notification");
  if (notificationType) return searchParams.get("entity") ?? notificationType;

  const step = searchParams.get("step");
  if (step) return `Step ${step}`;

  const invoiceClient = searchParams.get("invoice");
  if (invoiceClient) return invoiceClient;

  return null;
}

function sectionHref(
  route: string,
  searchParams: URLSearchParams,
  view: string | null,
  defaultView?: string,
): string {
  const drop = [...DETAIL_PARAMS];
  if (view && view !== defaultView) {
    return buildHref(`${route}?view=${view}`, searchParams, { drop, keepExtra: ["view"] });
  }
  return buildHref(route, searchParams, { drop });
}

function withDetail(
  items: BreadcrumbItem[],
  searchParams: URLSearchParams,
  detailLabel: string | null,
): BreadcrumbItem[] {
  if (!detailLabel) return items;
  return [...items, { label: detailLabel }];
}

export function resolveCommercialHubBreadcrumbs(searchParams: URLSearchParams): BreadcrumbItem[] {
  const view = searchParams.get("view") ?? "executive";
  const section = tabLabel(commercialHubTabs, view, "Executive Dashboard");
  const detail = resolveDetailLabel(searchParams);

  const items: BreadcrumbItem[] = [
    { label: "Commercial Hub", href: buildHref(routes.commercialHub, searchParams, { drop: [...DETAIL_PARAMS, "view"] }) },
    {
      label: section,
      href: sectionHref(routes.commercialHub, searchParams, view === "executive" ? null : view, "executive"),
    },
  ];

  return withDetail(items, searchParams, detail);
}

export function resolveIntakeFormsBreadcrumbs(searchParams: URLSearchParams): BreadcrumbItem[] {
  const view = searchParams.get("view") ?? "selector";
  const section = tabLabel(intakeFormsTabs, view, "Form Selector");
  const detail = resolveDetailLabel(searchParams);

  const items: BreadcrumbItem[] = [
    { label: "Intake Forms", href: buildHref(routes.intakeForms, searchParams, { drop: [...DETAIL_PARAMS, "view", "form", "step"] }) },
    {
      label: section,
      href: sectionHref(routes.intakeForms, searchParams, view === "selector" ? null : view, "selector"),
    },
  ];

  return withDetail(items, searchParams, detail);
}

export function resolveTrainingHubBreadcrumbs(searchParams: URLSearchParams): BreadcrumbItem[] {
  const view = searchParams.get("view");
  const dept = searchParams.get("dept");

  if (view === "detail") {
    const detail = resolveDetailLabel(searchParams) ?? "Training";
    const libraryHref = buildHref(
      `${routes.trainingHub}?view=library${dept ? `&dept=${dept}` : ""}`,
      searchParams,
      { drop: DETAIL_PARAMS },
    );
    return [
      { label: "Training Hub", href: buildHref(routes.trainingHub, searchParams, { drop: DETAIL_PARAMS }) },
      { label: "Training Library", href: libraryHref },
      { label: detail },
    ];
  }

  if (view === "library" && dept) {
    return [
      { label: "Training Hub", href: buildHref(routes.trainingHub, searchParams, { drop: [...DETAIL_PARAMS, "dept"] }) },
      { label: "Training Library", href: sectionHref(routes.trainingHub, searchParams, "library") },
      { label: dept },
    ];
  }

  const section = tabLabel(trainingHubTabs, view, "Department Overview");
  const detail = resolveDetailLabel(searchParams);

  const items: BreadcrumbItem[] = [
    { label: "Training Hub", href: buildHref(routes.trainingHub, searchParams, { drop: [...DETAIL_PARAMS, "view", "dept"] }) },
    {
      label: section,
      href: sectionHref(routes.trainingHub, searchParams, view === "departments" || !view ? null : view, "departments"),
    },
  ];

  return withDetail(items, searchParams, detail);
}

export function resolveCarrierLibraryBreadcrumbs(searchParams: URLSearchParams): BreadcrumbItem[] {
  const view = searchParams.get("view");

  if (view === "profile") {
    const detail = resolveDetailLabel(searchParams) ?? "Carrier";
    return [
      { label: "Carrier Library", href: buildHref(routes.carrierLibrary, searchParams, { drop: DETAIL_PARAMS }) },
      { label: "Carrier Search", href: buildHref(routes.carrierLibrary, searchParams, { drop: DETAIL_PARAMS }) },
      { label: detail },
    ];
  }

  const section = tabLabel(carrierLibraryTabs, view === "checklist" ? "rules" : view, "Carrier Search");
  const product = searchParams.get("product");
  const detail = product ?? resolveDetailLabel(searchParams);

  const items: BreadcrumbItem[] = [
    { label: "Carrier Library", href: buildHref(routes.carrierLibrary, searchParams, { drop: [...DETAIL_PARAMS, "view"] }) },
    {
      label: section,
      href: sectionHref(routes.carrierLibrary, searchParams, view === "search" || !view ? null : view === "checklist" ? "rules" : view, "search"),
    },
  ];

  return withDetail(items, searchParams, detail);
}

export function resolveEpayPolicyBreadcrumbs(searchParams: URLSearchParams): BreadcrumbItem[] {
  const view = searchParams.get("view") ?? "builder";
  const section = tabLabel(epayPolicyTabs, view, "Invoice Builder");
  const detail = resolveDetailLabel(searchParams);

  const items: BreadcrumbItem[] = [
    { label: "ePayPolicy", href: buildHref(routes.epayPolicy, searchParams, { drop: [...DETAIL_PARAMS, "view"] }) },
    {
      label: section,
      href: sectionHref(routes.epayPolicy, searchParams, view === "builder" ? null : view, "builder"),
    },
  ];

  return withDetail(items, searchParams, detail);
}

export function resolveSendCenterBreadcrumbs(
  searchParams: URLSearchParams,
  proposalId?: string,
): BreadcrumbItem[] {
  if (proposalId) {
    const detail = getProposalDetail(proposalId);
    const from = (searchParams.get("from") ?? "draft-queue") as keyof typeof sourceTabLabels;
    const tabLabelText = sourceTabLabels[from] ?? "Draft Queue";
    const backHref = buildHref(
      from === "draft-queue" ? routes.sendCenter : `${routes.sendCenter}?view=${from}`,
      searchParams,
      { drop: DETAIL_PARAMS },
    );
    return [
      { label: "Send Center", href: buildHref(routes.sendCenter, searchParams, { drop: DETAIL_PARAMS }) },
      { label: tabLabelText, href: backHref },
      { label: detail?.client ?? proposalId },
    ];
  }

  const view = searchParams.get("view") ?? "draft-queue";
  const section = tabLabel(sendCenterTabs, view, "Draft Queue");
  const detail = resolveDetailLabel(searchParams);

  const items: BreadcrumbItem[] = [
    { label: "Send Center", href: buildHref(routes.sendCenter, searchParams, { drop: [...DETAIL_PARAMS, "view"] }) },
    {
      label: section,
      href: sectionHref(routes.sendCenter, searchParams, view === "draft-queue" ? null : view, "draft-queue"),
    },
  ];

  return withDetail(items, searchParams, detail);
}

export function resolveVaOperationsBreadcrumbs(searchParams: URLSearchParams): BreadcrumbItem[] {
  const view = searchParams.get("view") ?? "overview";
  const section = tabLabel(vaOperationsTabs, view, "Overview");
  const detail = resolveDetailLabel(searchParams);

  const role = searchParams.get("role");
  const keepExtra = role && role !== "owner" ? (["role"] as string[]) : [];

  const items: BreadcrumbItem[] = [
    {
      label: "VA Operations",
      href: buildHref(routes.vaOperations, searchParams, { drop: [...DETAIL_PARAMS, "view", "role"], keepExtra }),
    },
    {
      label: section,
      href: sectionHref(routes.vaOperations, searchParams, view === "overview" ? null : view, "overview"),
    },
  ];

  return withDetail(items, searchParams, detail);
}

export function resolveGlobalSearchBreadcrumbs(searchParams: URLSearchParams): BreadcrumbItem[] {
  const detail = resolveDetailLabel(searchParams);
  const q = searchParams.get("q");
  const base = q ? `${routes.globalSearch}?q=${encodeURIComponent(q)}` : routes.globalSearch;

  const items: BreadcrumbItem[] = [
    { label: "Global Search", href: buildHref(routes.globalSearch, searchParams, { drop: DETAIL_PARAMS }) },
  ];

  if (detail) {
    items.push({ label: "Results", href: buildHref(base, searchParams, { drop: ["entity", "result", "detail"] }) });
    items.push({ label: detail });
  } else if (q) {
    items.push({ label: "Results" });
  }

  return items;
}

export function resolveSystemHealthBreadcrumbs(searchParams: URLSearchParams): BreadcrumbItem[] {
  const detail = resolveDetailLabel(searchParams);
  const errorId = searchParams.get("error");

  if (errorId) {
    return [
      { label: "System Health", href: routes.systemHealth },
      { label: "Logs", href: buildHref(routes.systemHealth, searchParams, { drop: ["error", "detail", "system"] }) },
      { label: errorId },
    ];
  }

  if (detail) {
    return [
      { label: "System Health", href: buildHref(routes.systemHealth, searchParams, { drop: DETAIL_PARAMS }) },
      { label: detail },
    ];
  }

  return [{ label: "System Health" }];
}

export function resolveNotificationsBreadcrumbs(
  notificationType?: string | null,
  entityName?: string | null,
): BreadcrumbItem[] {
  if (!notificationType) return [{ label: "Notifications" }];
  if (!entityName) return [{ label: "Notifications" }, { label: notificationType }];
  return [{ label: "Notifications" }, { label: notificationType }, { label: entityName }];
}

export function resolveBreadcrumbs(
  pathname: string,
  searchParams: URLSearchParams,
  options?: { proposalId?: string; notificationType?: string; notificationEntity?: string },
): BreadcrumbItem[] {
  if (pathname.startsWith("/send-center/proposal/")) {
    return resolveSendCenterBreadcrumbs(searchParams, options?.proposalId);
  }

  switch (pathname) {
    case routes.commercialHub:
      return resolveCommercialHubBreadcrumbs(searchParams);
    case routes.intakeForms:
      return resolveIntakeFormsBreadcrumbs(searchParams);
    case routes.trainingHub:
      return resolveTrainingHubBreadcrumbs(searchParams);
    case routes.carrierLibrary:
      return resolveCarrierLibraryBreadcrumbs(searchParams);
    case routes.epayPolicy:
      return resolveEpayPolicyBreadcrumbs(searchParams);
    case routes.sendCenter:
      return resolveSendCenterBreadcrumbs(searchParams);
    case routes.vaOperations:
      return resolveVaOperationsBreadcrumbs(searchParams);
    case routes.globalSearch:
      return resolveGlobalSearchBreadcrumbs(searchParams);
    case routes.systemHealth:
      return resolveSystemHealthBreadcrumbs(searchParams);
    default:
      return [];
  }
}

export function getReturnBackTarget(
  searchParams: URLSearchParams,
): { href: string; label: string } | null {
  return parseReturnContext(searchParams);
}

export function stripDetailParams(searchParams: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString());
  DETAIL_PARAMS.forEach((key) => next.delete(key));
  return next;
}

export function mergeDetailParam(
  pathname: string,
  searchParams: URLSearchParams,
  key: string,
  value: string,
  detailLabel?: string,
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.set(key, value);
  if (detailLabel) params.set("detail", detailLabel);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function clearDetailParams(
  pathname: string,
  searchParams: URLSearchParams,
): string {
  const params = stripDetailParams(searchParams);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
