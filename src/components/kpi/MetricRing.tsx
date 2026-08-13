"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import type { KpiStatusTone } from "@/lib/kpiTone";

type MetricRingProps = {
  value: number;
  size?: number;
  thickness?: number;
  tone?: KpiStatusTone | "hub";
  label?: string;
  centerValue?: string;
  centerLabel?: string;
  className?: string;
  animate?: boolean;
};

export function MetricRing({
  value,
  size = 64,
  thickness = 8,
  tone = "positive",
  label,
  centerValue,
  centerLabel,
  className,
  animate = true,
}: MetricRingProps) {
  const [animated, setAnimated] = useState(!animate);
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? clamped / 100 : 0) * circumference;
  const display = centerValue ?? `${Math.round(clamped)}%`;

  useEffect(() => {
    if (!animate || prefersReducedMotion()) {
      setAnimated(true);
      return;
    }
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [animate, clamped]);

  return (
    <div
      className={cn("aos-metric-ring", `aos-metric-ring--${tone}`, className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ? `${label}: ${display}` : display}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="aos-metric-ring-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="aos-metric-ring-fill"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="aos-metric-ring-center">
        <span className="aos-metric-ring-value">{display}</span>
        {centerLabel && <span className="aos-metric-ring-label">{centerLabel}</span>}
      </span>
    </div>
  );
}
