"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  assignmentStatusClass,
  resourceTypeCardClass,
} from "@/data/trainingHub";
import {
  contentBadgeClass,
  requirementLevelClass,
  resourceCompletionClass,
  findResourceByTitleLoose,
  findResourceFromActivityMessage,
  getInitialLibraryFilters,
  getTrainingDetailHref,
  libraryActivity,
  libraryAssignedTraining,
  libraryFilterOptions,
  librarySearchPlaceholder,
  matchesLibraryFilters,
  popularTopics,
  recentlyViewed,
  trainingLibraryHeader,
  trainingLibraryKpis,
  trainingResources,
  type LibraryFilterState,
} from "@/data/trainingLibrary";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { cn } from "@/lib/cn";
import { AssignTrainingModal } from "./AssignTrainingModal";
import { ManageCategoriesModal } from "./ManageCategoriesModal";

const memberUserIds: Record<string, string> = {
  Kat: "kat",
  Jaffer: "jaffer",
  Pedro: "pedro-va",
  JoJo: "jojo",
  Eva: "eva-chong",
};

const filterLabels: Record<keyof LibraryFilterState, string> = {
  department: "Department",
  contentType: "Content Type",
  tags: "Tags",
  completionStatus: "Completion Status",
  assignedTo: "Assigned To",
};

