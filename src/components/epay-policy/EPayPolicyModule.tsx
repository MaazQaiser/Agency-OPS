"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { epayPolicyTabs, type EPayPolicyTabId } from "@/data/epayPolicy";
import { getVisibleEpayTabs } from "@/data/rolePermissions";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { routes } from "@/lib/routes";
import { useToast, createLegacyToastHandler } from "@/hooks/useToast";
import { TabTransitionPanel } from "@/components/motion/TabTransitionPanel";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import { HubOperationalStrips } from "@/components/layout/HubOperationalStrips";
import { EPayPolicyPageHeader } from "./EPayPolicyPageHeader";
import { InvoiceBuilderTab } from "./InvoiceBuilderTab";
import { PaymentTrackerTab } from "./PaymentTrackerTab";
import { TrustReferenceTab } from "./TrustReferenceTab";

const validTabIds = new Set<string>(epayPolicyTabs.map((tab) => tab.id));

function resolveTab(view: string | null): EPayPolicyTabId {
  if (view && validTabIds.has(view)) return view as EPayPolicyTabId;
  return "builder";
}

export function EPayPolicyModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role, requirePermission } = usePermissions();
  const visibleTabs = getVisibleEpayTabs(role);
  const validVisibleIds = new Set(visibleTabs.map((t) => t.id));
  const active = resolveTab(searchParams.get("view"));
  const safeActive = validVisibleIds.has(active) ? active : (visibleTabs[0]?.id ?? "builder");
  const toast = useToast();
  const showToast = useCallback(createLegacyToastHandler(toast), [toast]);

  const setActive = useCallback(
    (tabId: EPayPolicyTabId) => {
      const href = tabId === "builder" ? routes.epayPolicy : `${routes.epayPolicy}?view=${tabId}`;
      router.push(href, { scroll: false });
    },
    [router],
  );

  const handlePageQuickAction = (actionId: string) => {
    if (actionId === "new-invoice") setActive("builder");
    if (actionId === "send-payment-link") {
      setActive("builder");
      showToast("Open invoice builder to send payment link", "success");
    }
  };

  useShortcutAction("reconcile-trust", () => setActive("trust"));
  useShortcutAction("export-ledger", () => {
    requirePermission("action:export-ledger", () => showToast("Ledger export started"));
  });

  return (
    <>
      <EPayPolicyPageHeader onQuickActionClick={handlePageQuickAction} />

      <nav className="va-ops-tab-nav" aria-label="ePayPolicy views">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`va-ops-tab-btn${safeActive === tab.id ? " active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <HubOperationalStrips />

      <div className="va-ops-tab-content">
        <TabTransitionPanel tabKey={safeActive}>
        {safeActive === "builder" && <InvoiceBuilderTab onToast={showToast} />}
        {safeActive === "tracker" && (
          <PaymentTrackerTab
            onToast={showToast}
            initialPaymentId={searchParams.get("payment")}
          />
        )}
        {safeActive === "trust" && <TrustReferenceTab onToast={showToast} />}
        </TabTransitionPanel>
      </div>
    </>
  );
}
