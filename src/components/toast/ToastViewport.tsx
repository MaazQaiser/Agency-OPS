"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";
import { TOAST_ICONS, type ToastItem } from "./types";

type ToastViewportProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
};

export function ToastViewport({ toasts, onDismiss, onPause, onResume }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="ops-toast-viewport" aria-live="polite" aria-relevant="additions text">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn("ops-toast", `ops-toast-${toast.type}`)}
          role="status"
          onMouseEnter={() => onPause(toast.id)}
          onMouseLeave={() => onResume(toast.id)}
        >
          <span className={cn("ops-toast-icon", toast.type === "processing" && "ops-toast-icon-spin")}>
            <AppIcon name={TOAST_ICONS[toast.type]} size={18} strokeWidth={2.25} />
          </span>
          <div className="ops-toast-body">
            <p className="ops-toast-message">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                className="ops-toast-action"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
          <button
            type="button"
            className="ops-toast-dismiss"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            <AppIcon name="close" size={14} strokeWidth={2.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
