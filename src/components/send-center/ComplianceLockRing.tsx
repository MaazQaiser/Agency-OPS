"use client";

import { cn } from "@/lib/cn";

type ComplianceLockRingProps = {
  locked: boolean;
  onSend?: () => void;
  label?: string;
  lockReason?: string;
  className?: string;
};

/**
 * Send Center Signature Element — Compliance Lock Ring
 * VA send button has an animated dashed rose ring when compliance gate is active.
 * The ring is NOT just a gray-out — it is visually distinct.
 * When gate clears, ring disappears with 200ms fade and button becomes active.
 */
export function ComplianceLockRing({
  locked,
  onSend,
  label = "Send",
  lockReason = "Compliance gate active — producer approval required before send",
  className,
}: ComplianceLockRingProps) {
  return (
    <div className={cn("compliance-lock-wrap", locked && "compliance-lock-wrap--locked", className)}>
      {locked && (
        <div className="compliance-lock-ring" aria-hidden="true" />
      )}
      <button
        type="button"
        className={cn("compliance-send-btn", locked && "compliance-send-btn--locked")}
        disabled={locked}
        onClick={!locked ? onSend : undefined}
        aria-disabled={locked}
        aria-label={locked ? "Send blocked — compliance gate active" : label}
      >
        {locked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="compliance-lock-icon">
            <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
        {label}
      </button>
      {locked && (
        <p className="compliance-lock-note" role="alert">
          {lockReason}
        </p>
      )}
    </div>
  );
}
