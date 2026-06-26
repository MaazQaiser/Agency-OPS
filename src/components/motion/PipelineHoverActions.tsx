"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

type PipelineHoverActionsProps = {
  className?: string;
  onView?: () => void;
  onAssign?: () => void;
  onEscalate?: () => void;
  onFlag?: () => void;
};

export function PipelineHoverActions({
  className,
  onView,
  onAssign,
  onEscalate,
  onFlag,
}: PipelineHoverActionsProps) {
  return (
    <div className={cn("pipeline-hover-actions", className)} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="pipeline-hover-action-btn" onClick={onView} aria-label="View">
        <AppIcon name="search" size={13} strokeWidth={2} />
        View
      </button>
      <button type="button" className="pipeline-hover-action-btn" onClick={onAssign} aria-label="Assign">
        <AppIcon name="users" size={13} strokeWidth={2} />
        Assign
      </button>
      <button type="button" className="pipeline-hover-action-btn" onClick={onEscalate} aria-label="Escalate">
        <AppIcon name="triangle-alert" size={13} strokeWidth={2} />
        Escalate
      </button>
      <button type="button" className="pipeline-hover-action-btn" onClick={onFlag} aria-label="Flag">
        <AppIcon name="flag" size={13} strokeWidth={2} />
        Flag
      </button>
    </div>
  );
}
