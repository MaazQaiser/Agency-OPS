"use client";

import { formatLastSynced, isDataStale } from "@/lib/dataState";
import { cn } from "@/lib/cn";

type DataFreshnessBadgeProps = {
  lastSyncedAt: Date | null;
  staleAfterMs?: number;
  className?: string;
};

export function DataFreshnessBadge({
  lastSyncedAt,
  staleAfterMs = 15 * 60 * 1000,
  className,
}: DataFreshnessBadgeProps) {
  if (!lastSyncedAt) return null;

  const stale = isDataStale(lastSyncedAt, staleAfterMs);
  const label = formatLastSynced(lastSyncedAt);

  return (
    <span
      className={cn(
        "data-freshness-badge",
        stale && "data-freshness-badge--stale",
        className,
      )}
      role="status"
    >
      {stale ? "Stale data warning · " : ""}
      {label}
    </span>
  );
}
