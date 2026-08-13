"use client";

import { MetricRing } from "@/components/kpi/MetricRing";
import { StatusPill } from "@/components/kpi/StatusPill";
import { cn } from "@/lib/cn";
import { parseExistingPercent, retentionStatusFromColor } from "@/lib/retentionScorecardView";

type RetentionHealthCardProps = {
  kicker: string;
  label: string;
  value: string;
  context: string;
  color?: string;
  statusOverride?: string;
  freshness?: string;
};

export function RetentionHealthCard({
  kicker,
  label,
  value,
  context,
  color,
  statusOverride,
  freshness,
}: RetentionHealthCardProps) {
  const percent = parseExistingPercent(value);
  const status = color ? retentionStatusFromColor(color) : null;
  const tone = status?.tone ?? "info";

  return (
    <article
      className={cn("retention-health-card", `retention-health-card--${tone}`)}
      aria-label={label}
    >
      <p className="retention-health-kicker">{kicker}</p>
      <div className="retention-health-body">
        {percent != null && (
          <MetricRing
            value={percent}
            size={120}
            thickness={10}
            tone={tone}
            centerValue={value}
            label={label}
            animate={false}
          />
        )}
        <div className="retention-health-copy">
          <p className="retention-health-label">{label}</p>
          <p className={cn("retention-health-value", `retention-health-value--${tone}`)}>{value}</p>
          {status?.label && (
            <StatusPill tone={tone}>
              <span className="retention-health-status-dot" aria-hidden="true" />
              {status.label}
            </StatusPill>
          )}
          {statusOverride && !status && (
            <p className="retention-health-goal">{statusOverride}</p>
          )}
          <p className="retention-health-context">{context}</p>
          {freshness && <p className="retention-health-freshness">{freshness}</p>}
        </div>
      </div>
    </article>
  );
}
