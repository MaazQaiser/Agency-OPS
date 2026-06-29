"use client";

import { usePermissions } from "@/components/permissions/PermissionProvider";
import { QuickActionButton } from "@/components/keyboard/QuickActionButton";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { epayPolicyHeader } from "@/data/epayPolicy";
import { epayQuickActionPermissions, filterQuickActions } from "@/data/rolePermissions";
import { cn } from "@/lib/cn";

type EPayPolicyPageHeaderProps = {
  onQuickActionClick?: (actionId: string) => void;
};

export function EPayPolicyPageHeader({ onQuickActionClick }: EPayPolicyPageHeaderProps) {
  const { can, requirePermission } = usePermissions();
  const visibleActions = filterQuickActions(epayPolicyHeader.quickActions, epayQuickActionPermissions, can);

  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{epayPolicyHeader.title}</h1>
          <p className="va-ops-page-subtitle">{epayPolicyHeader.subtitle}</p>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar epay-policy-header-actions">
        {visibleActions.map((action) => {
          const perm = epayQuickActionPermissions[action.id];
          return (
            <QuickActionButton
              key={action.id}
              actionId={action.id}
              label={action.label}
              icon={action.icon}
              className={cn(
                "va-ops-role-action-btn",
                action.variant === "primary" && "epay-header-btn--primary",
                action.variant === "secondary" && "epay-header-btn--secondary",
              )}
              onClick={() => {
                if (perm) {
                  requirePermission(perm, () => onQuickActionClick?.(action.id));
                } else {
                  onQuickActionClick?.(action.id);
                }
              }}
            />
          );
        })}
        <HubHelpTrigger hubId="epay-policy" />
      </div>
    </header>
  );
}
