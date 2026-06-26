"use client";

import { cn } from "@/lib/cn";

type SkeletonProps = {
  className?: string;
  label?: string;
};

export function TableSkeleton({
  rows = 6,
  columns = 5,
  className,
  label = "Loading table",
}: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn("ops-skeleton-table", className)} aria-busy="true" aria-label={label}>
      <div className="ops-skeleton-table-head">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="ops-skeleton-table-head-cell ops-skeleton-shimmer" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="ops-skeleton-table-row">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className="ops-skeleton-table-cell ops-skeleton-shimmer"
              style={{ flex: j === 0 ? 1.4 : 1 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function KpiSkeletonGrid({ count = 4, className, label = "Loading KPIs" }: SkeletonProps & { count?: number }) {
  return (
    <section className={cn("va-ops-kpi-strip", className)} aria-busy="true" aria-label={label}>
      <div className={cn("ops-skeleton-kpi-grid", count === 5 && "cols-5", count === 3 && "cols-3")}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="ops-skeleton-kpi-card">
            <div className="ops-skeleton-line short ops-skeleton-shimmer" />
            <div className="ops-skeleton-kpi-value ops-skeleton-shimmer" />
            <div className="ops-skeleton-kpi-sparkline ops-skeleton-shimmer" />
            <div className="ops-skeleton-line ops-skeleton-shimmer" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function CardSkeletonGrid({
  count = 3,
  className,
  label = "Loading cards",
  tall = false,
}: SkeletonProps & { count?: number; tall?: boolean }) {
  return (
    <div className={cn("ops-skeleton-card-grid", className)} aria-busy="true" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn("ops-skeleton-card", tall && "tall")} />
      ))}
    </div>
  );
}

export function DrawerSkeleton({ label = "Loading drawer" }: { label?: string }) {
  return (
    <div className="ops-skeleton-drawer" aria-busy="true" aria-label={label}>
      <div className="ops-skeleton-drawer-header">
        <div className="ops-skeleton-avatar pulse" />
        <div className="ops-skeleton-drawer-title">
          <div className="ops-skeleton-line wide" />
          <div className="ops-skeleton-line" />
        </div>
      </div>
      <div className="ops-skeleton-block" />
      <div className="ops-skeleton-block tall" />
      <div className="ops-skeleton-block" />
    </div>
  );
}

export function FormSkeleton({ fields = 6, label = "Loading form" }: { fields?: number; label?: string }) {
  return (
    <div className="ops-skeleton-form" aria-busy="true" aria-label={label}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="ops-skeleton-field">
          <div className="ops-skeleton-line short" />
          <div className="ops-skeleton-input" />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ items = 4, label = "Loading timeline" }: { items?: number; label?: string }) {
  return (
    <div className="ops-skeleton-timeline" aria-busy="true" aria-label={label}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="ops-skeleton-timeline-item">
          <div className="ops-skeleton-dot" />
          <div className="ops-skeleton-line wide" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ className, label = "Loading chart" }: SkeletonProps) {
  return (
    <div className={cn("ops-skeleton-chart", className)} aria-busy="true" aria-label={label}>
      <div className="ops-skeleton-chart-bars">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="ops-skeleton-chart-bar" style={{ height: `${30 + (i % 4) * 15}%` }} />
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton({ label = "Loading profile" }: { label?: string }) {
  return (
    <div className="avatar-profile-skeleton" aria-busy="true" aria-label={label}>
      <div className="ops-skeleton-avatar pulse large" />
      <div className="avatar-profile-skeleton-block" />
      <div className="avatar-profile-skeleton-block tall" />
      <div className="avatar-profile-skeleton-block" />
    </div>
  );
}

export function SearchResultsSkeleton({ rows = 3, label = "Searching" }: { rows?: number; label?: string }) {
  return (
    <div className="global-search-skeleton" aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="global-search-skeleton-card" />
      ))}
    </div>
  );
}

export function CommandPaletteSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="cmd-palette-skeleton" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="cmd-palette-skeleton-row" />
      ))}
    </div>
  );
}

export function AiThinkingLoader({ message = "Analyzing search context…" }: { message?: string }) {
  return (
    <div className="ops-ai-thinking" role="status" aria-live="polite">
      <span className="ops-ai-thinking-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="ops-ai-thinking-text">{message}</span>
    </div>
  );
}

export function SearchingIndicator({ className }: { className?: string }) {
  return (
    <p className={cn("ops-searching-indicator", className)} role="status" aria-live="polite">
      Searching…
    </p>
  );
}

/** Backward-compatible aliases */
export const SendCenterTableSkeleton = TableSkeleton;

export function PipelineCardSkeleton({ count = 3, className, label = "Loading pipeline" }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("ops-skeleton-pipeline-list", className)} aria-busy="true" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ops-skeleton-pipeline-card">
          <div className="ops-skeleton-pipeline-main">
            <div className="ops-skeleton-line wide ops-skeleton-shimmer" />
            <div className="ops-skeleton-line ops-skeleton-shimmer" />
          </div>
          <div className="ops-skeleton-pipeline-badge ops-skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function NotificationListSkeleton({ count = 5, className, label = "Loading notifications" }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("ops-skeleton-notification-list", className)} aria-busy="true" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ops-skeleton-notification-card">
          <div className="ops-skeleton-notification-icon ops-skeleton-shimmer" />
          <div className="ops-skeleton-notification-body">
            <div className="ops-skeleton-line wide ops-skeleton-shimmer" />
            <div className="ops-skeleton-line ops-skeleton-shimmer" />
            <div className="ops-skeleton-line short ops-skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AvatarListSkeleton({ count = 4, className, label = "Loading team" }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("ops-skeleton-avatar-list", className)} aria-busy="true" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ops-skeleton-avatar-list-row">
          <div className="ops-skeleton-avatar ops-skeleton-shimmer" />
          <div className="ops-skeleton-avatar-list-text">
            <div className="ops-skeleton-line wide ops-skeleton-shimmer" />
            <div className="ops-skeleton-line short ops-skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
