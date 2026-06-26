"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { hubEmptyPresets, type HubEmptyPresetId } from "@/data/hubStatePresets";
import { cn } from "@/lib/cn";
import type { AppIconName } from "@/components/ui/AppIcon";

type HubEmptyStateProps = {
  preset?: HubEmptyPresetId;
  icon?: AppIconName;
  title?: string;
  description?: string;
  ctaLabel?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
};

export function HubEmptyState({
  preset,
  icon,
  title,
  description,
  ctaLabel,
  onAction,
  className,
  compact,
}: HubEmptyStateProps) {
  const config = preset ? hubEmptyPresets[preset] : null;
  const resolvedIcon = icon ?? config?.icon ?? "folder";
  const resolvedTitle = title ?? config?.title ?? "Nothing here yet";
  const resolvedDescription = description ?? config?.description ?? "";
  const resolvedCta = ctaLabel ?? config?.ctaLabel;

  return (
    <div
      className={cn("hub-empty-state", "motion-empty-enter", compact && "hub-empty-state--compact", className)}
      role="status"
    >
      <div className="hub-empty-state-icon-wrap motion-empty-icon">
        <AppIcon name={resolvedIcon} size={compact ? 24 : 32} strokeWidth={1.75} />
      </div>
      <h3 className="hub-empty-state-title">{resolvedTitle}</h3>
      <p className="hub-empty-state-desc">{resolvedDescription}</p>
      {resolvedCta && onAction && (
        <button type="button" className="va-ops-action-btn hub-empty-state-cta motion-empty-cta" onClick={onAction}>
          {resolvedCta}
        </button>
      )}
    </div>
  );
}
