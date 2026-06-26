import type { VaOperationsTabId } from "@/data/vaOperations";
import { routes } from "@/lib/routes";
import {
  getFeaturesForTier,
  moduleToSubscriptionFeature,
  vaOpsTabFeatures,
  type AccessTarget,
  type SubscriptionFeature,
  type SubscriptionTierLevel,
} from "@/data/subscriptionTiers";

export function buildSubscribedFeatureSet(tier: SubscriptionTierLevel): Set<SubscriptionFeature> {
  return new Set(getFeaturesForTier(tier));
}

export function hasSubscriptionFeature(
  features: Set<SubscriptionFeature>,
  feature: SubscriptionFeature,
): boolean {
  return features.has(feature);
}

export function moduleRequiresSubscription(module: AccessTarget): SubscriptionFeature | null {
  return moduleToSubscriptionFeature[module] ?? null;
}

export function canAccessModuleBySubscription(
  features: Set<SubscriptionFeature>,
  module: AccessTarget,
): boolean {
  const required = moduleRequiresSubscription(module);
  if (!required) return true;
  return hasSubscriptionFeature(features, required);
}

export function canAccessVaOpsTabBySubscription(
  features: Set<SubscriptionFeature>,
  tabId: VaOperationsTabId,
): boolean {
  const required = vaOpsTabFeatures[tabId];
  if (!required) return true;
  return hasSubscriptionFeature(features, required);
}

export function pathnameToAccessTarget(pathname: string): AccessTarget | null {
  if (pathname.startsWith("/commercial-hub")) return "commercial";
  if (pathname.startsWith("/va-operations")) return "va-operations";
  if (pathname.startsWith("/intake-forms")) return "intake-forms";
  if (pathname.startsWith("/training-hub")) return "training-hub";
  if (pathname.startsWith("/carrier-library")) return "carrier-library";
  if (pathname.startsWith("/epay-policy")) return "epay-policy";
  if (pathname.startsWith("/send-center")) return "send-center";
  if (pathname.startsWith("/global-search")) return "global-search";
  if (pathname.startsWith("/retention")) return "retention";
  if (pathname.startsWith("/producer") || pathname.startsWith("/production")) return "producer";
  if (pathname.startsWith("/prime-agency")) return "prime-agency";
  if (pathname.startsWith("/system-health")) return "system-health";
  if (pathname === routes.home || pathname === "/dashboard") return "va-operations";
  return null;
}

export function canAccessPathBySubscription(
  features: Set<SubscriptionFeature>,
  pathname: string,
): boolean {
  const target = pathnameToAccessTarget(pathname);
  if (!target) return true;
  return canAccessModuleBySubscription(features, target);
}

/** Strip VA Ops views that require unsubscribed features. */
export function normalizeVaOpsView(
  features: Set<SubscriptionFeature>,
  view: string | null,
): string | null {
  if (!view) return view;
  if (!canAccessVaOpsTabBySubscription(features, view as VaOperationsTabId)) return null;
  return view;
}

export function hrefRequiresSubscription(href: string): SubscriptionFeature | null {
  const [path] = href.split("?");
  const target = pathnameToAccessTarget(path);
  if (!target) return null;
  return moduleRequiresSubscription(target);
}

export function isHrefAccessible(
  features: Set<SubscriptionFeature>,
  href: string,
): boolean {
  const required = hrefRequiresSubscription(href);
  if (!required) return true;
  return hasSubscriptionFeature(features, required);
}
