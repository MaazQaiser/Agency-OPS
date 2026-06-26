"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { buildCarrierRecordsFromForm, type AddCarrierForm } from "@/data/addCarrier";
import {
  carrierLibraryTabs,
  setExtraCarrierRecords,
  type CarrierLibraryTabId,
  type CarrierRecord,
} from "@/data/carrierLibrary";
import { routes } from "@/lib/routes";
import { TabTransitionPanel } from "@/components/motion/TabTransitionPanel";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { AddCarrierDrawer } from "./AddCarrierDrawer";
import { CarrierLibraryPageHeader } from "./CarrierLibraryPageHeader";
import { CarrierProfileTab } from "./CarrierProfileTab";
import { CarrierSearchTab } from "./CarrierSearchTab";
import { SubmissionRulesTab } from "./SubmissionRulesTab";

const validTabIds = new Set<string>(carrierLibraryTabs.map((tab) => tab.id));

function isProfileView(view: string | null) {
  return view === "profile";
}

function resolveTab(view: string | null): CarrierLibraryTabId {
  if (view === "checklist") return "rules";
  if (view && validTabIds.has(view)) return view as CarrierLibraryTabId;
  return "search";
}

export function CarrierLibraryModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const showingProfile = isProfileView(view);
  const active = resolveTab(view);

  const [addedCarriers, setAddedCarriers] = useState<CarrierRecord[]>([]);
  const [addCarrierOpen, setAddCarrierOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setExtraCarrierRecords(addedCarriers);
  }, [addedCarriers]);

  const setActive = useCallback(
    (tabId: CarrierLibraryTabId) => {
      const href =
        tabId === "search"
          ? routes.carrierLibrary
          : `${routes.carrierLibrary}?view=${tabId}`;
      router.push(href, { scroll: false });
    },
    [router],
  );

  const handlePageQuickAction = (actionId: string) => {
    if (actionId === "add-carrier") {
      setAddCarrierOpen(true);
    }
  };

  useShortcutAction("add-carrier", () => handlePageQuickAction("add-carrier"));
  useShortcutAction("update-market", () => toast.success("Update Market Info opened"));

  const handleSaveCarrier = (form: AddCarrierForm) => {
    const records = buildCarrierRecordsFromForm(form);
    setAddedCarriers((prev) => [...prev, ...records]);
    toast.success(toastMessages.carrierLibrary.carrierAdded);
  };

  const handleSaveDraft = (_form: AddCarrierForm) => {
    toast.success("Draft saved");
  };

  return (
    <>
      <CarrierLibraryPageHeader onQuickActionClick={handlePageQuickAction} />

      {!showingProfile && (
        <nav className="va-ops-tab-nav" aria-label="Carrier Library views">
          {carrierLibraryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`va-ops-tab-btn${active === tab.id ? " active" : ""}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      <div className="va-ops-tab-content">
        <TabTransitionPanel tabKey={showingProfile ? "profile" : active}>
        {showingProfile && <CarrierProfileTab />}
        {!showingProfile && active === "search" && (
          <CarrierSearchTab addedCarriers={addedCarriers} />
        )}
        {!showingProfile && active === "rules" && <SubmissionRulesTab />}
        </TabTransitionPanel>
      </div>

      <AddCarrierDrawer
        open={addCarrierOpen}
        onClose={() => setAddCarrierOpen(false)}
        onSave={handleSaveCarrier}
        onSaveDraft={handleSaveDraft}
      />
    </>
  );
}