export function TrainingLibraryTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deptParam = searchParams.get("dept");
  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => trainingResources,
    errorPreset: "supabase-timeout",
  });

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<LibraryFilterState>(() =>
    getInitialLibraryFilters(deptParam),
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useShortcutAction("assign-training", () => setAssignOpen(true));

  useEffect(() => {
    const ownerAction = searchParams.get("ownerAction");
    if (ownerAction === "assign") setAssignOpen(true);
    if (ownerAction === "categories") setCategoriesOpen(true);
  }, [searchParams]);

  const effectiveFilters = useMemo(
    () => (activeTag ? { ...filters, tags: activeTag } : filters),
    [filters, activeTag],
  );

  const filteredResources = useMemo(
    () => trainingResources.filter((r) => matchesLibraryFilters(r, search, effectiveFilters)),
    [search, effectiveFilters],
  );

  const status = resolveDisplayStatus(loadStatus, filteredResources, (d) => d.length === 0);

  const openDetail = (resourceId: string) => {
    router.push(
      getTrainingDetailHref(resourceId, { from: "library", dept: deptParam }),
      { scroll: false },
    );
  };

  const openDetailByTitle = (title: string) => {
    const resource = findResourceByTitleLoose(title);
    if (resource) openDetail(resource.id);
  };

  const updateFilter = (key: keyof LibraryFilterState, value: string) => {
    setActiveTag(null);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyTagFilter = (tag: string) => {
    setActiveTag(tag);
    setFilters((prev) => ({ ...prev, tags: tag }));
  };

  const openRecentlyViewed = (title: string) => {
    openDetailByTitle(title);
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === "assign") setAssignOpen(true);
    if (actionId === "categories") setCategoriesOpen(true);
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view training-library">
          <TableSkeleton rows={6} />
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
    <div className="va-ops-role-view training-library">
      <RoleTabHeader
        title={trainingLibraryHeader.title}
        subtitle={trainingLibraryHeader.subtitle}
        quickActions={trainingLibraryHeader.quickActions}
        onQuickActionClick={handleQuickAction}
      />

      <div className="training-library-filters">
        <label className="va-ops-search training-library-search" aria-label="Search training">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input
            type="search"
            className="va-ops-search-input"
            placeholder={librarySearchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        {(Object.keys(libraryFilterOptions) as (keyof LibraryFilterState)[]).map((key) => (
          <label key={key} className="training-library-filter">
            <select
              className="header-filter-select training-library-select"
              aria-label={filterLabels[key]}
              value={activeTag && key === "tags" ? activeTag : filters[key]}
              onChange={(e) => updateFilter(key, e.target.value)}
            >
              {libraryFilterOptions[key].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <section className="va-ops-kpi-strip" aria-label="Training library KPI summary">
        <div className="commercial-hub-kpi-grid hub-kpi-grid training-kpi-grid">
          {trainingLibraryKpis.map((kpi) => (
            <VaOpsKpiCard key={kpi.label} {...kpi} className="commercial-hub-kpi-uniform" sparkline={false} />
          ))}
        </div>
      </section>

      <div className="va-ops-panel-header training-library-resources-header">
        <h3 className="va-ops-section-title">Training Resources</h3>
        <p className="va-ops-section-sub">
          {filteredResources.length} resource{filteredResources.length === 1 ? "" : "s"} — click a card for details.
        </p>
      </div>
      <div className="training-resource-grid">
          {filteredResources.map((resource) => (
            <article key={resource.id} className={cn("training-resource-card", resourceTypeCardClass[resource.type])}>
              <button
                type="button"
                className="training-resource-card-body"
                onClick={() => openDetail(resource.id)}
              >
                <div className="training-resource-card-top">
                  <span className={cn("training-resource-type-badge", contentBadgeClass[resource.contentBadge])}>
                    {resource.contentBadge}
                  </span>
                  <span className={cn("badge training-resource-requirement", requirementLevelClass[resource.requirementLevel])}>
                    {resource.requirementLevel}
                  </span>
                </div>
                <h4 className="training-resource-title">{resource.title}</h4>
                <div className="training-resource-priority-row">
                  <span className={cn("badge", resourceCompletionClass[resource.completionStatus])}>
                    {resource.completionStatus}
                  </span>
                  <span className="training-resource-dept-meta">{resource.department}</span>
                </div>
                <dl className="training-resource-meta training-resource-meta--compact">
                  <div className="training-resource-meta-row training-resource-meta-row--secondary">
                    <dt>Duration</dt>
                    <dd>{resource.duration}</dd>
                  </div>
                  <div className="training-resource-meta-row training-resource-meta-row--tertiary">
                    <dt>Difficulty</dt>
                    <dd>{resource.difficulty}</dd>
                  </div>
                  <div className="training-resource-meta-row training-resource-meta-row--tertiary">
                    <dt>Updated</dt>
                    <dd>{resource.lastUpdated}</dd>
                  </div>
                </dl>
                {resource.progressPercent != null && resource.completionStatus !== "Completed" && (
                  <div className="training-resource-progress">
                    <div className="training-resource-progress-label">
                      <span>Progress</span>
                      <span>{resource.progressPercent}%</span>
                    </div>
                    <div className="training-resource-progress-track">
                      <div
                        className="training-resource-progress-fill"
                        style={{ width: `${resource.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="training-resource-tags">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="training-resource-tag">{tag}</span>
                  ))}
                </div>
              </button>
              <div className="training-resource-action-strip">
                <button
                  type="button"
                  className="training-resource-action-btn"
                  onClick={() => openDetail(resource.id)}
                >
                  <span>Open Resource</span>
                </button>
              </div>
            </article>
          ))}
      </div>

      <div className="training-library-lower-grid">
        <section className="va-ops-panel training-library-primary" aria-label="Assigned training queue">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Assigned Training</h3>
            <p className="va-ops-section-sub">Track assigned resources across the team.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Training</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {libraryAssignedTraining.map((row) => (
                  <tr
                    key={row.id}
                    className="training-hub-clickable-row"
                    tabIndex={0}
                    role="button"
                    onClick={() => openDetailByTitle(row.training)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDetailByTitle(row.training);
                      }
                    }}
                  >
                    <td className="commercial-hub-client-cell">{row.assignee}</td>
                    <td>{row.training}</td>
                    <td>{row.due}</td>
                    <td>
                      <span className={cn("badge", assignmentStatusClass[row.status])}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel training-library-secondary-compact" aria-label="Recently viewed">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Recently Viewed</h3>
            <p className="va-ops-section-sub">Fast return to recent learning.</p>
          </div>
          <ul className="training-recent-list">
            {recentlyViewed.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  className="training-recent-item"
                  onClick={() => openRecentlyViewed(row.title)}
                >
                  <span className="training-recent-title">{row.title}</span>
                  <span className="training-recent-time">{row.viewed}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel training-topics-panel" aria-label="Popular topics">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Popular Topics</h3>
          <p className="va-ops-section-sub">Filter by tag usage across the library.</p>
        </div>
        <div className="training-popular-tags">
          {popularTopics.map(({ tag, usageCount }) => (
            <button
              key={tag}
              type="button"
              className={cn("training-popular-tag", activeTag === tag && "active")}
              onClick={() => applyTagFilter(tag)}
            >
              <span className="training-popular-tag-label">{tag}</span>
              <span className="training-popular-tag-count">{usageCount}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="va-ops-panel training-activity-panel" aria-label="Training activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Training Activity</h3>
          <p className="va-ops-section-sub">Learning visibility across the team.</p>
        </div>
        <ol className="training-activity-timeline">
          {libraryActivity.map((item) => {
            const linkedResource = findResourceFromActivityMessage(item.message);
            return (
            <li
              key={item.id}
              className={cn("training-activity-item", linkedResource && "training-hub-clickable-row")}
              tabIndex={linkedResource ? 0 : undefined}
              role={linkedResource ? "button" : undefined}
              onClick={() => linkedResource && openDetail(linkedResource.id)}
              onKeyDown={(event) => {
                if (!linkedResource) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openDetail(linkedResource.id);
                }
              }}
            >
              <TeamAvatar
                userId={memberUserIds[item.actor]}
                name={item.actor}
                size="sm"
                showStatus={false}
                className="training-activity-avatar"
              />
              <div className="training-activity-body">
                <div className="training-activity-message">{item.message}</div>
                <time className="training-activity-time">{item.timeAgo}</time>
              </div>
            </li>
            );
          })}
        </ol>
      </section>

      <AssignTrainingModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssign={() => undefined}
      />
      <ManageCategoriesModal
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
        onSave={() => undefined}
      />
    </div>
    </DataStateView>
  );
}
