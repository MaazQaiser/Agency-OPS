"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { getShortcutHintForAction } from "@/data/keyboardShortcuts";
import { ShortcutHint } from "@/components/keyboard/ShortcutHint";
import type { AppIconName } from "@/components/ui/AppIcon";

type QuickActionButtonProps = {
  actionId: string;
  label: string;
  icon: AppIconName;
  onClick?: () => void;
  className?: string;
};

export function QuickActionButton({
  actionId,
  label,
  icon,
  onClick,
  className = "va-ops-role-action-btn",
}: QuickActionButtonProps) {
  const hint = getShortcutHintForAction(actionId);

  return (
    <button type="button" className={className} onClick={onClick}>
      <AppIcon name={icon} size={15} strokeWidth={2} />
      {label}
      {hint ? <ShortcutHint keys={hint} /> : null}
    </button>
  );
}
