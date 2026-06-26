"use client";

import { useId, useState } from "react";
import type { EoRiskScore } from "@/lib/eoRiskScore";
import { cn } from "@/lib/cn";
import { EoRiskBreakdown } from "./EoRiskBreakdown";

type EoRiskBadgeProps = {
  score: EoRiskScore;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
};

export function EoRiskBadge({ score, compact = false, className, onClick }: EoRiskBadgeProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className={cn("eo-risk-badge-wrap", className)}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      onFocus={() => setTooltipOpen(true)}
      onBlur={() => setTooltipOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "eo-risk-badge",
          `eo-risk-badge--${score.level}`,
          compact && "eo-risk-badge--compact",
          onClick && "eo-risk-badge--interactive",
        )}
        aria-describedby={tooltipOpen ? tooltipId : undefined}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.();
        }}
      >
        <span className="eo-risk-badge-prefix">E&O</span>
        <span className="eo-risk-badge-score">{score.total}</span>
        {!compact && (
          <>
            <span className="eo-risk-badge-sep" aria-hidden="true">
              ·
            </span>
            <span className="eo-risk-badge-label">{score.label}</span>
          </>
        )}
      </button>

      <div
        id={tooltipId}
        role="tooltip"
        className={cn("eo-risk-tooltip", tooltipOpen && "eo-risk-tooltip--open")}
      >
        <EoRiskBreakdown score={score} variant="tooltip" />
      </div>
    </span>
  );
}
