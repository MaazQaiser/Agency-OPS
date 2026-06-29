"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";

export type CommercialRowAction = {
  id: string;
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  accent?: "farmers-edge";
  disabled?: boolean;
};

type CommercialRowActionMenuProps = {
  actions: CommercialRowAction[];
  label: string;
  className?: string;
};

export function CommercialRowActionMenu({
  actions,
  label,
  className,
}: CommercialRowActionMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div className={cn("commercial-row-action-menu", className)} ref={rootRef}>
      <button
        type="button"
        className="commercial-row-action-trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <AppIcon name="more-horizontal" size={16} strokeWidth={2} />
      </button>
      {open && (
        <ul id={menuId} className="commercial-row-action-dropdown" role="menu">
          {actions.map((action) => (
            <li key={action.id} role="none">
              <button
                type="button"
                role="menuitem"
                className={cn(
                  "commercial-row-action-item",
                  action.accent === "farmers-edge" && "commercial-row-action-item--farmers-edge",
                )}
                disabled={action.disabled}
                onClick={() => {
                  close();
                  action.onSelect();
                }}
              >
                {action.icon}
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
