"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

type EPayAccordionProps = {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  countBadge?: number;
  statusSummary?: string;
  preview?: React.ReactNode;
};

export function EPayAccordion({
  title,
  subtitle,
  defaultOpen = false,
  children,
  className,
  countBadge,
  statusSummary,
  preview,
}: EPayAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={cn("va-ops-panel epay-accordion", className)}>
      <button
        type="button"
        className="epay-accordion-trigger"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="epay-accordion-trigger-text">
          <h3 className="va-ops-section-title">
            {title}
            {countBadge != null && countBadge > 0 && (
              <span className="epay-accordion-count">{countBadge}</span>
            )}
          </h3>
          {subtitle && <p className="va-ops-section-sub">{subtitle}</p>}
        </div>
        <div className="epay-accordion-trigger-meta">
          {!open && statusSummary && (
            <span className="epay-accordion-status-summary">{statusSummary}</span>
          )}
          <AppIcon
            name="chevron-down"
            size={18}
            strokeWidth={2.25}
            className={cn("epay-accordion-chevron", open && "open")}
          />
        </div>
      </button>
      {!open && preview && (
        <div className="epay-accordion-preview-collapsed">{preview}</div>
      )}
      {open && <div className="epay-accordion-body">{children}</div>}
    </section>
  );
}
