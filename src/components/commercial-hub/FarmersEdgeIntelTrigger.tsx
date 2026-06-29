"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { useFarmersEdgeIntelOptional } from "@/components/farmers-edge/FarmersEdgeIntelligenceProvider";
import { cn } from "@/lib/cn";
import type { FarmersEdgeIntelRequest } from "@/lib/farmersEdgeIntel";

type FarmersEdgeIntelTriggerProps = {
  label: string;
  request: FarmersEdgeIntelRequest;
  className?: string;
  compact?: boolean;
};

export function FarmersEdgeIntelTrigger({
  label,
  request,
  className,
  compact = false,
}: FarmersEdgeIntelTriggerProps) {
  const intel = useFarmersEdgeIntelOptional();
  if (!intel?.canOpen) return null;

  return (
    <button
      type="button"
      className={cn(
        "va-ops-action-btn farmers-edge-intel-trigger",
        !compact && "farmers-edge-intel-trigger--toolbar",
        className,
      )}
      onClick={() => intel.openIntel(request)}
    >
      <AppIcon name="sparkles" size={14} strokeWidth={2} className="farmers-edge-intel-trigger-icon" />
      {label}
    </button>
  );
}
