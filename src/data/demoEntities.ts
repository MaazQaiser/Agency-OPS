/**
 * Canonical demo entities for Agency OPS cross-module consistency.
 * All seed data should reference these clients, carriers, producers, and VAs.
 */

export const DEMO_CARRIERS = ["Markel", "Travelers", "CNA", "ICW", "Kingsway"] as const;
export type DemoCarrier = (typeof DEMO_CARRIERS)[number];

export const DEMO_PRODUCERS = ["Eva", "Pedro", "Sarah"] as const;
export type DemoProducer = (typeof DEMO_PRODUCERS)[number];

export const DEMO_VAS = ["JoJo", "Valerie", "Tracie"] as const;
export type DemoVa = (typeof DEMO_VAS)[number];

export type DemoClientEntity = {
  slug: string;
  name: string;
  submissionId: string;
  proposalId: string;
  invoiceClientId: string;
  paymentId: string;
  dncId: string;
  leadName: string;
  producer: DemoProducer;
  va: DemoVa;
  primaryCarrier: DemoCarrier;
  coverage: string;
  state: string;
};

export const DEMO_CLIENTS: DemoClientEntity[] = [
  {
    slug: "martinez",
    name: "Martinez Landscaping",
    submissionId: "trk-martinez",
    proposalId: "prop-martinez",
    invoiceClientId: "inv-martinez",
    paymentId: "pay-martinez",
    dncId: "dnc-martinez",
    leadName: "Carlos Martinez",
    producer: "Eva",
    va: "JoJo",
    primaryCarrier: "Markel",
    coverage: "BOP",
    state: "CA",
  },
  {
    slug: "kim",
    name: "Kim Auto Shop",
    submissionId: "trk-kim",
    proposalId: "prop-kim",
    invoiceClientId: "inv-kim",
    paymentId: "pay-kim",
    dncId: "dnc-kim",
    leadName: "David Kim",
    producer: "Pedro",
    va: "Tracie",
    primaryCarrier: "Travelers",
    coverage: "Commercial Auto",
    state: "CA",
  },
  {
    slug: "rivera",
    name: "Rivera Construction",
    submissionId: "trk-rivera",
    proposalId: "prop-rivera",
    invoiceClientId: "inv-rivera",
    paymentId: "pay-rivera",
    dncId: "dnc-rivera",
    leadName: "James Rivera",
    producer: "Sarah",
    va: "Valerie",
    primaryCarrier: "ICW",
    coverage: "Workers Comp",
    state: "CA",
  },
  {
    slug: "greenline",
    name: "Greenline Logistics",
    submissionId: "trk-greenline",
    proposalId: "prop-greenline",
    invoiceClientId: "inv-greenline",
    paymentId: "pay-greenline",
    dncId: "dnc-greenline",
    leadName: "Min Park",
    producer: "Eva",
    va: "JoJo",
    primaryCarrier: "CNA",
    coverage: "BOP",
    state: "TX",
  },
  {
    slug: "atlas",
    name: "Atlas Roofing",
    submissionId: "trk-atlas",
    proposalId: "prop-atlas",
    invoiceClientId: "inv-atlas",
    paymentId: "pay-atlas",
    dncId: "dnc-atlas",
    leadName: "Robert Chen",
    producer: "Pedro",
    va: "Tracie",
    primaryCarrier: "Kingsway",
    coverage: "General Liability",
    state: "WA",
  },
];

export const DEMO_CLIENT_NAMES = DEMO_CLIENTS.map((c) => c.name);

export function getDemoClientByName(name: string): DemoClientEntity | undefined {
  return DEMO_CLIENTS.find((c) => c.name === name);
}

export function getDemoClientBySubmissionId(id: string): DemoClientEntity | undefined {
  return DEMO_CLIENTS.find((c) => c.submissionId === id);
}

export function getDemoClientByProposalId(id: string): DemoClientEntity | undefined {
  return DEMO_CLIENTS.find((c) => c.proposalId === id);
}

export function getDemoClientByPaymentId(id: string): DemoClientEntity | undefined {
  return DEMO_CLIENTS.find((c) => c.paymentId === id);
}

export function buildClientRecordMap<T extends string>(
  key: keyof Pick<DemoClientEntity, "name" | "submissionId" | "proposalId" | "invoiceClientId" | "paymentId">,
  valueKey: keyof DemoClientEntity,
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const client of DEMO_CLIENTS) {
    map[client.name] = String(client[valueKey]);
  }
  return map;
}

export const CLIENT_TO_PROPOSAL_ID = Object.fromEntries(
  DEMO_CLIENTS.map((c) => [c.name, c.proposalId]),
) as Record<string, string>;

export const CLIENT_TO_SUBMISSION_ID = Object.fromEntries(
  DEMO_CLIENTS.map((c) => [c.name, c.submissionId]),
) as Record<string, string>;

export const CLIENT_TO_INVOICE_CLIENT_ID = Object.fromEntries(
  DEMO_CLIENTS.map((c) => [c.name, c.invoiceClientId]),
) as Record<string, string>;

export const CLIENT_TO_PAYMENT_ID = Object.fromEntries(
  DEMO_CLIENTS.map((c) => [c.name, c.paymentId]),
) as Record<string, string>;

export const LEAD_NAME_TO_SUBMISSION_ID = Object.fromEntries(
  DEMO_CLIENTS.map((c) => [c.leadName, c.submissionId]),
) as Record<string, string>;

export const LEAD_NAME_TO_DNC_ID = Object.fromEntries(
  DEMO_CLIENTS.map((c) => [c.leadName, c.dncId]),
) as Record<string, string>;

/** Alternate lead names used in dialer / search */
export const LEAD_ALIASES: Record<string, { submissionId?: string; dncId?: string }> = {
  "John Martinez": { submissionId: "trk-martinez", dncId: "dnc-martinez" },
  "Carlos Martinez": { submissionId: "trk-martinez", dncId: "dnc-martinez" },
  "Michael Kim": { submissionId: "trk-kim", dncId: "dnc-kim" },
  "David Kim": { submissionId: "trk-kim", dncId: "dnc-kim" },
};

export function resolveLeadSubmissionId(leadName: string): string | undefined {
  return LEAD_ALIASES[leadName]?.submissionId ?? LEAD_NAME_TO_SUBMISSION_ID[leadName];
}

export function resolveLeadDncId(leadName: string): string | undefined {
  return LEAD_ALIASES[leadName]?.dncId ?? LEAD_NAME_TO_DNC_ID[leadName];
}

/** Legacy ID aliases for backward-compatible deep links */
export const LEGACY_ID_ALIASES: Record<string, string> = {
  "prop-kim-auto": "prop-kim",
  "trk-seoul": "trk-greenline",
  "trk-pacific": "trk-rivera",
  "trk-paks": "trk-atlas",
  "trk-greenscape": "trk-atlas",
  "prop-seoul": "prop-greenline",
  "prop-westside": "prop-rivera",
  "prop-pacific": "prop-atlas",
  "prop-harbor": "prop-greenline",
  "pay-seoul": "pay-greenline",
  "pay-westside": "pay-rivera",
  "dnc-1": "dnc-rivera",
  "dnc-2": "dnc-martinez",
  "dnc-3": "dnc-greenline",
  "dnc-4": "dnc-kim",
  "dnc-6": "dnc-atlas",
};

export function resolveCanonicalId(id: string): string {
  return LEGACY_ID_ALIASES[id] ?? id;
}
