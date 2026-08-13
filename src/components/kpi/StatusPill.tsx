import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { KpiStatusTone } from "@/lib/kpiTone";

type StatusPillProps = {
  tone?: KpiStatusTone;
  children: ReactNode;
  className?: string;
};

export function StatusPill({ tone = "info", children, className }: StatusPillProps) {
  return (
    <span className={cn("aos-status-pill", `aos-status-pill--${tone}`, className)}>
      {children}
    </span>
  );
}
