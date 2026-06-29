"use client";

import {
  confidenceLevelClass,
  type MarketRecommendation,
} from "@/data/carrierLibrary";
import { cn } from "@/lib/cn";

type RecommendedMarketCardProps = {
  rec: MarketRecommendation;
  onOpenCarrier: (carrierName: string) => void;
};

export function RecommendedMarketCard({ rec, onOpenCarrier }: RecommendedMarketCardProps) {
  const riskLevelClass = {
    Open: "badge-green",
    Conditional: "badge-amber",
    Restricted: "badge-amber",
    "High Risk": "badge-rose",
  } as const;

  return (
    <article className="carrier-market-rec-card carrier-decision-card">
      <div className="carrier-decision-card-top">
        <div className="carrier-market-rec-context">
          <span className="carrier-market-rec-chip">{rec.vertical}</span>
          <span className="carrier-market-rec-chip">{rec.product}</span>
          <span className="carrier-market-rec-chip">{rec.state}</span>
          <span className={cn("badge", riskLevelClass[rec.riskLevel])}>{rec.riskLevel}</span>
        </div>
        <span className={cn("carrier-confidence-badge", confidenceLevelClass[rec.confidence])}>
          {rec.confidence}
        </span>
      </div>

      <div className="carrier-decision-score-row">
        <div className="carrier-decision-score">
          <span className="carrier-decision-score-value">{rec.appetiteMatchScore}%</span>
          <span className="carrier-decision-score-label">Appetite match</span>
        </div>
        <div className="carrier-decision-score-meter" aria-hidden="true">
          <span
            className="carrier-decision-score-fill"
            style={{ width: `${rec.appetiteMatchScore}%` }}
          />
        </div>
      </div>

      <div className="carrier-market-rec-best">
        <span className="carrier-market-rec-best-label">Best Market</span>
        <button
          type="button"
          className="carrier-market-rec-carrier"
          onClick={() => onOpenCarrier(rec.bestCarrier)}
        >
          {rec.bestCarrier}
        </button>
      </div>

      <p className="carrier-market-rec-reason">{rec.reason}</p>

      <dl className="carrier-market-rec-intel carrier-decision-intel">
        <div>
          <dt>Avg turnaround</dt>
          <dd>{rec.avgTurnaroundSpeed}</dd>
        </div>
        <div>
          <dt>Bind success rate</dt>
          <dd>{rec.bindSuccessRate}%</dd>
        </div>
        <div>
          <dt>Last used by team</dt>
          <dd>{rec.lastUsedByTeam}</dd>
        </div>
        <div>
          <dt>Vertical fit</dt>
          <dd>{rec.verticalFit}</dd>
        </div>
        {rec.restrictions ? (
          <div className="carrier-decision-restriction">
            <dt>Restrictions</dt>
            <dd>{rec.restrictions}</dd>
          </div>
        ) : null}
      </dl>

      {rec.alternateCarriers.length > 0 ? (
        <div className="carrier-market-rec-alternates">
          <span className="carrier-market-rec-alt-label">Also consider:</span>
          {rec.alternateCarriers.map((name) => (
            <button
              key={name}
              type="button"
              className="carrier-market-rec-alt-link"
              onClick={() => onOpenCarrier(name)}
            >
              {name}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
