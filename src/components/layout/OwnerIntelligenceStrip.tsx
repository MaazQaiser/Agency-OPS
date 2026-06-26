"use client";

import { usePermissions } from "@/components/permissions/PermissionProvider";
import { ownerIntelligenceStats } from "@/data/vaOperations";
import { cn } from "@/lib/cn";

export function OwnerIntelligenceStrip() {
  const { can } = usePermissions();
  const isOwner = can("action:owner-quick-actions");

  if (!isOwner) return null;

  return (
    <div className="owner-intelligence-strip" role="status" aria-label="Owner intelligence summary">
      <span className="owner-intelligence-strip-label">Owner pulse</span>
      <div className="owner-intelligence-strip-chips">
        {ownerIntelligenceStats.map((stat) => (
          <span
            key={stat.id}
            className={cn("owner-intelligence-chip", `owner-intelligence-chip--${stat.tone}`)}
          >
            <strong>{stat.value}</strong>
            {stat.label}
          </span>
        ))}
      </div>
    </div>
  );
}
