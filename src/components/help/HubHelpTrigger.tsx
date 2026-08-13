"use client";

import { usePathname } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import type { HubHelpId } from "@/data/contextualHelp";
import { resolveHubHelpFromPath } from "@/data/contextualHelp";
import { cn } from "@/lib/cn";
import { useContextualHelp } from "./ContextualHelpProvider";

type HubHelpTriggerProps = {
  hubId?: HubHelpId;
  className?: string;
};

export function HubHelpTrigger({ hubId, className }: HubHelpTriggerProps) {
  const pathname = usePathname();
  const { toggle, activeHubId } = useContextualHelp();
  const resolvedHubId = hubId ?? resolveHubHelpFromPath(pathname) ?? "va-operations";
  const isOpen = activeHubId === resolvedHubId;

  return (
    <button
      type="button"
      className={cn("hub-help-trigger", isOpen && "hub-help-trigger--open", className)}
      aria-label="Open contextual help"
      aria-expanded={isOpen}
      aria-controls="contextual-help-drawer"
      onClick={(event) => toggle(resolvedHubId, event.currentTarget)}
    >
      <AppIcon name="help-circle" size={18} strokeWidth={2} />
    </button>
  );
}
