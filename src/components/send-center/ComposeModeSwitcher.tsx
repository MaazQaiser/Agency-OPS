"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import type { ComposeMode } from "@/data/manualCompose";
import { cn } from "@/lib/cn";

type ComposeModeSwitcherProps = {
  mode: ComposeMode;
  onChange: (mode: ComposeMode) => void;
  aiDisabled?: boolean;
  className?: string;
};

/**
 * Segmented control for AI Draft vs Manual Compose.
 */
export function ComposeModeSwitcher({
  mode,
  onChange,
  aiDisabled = false,
  className,
}: ComposeModeSwitcherProps) {
  return (
    <div
      className={cn("send-center-compose-mode-switch", className)}
      role="tablist"
      aria-label="Compose mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "ai"}
        className={cn(
          "send-center-compose-mode-btn",
          mode === "ai" && "is-active",
          aiDisabled && "is-disabled",
        )}
        disabled={aiDisabled}
        title={aiDisabled ? "AI drafting is currently unavailable." : undefined}
        onClick={() => onChange("ai")}
      >
        <AppIcon name="sparkles" size={14} strokeWidth={2.25} />
        AI Draft
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "manual"}
        className={cn("send-center-compose-mode-btn", mode === "manual" && "is-active")}
        onClick={() => onChange("manual")}
      >
        <AppIcon name="mail" size={14} strokeWidth={2.25} />
        Manual Compose
      </button>
    </div>
  );
}
