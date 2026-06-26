"use client";

import { useCallback, useEffect, useRef } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { evaQuickActions, type EvaQuickActionId } from "@/data/evaQuickActions";
import { cn } from "@/lib/cn";

type EvaQuickActionsClusterProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onAction: (actionId: EvaQuickActionId) => void;
};

export function EvaQuickActionsCluster({
  open,
  onToggle,
  onClose,
  onAction,
}: EvaQuickActionsClusterProps) {
  const clusterRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (event: MouseEvent) => {
      if (!open) return;
      if (clusterRef.current?.contains(event.target as Node)) return;
      onClose();
    },
    [onClose, open],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [handlePointerDown, open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  return (
    <>
      {open && (
        <button
          type="button"
          className="eva-fab-backdrop"
          aria-label="Close quick actions"
          onClick={onClose}
        />
      )}

      <div
        ref={clusterRef}
        className={cn("eva-fab-cluster", open && "eva-fab-cluster--open")}
        aria-label="Eva quick actions"
      >
        <div className="eva-fab-mobile-sheet" aria-hidden={!open}>
          <div className="eva-fab-mobile-sheet-header">
            <span>⚡ Eva Actions</span>
            <button type="button" className="eva-fab-mobile-close" aria-label="Close" onClick={onClose}>
              <AppIcon name="close" size={16} strokeWidth={2.25} />
            </button>
          </div>
          <ul className="eva-fab-mobile-list">
            {evaQuickActions.map((action) => (
              <li key={action.id}>
                <button
                  type="button"
                  className={cn("eva-fab-mobile-item", `eva-fab-mobile-item--${action.color}`)}
                  onClick={() => onAction(action.id)}
                >
                  <span className="eva-fab-mobile-item-icon">
                    <AppIcon name={action.icon} size={18} strokeWidth={2.25} />
                  </span>
                  <span className="eva-fab-mobile-item-copy">
                    <span className="eva-fab-mobile-item-label">{action.label}</span>
                    <span className="eva-fab-mobile-item-desc">{action.tooltip}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="eva-fab-actions" aria-hidden={!open}>
          {evaQuickActions.map((action, index) => (
            <button
              key={action.id}
              type="button"
              className={cn("eva-fab-action", `eva-fab-action--${action.color}`)}
              style={{ "--eva-fab-index": index } as React.CSSProperties}
              aria-label={action.label}
              onClick={() => onAction(action.id)}
            >
              <span className="eva-fab-action-tooltip">{action.tooltip}</span>
              <AppIcon name={action.icon} size={20} strokeWidth={2.25} />
            </button>
          ))}
        </div>

        <button
          type="button"
          className={cn("eva-fab-trigger", open && "eva-fab-trigger--open")}
          aria-label={open ? "Close Eva quick actions" : "Open Eva quick actions"}
          aria-expanded={open}
          onClick={onToggle}
        >
          <span className="eva-fab-trigger-glow" aria-hidden="true" />
          <AppIcon name="zap" size={22} strokeWidth={2.35} className="eva-fab-trigger-icon" />
          <span className="eva-fab-trigger-label">Eva Actions</span>
        </button>
      </div>
    </>
  );
}
