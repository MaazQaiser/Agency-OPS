"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  getTrainingDetail,
  getTypeDisplayLabel,
  resourceCompletionClass,
  trainingDetailHeader,
  type KnowledgeQuestion,
  type RelatedTrainingItem,
  type SopStep,
} from "@/data/trainingDetail";
import { findResourceByTitle, getTrainingDetailHref } from "@/data/trainingLibrary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { CardSkeletonGrid, FormSkeleton } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { RelatedResourceDrawer } from "./RelatedResourceDrawer";

const DEFAULT_RESOURCE_ID = "lib-quote-script";

export function TrainingDetailTab() {
  const loading = useTabLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("resource") ?? DEFAULT_RESOURCE_ID;
  const returnFrom = searchParams.get("from");
  const returnDept = searchParams.get("dept");

  const detail = useMemo(() => getTrainingDetail(resourceId), [resourceId]);

  const [sopSteps, setSopSteps] = useState<SopStep[]>([]);
  const [knowledgeCheck, setKnowledgeCheck] = useState<KnowledgeQuestion[]>([]);
  const [notes, setNotes] = useState("");
  const [relatedDrawer, setRelatedDrawer] = useState<RelatedTrainingItem | null>(null);

  useEffect(() => {
    if (detail) {
      setSopSteps(detail.sopSteps);
      setKnowledgeCheck(detail.knowledgeCheck.map((q) => ({ ...q })));
      setNotes("");
    }
  }, [detail]);

  if (loading) {
    return (
      <div className="va-ops-role-view training-detail">
        <FormSkeleton />
        <CardSkeletonGrid count={2} />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="va-ops-role-view training-detail">
        <section className="va-ops-panel">
          <p>Training resource not found.</p>
          <button
            type="button"
            className="va-ops-role-action-btn"
            onClick={() => router.push(`${routes.trainingHub}?view=library`, { scroll: false })}
          >
            Back to Library
          </button>
        </section>
      </div>
    );
  }

  const { resource } = detail;

  const toggleStep = (stepId: string) => {
    setSopSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, complete: !s.complete } : s)),
    );
  };

  const setKnowledgeAnswer = (questionId: string, answer: "yes" | "no") => {
    setKnowledgeCheck((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answer } : q)),
    );
  };

  const goBack = () => {
    if (returnFrom === "departments") {
      router.push(routes.trainingHub, { scroll: false });
      return;
    }
    if (returnFrom === "library") {
      router.push(
        returnDept
          ? `${routes.trainingHub}?view=library&dept=${returnDept}`
          : `${routes.trainingHub}?view=library`,
        { scroll: false },
      );
      return;
    }
    router.back();
  };

  const goToLibrary = () => {
    router.push(
      returnDept
        ? `${routes.trainingHub}?view=library&dept=${returnDept}`
        : `${routes.trainingHub}?view=library`,
      { scroll: false },
    );
  };

  const openResource = (id: string) => {
    router.push(
      getTrainingDetailHref(id, {
        from: returnFrom === "departments" ? "departments" : "library",
        dept: returnDept,
      }),
      { scroll: false },
    );
  };

  const openByTitle = (title: string) => {
    const match = findResourceByTitle(title);
    if (match) {
      setRelatedDrawer(null);
      openResource(match.id);
    }
  };

  const goNext = () => {
    if (detail.nextTrainingId) openResource(detail.nextTrainingId);
  };

  const renderContentViewer = () => {
    if (resource.type === "Loom") {
      return (
        <div className="training-content-viewer training-video-viewer">
          <div className="training-video-placeholder" aria-label="Video player placeholder">
            <AppIcon name="folder" size={48} strokeWidth={1.5} />
            <span>{resource.title}</span>
          </div>
          <div className="training-video-meta">
            <span>Video duration: {resource.duration}</span>
            {detail.playbackProgress != null && (
              <span>Playback progress: {detail.playbackProgress}%</span>
            )}
          </div>
          {detail.playbackProgress != null && (
            <div className="training-video-progress">
              <div
                className="training-video-progress-fill"
                style={{ width: `${detail.playbackProgress}%` }}
              />
            </div>
          )}
        </div>
      );
    }

    if (resource.type === "Scribe" && detail.scribeSteps) {
      return (
        <ol className="training-scribe-steps">
          {detail.scribeSteps.map((step, index) => (
            <li key={step.id}>
              <div className="training-scribe-step-index">{index + 1}</div>
              <div>
                <div className="training-scribe-step-title">{step.title}</div>
                <p className="training-scribe-step-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    }

    return (
      <div className="training-doc-viewer">
        {detail.documentSections?.map((section, index) => (
          <div key={index} className="training-doc-section">
            <div className="training-doc-section-num">{index + 1}</div>
            <p>{section}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="va-ops-role-view training-detail">
      <header className="training-detail-header">
        <div className="training-detail-header-left">
          <button type="button" className="training-detail-back" onClick={goBack}>
            <AppIcon name="chevron-down" size={16} strokeWidth={2.5} className="training-back-icon" />
            Back
          </button>
          <div>
            <h2 className="va-ops-role-title">{trainingDetailHeader.title}</h2>
            <p className="va-ops-role-subtitle">{trainingDetailHeader.subtitle}</p>
          </div>
        </div>
        <div className="va-ops-role-actions">
          {trainingDetailHeader.quickActions.map((action) => (
            <button key={action.id} type="button" className="va-ops-role-action-btn">
              <AppIcon name={action.icon} size={15} strokeWidth={2} />
              {action.label}
            </button>
          ))}
        </div>
      </header>

      <section className="va-ops-panel training-detail-summary" aria-label="Resource summary">
        <div className="training-detail-summary-main">
          <h3 className="training-detail-resource-title">{resource.title}</h3>
          <dl className="training-detail-summary-grid">
            <div><dt>Department</dt><dd>{resource.department}</dd></div>
            <div><dt>Type</dt><dd>{getTypeDisplayLabel(resource.type)}</dd></div>
            <div><dt>Duration</dt><dd>{resource.duration}</dd></div>
            <div><dt>Created By</dt><dd>{detail.createdBy}</dd></div>
            <div><dt>Last Updated</dt><dd>{resource.lastUpdated}</dd></div>
            <div><dt>Assigned To</dt><dd>{resource.assignedTo}</dd></div>
            <div>
              <dt>Completion Status</dt>
              <dd>
                <span className={cn("badge", resourceCompletionClass[resource.completionStatus])}>
                  {resource.completionStatus}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="training-detail-main">
        <section className="va-ops-panel" aria-label="Content viewer">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Content</h3>
            <p className="va-ops-section-sub">{resource.title}</p>
          </div>
          {renderContentViewer()}
        </section>

        <aside className="training-detail-sidebar">
          <section className="va-ops-panel">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Resource Overview</h3>
            </div>
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Description</div>
              <p className="va-ops-drawer-text">{resource.drawer.description}</p>
            </div>
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Tags</div>
              <div className="training-resource-tags">
                {resource.tags.map((tag) => (
                  <span key={tag} className="training-resource-tag">{tag}</span>
                ))}
              </div>
            </div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div><dt>Skill Level</dt><dd>{detail.skillLevel}</dd></div>
              <div><dt>Required For</dt><dd>{detail.requiredFor}</dd></div>
              <div><dt>Completion Time</dt><dd>{detail.estimatedCompletionTime}</dd></div>
            </dl>
          </section>
        </aside>
      </div>

      <section className="va-ops-panel" aria-label="Key steps">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Key Steps</h3>
          <p className="va-ops-section-sub">Mark steps complete as you work through the training.</p>
        </div>
        <ul className="training-sop-steps">
          {sopSteps.map((step) => (
            <li key={step.id} className={cn(step.complete && "complete")}>
              <button type="button" className="training-sop-step-btn" onClick={() => toggleStep(step.id)}>
                <AppIcon name={step.complete ? "check" : "x"} size={16} strokeWidth={2.5} />
                <span>{step.label}</span>
                <span className="training-sop-step-status">{step.complete ? "Complete" : "Incomplete"}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="commercial-hub-mid-grid">
        <section className="va-ops-panel" aria-label="Personal notes">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">My Notes</h3>
            <p className="va-ops-section-sub">Saved by user.</p>
          </div>
          <textarea
            className="intake-form-input intake-form-textarea training-detail-notes"
            rows={5}
            placeholder="Add your notes, reminders, or questions here."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <section className="va-ops-panel" aria-label="Quick review">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Quick Review</h3>
            <p className="va-ops-section-sub">Basic training validation.</p>
          </div>
          <ul className="training-knowledge-check">
            {knowledgeCheck.map((q) => (
              <li key={q.id}>
                <p className="training-knowledge-question">{q.question}</p>
                <div className="training-knowledge-options">
                  {(["yes", "no"] as const).map((opt) => (
                    <label key={opt} className="intake-form-radio">
                      <input
                        type="radio"
                        name={q.id}
                        checked={q.answer === opt}
                        onChange={() => setKnowledgeAnswer(q.id, opt)}
                      />
                      {opt === "yes" ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel" aria-label="Related training">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Related Training</h3>
          <p className="va-ops-section-sub">Continue your learning path.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Type</th>
                <th>Duration</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {detail.relatedTraining.map((rel) => (
                <tr key={rel.id}>
                  <td className="commercial-hub-client-cell">{rel.title}</td>
                  <td>{rel.type}</td>
                  <td>{rel.duration}</td>
                  <td>
                    <button
                      type="button"
                      className="va-ops-action-btn"
                      onClick={() => setRelatedDrawer(rel)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Completion history">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Completion History</h3>
          <p className="va-ops-section-sub">Track team usage of this resource.</p>
        </div>
        <ul className="training-completion-history">
          {detail.completionHistory.map((item) => (
            <li key={item.id}>
              <span>{item.message}</span>
              <span>{item.timeAgo}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="training-detail-sticky-actions">
        <div className="training-detail-sticky-inner">
          <button type="button" className="va-ops-role-action-btn intake-form-submit-btn">
            <AppIcon name="check" size={15} strokeWidth={2} />
            Mark Complete
          </button>
          <button type="button" className="va-ops-role-action-btn">
            Save Notes
          </button>
          <button
            type="button"
            className="va-ops-role-action-btn training-detail-next-btn"
            onClick={goNext}
            disabled={!detail.nextTrainingId}
          >
            Next Training
          </button>
        </div>
      </div>

      <RelatedResourceDrawer
        resource={relatedDrawer}
        onClose={() => setRelatedDrawer(null)}
        onOpen={openByTitle}
      />
    </div>
  );
}
