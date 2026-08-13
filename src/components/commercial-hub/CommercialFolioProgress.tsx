"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { getFolioProgressMetrics } from "@/lib/folioProgress";

export function CommercialFolioProgress() {
  const metrics = getFolioProgressMetrics();
  const [fillPct, setFillPct] = useState(0);
  const clamped = Math.min(100, Math.max(0, metrics.goalProgressPct));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setFillPct(clamped));
    return () => cancelAnimationFrame(frame);
  }, [clamped]);

  return (
    <section
      className="commercial-folio-progress"
      aria-label={`Folio ${metrics.folioNumber} revenue progress`}
    >
      <div className="commercial-folio-progress-copy">
        <p className="commercial-folio-progress-label">Folio {metrics.folioNumber} revenue</p>
        <p className="commercial-folio-progress-value">
          <span className="commercial-folio-progress-written">{metrics.writtenLabel}</span>
          <span className="commercial-folio-progress-of"> of {metrics.targetLabel} goal</span>
        </p>
      </div>

      <div className="commercial-folio-progress-meter">
        <div
          className="commercial-folio-progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(clamped)}
          aria-label="Folio goal progress"
        >
          <div
            className={cn("commercial-folio-progress-fill", `commercial-folio-progress-fill--${metrics.folioState}`)}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <div className="commercial-folio-progress-pct">
        <span className="commercial-folio-progress-pct-value">{Math.round(clamped)}%</span>
        <span className="commercial-folio-progress-pct-label">to goal</span>
      </div>
    </section>
  );
}
