"use client";

import { useCallback, useMemo } from "react";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useSubscription } from "@/components/subscription/SubscriptionProvider";
import type { VaOperationsTabId } from "@/data/vaOperations";
import type { AccessTarget } from "@/data/subscriptionTiers";
import {
  canAccessModuleBySubscription,
  canAccessVaOpsTabBySubscription,
  isHrefAccessible,
  pathnameToAccessTarget,
} from "@/lib/subscriptionAccess";

export function useEntitlements() {
  const { canAccessModule: roleCanAccessModule, isOwner } = usePermissions();
  const { subscribedFeatures, hasFeature, showUpgradePrompts, tenant } = useSubscription();

  const canAccessModule = useCallback(
    (module: AccessTarget) =>
      roleCanAccessModule(module) && canAccessModuleBySubscription(subscribedFeatures, module),
    [roleCanAccessModule, subscribedFeatures],
  );

  const canAccessPath = useCallback(
    (pathname: string) => {
      const target = pathnameToAccessTarget(pathname);
      if (!target) return true;
      if (!roleCanAccessModule(target)) return false;
      return canAccessModuleBySubscription(subscribedFeatures, target);
    },
    [roleCanAccessModule, subscribedFeatures],
  );

  const canAccessVaOpsTab = useCallback(
    (tabId: VaOperationsTabId) => canAccessVaOpsTabBySubscription(subscribedFeatures, tabId),
    [subscribedFeatures],
  );

  const canOpenHref = useCallback(
    (href: string) => isHrefAccessible(subscribedFeatures, href),
    [subscribedFeatures],
  );

  return useMemo(
    () => ({
      canAccessModule,
      canAccessPath,
      canAccessVaOpsTab,
      canOpenHref,
      hasFeature,
      showUpgradePrompts,
      isOwner,
      tenant,
      subscribedFeatures,
    }),
    [
      canAccessModule,
      canAccessPath,
      canAccessVaOpsTab,
      canOpenHref,
      hasFeature,
      showUpgradePrompts,
      isOwner,
      tenant,
      subscribedFeatures,
    ],
  );
}
