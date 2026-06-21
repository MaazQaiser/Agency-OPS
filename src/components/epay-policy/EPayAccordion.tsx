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
};

export function EPayAccordion({
  title,
  subtitle,
  defaultOpen = false,
  children,
  className,
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
          <h3 className="va-ops-section-title">{title}</h3>
          {subtitle && <p className="va-ops-section-sub">{subtitle}</p>}
        </div>
        <AppIcon
          name="chevron-down"
          size={18}
          strokeWidth={2.25}
          className={cn("epay-accordion-chevron", open && "open")}
        />
      </button>
      {open && <div className="epay-accordion-body">{children}</div>}
    </section>
  );
}
