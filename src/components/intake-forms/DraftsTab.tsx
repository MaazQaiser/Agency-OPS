"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { savedDrafts, type IntakeDraftStatus } from "@/data/intakeForms";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";

const draftStatusClass: Record<IntakeDraftStatus, string> = {
  Draft: "badge-violet",
  "In Progress": "badge-amber",
};

const ownerUserIds: Record<string, string> = {
  JoJo: "jojo",
  Pedro: "pedro-va",
  Tracie: "tracie-wong",
  Valerie: "valerie-martinez",
};

export function DraftsTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightDraftId = searchParams.get("draft");
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => savedDrafts,
    errorPreset: "supabase-timeout",
  });

  const resumeDraft = useCallback(
    (draft: (typeof savedDrafts)[number]) => {
      router.push(`${routes.intakeForms}?view=new-submission&form=${draft.formType}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (!highlightDraftId) return;
    const draft = savedDrafts.find((row) => row.id === highlightDraftId);
    if (draft) resumeDraft(draft);
  }, [highlightDraftId, resumeDraft]);

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view intake-drafts">
          <TableSkeleton rows={5} />
        </div>
      }
      empty={<HubEmptyState preset="intake-forms" />}
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
      <div className="va-ops-role-view intake-drafts">
        <section className="va-ops-panel" aria-label="Saved drafts">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Draft Submissions</h3>
            <p className="va-ops-section-sub">
              Resume incomplete intake forms — drafts are saved automatically or via Save Draft.
            </p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Form Type</th>
                  <th>Last Edited</th>
                  <th>Completion</th>
                  <th>Assigned Owner</th>
                  <th>Status</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {savedDrafts.map((draft) => (
                  <tr
                    key={draft.id}
                    className={cn(highlightDraftId === draft.id && "submission-tracker-row-expanded")}
                  >
                    <td className="commercial-hub-client-cell">{draft.client}</td>
                    <td>{draft.form}</td>
                    <td>{draft.lastEdited}</td>
                    <td>
                      <div className="intake-draft-progress">
                        <div className="intake-draft-progress-bar">
                          <div
                            className="intake-draft-progress-fill"
                            style={{ width: `${draft.progress}%` }}
                          />
                        </div>
                        <span>{draft.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="intake-draft-owner">
                        <TeamAvatar
                          userId={ownerUserIds[draft.assignedOwner]}
                          name={draft.assignedOwner}
                          size="xs"
                          showStatus={false}
                        />
                        {draft.assignedOwner}
                      </span>
                    </td>
                    <td>
                      <span className={cn("badge", draftStatusClass[draft.status])}>
                        {draft.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="va-ops-action-btn primary"
                        onClick={() => resumeDraft(draft)}
                      >
                        Resume
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DataStateView>
  );
}
