"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type SkeletonBlockProps = {
  className?: string;
  style?: CSSProperties;
  rounded?: "sm" | "md" | "lg" | "full";
};

/** Lightweight shimmer block. Presentation only. */
export function Skeleton({ className, style, rounded = "md" }: SkeletonBlockProps) {
  return (
    <span
      className={cn("ops-skeleton", `ops-skeleton--${rounded}`, "ops-skeleton-shimmer", className)}
      style={style}
      aria-hidden="true"
    />
  );
}

type SkeletonProps = {
  className?: string;
  label?: string;
};

const TABLE_COL_WIDTHS = [120, 70, 80, 110, 90, 50, 100, 70];
const KPI_LABEL_WIDTHS = [88, 104, 76, 96, 110];
const KPI_VALUE_WIDTHS = [118, 142, 96, 132, 150];
const KPI_SUPPORT_WIDTHS = [140, 168, 112, 156, 180];
const CHART_BAR_HEIGHTS = [38, 62, 48, 78, 54, 70, 44];

export function KpiSkeleton({ className, index = 0 }: { className?: string; index?: number }) {
  return (
    <div className={cn("ops-skeleton-kpi-card", className)}>
      <Skeleton className="ops-skeleton-kpi-label" style={{ width: KPI_LABEL_WIDTHS[index % KPI_LABEL_WIDTHS.length] }} />
      <Skeleton className="ops-skeleton-kpi-value" style={{ width: KPI_VALUE_WIDTHS[index % KPI_VALUE_WIDTHS.length] }} />
      <Skeleton className="ops-skeleton-kpi-support" style={{ width: KPI_SUPPORT_WIDTHS[index % KPI_SUPPORT_WIDTHS.length] }} />
      <Skeleton className="ops-skeleton-kpi-trend" />
    </div>
  );
}

