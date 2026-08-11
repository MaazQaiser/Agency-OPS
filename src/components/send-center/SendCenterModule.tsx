"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { KpiSkeletonGrid } from "@/components/shared/loading";
import { DataStateView, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import {
  createDraftQueueRecordFromForm,
  defaultNewDraftFormValues,
  type NewDraftFormValues,
} from "@/data/newDraftForm";
import { createAiDraftSession, type AiDraftSession } from "@/data/aiDraftReview";
import type { ManualComposeValues } from "@/data/manualCompose";
import { resolveSendCenterAiSettings } from "@/data/sendCenterAiSettings";
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
import { toastMessages } from "@/lib/toastMessages";
import { HubOperationalStrips } from "@/components/layout/HubOperationalStrips";
import { SendCenterKpiCommand } from "./SendCenterKpiCommand";
import { SendCenterPageHeader } from "./SendCenterPageHeader";
import { DraftQueueTab } from "./DraftQueueTab";
import { PendingReviewTab } from "./PendingReviewTab";
import { ApprovedDraftsTab } from "./ApprovedDraftsTab";
import { SentProposalsTab } from "./SentProposalsTab";
import { TemplatesTab } from "./TemplatesTab";
import { AiDraftReviewView } from "./AiDraftReviewView";
import { AiDisabledBanner } from "./AiDisabledBanner";
import { ComposeWorkspace } from "./ComposeWorkspace";

const validTabIds = new Set<string>(sendCenterTabs.map((tab) => tab.id));

function resolveTab(view: string | null): SendCenterTabId {
  if (view && validTabIds.has(view)) return view as SendCenterTabId;
  return "draft-queue";
}

function manualValuesToDraftForm(values: ManualComposeValues): NewDraftFormValues {
  const localPart = values.to.split("@")[0]?.replace(/[._]/g, " ") || "Manual Recipient";
  const clientName = localPart.replace(/\b\w/g, (c) => c.toUpperCase());
  const defaults = defaultNewDraftFormValues();
  return {
    ...defaults,
    clientName,
    policyType: values.category === "General" ? "BOP" : values.category,
    producerAssigned: "Eva",
    carrier: "Travelers",
    productType: values.category,
    premiumEstimate: "1000",
    brokerFee: "0",
    taxesFees: "0",
    submissionType: "New Business",
    priority: values.priority,
    requiredDocuments: { ...defaults.requiredDocuments, "acord-125": true },
    internalNotes: values.body.slice(0, 240),
    emailSubject: values.subject,
    emailBody: values.body,
    selectedTemplate: values.category,
  };
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
  const aiSettings = useMemo(
    () => resolveSendCenterAiSettings(searchParams.get("ai")),
    [searchParams],
  );
  const aiDraftingEnabled = aiSettings.draftingEnabled;

  const [composeOpen, setComposeOpen] = useState(false);
  const [draftPrefill, setDraftPrefill] = useState<Partial<NewDraftFormValues> | undefined>();
  const [draftRows, setDraftRows] = useState<DraftQueueRecord[]>(draftQueueRecords);
  const [aiDraftSession, setAiDraftSession] = useState<AiDraftSession | null>(null);
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

  const openCompose = useCallback((prefill?: Partial<NewDraftFormValues>) => {
    setDraftPrefill(prefill);
    setComposeOpen(true);
  }, []);

  useCrossModuleHandoff("quote-to-draft", (payload) => {
    openCompose({
      clientName: payload.client ?? "",
      carrier: payload.carrier ?? "",
      premiumEstimate: payload.premium ?? "",
      brokerFee: payload.brokerFee ?? "",
      internalNotes: payload.quote ? `Imported from Quote Review: ${payload.quote}` : "",
    });
    showToast(`Quote loaded for ${payload.client ?? "client"}: review draft`, "success");
  });

  useCrossModuleHandoff("revise-proposal", (payload) => {
    openCompose({
      clientName: payload.client ?? "",
      internalNotes: `Revision requested from Outreach Queue for ${payload.client ?? "client"}.`,
    });
    showToast(`Revision draft opened for ${payload.client ?? "client"}`, "success");
  });

  const setActive = useCallback(
    (tabId: SendCenterTabId) => {
      const aiQuery = searchParams.get("ai");
      const params = new URLSearchParams();
      if (tabId !== "draft-queue") params.set("view", tabId);
      if (aiQuery) params.set("ai", aiQuery);
      const qs = params.toString();
      router.push(qs ? `${routes.sendCenter}?${qs}` : routes.sendCenter, { scroll: false });
    },
    [router, searchParams],
  );

  const openNewDraft = useCallback(() => {
    openCompose(undefined);
  }, [openCompose]);

  useShortcutAction("new-draft", openNewDraft);

  const handleNewDraftSave = useCallback(
    (form: NewDraftFormValues, submitForReview: boolean) => {
      const record = createDraftQueueRecordFromForm(form, submitForReview);
      setDraftRows((prev) => [record, ...prev]);
      setComposeOpen(false);
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

  const handleManualSave = useCallback(
    (values: ManualComposeValues) => {
      const form = manualValuesToDraftForm(values);
      const record = createDraftQueueRecordFromForm(form, false);
      setDraftRows((prev) => [record, ...prev]);
      showToast(toastMessages.sendCenter.draftSaved, "success");
    },
    [showToast],
  );

  const handleManualSend = useCallback(
    (values: ManualComposeValues) => {
      const form = manualValuesToDraftForm(values);
      const record = createDraftQueueRecordFromForm(form, false);
      setDraftRows((prev) => [record, ...prev]);
      setComposeOpen(false);
      setDraftPrefill(undefined);
      setActive("sent");
      showToast(toastMessages.sendCenter.proposalSent, "success");
    },
    [setActive, showToast],
  );

  const handleGenerateAiDraft = useCallback(
    (form: NewDraftFormValues) => {
      if (!aiDraftingEnabled) {
        showToast(aiSettings.disabledTooltip, "error");
        return;
      }
      const record = createDraftQueueRecordFromForm(form, false);
      setDraftRows((prev) => [record, ...prev]);
      setComposeOpen(false);
      setDraftPrefill(undefined);
      setAiDraftSession(createAiDraftSession(form));
      showToast(toastMessages.sendCenter.aiDraftGenerated, "success");
    },
    [aiDraftingEnabled, aiSettings.disabledTooltip, showToast],
  );

  const handleAiDraftSent = useCallback(
    (session: AiDraftSession) => {
      setAiDraftSession(null);
      setActive("approved");
      showToast(`${session.clientName} ready in Approved Drafts`, "success");
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

  if (composeOpen) {
    return (
      <ComposeWorkspace
        aiDraftingEnabled={aiDraftingEnabled}
        aiDisabledTooltip={aiSettings.disabledTooltip}
        initialMode={aiDraftingEnabled ? "ai" : "manual"}
        initialPrefill={draftPrefill}
        startEmpty={!draftPrefill}
        onClose={() => {
          setComposeOpen(false);
          setDraftPrefill(undefined);
        }}
        onSaveManual={handleManualSave}
        onSendManual={handleManualSend}
        onSaveAiDraft={handleNewDraftSave}
        onGenerateAiDraft={handleGenerateAiDraft}
        onToast={showToast}
      />
    );
  }

  if (aiDraftSession) {
    return (
      <AiDraftReviewView
        session={aiDraftSession}
        onSessionChange={setAiDraftSession}
        onClose={() => setAiDraftSession(null)}
        onToast={showToast}
        onSent={handleAiDraftSent}
      />
    );
  }

  return (
    <>
      <SendCenterPageHeader onQuickActionClick={handlePageQuickAction} />

      {!aiDraftingEnabled && (
        <div className="send-center-ai-disabled-page-banner-wrap">
          <AiDisabledBanner compact />
        </div>
      )}

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
