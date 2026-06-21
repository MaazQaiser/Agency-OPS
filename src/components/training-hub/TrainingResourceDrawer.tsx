"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { TrainingResource } from "@/data/trainingLibrary";
import { resourceCompletionClass } from "@/data/trainingLibrary";
import { resourceTypeClass } from "@/data/trainingHub";
import { cn } from "@/lib/cn";

type TrainingResourceDrawerProps = {
  resource: TrainingResource | null;
  onClose: () => void;
  onOpenResource?: (resourceId: string) => void;
};

export function TrainingResourceDrawer({ resource, onClose, onOpenResource }: TrainingResourceDrawerProps) {
  useEffect(() => {
    if (!resource) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [resource, onClose]);

  if (!resource) return null;

  const { drawer } = resource;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close resource details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${resource.title} details`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{resource.title}</div>
              <div className="va-ops-drawer-role">
                {resource.department} · {resource.duration}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="training-resource-drawer-badges">
              <span className={cn("badge", resourceTypeClass[resource.type])}>{resource.type}</span>
              <span className={cn("badge", resourceCompletionClass[resource.completionStatus])}>
                {resource.completionStatus}
              </span>
            </div>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Description</div>
            <p className="va-ops-drawer-text">{drawer.description}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Tags</div>
            <div className="training-resource-tags">
              {resource.tags.map((tag) => (
                <span key={tag} className="training-resource-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Assigned Users</div>
            <ul className="va-ops-gap-list">
              {drawer.assignedUsers.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </div>

          {drawer.completionLogs.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Completion Logs</div>
              <ul className="training-completion-log">
                {drawer.completionLogs.map((log) => (
                  <li key={`${log.user}-${log.date}`}>
                    <strong>{log.user}</strong> — {log.status}
                    <span>{log.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Related Resources</div>
            <ul className="va-ops-gap-list">
              {drawer.relatedResources.map((related) => (
                <li key={related}>{related}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button
                type="button"
                className="va-ops-drawer-action-btn primary"
                onClick={() => onOpenResource?.(resource.id)}
              >
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Open Resource
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Mark Complete
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="user-plus" size={15} strokeWidth={2} />
                Assign to Team
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="star" size={15} strokeWidth={2} />
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
