"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { trainingHubTabs, type TrainingHubTabId } from "@/data/trainingHub";
import { routes } from "@/lib/routes";
import { TabTransitionPanel } from "@/components/motion/TabTransitionPanel";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import { AddNewResourceModal } from "./AddNewResourceModal";
import { DepartmentOverviewTab } from "./DepartmentOverviewTab";
import { ManageTagsModal } from "./ManageTagsModal";
import { TrainingHubPageHeader } from "./TrainingHubPageHeader";
import { TrainingDetailTab } from "./TrainingDetailTab";
import { TrainingLibraryTab } from "./TrainingLibraryTab";
import { UploadTrainingModal } from "./UploadTrainingModal";

const validTabIds = new Set<string>(trainingHubTabs.map((tab) => tab.id));

function isDetailView(view: string | null) {
  return view === "detail";
}

function resolveTab(view: string | null): TrainingHubTabId {
  if (view && validTabIds.has(view)) return view as TrainingHubTabId;
  return "departments";
}

export function TrainingHubModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const showingDetail = isDetailView(view);
  const active = resolveTab(view);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [addResourceOpen, setAddResourceOpen] = useState(false);
  const [manageTagsOpen, setManageTagsOpen] = useState(false);

  const setActive = useCallback(
    (tabId: TrainingHubTabId) => {
      const dept = searchParams.get("dept");
      let href: string = routes.trainingHub;
      if (tabId === "library") {
        href = dept
          ? `${routes.trainingHub}?view=library&dept=${dept}`
          : `${routes.trainingHub}?view=library`;
      }
      router.push(href, { scroll: false });
    },
    [router, searchParams],
  );

  const handlePageQuickAction = useCallback((actionId: string) => {
    if (actionId === "upload") setUploadOpen(true);
    if (actionId === "add-resource") setAddResourceOpen(true);
    if (actionId === "manage-tags") setManageTagsOpen(true);
  }, []);

  useShortcutAction("upload-training", () => handlePageQuickAction("upload"));
  useShortcutAction("manage-tags", () => handlePageQuickAction("manage-tags"));

  useEffect(() => {
    const ownerAction = searchParams.get("ownerAction");
    if (ownerAction === "upload") setUploadOpen(true);
  }, [searchParams]);

  const showPageActions = !showingDetail && active === "departments";

  return (
    <>
      <TrainingHubPageHeader
        showActions={showPageActions}
        onQuickActionClick={handlePageQuickAction}
      />

      {!showingDetail && (
        <nav className="va-ops-tab-nav" aria-label="Training Hub views">
          {trainingHubTabs.map((tab) => (
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
        <TabTransitionPanel tabKey={showingDetail ? "detail" : active}>
        {showingDetail && <TrainingDetailTab />}
        {!showingDetail && active === "departments" && <DepartmentOverviewTab />}
        {!showingDetail && active === "library" && <TrainingLibraryTab />}
        </TabTransitionPanel>
      </div>

      <UploadTrainingModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onPublish={() => undefined}
      />
      <AddNewResourceModal
        open={addResourceOpen}
        onClose={() => setAddResourceOpen(false)}
        onSave={() => undefined}
      />
      <ManageTagsModal
        open={manageTagsOpen}
        onClose={() => setManageTagsOpen(false)}
        onSave={() => undefined}
      />
    </>
  );
}
