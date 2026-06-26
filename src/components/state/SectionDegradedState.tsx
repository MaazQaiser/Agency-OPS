"use client";

import { HubErrorState } from "./HubErrorState";
import { hubErrorPresets, type HubErrorPresetId } from "@/data/hubStatePresets";
import { cn } from "@/lib/cn";

type SectionDegradedStateProps = {
  title?: string;
  message?: string;
  preset?: HubErrorPresetId;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
};

export function SectionDegradedState({
  title,
  message,
  preset = "partial-section",
  onRetry,
  retrying,
  className,
}: SectionDegradedStateProps) {
  const config = hubErrorPresets[preset];

  return (
    <div className={cn("hub-section-degraded", className)} role="alert">
      <HubErrorState
        compact
        preset={preset}
        error={{
          title: title ?? config.title,
          message: message ?? config.message,
          severity: config.severity,
        }}
        onRetry={onRetry}
        retrying={retrying}
      />
    </div>
  );
}
