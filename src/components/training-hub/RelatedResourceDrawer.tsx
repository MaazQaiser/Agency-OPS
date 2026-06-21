"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { RelatedTrainingItem } from "@/data/trainingDetail";
import { resourceTypeClass } from "@/data/trainingHub";
import { cn } from "@/lib/cn";

type RelatedResourceDrawerProps = {
  resource: RelatedTrainingItem | null;
  onClose: () => void;
  onOpen?: (title: string) => void;
};

export function RelatedResourceDrawer({ resource, onClose, onOpen }: RelatedResourceDrawerProps) {
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

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close related resource"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${resource.title} preview`}
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
          <div className="training-resource-drawer-badges">
            <span className={cn("badge", resourceTypeClass[resource.type])}>{resource.type}</span>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Summary</div>
            <p className="va-ops-drawer-text">{resource.summary}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Assigned Users</div>
            <ul className="va-ops-gap-list">
              {resource.assignedUsers.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
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
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button
                type="button"
                className="va-ops-drawer-action-btn primary"
                onClick={() => onOpen?.(resource.title)}
              >
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Open Resource
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="user-plus" size={15} strokeWidth={2} />
                Assign
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="star" size={15} strokeWidth={2} />
                Bookmark
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
