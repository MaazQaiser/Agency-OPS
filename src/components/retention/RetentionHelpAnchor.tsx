"use client";

import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";

export function RetentionHelpAnchor() {
  return (
    <div className="retention-help-anchor">
      <HubHelpTrigger hubId="retention" />
    </div>
  );
}
