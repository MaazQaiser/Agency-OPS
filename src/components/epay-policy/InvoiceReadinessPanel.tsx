"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";
import type { InvoiceReadinessItem } from "@/data/epayPolicy";

type InvoiceReadinessPanelProps = {
  items: readonly InvoiceReadinessItem[];
  ready: boolean;
};

export function InvoiceReadinessPanel({ items, ready }: InvoiceReadinessPanelProps) {
  const completeCount = items.filter((i) => i.complete).length;

  return (
    <section
      className={cn("va-ops-panel epay-readiness-panel", !ready && "epay-readiness-panel--blocked")}
      aria-label="Invoice readiness pre-flight"
    >
      <div className="epay-readiness-header">
        <div>
          <h3 className="va-ops-section-title">Invoice Readiness</h3>
          <p className="va-ops-section-sub">Pre-flight validation — all checks must pass before send.</p>
        </div>
        <span className={cn("badge epay-readiness-badge", ready ? "badge-green" : "badge-red")}>
          {completeCount}/{items.length} ready
        </span>
      </div>
      <ol className="epay-readiness-checklist">
        {items.map((item) => (
          <li key={item.id} className={cn("epay-readiness-item", item.complete && "complete")}>
            <span className="epay-readiness-icon" aria-hidden="true">
              <AppIcon name={item.complete ? "check" : "x"} size={14} strokeWidth={2.5} />
            </span>
            <span className="epay-readiness-label">{item.label}</span>
            <span className="epay-readiness-status">{item.complete ? "Verified" : "Incomplete"}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
