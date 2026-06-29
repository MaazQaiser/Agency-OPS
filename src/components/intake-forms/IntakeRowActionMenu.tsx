"use client";

import { useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

export type IntakeRowAction = {
  id: string;
  label: string;
  tone?: "default" | "primary" | "danger";
};

type IntakeRowActionMenuProps = {
  actions: IntakeRowAction[];
  onAction: (actionId: string) => void;
  ariaLabel: string;
};

export function IntakeRowActionMenu({ actions, onAction, ariaLabel }: IntakeRowActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="intake-row-action-menu" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="intake-row-action-trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <AppIcon name="more-horizontal" size={16} strokeWidth={2} />
      </button>
      {open && (
        <div className="intake-row-action-dropdown" role="menu">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              className={cn(
                "intake-row-action-item",
                action.tone === "primary" && "intake-row-action-item--primary",
                action.tone === "danger" && "intake-row-action-item--danger",
              )}
              onClick={() => {
                setOpen(false);
                onAction(action.id);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
