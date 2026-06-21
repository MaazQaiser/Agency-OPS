"use client";

import { formatShortcutKeys } from "@/lib/keyboardShortcutUtils";
import { cn } from "@/lib/cn";

type ShortcutHintProps = {
  keys: string;
  className?: string;
  /** When true, wraps in parentheses for inline button labels */
  inline?: boolean;
};

export function ShortcutHint({ keys, className, inline = true }: ShortcutHintProps) {
  const label = formatShortcutKeys(keys);
  return (
    <kbd className={cn("ops-shortcut-hint", inline && "ops-shortcut-hint-inline", className)} aria-hidden="true">
      {inline ? `(${label})` : label}
    </kbd>
  );
}
