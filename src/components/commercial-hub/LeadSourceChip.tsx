"use client";

import { cn } from "@/lib/cn";

const sourceClass: Record<string, string> = {
  Ricochet: "lead-source-chip--ricochet",
  Referral: "lead-source-chip--referral",
  "Walk-in": "lead-source-chip--walk-in",
  "Walk-In": "lead-source-chip--walk-in",
  "Cold Call": "lead-source-chip--cold-call",
  Website: "lead-source-chip--website",
  Partner: "lead-source-chip--partner",
};

type LeadSourceChipProps = {
  source: string;
  className?: string;
};

export function LeadSourceChip({ source, className }: LeadSourceChipProps) {
  const normalized = source.trim();
  const variant = sourceClass[normalized] ?? "lead-source-chip--default";

  return (
    <span className={cn("lead-source-chip", variant, className)}>
      {normalized}
    </span>
  );
}
