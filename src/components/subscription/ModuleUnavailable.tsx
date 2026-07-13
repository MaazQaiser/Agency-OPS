"use client";

import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useSubscription } from "@/components/subscription/SubscriptionProvider";
import { UpgradePrompt } from "@/components/subscription/UpgradePrompt";

/** Generic unavailable state: no tier names or locked feature labels. */
export function ModuleUnavailable() {
  const { isOwner } = usePermissions();
  const { tenant, showUpgradePrompts } = useSubscription();

  return (
    <div className="permission-denied-page subscription-unavailable-page">
      <div className="permission-denied-icon" aria-hidden="true">
        <span className="permission-denied-shield">◇</span>
      </div>
      <h1 className="permission-denied-page-title">Not Available</h1>
      <p className="permission-denied-page-desc">
        This area is not enabled for your agency workspace.
      </p>
      <p className="permission-denied-hint">
        If you believe this is an error, contact your agency administrator.
      </p>
      {isOwner && showUpgradePrompts ? <UpgradePrompt tenant={tenant} /> : null}
    </div>
  );
}
