"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

type EPayConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant?: "default" | "warning";
  onClose: () => void;
  onConfirm: () => void;
};

export function EPayConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  variant = "default",
  onClose,
  onConfirm,
}: EPayConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close confirmation" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">{title}</h2>
            <p className="va-ops-modal-subtitle">{message}</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className={cn(
              "va-ops-role-action-btn intake-form-continue-btn",
              variant === "warning" && "epay-confirm-warning-btn",
            )}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
