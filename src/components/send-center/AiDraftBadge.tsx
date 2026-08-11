"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

export const AI_DRAFT_BADGE_TOOLTIP =
  "This draft was generated using AI and should be reviewed before sending.";

type AiDraftBadgeProps = {
  variant?: "ai" | "edited";
  showHelper?: boolean;
  className?: string;
};

/**
 * Reusable Send Center badge for AI-originated vs user-edited drafts.
 */
export function AiDraftBadge({
  variant = "ai",
  showHelper = true,
  className,
}: AiDraftBadgeProps) {
  const isEdited = variant === "edited";

  return (
    <div className={cn("send-center-ai-draft-badge-wrap", className)}>
      <span
        className={cn(
          "send-center-ai-draft-id-badge",
          isEdited
            ? "send-center-ai-draft-id-badge--edited"
            : "send-center-ai-draft-id-badge--ai",
        )}
        tabIndex={0}
        aria-label={
          isEdited
            ? "Edited by User"
            : `AI Draft. ${AI_DRAFT_BADGE_TOOLTIP}`
        }
        {...(!isEdited
          ? {
              title: AI_DRAFT_BADGE_TOOLTIP,
              "data-tooltip": AI_DRAFT_BADGE_TOOLTIP,
            }
          : {})}
      >
        {!isEdited && (
          <AppIcon name="sparkles" size={12} strokeWidth={2.25} aria-hidden />
        )}
        <span>{isEdited ? "Edited by User" : "AI Draft"}</span>
        {!isEdited && (
          <span className="send-center-ai-draft-id-badge-tooltip" role="tooltip">
            {AI_DRAFT_BADGE_TOOLTIP}
          </span>
        )}
      </span>
      {showHelper && !isEdited && (
        <span className="send-center-ai-draft-id-badge-helper">
          Generated with AI assistance
        </span>
      )}
    </div>
  );
}
