"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_TENANT_ID,
  loadTenantId,
  resolveTenantConfig,
  saveTenantId,
  type SubscriptionFeature,
  type TenantSubscriptionConfig,
} from "@/data/subscriptionTiers";
import { buildSubscribedFeatureSet } from "@/lib/subscriptionAccess";

type SubscriptionContextValue = {
  tenant: TenantSubscriptionConfig;
  subscribedFeatures: Set<SubscriptionFeature>;
  hasFeature: (feature: SubscriptionFeature) => boolean;
  showUpgradePrompts: boolean;
  setTenantId: (tenantId: string) => void;
  hydrated: boolean;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState(DEFAULT_TENANT_ID);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTenantIdState(loadTenantId());
    setHydrated(true);
  }, []);

  const tenant = useMemo(() => resolveTenantConfig(tenantId), [tenantId]);

  const subscribedFeatures = useMemo(
    () => buildSubscribedFeatureSet(tenant.tier),
    [tenant.tier],
  );

  const hasFeature = useCallback(
    (feature: SubscriptionFeature) => subscribedFeatures.has(feature),
    [subscribedFeatures],
  );

  const setTenantId = useCallback((nextTenantId: string) => {
    setTenantIdState(nextTenantId);
    saveTenantId(nextTenantId);
  }, []);

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      tenant,
      subscribedFeatures,
      hasFeature,
      showUpgradePrompts: tenant.showUpgradePrompts,
      setTenantId,
      hydrated,
    }),
    [tenant, subscribedFeatures, hasFeature, setTenantId, hydrated],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    const fallback = resolveTenantConfig(loadTenantId());
    const features = buildSubscribedFeatureSet(fallback.tier);
    return {
      tenant: fallback,
      subscribedFeatures: features,
      hasFeature: (feature: SubscriptionFeature) => features.has(feature),
      showUpgradePrompts: fallback.showUpgradePrompts,
      setTenantId: () => {},
      hydrated: true,
    };
  }
  return ctx;
}
