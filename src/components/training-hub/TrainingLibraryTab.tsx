"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  assignmentStatusClass,
  resourceTypeClass,
} from "@/data/trainingHub";
import {
  findResourceByTitleLoose,
  findResourceFromActivityMessage,
  getInitialLibraryFilters,
  getTrainingDetailHref,
  libraryActivity,
  libraryAssignedTraining,
  libraryFilterOptions,
  librarySearchPlaceholder,
  matchesLibraryFilters,
  popularTags,
  recentlyViewed,
  resourceCompletionClass,
  trainingLibraryHeader,
  trainingLibraryKpis,
  trainingResources,
  type LibraryFilterState,
} from "@/data/trainingLibrary";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { CardSkeletonGrid, KpiSkeletonGrid } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useShortcutAction } from "@/hooks/useShortcutAction";
import { cn } from "@/lib/cn";
import { AssignTrainingModal } from "./AssignTrainingModal";
import { ManageCategoriesModal } from "./ManageCategoriesModal";

const filterLabels: Record<keyof LibraryFilterState, string> = {
  department: "Department",
  contentType: "Content Type",
  tags: "Tags",
  completionStatus: "Completion Status",
  assignedTo: "Assigned To",
};

export function TrainingLibraryTab() {
  const loading = useTabLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deptParam = searchParams.get("dept");

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

  if (loading) {
    return (
      <div className="va-ops-role-view training-library">
        <KpiSkeletonGrid count={4} />
        <CardSkeletonGrid count={6} tall />
      </div>
    );
  }

  return (
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
        <div className="commercial-hub-kpi-grid training-kpi-grid">
          {trainingLibraryKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <div className="va-ops-panel-header">
        <h3 className="va-ops-section-title">Training Resources</h3>
        <p className="va-ops-section-sub">
          {filteredResources.length} resource{filteredResources.length === 1 ? "" : "s"} — click a card for details.
        </p>
      </div>
      <div className="training-resource-grid">
          {filteredResources.map((resource) => (
            <article key={resource.id} className="training-resource-card">
              <button
                type="button"
                className="training-resource-card-body"
                onClick={() => openDetail(resource.id)}
              >
                <h4 className="training-resource-title">{resource.title}</h4>
                <dl className="training-resource-meta">
                  <div><dt>Department</dt><dd>{resource.department}</dd></div>
                  <div>
                    <dt>Type</dt>
                    <dd>
                      <span className={cn("badge", resourceTypeClass[resource.type])}>
                        {resource.type}
                      </span>
                    </dd>
                  </div>
                  <div><dt>Duration</dt><dd>{resource.duration}</dd></div>
                  <div><dt>Assigned To</dt><dd>{resource.assignedTo}</dd></div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <span className={cn("badge", resourceCompletionClass[resource.completionStatus])}>
                        {resource.completionStatus}
                      </span>
                    </dd>
                  </div>
                  <div><dt>Last Updated</dt><dd>{resource.lastUpdated}</dd></div>
                </dl>
                <div className="training-resource-tags">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="training-resource-tag">{tag}</span>
                  ))}
                </div>
              </button>
              <button
                type="button"
                className="training-resource-cta"
                onClick={() => openDetail(resource.id)}
              >
                Open Resource
              </button>
            </article>
          ))}
      </div>

      <div className="commercial-hub-mid-grid">
        <section className="va-ops-panel" aria-label="Assigned training queue">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Assigned Training</h3>
            <p className="va-ops-section-sub">Track assigned resources across the team.</p>
          </div>
          <div className="commercial-hub-table-wrap">
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

        <section className="va-ops-panel" aria-label="Recently viewed">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Recently Viewed</h3>
            <p className="va-ops-section-sub">Fast return to recent learning.</p>
          </div>
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Viewed</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {recentlyViewed.map((row) => (
                  <tr
                    key={row.id}
                    className="training-hub-clickable-row"
                    tabIndex={0}
                    role="button"
                    onClick={() => openRecentlyViewed(row.title)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openRecentlyViewed(row.title);
                      }
                    }}
                  >
                    <td className="commercial-hub-client-cell">{row.title}</td>
                    <td>{row.viewed}</td>
                    <td>
                      <button
                        type="button"
                        className="va-ops-action-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          openRecentlyViewed(row.title);
                        }}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="va-ops-panel" aria-label="Popular topics">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Popular Topics</h3>
          <p className="va-ops-section-sub">Quick topic navigation by tag.</p>
        </div>
        <div className="training-popular-tags">
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={cn("training-popular-tag", activeTag === tag && "active")}
              onClick={() => applyTagFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Training activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Training Activity</h3>
          <p className="va-ops-section-sub">Learning visibility across the team.</p>
        </div>
        <ol className="outreach-activity-timeline">
          {libraryActivity.map((item) => {
            const linkedResource = findResourceFromActivityMessage(item.message);
            return (
            <li
              key={item.id}
              className={cn("outreach-activity-item", linkedResource && "training-hub-clickable-row")}
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
              <div className="outreach-activity-dot" aria-hidden="true" />
              <div className="outreach-activity-content">
                <div className="outreach-activity-message">{item.message}</div>
                <div className="outreach-activity-time">{item.timeAgo}</div>
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
  );
}
