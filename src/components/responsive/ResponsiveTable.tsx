"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ResponsiveTableWrapProps = {
  children: ReactNode;
  className?: string;
};

/** Wraps hub tables: horizontal scroll on mobile (≤767px), full table on desktop. */
export function ResponsiveTableWrap({ children, className }: ResponsiveTableWrapProps) {
  return (
    <div className={cn("commercial-hub-table-wrap ops-responsive-table-wrap ops-table-scroll", className)}>
      {children}
    </div>
  );
}

type RCellProps = {
  label: string;
  children: ReactNode;
  className?: string;
  colSpan?: number;
  /** Hide label row (checkboxes, actions) */
  hideLabel?: boolean;
};

export function RCell({ label, children, className, colSpan, hideLabel }: RCellProps) {
  return (
    <td
      className={cn(className, hideLabel && "ops-responsive-cell--bare")}
      data-label={hideLabel ? "" : label}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
