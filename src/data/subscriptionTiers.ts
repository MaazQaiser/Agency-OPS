import type { AppModule } from "@/lib/routes";
import type { VaOperationsTabId } from "@/data/vaOperations";

/** Subscription-gated capabilities (cumulative by tier). */
export type SubscriptionFeature =
  | "va-operations"
  | "commercial-hub"
  | "intake-forms"
  | "carrier-library"
  | "epay-policy"
  | "retention"
  | "send-center"
  | "analytics"
  | "korean-department"
  | "coaches-corner-ai"
  | "custom-webhooks";

export type SubscriptionTierLevel = 1 | 2 | 3;

export type AccessTarget = AppModule | "system-health";

export type TenantSubscriptionConfig = {
  tenantId: string;
  name: string;
  tier: SubscriptionTierLevel;
  /** Owner-only upgrade CTA on unavailable modules; never reveals tier names. */
  showUpgradePrompts: boolean;
  upgradeContactEmail?: string;
};

export const TENANT_STORAGE_KEY = "agency-ops-tenant-id";

export const DEFAULT_TENANT_ID = "insurance-town";

/** Features introduced at each tier (cumulative when resolving access). */
export const subscriptionTierFeatures: Record<SubscriptionTierLevel, SubscriptionFeature[]> = {
  1: ["va-operations", "commercial-hub", "intake-forms", "carrier-library", "epay-policy"],
  2: ["retention", "send-center", "analytics"],
  3: ["korean-department", "coaches-corner-ai", "custom-webhooks"],
};

export const tenantSubscriptions: Record<string, TenantSubscriptionConfig> = {
  "insurance-town": {
    tenantId: "insurance-town",
    name: "Insurance Town",
    tier: 3,
    showUpgradePrompts: true,
    upgradeContactEmail: "success@insurancetown.com",
  },
  "acme-standard": {
    tenantId: "acme-standard",
    name: "Acme Standard",
    tier: 1,
    showUpgradePrompts: true,
    upgradeContactEmail: "billing@acme-insurance.com",
  },
  "acme-growth": {
    tenantId: "acme-growth",
    name: "Acme Growth",
    tier: 2,
    showUpgradePrompts: true,
    upgradeContactEmail: "billing@acme-insurance.com",
  },
};

/** Maps app modules to subscription features. Ungated modules are omitted. */
export const moduleToSubscriptionFeature: Partial<Record<AccessTarget, SubscriptionFeature>> = {
  "va-operations": "va-operations",
  commercial: "commercial-hub",
  "intake-forms": "intake-forms",
  "carrier-library": "carrier-library",
  "epay-policy": "epay-policy",
  retention: "retention",
  producer: "retention",
  "prime-agency": "retention",
  "send-center": "send-center",
  analytics: "analytics",
  "global-search": "analytics",
  "farmers-edge": "commercial-hub",
};

/** VA Operations tabs gated beyond the base module. */
export const vaOpsTabFeatures: Partial<Record<VaOperationsTabId, SubscriptionFeature>> = {
  automations: "custom-webhooks",
  "bilingual-queue": "korean-department",
};

export function getFeaturesForTier(tier: SubscriptionTierLevel): SubscriptionFeature[] {
  const features: SubscriptionFeature[] = [];
  for (let level = 1 as SubscriptionTierLevel; level <= tier; level += 1) {
    features.push(...subscriptionTierFeatures[level]);
  }
  return features;
}

export function resolveTenantConfig(tenantId: string): TenantSubscriptionConfig {
  return tenantSubscriptions[tenantId] ?? tenantSubscriptions[DEFAULT_TENANT_ID];
}

export function loadTenantId(): string {
  if (typeof window === "undefined") return DEFAULT_TENANT_ID;
  try {
    const raw = localStorage.getItem(TENANT_STORAGE_KEY);
    if (raw && tenantSubscriptions[raw]) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_TENANT_ID;
}

export function saveTenantId(tenantId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
  } catch {
    /* ignore */
  }
}
