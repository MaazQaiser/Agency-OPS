"use client";

import { usePermissions } from "@/components/permissions/PermissionProvider";
import { QuickActionButton } from "@/components/keyboard/QuickActionButton";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
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
    <header className="va-ops-page-header commercial-hub-hero">
      <div className="commercial-hub-hero-main">
        <div className="va-ops-page-header-left commercial-hub-hero-copy">
          <p className="commercial-hub-hero-eyebrow">{commercialHubHeader.title}</p>
          <div className="va-ops-page-title-block">
            <h1 className="va-ops-page-title commercial-hub-hero-title">Pipeline Intelligence</h1>
            <p className="va-ops-page-subtitle commercial-hub-hero-subtitle">
              {commercialHubHeader.subtitle}
            </p>
          </div>
        </div>

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
          <HubHelpTrigger hubId="commercial-hub" />
        </div>
      </div>
    </header>
  );
}
