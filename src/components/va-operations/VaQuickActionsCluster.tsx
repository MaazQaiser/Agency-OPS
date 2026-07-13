"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import { vaQuickActions, type VaQuickActionId } from "@/data/vaQuickActions";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";

type VaQuickActionsClusterProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function VaQuickActionsCluster({ open, onToggle, onClose }: VaQuickActionsClusterProps) {
  const clusterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toast = useToast();

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

  const handleAction = (actionId: VaQuickActionId) => {
    const action = vaQuickActions.find((item) => item.id === actionId);
    if (!action) return;
    onClose();
    if (action.href) {
      router.push(action.href);
    }
    toast.success(`${action.label}: opening`);
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="va-quick-actions-backdrop"
          aria-label="Close quick actions"
          onClick={onClose}
        />
      )}

      <div
        ref={clusterRef}
        className={cn("va-quick-actions-cluster", open && "va-quick-actions-cluster--open")}
        aria-label="VA quick actions"
      >
        <div className="va-quick-actions-menu" aria-hidden={!open}>
          {vaQuickActions.map((action, index) => (
            <button
              key={action.id}
              type="button"
              className="va-quick-actions-item"
              style={{ "--va-qa-index": index } as React.CSSProperties}
              aria-label={action.label}
              onClick={() => handleAction(action.id)}
            >
              <span className="va-quick-actions-item-tooltip">{action.tooltip}</span>
              <AppIcon name={action.icon} size={18} strokeWidth={2.25} />
            </button>
          ))}
        </div>

        <button
          type="button"
          className={cn("va-quick-actions-trigger", open && "va-quick-actions-trigger--open")}
          aria-label={open ? "Close quick actions" : "Open quick actions"}
          aria-expanded={open}
          onClick={onToggle}
        >
          <span className="va-quick-actions-trigger-glow" aria-hidden="true" />
          <AppIcon name="zap" size={20} strokeWidth={2.35} />
        </button>
      </div>
    </>
  );
}
