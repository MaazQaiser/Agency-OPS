"use client";

import { usePathname } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAuditLog } from "@/components/audit-log/AuditLogProvider";
import { useContextualHelp } from "@/components/help/ContextualHelpProvider";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { useNotificationCenter } from "@/components/notifications/NotificationCenterProvider";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useSubscription } from "@/components/subscription/SubscriptionProvider";
import { useGlobalSync } from "@/components/sync/GlobalSyncProvider";
import { getRoleLabel } from "@/data/rolePermissions";
import { pathnameToHelpHub } from "@/lib/pathnameToHelpHub";
import { cn } from "@/lib/cn";

export function GlobalUtilityStrip() {
  const pathname = usePathname();
  const { tenant } = useSubscription();
  const { role } = usePermissions();
  const { open: openCommandPalette } = useGlobalSearch();
  const { open: openContextualHelp } = useContextualHelp();
  const {
    toggle: toggleNotifications,
    unreadCount,
    hasDanger,
    hasUrgentPulse,
    loading: notificationsLoading,
  } = useNotificationCenter();
  const { toggle: toggleAuditLog, canView: canViewAuditLog } = useAuditLog();
  const { phase, label: syncLabel, isStale, refresh } = useGlobalSync();

  const helpHubId = pathnameToHelpHub(pathname);

  const openHelpDrawer = () => {
    openContextualHelp(helpHubId);
  };

  return (
    <div className="global-utility-strip" aria-label="Global utilities">
      <div className="global-utility-strip-badges" aria-label="Workspace context">
        <span
          className="global-utility-badge global-utility-badge--context"
          title={`${tenant.name} · ${getRoleLabel(role)}`}
        >
          <AppIcon name="globe" size={12} strokeWidth={2.25} className="global-utility-badge-icon" />
          <span className="global-utility-badge-text">
            {tenant.name}
            <span className="global-utility-badge-sep" aria-hidden="true">
              /
            </span>
            {getRoleLabel(role)}
          </span>
        </span>
      </div>

      <span className="global-utility-strip-divider" aria-hidden="true" />

      <button
        type="button"
        className={cn(
          "global-utility-sync",
          phase === "syncing" && "global-utility-sync--active",
          isStale && "global-utility-sync--stale",
          phase === "error" && "global-utility-sync--error",
        )}
        onClick={refresh}
        aria-label={`Sync state: ${syncLabel}. Click to refresh module.`}
        title={syncLabel}
      >
        <span className="global-utility-sync-dot" aria-hidden="true" />
        <span className="global-utility-sync-label">{syncLabel}</span>
      </button>

      <span className="global-utility-strip-divider" aria-hidden="true" />

      <div className="global-utility-strip-actions">
        <button
          type="button"
          className="global-utility-btn global-utility-btn--search"
          onClick={() => openCommandPalette()}
          aria-label="Open command palette. Command K"
        >
          <AppIcon name="search" size={16} strokeWidth={2} />
          <span className="global-utility-btn-label">Search</span>
          <kbd className="global-utility-kbd">⌘K</kbd>
        </button>

        <button
          type="button"
          className="global-utility-btn global-utility-btn--palette"
          onClick={() => openCommandPalette()}
          aria-label="Open command palette"
          title="Command palette"
        >
          <AppIcon name="zap" size={16} strokeWidth={2} />
          <span className="global-utility-btn-label">Command</span>
          <kbd className="global-utility-kbd global-utility-kbd--compact">⌘K</kbd>
        </button>

        <button
          type="button"
          className={cn(
            "global-utility-btn global-utility-btn--icon",
            hasUrgentPulse && "global-utility-btn--pulse",
            notificationsLoading && "global-utility-btn--loading",
          )}
          onClick={toggleNotifications}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <AppIcon name="bell" size={16} strokeWidth={2} />
          {unreadCount > 0 && (
            <span className={cn("global-utility-badge-count", hasDanger && "global-utility-badge-count--danger")}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {canViewAuditLog && (
          <button
            type="button"
            className="global-utility-btn global-utility-btn--icon"
            onClick={toggleAuditLog}
            aria-label="Open audit log. Command Shift J"
          >
            <AppIcon name="clipboard" size={16} strokeWidth={2} />
            <kbd className="global-utility-kbd global-utility-kbd--floating">⌘⇧J</kbd>
          </button>
        )}

        <button
          type="button"
          className="global-utility-btn global-utility-btn--icon"
          onClick={openHelpDrawer}
          aria-label="Open help for current hub"
        >
          <AppIcon name="help-circle" size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
