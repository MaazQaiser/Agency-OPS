"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { savedDrafts, type IntakeDraftStatus } from "@/data/intakeForms";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { TableSkeleton } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";

const draftStatusClass: Record<IntakeDraftStatus, string> = {
  Draft: "badge-gray",
  "In Progress": "badge-yellow",
};

export function DraftsTab() {
  const loading = useTabLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightDraftId = searchParams.get("draft");

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

  if (loading) {
    return (
      <div className="va-ops-role-view intake-drafts">
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view intake-drafts">
      <section className="va-ops-panel" aria-label="Saved drafts">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Draft Submissions</h3>
          <p className="va-ops-section-sub">
            Resume incomplete intake forms — drafts are saved automatically or via Save Draft.
          </p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Form Type</th>
                <th>Last Edited</th>
                <th>Completion %</th>
                <th>Status</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {savedDrafts.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="commercial-hub-empty-state" role="status">
                      <div className="commercial-hub-empty-state-title">No saved drafts</div>
                      <p className="commercial-hub-empty-state-desc">
                        Start a new submission and use Save Draft to continue later.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                savedDrafts.map((draft) => (
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
                      <span className={cn("badge", draftStatusClass[draft.status])}>
                        {draft.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="va-ops-action-btn"
                        onClick={() => resumeDraft(draft)}
                      >
                        Resume
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
