"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  assignedTraining,
  assignmentStatusClass,
  certificationHealthClass,
  certificationStatusClass,
  contentFormatCards,
  recentlyAddedResources,
  resourceTypeClass,
  teamCertifications,
  trainingActivity,
  trainingDepartments,
  trainingHubKpis,
  type TrainingDepartment,
} from "@/data/trainingHub";
import {
  findResourceByTitleLoose,
  findResourceFromActivityMessage,
  getTrainingDetailHref,
} from "@/data/trainingLibrary";
import { crossModuleRoutes, resolveUserProfileId } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { cn } from "@/lib/cn";
import { KpiSkeletonGrid } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { useAvatarProfile } from "@/components/user-profile/AvatarProfileProvider";
import { DepartmentDetailDrawer } from "./DepartmentDetailDrawer";
import { DepartmentProgressRing } from "./DepartmentProgressRing";

export function DepartmentOverviewTab() {
  const router = useRouter();
  const { openProfile } = useAvatarProfile();
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => trainingDepartments,
    errorPreset: "supabase-timeout",
  });
  const [selectedDepartment, setSelectedDepartment] = useState<TrainingDepartment | null>(null);

  const openLibrary = (departmentId: string) => {
    setSelectedDepartment(null);
    router.push(`${routes.trainingHub}?view=library&dept=${departmentId}`, { scroll: false });
  };

  const openDetail = (resourceId: string) => {
    router.push(getTrainingDetailHref(resourceId, { from: "departments" }), { scroll: false });
  };

  const openDetailByTitle = (title: string) => {
    const resource = findResourceByTitleLoose(title);
    if (resource) openDetail(resource.id);
  };

  const viewAssignee = (assignee: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const userId = resolveUserProfileId(assignee);
    if (userId) openProfile(userId);
  };

  const viewActivity = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(
      crossModuleRoutes.recentActivity({
        href: `${routes.trainingHub}?view=departments`,
        label: "Training Hub",
      }),
    );
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view training-department-overview">
          <KpiSkeletonGrid count={4} />
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
    <div className="va-ops-role-view training-department-overview">
      <section className="va-ops-kpi-strip training-kpi-priority-strip" aria-label="Training hub KPI summary">
        <div className="commercial-hub-kpi-grid training-kpi-grid hub-kpi-grid">
          {trainingHubKpis.map((kpi) => (
            <VaOpsKpiCard
              key={kpi.label}
              {...kpi}
              className={cn(
                "commercial-hub-kpi-uniform",
                kpi.tier === "primary" && "training-kpi-card--primary",
                kpi.tier === "secondary" && "training-kpi-card--secondary",
              )}
              sparkline={false}
            />
          ))}
        </div>
      </section>

      <div className="va-ops-panel-header">
        <h3 className="va-ops-section-title">Live Training Pods</h3>
        <p className="va-ops-section-sub">Operational department views — assignments, overdue items, and certification health.</p>
      </div>
      <div className="training-dept-card-grid">
        {trainingDepartments.map((dept) => (
          <article key={dept.id} className="training-dept-card training-dept-pod">
            <button
              type="button"
              className="training-dept-card-body"
              onClick={() => setSelectedDepartment(dept)}
            >
              <div className="training-dept-card-header-row">
                <div className="training-dept-card-icon" aria-hidden="true">
                  <AppIcon name={dept.icon} size={22} strokeWidth={2} />
                </div>
                <DepartmentProgressRing
                  completion={dept.completion}
                  size={56}
                  label={dept.title}
                />
              </div>
              <div className="training-dept-pod-badges">
                {dept.overdueTrainingCount > 0 && (
                  <span className="badge badge-rose training-dept-overdue-badge">
                    {dept.overdueTrainingCount} overdue
                  </span>
                )}
                <span className={cn("badge", certificationHealthClass[dept.certificationHealth])}>
                  Cert: {dept.certificationHealth}
                </span>
              </div>
              <h4 className="training-dept-card-title">{dept.title}</h4>
              <p className="training-dept-card-desc">{dept.description}</p>
              <dl className="training-dept-card-stats training-dept-pod-stats">
                <div>
                  <dt>Assigned</dt>
                  <dd>{dept.assignedTrainingCount}</dd>
                </div>
                <div>
                  <dt>Resources</dt>
                  <dd>{dept.resources}</dd>
                </div>
                <div className="training-dept-pod-activity">
                  <dt>Last activity</dt>
                  <dd>{dept.lastActivity}</dd>
                </div>
              </dl>
            </button>
            <button
              type="button"
              className="training-dept-card-cta"
              onClick={() => openLibrary(dept.id)}
            >
              Open Department
            </button>
          </article>
        ))}
      </div>

      <section className="va-ops-panel training-certifications-panel" aria-label="Team certifications">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Certifications</h3>
          <p className="va-ops-section-sub">Active, expiring, expired, and required certifications across the team.</p>
        </div>
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Certification</th>
                <th>Holder</th>
                <th>Department</th>
                <th>Status</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {teamCertifications.map((cert) => (
                <tr key={cert.id}>
                  <td className="commercial-hub-client-cell">
                    {cert.name}
                    {cert.required && <span className="badge badge-violet training-cert-required">Required</span>}
                  </td>
                  <td>{cert.holder}</td>
                  <td>{cert.department}</td>
                  <td>
                    <span className={cn("badge", certificationStatusClass[cert.status])}>{cert.status}</span>
                  </td>
                  <td>{cert.expires ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="commercial-hub-mid-grid">
        <section className="va-ops-panel" aria-label="Recently added resources">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Recently Added</h3>
            <p className="va-ops-section-sub">Fresh training content across departments.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {recentlyAddedResources.map((row) => (
                  <tr
                    key={row.id}
                    className="training-hub-clickable-row"
                    tabIndex={0}
                    role="button"
                    onClick={() => openDetailByTitle(row.title)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDetailByTitle(row.title);
                      }
                    }}
                  >
                    <td className="commercial-hub-client-cell">{row.title}</td>
                    <td>{row.department}</td>
                    <td>
                      <span className={cn("badge", resourceTypeClass[row.type])}>{row.type}</span>
                    </td>
                    <td>{row.added}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel" aria-label="Assigned training">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Assigned Training</h3>
            <p className="va-ops-section-sub">Active assignments needing completion.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Training</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {assignedTraining.map((row) => (
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
                    <td>
                      {row.status === "Completed" ? (
                        <button type="button" className="va-ops-action-btn" onClick={viewActivity}>
                          View Activity
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="va-ops-action-btn"
                          onClick={(event) => viewAssignee(row.assignee, event)}
                        >
                          View Assignee
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="va-ops-panel-header">
        <h3 className="va-ops-section-title">Browse by Format</h3>
        <p className="va-ops-section-sub">Alternate content browsing by resource type.</p>
      </div>
      <div className="training-format-grid">
        {contentFormatCards.map((format) => (
          <article key={format.id} className="training-format-card">
            <div className="training-format-icon" aria-hidden="true">
              <AppIcon name={format.icon} size={22} strokeWidth={2} />
            </div>
            <h4 className="training-format-title">{format.title}</h4>
            <div className="training-format-count">{format.count}</div>
            <button type="button" className="va-ops-action-btn">View All</button>
          </article>
        ))}
      </div>

      <section className="va-ops-panel" aria-label="Training activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Training Activity</h3>
          <p className="va-ops-section-sub">Team learning visibility.</p>
        </div>
        <ol className="outreach-activity-timeline">
          {trainingActivity.map((item) => {
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
              {item.message.toLowerCase().includes("completed") && (
                <button
                  type="button"
                  className="va-ops-action-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    viewActivity(event);
                  }}
                >
                  View Activity
                </button>
              )}
            </li>
            );
          })}
        </ol>
      </section>

      <DepartmentDetailDrawer
        department={selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
        onOpenLibrary={openLibrary}
      />
    </div>
    </DataStateView>
  );
}
