"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import type { KpiStatusTone } from "@/lib/kpiTone";

type MetricProgressBarProps = {
  percent: number;
  tone?: KpiStatusTone | "hub";
  animate?: boolean;
  label?: string;
  className?: string;
};

export function MetricProgressBar({
  percent,
  tone = "positive",
  animate = true,
  label,
  className,
}: MetricProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 0));
  const [fill, setFill] = useState(animate ? 0 : clamped);

  useEffect(() => {
    if (!animate || prefersReducedMotion()) {
      setFill(clamped);
      return;
    }
    setFill(0);
    const frame = requestAnimationFrame(() => setFill(clamped));
    return () => cancelAnimationFrame(frame);
  }, [animate, clamped]);

  return (
    <div
      className={cn("aos-progress", `aos-progress--${tone}`, className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
    >
      <div className="aos-progress-fill" style={{ transform: `scaleX(${fill / 100})` }} />
    </div>
  );
}

export function parseProgressPercent(width: string | number | undefined): number {
  if (typeof width === "number") return width;
  if (!width) return 0;
  const parsed = Number.parseFloat(width);
  return Number.isFinite(parsed) ? parsed : 0;
}