export function KpiSkeletonGrid({ count = 4, className, label = "Loading KPIs" }: SkeletonProps & { count?: number }) {
  return (
    <section className={cn("va-ops-kpi-strip", className)} aria-busy="true" aria-live="polite" aria-label={label}>
      <div className={cn("ops-skeleton-kpi-grid", count === 5 && "cols-5", count === 3 && "cols-3")}>
        {Array.from({ length: count }).map((_, i) => (
          <KpiSkeleton key={i} index={i} />
        ))}
      </div>
    </section>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
  className,
  label = "Loading table",
}: SkeletonProps & { rows?: number; columns?: number }) {
  const cols = Math.min(Math.max(columns, 3), TABLE_COL_WIDTHS.length);
  return (
    <div className={cn("ops-skeleton-table", className)} aria-busy="true" aria-live="polite" aria-label={label}>
      <div className="ops-skeleton-table-head" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className="ops-skeleton-table-head-cell"
            style={{ width: TABLE_COL_WIDTHS[i % TABLE_COL_WIDTHS.length] }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="ops-skeleton-table-row">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              className="ops-skeleton-table-cell"
              style={{
                width: TABLE_COL_WIDTHS[(j + i) % TABLE_COL_WIDTHS.length],
                flex: j === 0 ? 1.4 : 1,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({
  className,
  label = "Loading chart",
  variant = "bar",
}: SkeletonProps & { variant?: "bar" | "line" | "ring" }) {
  return (
    <div
      className={cn("ops-skeleton-chart", `ops-skeleton-chart--${variant}`, className)}
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
    >
      {variant === "ring" ? (
        <div className="ops-skeleton-ring" />
      ) : variant === "line" ? (
        <div className="ops-skeleton-chart-line-wrap">
          <svg className="ops-skeleton-chart-line" viewBox="0 0 320 160" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8 118 C 48 108, 72 86, 110 92 S 168 128, 210 74 S 268 40, 312 58" />
          </svg>
        </div>
      ) : (
        <div className="ops-skeleton-chart-bars">
          {CHART_BAR_HEIGHTS.map((height, i) => (
            <div key={i} className="ops-skeleton-chart-bar ops-skeleton-shimmer" style={{ height: `${height}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}

export function PipelineSkeleton({
  count = 5,
  className,
  label = "Loading pipeline",
}: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("ops-skeleton-pipeline-stages", className)} aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ops-skeleton-pipeline-stage">
          <Skeleton className="ops-skeleton-pipeline-title" style={{ width: 72 + (i % 3) * 12 }} />
          <Skeleton className="ops-skeleton-pipeline-count" style={{ width: 48 + (i % 2) * 16 }} />
          <Skeleton className="ops-skeleton-pipeline-value" style={{ width: 86 + (i % 3) * 10 }} />
          <Skeleton className="ops-skeleton-pipeline-status" />
        </div>
      ))}
    </div>
  );
}

export function PipelineCardSkeleton({
  count = 3,
  className,
  label = "Loading pipeline",
}: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("ops-skeleton-pipeline-list", className)} aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ops-skeleton-pipeline-card">
          <div className="ops-skeleton-pipeline-main">
            <Skeleton className="ops-skeleton-line wide" />
            <Skeleton className="ops-skeleton-line" />
          </div>
          <Skeleton className="ops-skeleton-pipeline-badge" rounded="lg" />
        </div>
      ))}
    </div>
  );
}

export function ActivitySkeleton({
  count = 5,
  className,
  label = "Loading activity",
}: SkeletonProps & { count?: number }) {
  const titleWidths = [160, 132, 184, 148, 172, 120];
  const supportWidths = [210, 176, 198, 154, 188, 166];
  return (
    <div className={cn("ops-skeleton-activity", className)} aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ops-skeleton-activity-row">
          <Skeleton className="ops-skeleton-avatar" rounded="full" />
          <div className="ops-skeleton-activity-text">
            <Skeleton className="ops-skeleton-line" style={{ width: titleWidths[i % titleWidths.length] }} />
            <Skeleton className="ops-skeleton-line short" style={{ width: supportWidths[i % supportWidths.length] }} />
          </div>
          <Skeleton className="ops-skeleton-activity-time" />
        </div>
      ))}
    </div>
  );
}

export function AvatarListSkeleton({
  count = 4,
  className,
  label = "Loading team",
}: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("ops-skeleton-avatar-list", className)} aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ops-skeleton-avatar-list-row">
          <Skeleton className="ops-skeleton-avatar" rounded="full" />
          <div className="ops-skeleton-avatar-list-text">
            <Skeleton className="ops-skeleton-line wide" />
            <Skeleton className="ops-skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeletonGrid({
  count = 3,
  className,
  label = "Loading cards",
  tall = false,
}: SkeletonProps & { count?: number; tall?: boolean }) {
  return (
    <div className={cn("ops-skeleton-card-grid", className)} aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn("ops-skeleton-card", tall && "tall")}>
          <Skeleton className="ops-skeleton-line short" />
          <Skeleton className="ops-skeleton-line wide" />
          <Skeleton className="ops-skeleton-block" />
        </div>
      ))}
    </div>
  );
}

export function DrawerSkeleton({ label = "Loading drawer" }: { label?: string }) {
  return (
    <div className="ops-skeleton-drawer" aria-busy="true" aria-live="polite" aria-label={label}>
      <div className="ops-skeleton-drawer-header">
        <Skeleton className="ops-skeleton-avatar" rounded="full" />
        <div className="ops-skeleton-drawer-title">
          <Skeleton className="ops-skeleton-line wide" />
          <Skeleton className="ops-skeleton-line" />
        </div>
      </div>
      <Skeleton className="ops-skeleton-line short" />
      <Skeleton className="ops-skeleton-block" />
      <Skeleton className="ops-skeleton-line short" />
      <div className="ops-skeleton-drawer-list">
        <Skeleton className="ops-skeleton-line wide" />
        <Skeleton className="ops-skeleton-line" />
        <Skeleton className="ops-skeleton-line wide" />
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 6, label = "Loading form" }: { fields?: number; label?: string }) {
  return (
    <div className="ops-skeleton-form" aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="ops-skeleton-field">
          <Skeleton className="ops-skeleton-line short" />
          <Skeleton className="ops-skeleton-input" />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ items = 4, label = "Loading timeline" }: { items?: number; label?: string }) {
  return (
    <div className="ops-skeleton-timeline" aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="ops-skeleton-timeline-item">
          <Skeleton className="ops-skeleton-dot" rounded="full" />
          <Skeleton className="ops-skeleton-line wide" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton({ label = "Loading profile" }: { label?: string }) {
  return (
    <div className="avatar-profile-skeleton" aria-busy="true" aria-live="polite" aria-label={label}>
      <Skeleton className="ops-skeleton-avatar large" rounded="full" />
      <Skeleton className="avatar-profile-skeleton-block" />
      <Skeleton className="avatar-profile-skeleton-block tall" />
      <Skeleton className="avatar-profile-skeleton-block" />
    </div>
  );
}

export function SearchResultsSkeleton({ rows = 3, label = "Searching" }: { rows?: number; label?: string }) {
  return (
    <div className="global-search-skeleton" aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="global-search-skeleton-card ops-skeleton-shimmer" />
      ))}
    </div>
  );
}

export function CommandPaletteSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="cmd-palette-skeleton" aria-busy="true" aria-live="polite" aria-label="Loading results">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="cmd-palette-skeleton-row" />
      ))}
    </div>
  );
}

export function NotificationListSkeleton({
  count = 5,
  className,
  label = "Loading notifications",
}: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("ops-skeleton-notification-list", className)} aria-busy="true" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ops-skeleton-notification-card">
          <Skeleton className="ops-skeleton-notification-icon" />
          <div className="ops-skeleton-notification-body">
            <Skeleton className="ops-skeleton-line wide" />
            <Skeleton className="ops-skeleton-line" />
            <Skeleton className="ops-skeleton-line short" />
          </div>
        </div>
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
