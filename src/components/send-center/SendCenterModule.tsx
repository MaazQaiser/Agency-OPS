"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { KpiSkeletonGrid } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { createDraftQueueRecordFromForm, type NewDraftFormValues } from "@/data/newDraftForm";
import {
  draftQueueRecords,
  sendCenterKpis,
  sendCenterTabs,
  type DraftQueueRecord,
  type SendCenterTabId,
} from "@/data/sendCenter";
import { useCrossModuleHandoff } from "@/hooks/useCrossModuleHandoff";
import { useToast, createLegacyToastHandler } from "@/hooks/useToast";
import { ModuleBreadcrumbBar } from "@/components/shared/ModuleBreadcrumbBar";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import { getVisibleSendCenterTabs } from "@/data/rolePermissions";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
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
  const kpiLoading = useTabLoading();

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
    if (actionId === "export-log") {
      showToast("Communication log exported from proposal records", "success");
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
      <ModuleBreadcrumbBar />

      <section className="va-ops-kpi-strip send-center-kpi-strip" aria-label="Send Center summary">
        {kpiLoading ? (
          <KpiSkeletonGrid count={4} />
        ) : (
        <div className="commercial-hub-kpi-grid send-center-kpi-grid">
          {sendCenterKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
        )}
      </section>

      <nav className="va-ops-tab-nav" aria-label="Send Center views">
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

      <div className="va-ops-tab-content">
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
      </div>
    </>
  );
}
