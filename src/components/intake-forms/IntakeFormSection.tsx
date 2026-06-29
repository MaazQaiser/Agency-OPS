"use client";

import { useState, type ReactNode } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

type IntakeFormSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export function IntakeFormSection({
  title,
  defaultOpen = true,
  children,
  className,
}: IntakeFormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={cn("intake-form-section", className)}>
      <button
        type="button"
        className="intake-form-section-header"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="intake-form-section-title">{title}</span>
        <AppIcon name="chevron-down" size={16} strokeWidth={2} className={cn("intake-form-section-chevron", open && "open")} />
      </button>
      {open && <div className="intake-form-section-body">{children}</div>}
    </section>
  );
}
