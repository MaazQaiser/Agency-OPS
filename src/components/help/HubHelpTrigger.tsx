"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import type { HubHelpId } from "@/data/contextualHelp";
import { getHubHelpContent } from "@/data/contextualHelp";
import { useContextualHelp } from "./ContextualHelpProvider";

type HubHelpTriggerProps = {
  hubId: HubHelpId;
  className?: string;
};

export function HubHelpTrigger({ hubId, className }: HubHelpTriggerProps) {
  const { open } = useContextualHelp();
  const content = getHubHelpContent(hubId);

  return (
    <button
      type="button"
      className={className ?? "hub-help-trigger"}
      aria-label={`Open ${content.title} help`}
      title={`${content.title} help`}
      onClick={() => open(hubId)}
    >
      <AppIcon name="help-circle" size={18} strokeWidth={2} />
    </button>
  );
}
