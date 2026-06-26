"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { hubErrorPresets, type HubErrorPresetId } from "@/data/hubStatePresets";
import { formatLastSynced } from "@/lib/dataState";
import { cn } from "@/lib/cn";
import type { HubErrorInfo } from "@/lib/dataState";

type HubErrorStateProps = {
  preset?: HubErrorPresetId;
  error?: HubErrorInfo;
  onRetry?: () => void;
  retrying?: boolean;
  lastSyncedAt?: Date | null;
  className?: string;
  compact?: boolean;
};

export function HubErrorState({
  preset = "generic-fetch",
  error,
  onRetry,
  retrying,
  lastSyncedAt,
  className,
  compact,
}: HubErrorStateProps) {
  const config = hubErrorPresets[preset];
  const title = error?.title ?? config.title;
  const message = error?.message ?? config.message;
  const severity = error?.severity ?? config.severity;
  const retryLabel = config.retryLabel ?? "Retry";
  const syncLabel = formatLastSynced(lastSyncedAt ?? null);

  return (
    <div
      className={cn(
        "hub-error-state",
        `hub-error-state--${severity}`,
        compact && "hub-error-state--compact",
        className,
      )}
      role="alert"
    >
      <div className="hub-error-state-icon" aria-hidden="true">
        <AppIcon name="triangle-alert" size={compact ? 22 : 28} strokeWidth={2} />
      </div>
      <h3 className="hub-error-state-title">{title}</h3>
      <p className="hub-error-state-message">{message}</p>
      {syncLabel && <p className="hub-error-state-sync">{syncLabel}</p>}
      {onRetry && (
        <button
          type="button"
          className={cn("va-ops-action-btn hub-error-state-retry", retrying && "hub-error-state-retry--active")}
          onClick={onRetry}
          disabled={retrying}
        >
          <AppIcon name="refresh" size={14} strokeWidth={2} className={retrying ? "hub-error-retry-spin" : undefined} />
          {retrying ? "Retrying…" : retryLabel}
        </button>
      )}
    </div>
  );
}
