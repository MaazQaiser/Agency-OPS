"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

type LicensedReviewBannerProps = {
  className?: string;
};

/**
 * Amber compliance banner when coverage language is detected.
 */
export function LicensedReviewBanner({ className }: LicensedReviewBannerProps) {
  return (
    <div
      className={cn("send-center-licensed-banner", className)}
      role="status"
      aria-live="polite"
    >
      <div className="send-center-licensed-banner-icon" aria-hidden="true">
        <AppIcon name="shield" size={22} strokeWidth={2} />
      </div>
      <div className="send-center-licensed-banner-copy">
        <h3 className="send-center-licensed-banner-title">
          Coverage Language Detected
        </h3>
        <p className="send-center-licensed-banner-desc">
          This draft contains insurance coverage language and requires licensed
          producer review before it can be sent.
        </p>
      </div>
    </div>
  );
}
