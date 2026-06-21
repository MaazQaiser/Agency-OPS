"use client";

import { usePermissions } from "@/components/permissions/PermissionProvider";
import { QuickActionButton } from "@/components/keyboard/QuickActionButton";
import { commercialHubHeader } from "@/data/commercialHub";
import { commercialHubQuickActionPermissions, filterQuickActions } from "@/data/rolePermissions";

type CommercialHubPageHeaderProps = {
  onQuickActionClick?: (actionId: string) => void;
};

export function CommercialHubPageHeader({ onQuickActionClick }: CommercialHubPageHeaderProps) {
  const { can, requirePermission } = usePermissions();
  const visibleActions = filterQuickActions(
    commercialHubHeader.quickActions,
    commercialHubQuickActionPermissions,
    can,
  );

  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{commercialHubHeader.title}</h1>
          <p className="va-ops-page-subtitle">{commercialHubHeader.subtitle}</p>
        </div>
      </div>

      {visibleActions.length > 0 && (
        <div className="va-ops-page-header-toolbar commercial-hub-header-actions">
          {visibleActions.map((action) => {
            const perm = commercialHubQuickActionPermissions[action.id];
            return (
              <QuickActionButton
                key={action.id}
                actionId={action.id}
                label={action.label}
                icon={action.icon}
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
        </div>
      )}
    </header>
  );
}
