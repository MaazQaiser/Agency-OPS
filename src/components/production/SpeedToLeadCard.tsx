"use client";

import { useEffect, useState } from "react";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import type { SpeedToLeadEntry } from "@/data/producerScorecard";
import {
  computeSlaState,
  formatResponseTime,
  formatStlDuration,
  slaStateLabels,
  slaStateToVariant,
} from "@/lib/speedToLead";
import { cn } from "@/lib/cn";

const statusIcon: Record<string, AppIconName> = {
  green: "check",
  amber: "triangle-alert",
  red: "x",
};

type SpeedToLeadCardProps = {
  entry: SpeedToLeadEntry;
};

export function SpeedToLeadCard({ entry }: SpeedToLeadCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(entry.secondsSinceLastLead);

  useEffect(() => {
    const startedAt = Date.now();
    const base = entry.secondsSinceLastLead;

    const tick = () => {
      setElapsedSeconds(base + Math.floor((Date.now() - startedAt) / 1000));
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [entry.id, entry.secondsSinceLastLead]);

  const slaState = computeSlaState(elapsedSeconds, entry.slaWindowSeconds);
  const variant = slaStateToVariant(slaState);
  const remainingSeconds = Math.max(0, entry.slaWindowSeconds - elapsedSeconds);
  const overSeconds = Math.max(0, elapsedSeconds - entry.slaWindowSeconds);
  const isBreached = slaState === "breached";

  return (
    <article
      className={cn(
        "speed-stl-card",
        `speed-stl-card--${variant}`,
        isBreached && "speed-stl-card--breach-active",
      )}
      aria-live="polite"
    >
      <div className="speed-stl-card-head">
        <div className="speed-stl-card-identity">
          <AppIcon
            name={statusIcon[variant]}
            size={18}
            className="speed-stl-card-icon"
            strokeWidth={2.25}
          />
          <div>
            <div className="speed-stl-card-name">{entry.name}</div>
            <div className="speed-stl-card-source">{entry.source}</div>
          </div>
        </div>
        <span className={cn("speed-stl-sla-badge", `speed-stl-sla-badge--${slaState}`)}>
          {slaStateLabels[slaState]}
        </span>
      </div>

      <p className="speed-stl-card-detail">{entry.detail}</p>

      <div className="speed-stl-timer-row">
        <div className="speed-stl-timer-block">
          <span className="speed-stl-timer-label">Since last lead</span>
          <span className="speed-stl-timer-value" aria-label={`${elapsedSeconds} seconds since last lead`}>
            {formatStlDuration(elapsedSeconds)}
          </span>
        </div>
        <div className="speed-stl-timer-divider" aria-hidden="true" />
        <div className="speed-stl-timer-block">
          <span className="speed-stl-timer-label">
            {isBreached ? "Over SLA limit" : "Countdown to breach"}
          </span>
          <span
            className={cn(
              "speed-stl-timer-value",
              "speed-stl-timer-value--countdown",
              isBreached && "speed-stl-timer-value--over",
            )}
          >
            {isBreached ? `+${formatStlDuration(overSeconds)}` : formatStlDuration(remainingSeconds)}
          </span>
        </div>
      </div>

      <div className="speed-stl-metrics">
        <div className="speed-stl-metric">
          <span className="speed-stl-metric-label">Last response</span>
          <strong>{formatResponseTime(entry.lastResponseSeconds)}</strong>
        </div>
        <div className="speed-stl-metric">
          <span className="speed-stl-metric-label">Avg response</span>
          <strong>{formatResponseTime(entry.avgResponseSeconds)}</strong>
        </div>
        <div className="speed-stl-metric">
          <span className="speed-stl-metric-label">SLA window</span>
          <strong>{formatResponseTime(entry.slaWindowSeconds)}</strong>
        </div>
      </div>
    </article>
  );
}
