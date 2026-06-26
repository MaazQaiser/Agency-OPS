"use client";

import { cn } from "@/lib/cn";
import type { MarketReadinessScore as MarketReadinessScoreType } from "@/lib/marketReadiness";

type MarketReadinessScoreProps = {
  score: MarketReadinessScoreType;
  className?: string;
};

const toneClass: Record<MarketReadinessScoreType["tone"], string> = {
  green: "market-readiness--green",
  amber: "market-readiness--amber",
  red: "market-readiness--red",
};

export function MarketReadinessScore({ score, className }: MarketReadinessScoreProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score.percent / 100) * circumference;

  return (
    <div className={cn("market-readiness", toneClass[score.tone], className)} aria-label={`Market readiness ${score.label}`}>
      <div className="market-readiness-ring" aria-hidden="true">
        <svg viewBox="0 0 88 88" width={88} height={88}>
          <circle className="market-readiness-ring-track" cx="44" cy="44" r={radius} />
          <circle
            className="market-readiness-ring-fill"
            cx="44"
            cy="44"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="market-readiness-value">{score.percent}%</span>
      </div>
      <div className="market-readiness-copy">
        <span className="market-readiness-title">Market Readiness</span>
        <span className="market-readiness-label">{score.label}</span>
        <ul className="market-readiness-factors">
          {score.factors.map((factor) => (
            <li key={factor.id} className={cn(factor.complete && "is-complete")}>
              {factor.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
