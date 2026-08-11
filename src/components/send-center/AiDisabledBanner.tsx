"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

type AiDisabledBannerProps = {
  className?: string;
  /** Slightly denser spacing when shown in the Send Center page shell. */
  compact?: boolean;
};

/**
 * Neutral info banner when Claude / AI drafting is admin-disabled.
 */
export function AiDisabledBanner({ className, compact = false }: AiDisabledBannerProps) {
  return (
    <div
      className={cn(
        "send-center-ai-disabled-banner",
        compact && "send-center-ai-disabled-banner--compact",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="send-center-ai-disabled-banner-icon" aria-hidden="true">
        <AppIcon name="zap" size={20} strokeWidth={2} />
      </div>
      <div className="send-center-ai-disabled-banner-copy">
        <h3 className="send-center-ai-disabled-banner-title">AI Drafting Currently Disabled</h3>
        <p className="send-center-ai-disabled-banner-desc">
          AI-assisted drafting has been temporarily disabled by your administrator. You can continue
          composing emails manually.
        </p>
      </div>
    </div>
  );
}
