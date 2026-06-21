"use client";

import { usePermissions } from "@/components/permissions/PermissionProvider";
import { QuickActionButton } from "@/components/keyboard/QuickActionButton";
import { trainingHubHeader } from "@/data/trainingHub";
import { filterQuickActions, trainingHubQuickActionPermissions } from "@/data/rolePermissions";

type TrainingHubPageHeaderProps = {
  showActions?: boolean;
  onQuickActionClick?: (actionId: string) => void;
};

export function TrainingHubPageHeader({ showActions = true, onQuickActionClick }: TrainingHubPageHeaderProps) {
  const { can, requirePermission } = usePermissions();
  const visibleActions = filterQuickActions(
    trainingHubHeader.quickActions,
    trainingHubQuickActionPermissions,
    can,
  );

  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{trainingHubHeader.title}</h1>
          <p className="va-ops-page-subtitle">{trainingHubHeader.subtitle}</p>
        </div>
      </div>

      {showActions && visibleActions.length > 0 && (
        <div className="va-ops-page-header-toolbar training-hub-header-actions">
          {visibleActions.map((action) => {
            const perm = trainingHubQuickActionPermissions[action.id];
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
