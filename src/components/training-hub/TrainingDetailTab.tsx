"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  getTrainingDetail,
  getTypeDisplayLabel,
  resourceCompletionClass,
  trainingDetailHeader,
  type RelatedTrainingItem,
  type SopStep,
} from "@/data/trainingDetail";
import { teamCertifications, certificationStatusClass } from "@/data/trainingHub";
import { findResourceByTitle, getTrainingDetailHref } from "@/data/trainingLibrary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { FormSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { RelatedResourceDrawer } from "./RelatedResourceDrawer";
import { TrainingQuizBlock } from "./TrainingQuizBlock";

const DEFAULT_RESOURCE_ID = "lib-quote-script";

export function TrainingDetailTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("resource") ?? DEFAULT_RESOURCE_ID;
  const returnFrom = searchParams.get("from");
  const returnDept = searchParams.get("dept");

  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => getTrainingDetail(resourceId),
    deps: [resourceId],
    errorPreset: "supabase-timeout",
  });

  const detail = useMemo(() => getTrainingDetail(resourceId), [resourceId]);

  const [sopSteps, setSopSteps] = useState<SopStep[]>([]);
  const [quizValidated, setQuizValidated] = useState(false);
  const [notes, setNotes] = useState("");
  const [relatedDrawer, setRelatedDrawer] = useState<RelatedTrainingItem | null>(null);

  useEffect(() => {
    if (detail) {
      setSopSteps(detail.sopSteps);
      setQuizValidated(false);
      setNotes("");
    }
  }, [detail]);

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

  if (!detail) {
    return (
      <DataStateView
        status={status}
        lastSyncedAt={lastSyncedAt}
        isStale={isStale}
        showFreshness={false}
        loading={
          <div className="va-ops-role-view training-detail">
            <FormSkeleton />
          </div>
        }
        empty={
          <HubEmptyState
            preset="training-content"
            title="Training resource not found"
            description="The requested training resource could not be loaded."
            ctaLabel="Back to Library"
            onAction={() => router.push(`${routes.trainingHub}?view=library`, { scroll: false })}
          />
        }
        error={
          <HubErrorState
            preset="supabase-timeout"
            onRetry={retry}
            retrying={retrying}
            lastSyncedAt={lastSyncedAt}
          />
        }
      >
        {null}
      </DataStateView>
    );
  }

  const { resource } = detail;

  const toggleStep = (stepId: string) => {
    setSopSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, complete: !s.complete } : s)),
    );
  };

  const progressPercent = detail.readProgress ?? detail.playbackProgress ?? 0;

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
          <div className="training-content-preview-header">
            <span className="training-content-preview-type">Video preview</span>
            <span className="training-content-preview-time">Est. {detail.estimatedCompletionTime}</span>
          </div>
          <div className="training-video-preview" aria-label="Video player preview">
            <div className="training-video-preview-play" aria-hidden="true">
              <AppIcon name="folder" size={32} strokeWidth={1.5} />
            </div>
            <div className="training-video-preview-body">
              <strong>{resource.title}</strong>
              <span>Loom training video · {resource.duration}</span>
            </div>
          </div>
          {detail.resumeLabel && (
            <p className="training-resume-label">
              <AppIcon name="clock" size={14} strokeWidth={2} />
              {detail.resumeLabel}
            </p>
          )}
          <div className="training-progress-memory">
            <div className="training-progress-memory-top">
              <span>Watched</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="training-video-progress">
              <div className="training-video-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      );
    }

    if (resource.type === "Scribe" && detail.scribeSteps) {
      return (
        <div className="training-content-viewer training-script-viewer">
          <div className="training-content-preview-header">
            <span className="training-content-preview-type">Script preview</span>
            <span className="training-content-preview-time">Est. {detail.estimatedCompletionTime}</span>
          </div>
          {detail.resumeLabel && (
            <p className="training-resume-label">
              <AppIcon name="clock" size={14} strokeWidth={2} />
              {detail.resumeLabel}
            </p>
          )}
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
          <div className="training-progress-memory">
            <div className="training-progress-memory-top">
              <span>Read</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="training-video-progress">
              <div className="training-video-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="training-content-viewer training-doc-viewer-wrap">
        <div className="training-content-preview-header">
          <span className="training-content-preview-type">Document preview</span>
          <span className="training-content-preview-time">Est. {detail.estimatedCompletionTime}</span>
        </div>
        {detail.resumeLabel && (
          <p className="training-resume-label">
            <AppIcon name="clock" size={14} strokeWidth={2} />
            {detail.resumeLabel}
          </p>
        )}
        <div className="training-doc-viewer">
          {detail.documentSections?.map((section, index) => (
            <div key={index} className="training-doc-section">
              <div className="training-doc-section-num">{index + 1}</div>
              <p>{section}</p>
            </div>
          ))}
        </div>
        <div className="training-progress-memory">
          <div className="training-progress-memory-top">
            <span>Read</span>
            <strong>{progressPercent}%</strong>
          </div>
          <div className="training-video-progress">
            <div className="training-video-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view training-detail">
          <FormSkeleton />
        </div>
      }
      empty={<HubEmptyState preset="training-content" />}
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
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

          <section className="va-ops-panel" aria-label="Knowledge validation quiz">
            <TrainingQuizBlock questions={detail.quiz} onValidated={setQuizValidated} />
          </section>
        </div>

        <section className="va-ops-panel" aria-label="Related training">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Related Training</h3>
            <p className="va-ops-section-sub">Continue your learning path.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
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

        <section className="va-ops-panel" aria-label="Team completion leaderboard">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Team Completion Leaderboard</h3>
            <p className="va-ops-section-sub">Completion rates and quiz performance across the team.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table training-leaderboard-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Completion %</th>
                  <th>Avg Quiz Score</th>
                  <th>Last Completed Training</th>
                </tr>
              </thead>
              <tbody>
                {detail.teamLeaderboard.map((entry) => (
                  <tr key={entry.id}>
                    <td className="commercial-hub-client-cell">{entry.member}</td>
                    <td>
                      <span className="training-leaderboard-completion">{entry.completionPercent}%</span>
                    </td>
                    <td>{entry.avgQuizScore}%</td>
                    <td>{entry.lastCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel training-detail-certifications" aria-label="Certifications">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Certifications</h3>
            <p className="va-ops-section-sub">Certification status related to this department.</p>
          </div>
          <ul className="training-cert-list">
            {teamCertifications
              .filter((c) => c.department === resource.department || c.holder === "All Team")
              .map((cert) => (
                <li key={cert.id} className="training-cert-list-item">
                  <div>
                    <strong>{cert.name}</strong>
                    <span>{cert.holder}</span>
                  </div>
                  <span className={cn("badge", certificationStatusClass[cert.status])}>{cert.status}</span>
                </li>
              ))}
          </ul>
        </section>

        <div className="training-detail-sticky-actions">
          <div className="training-detail-sticky-inner">
            <button
              type="button"
              className="va-ops-role-action-btn intake-form-submit-btn"
              disabled={!quizValidated && resource.requirementLevel === "Required"}
              title={!quizValidated ? "Pass the knowledge validation quiz first" : undefined}
            >
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
    </DataStateView>
  );
}
