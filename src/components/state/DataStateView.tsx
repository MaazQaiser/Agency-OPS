"use client";

import type { ReactNode } from "react";
import type { DataStatus } from "@/lib/dataState";
import { cn } from "@/lib/cn";
import { DataFreshnessBadge } from "./DataFreshnessBadge";

type DataStateViewProps = {
  status: DataStatus;
  children: ReactNode;
  loading?: ReactNode;
  empty?: ReactNode;
  error?: ReactNode;
  lastSyncedAt?: Date | null;
  isStale?: boolean;
  showFreshness?: boolean;
  className?: string;
};

export function DataStateView({
  status,
  children,
  loading,
  empty,
  error,
  lastSyncedAt,
  isStale,
  showFreshness = true,
  className,
}: DataStateViewProps) {
  return (
    <div className={cn("data-state-view", className)}>
      {showFreshness && status === "success" && lastSyncedAt && (
        <div className="data-state-freshness-row">
          <DataFreshnessBadge lastSyncedAt={lastSyncedAt} />
        </div>
      )}

      {status === "loading" && (
        <div className="data-state-panel data-state-panel--loading" aria-busy="true">
          {loading}
        </div>
      )}

      {status === "error" && (
        <div className="data-state-panel data-state-panel--error">{error}</div>
      )}

      {status === "empty" && (
        <div className="data-state-panel data-state-panel--empty motion-empty-enter">{empty}</div>
      )}

      {status === "success" && (
        <div
          className={cn(
            "data-state-panel data-state-panel--success motion-data-loaded",
            isStale && "data-state-panel--stale",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
