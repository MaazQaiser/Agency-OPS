"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { KpiSkeletonGrid } from "@/components/shared/loading";
import { DataStateView, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { createDraftQueueRecordFromForm, type NewDraftFormValues } from "@/data/newDraftForm";
import {
  draftQueueRecords,
  sendCenterKpiCommands,
  sendCenterTabs,
  type DraftQueueRecord,
  type SendCenterTabId,
} from "@/data/sendCenter";
import { useCrossModuleHandoff } from "@/hooks/useCrossModuleHandoff";
import { useToast, createLegacyToastHandler } from "@/hooks/useToast";
import { TabTransitionPanel } from "@/components/motion/TabTransitionPanel";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import { getVisibleSendCenterTabs } from "@/data/rolePermissions";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { routes } from "@/lib/routes";
import { HubOperationalStrips } from "@/components/layout/HubOperationalStrips";
import { SendCenterKpiCommand } from "./SendCenterKpiCommand";
import { SendCenterPageHeader } from "./SendCenterPageHeader";
import { DraftQueueTab } from "./DraftQueueTab";
import { PendingReviewTab } from "./PendingReviewTab";
import { ApprovedDraftsTab } from "./ApprovedDraftsTab";
import { SentProposalsTab } from "./SentProposalsTab";
import { TemplatesTab } from "./TemplatesTab";
import { NewDraftModal } from "./NewDraftModal";

const validTabIds = new Set<string>(sendCenterTabs.map((tab) => tab.id));

function resolveTab(view: string | null): SendCenterTabId {
  if (view && validTabIds.has(view)) return view as SendCenterTabId;
  return "draft-queue";
}

export function SendCenterModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = usePermissions();
  const visibleTabs = getVisibleSendCenterTabs(role);
  const validVisibleIds = new Set(visibleTabs.map((t) => t.id));
  const active = resolveTab(searchParams.get("view"));
  const safeActive = validVisibleIds.has(active) ? active : (visibleTabs[0]?.id ?? "draft-queue");
  const toast = useToast();
  const showToast = useCallback(createLegacyToastHandler(toast), [toast]);

  const [newDraftOpen, setNewDraftOpen] = useState(false);
  const [draftPrefill, setDraftPrefill] = useState<Partial<NewDraftFormValues> | undefined>();
  const [draftRows, setDraftRows] = useState<DraftQueueRecord[]>(draftQueueRecords);
  const {
    status: kpiStatus,
    retry: retryKpis,
    lastSyncedAt: kpiSyncedAt,
    isStale: kpiStale,
    retrying: kpiRetrying,
  } = useHubDataState({
    load: () => sendCenterKpiCommands,
    isEmpty: () => false,
    errorPreset: "supabase-timeout",
  });

  useCrossModuleHandoff("quote-to-draft", (payload) => {
    setDraftPrefill({
      clientName: payload.client ?? "",
      carrier: payload.carrier ?? "",
      premiumEstimate: payload.premium ?? "",
      brokerFee: payload.brokerFee ?? "",
      internalNotes: payload.quote ? `Imported from Quote Review: ${payload.quote}` : "",
    });
    setNewDraftOpen(true);
    showToast(`Quote loaded for ${payload.client ?? "client"} — review draft`, "success");
  });

  useCrossModuleHandoff("revise-proposal", (payload) => {
    setDraftPrefill({
      clientName: payload.client ?? "",
      internalNotes: `Revision requested from Outreach Queue for ${payload.client ?? "client"}.`,
    });
    setNewDraftOpen(true);
    showToast(`Revision draft opened for ${payload.client ?? "client"}`, "success");
  });

  const setActive = useCallback(
    (tabId: SendCenterTabId) => {
      const href = tabId === "draft-queue" ? routes.sendCenter : `${routes.sendCenter}?view=${tabId}`;
      router.push(href, { scroll: false });
    },
    [router],
  );

  const openNewDraft = useCallback(() => {
    setDraftPrefill(undefined);
    setNewDraftOpen(true);
  }, []);

  useShortcutAction("new-draft", openNewDraft);

  const handleNewDraftSave = useCallback(
    (form: NewDraftFormValues, submitForReview: boolean) => {
      const record = createDraftQueueRecordFromForm(form, submitForReview);
      setDraftRows((prev) => [record, ...prev]);
      setNewDraftOpen(false);
      setActive("draft-queue");
      showToast(
        submitForReview
          ? `${form.clientName} saved and submitted for licensed review`
          : `Draft saved for ${form.clientName}`,
        "success",
      );
    },
    [setActive, showToast],
  );

  const handlePageQuickAction = (actionId: string) => {
    if (actionId === "new-draft") {
      openNewDraft();
      return;
    }
    if (actionId === "use-template") {
      setActive("templates");
    }
  };

  return (
    <>
      <NewDraftModal
        open={newDraftOpen}
        initialValues={draftPrefill}
        onClose={() => {
          setNewDraftOpen(false);
          setDraftPrefill(undefined);
        }}
        onSave={handleNewDraftSave}
      />

      <SendCenterPageHeader onQuickActionClick={handlePageQuickAction} />

      <nav className="va-ops-tab-nav send-center-tab-nav" aria-label="Send Center views">
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

      <section className="va-ops-kpi-strip send-center-kpi-strip" aria-label="Send Center summary">
        <DataStateView
          status={kpiStatus}
          lastSyncedAt={kpiSyncedAt}
          isStale={kpiStale}
          showFreshness={false}
          loading={<KpiSkeletonGrid count={4} />}
          error={
            <HubErrorState
              preset="supabase-timeout"
              onRetry={retryKpis}
              retrying={kpiRetrying}
              lastSyncedAt={kpiSyncedAt}
              compact
            />
          }
        >
          <SendCenterKpiCommand items={sendCenterKpiCommands} activeTab={safeActive} onSelect={setActive} />
        </DataStateView>
      </section>

      <div className="va-ops-tab-content">
        <TabTransitionPanel tabKey={safeActive}>
        {safeActive === "draft-queue" && (
          <DraftQueueTab
            rows={draftRows}
            setRows={setDraftRows}
            onToast={showToast}
            onOpenNewDraft={openNewDraft}
          />
        )}
        {safeActive === "pending-review" && <PendingReviewTab onToast={showToast} />}
        {safeActive === "approved" && <ApprovedDraftsTab onToast={showToast} />}
        {safeActive === "sent" && <SentProposalsTab onToast={showToast} />}
        {safeActive === "templates" && <TemplatesTab onToast={showToast} />}
        </TabTransitionPanel>
      </div>
    </>
  );
}
