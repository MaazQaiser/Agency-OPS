"use client";

import type { EoRiskScore } from "@/lib/eoRiskScore";
import { cn } from "@/lib/cn";

type EoRiskBreakdownProps = {
  score: EoRiskScore;
  variant?: "panel" | "tooltip";
  className?: string;
};

export function EoRiskBreakdown({ score, variant = "panel", className }: EoRiskBreakdownProps) {
  const meterPct = Math.min(100, (score.total / 6) * 100);

  return (
    <div className={cn("eo-risk-breakdown", `eo-risk-breakdown--${variant}`, className)}>
      <div className="eo-risk-breakdown-header">
        <div>
          <div className="eo-risk-breakdown-title">E&O Exposure Score</div>
          <div className={cn("eo-risk-breakdown-total", `eo-risk-breakdown-total--${score.level}`)}>
            {score.total} · {score.label}
          </div>
        </div>
      </div>

      <div className="eo-risk-meter" aria-hidden="true">
        <div className="eo-risk-meter-track">
          <div
            className={cn("eo-risk-meter-fill", `eo-risk-meter-fill--${score.level}`)}
            style={{ width: `${meterPct}%` }}
          />
        </div>
        <div className="eo-risk-meter-labels">
          <span>Safe</span>
          <span>Watch</span>
          <span>Critical</span>
        </div>
      </div>

      <div className="eo-risk-stats">
        <div className="eo-risk-stat">
          <span className="eo-risk-stat-label">Days open</span>
          <span className="eo-risk-stat-value">{score.daysOpen}</span>
        </div>
        <div className="eo-risk-stat">
          <span className="eo-risk-stat-label">Missing docs</span>
          <span className="eo-risk-stat-value">{score.missingDocsCount}</span>
        </div>
        <div className="eo-risk-stat">
          <span className="eo-risk-stat-label">Carrier</span>
          <span className={cn("eo-risk-stat-value", !score.hasCarrier && "eo-risk-stat-value--alert")}>
            {score.hasCarrier ? "On file" : "Missing"}
          </span>
        </div>
      </div>

      <div className="eo-risk-factors">
        <div className="eo-risk-factors-title">Risk factors</div>
        {score.factors.length === 0 ? (
          <p className="eo-risk-factors-empty">No active risk factors: submission is within tolerance.</p>
        ) : (
          <ul className="eo-risk-factors-list">
            {score.factors.map((factor) => (
              <li key={factor.id}>{factor.label}</li>
            ))}
          </ul>
        )}
        <div className="eo-risk-factors-total">Total: {score.total}</div>
      </div>
    </div>
  );
}
