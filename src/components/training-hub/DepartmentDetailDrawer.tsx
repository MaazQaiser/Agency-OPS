"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { TrainingDepartment } from "@/data/trainingHub";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";

type DepartmentDetailDrawerProps = {
  department: TrainingDepartment | null;
  onClose: () => void;
  onOpenLibrary?: (departmentId: string) => void;
};

export function DepartmentDetailDrawer({
  department,
  onClose,
  onOpenLibrary,
}: DepartmentDetailDrawerProps) {
  useEffect(() => {
    if (!department) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [department, onClose]);

  if (!department) return null;

  const { drawer } = department;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close department details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${department.title} training overview`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{department.title}</div>
              <div className="va-ops-drawer-role">
                {department.resources} resources · {department.completion}% complete
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Department Summary</div>
            <p className="va-ops-drawer-text">{drawer.summary}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Team Members</div>
            <ul className="va-ops-gap-list">
              {drawer.teamMembers.map((member) => (
                <li key={member}>
                  <UserChip name={member} />
                </li>
              ))}
            </ul>
          </div>

          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div><dt>Total Resources</dt><dd>{department.resources}</dd></div>
            <div><dt>Last Updated</dt><dd>{department.lastUpdated}</dd></div>
          </dl>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Recent Updates</div>
            <ul className="va-ops-gap-list">
              {drawer.recentUpdates.map((update) => (
                <li key={update}>{update}</li>
              ))}
            </ul>
          </div>

          {drawer.pendingAssignments.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Pending Assignments</div>
              <ul className="training-drawer-assignments">
                {drawer.pendingAssignments.map((a) => (
                  <li key={`${a.name}-${a.training}`}>
                    <strong>{a.name}</strong> — {a.training}
                    <span>Due: {a.due}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Completion Stats</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              {drawer.completionStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button
                type="button"
                className="va-ops-drawer-action-btn primary"
                onClick={() => onOpenLibrary?.(department.id)}
              >
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Open Library
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="user-plus" size={15} strokeWidth={2} />
                Assign Training
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="upload" size={15} strokeWidth={2} />
                Upload Resource
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
