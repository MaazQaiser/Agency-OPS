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
  const interactive = Boolean(onClick);
  const badgeClassName = cn(
    "eo-risk-badge",
    `eo-risk-badge--${score.level}`,
    compact && "eo-risk-badge--compact",
    interactive && "eo-risk-badge--interactive",
  );
  const badgeLabel = `E&O risk ${score.total}, ${score.label}`;

  const badgeContent = (
    <>
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
    </>
  );

  return (
    <span
      className={cn("eo-risk-badge-wrap", className)}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      onFocus={() => setTooltipOpen(true)}
      onBlur={() => setTooltipOpen(false)}
    >
      {interactive ? (
        <button
          type="button"
          className={badgeClassName}
          aria-label={badgeLabel}
          aria-describedby={tooltipOpen ? tooltipId : undefined}
          onClick={(event) => {
            event.stopPropagation();
            onClick?.();
          }}
        >
          {badgeContent}
        </button>
      ) : (
        <span
          className={badgeClassName}
          role="img"
          aria-label={badgeLabel}
          aria-describedby={tooltipOpen ? tooltipId : undefined}
        >
          {badgeContent}
        </span>
      )}

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
