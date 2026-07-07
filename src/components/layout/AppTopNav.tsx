"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useContextualHelp } from "@/components/help/ContextualHelpProvider";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { useNotificationCenter } from "@/components/notifications/NotificationCenterProvider";
import { useGlobalSync } from "@/components/sync/GlobalSyncProvider";
import { pathnameToHelpHub } from "@/lib/pathnameToHelpHub";
import { cn } from "@/lib/cn";
import { SidebarProfileMenu } from "./SidebarProfileMenu";

export function AppTopNav() {
  const pathname = usePathname();
  const { phase, label: syncLabel, isStale, refresh } = useGlobalSync();
  const { toggle: toggleNotifications, unreadCount, hasUrgentPulse } = useNotificationCenter();
  const { open: openContextualHelp } = useContextualHelp();
  const { open: openGlobalSearch } = useGlobalSearch();
  const [profileOpen, setProfileOpen] = useState(false);

  const helpHubId = pathnameToHelpHub(pathname);

  return (
    <header className="app-top-nav" aria-label="Application utilities">
      <div className="app-top-nav-start">
        <button
          type="button"
          className="app-top-nav-search"
          onClick={() => openGlobalSearch()}
          aria-label="Open global search"
        >
          <AppIcon name="search" size={16} strokeWidth={2} />
          <span className="app-top-nav-search-label">Search</span>
          <kbd className="app-top-nav-kbd" aria-hidden="true">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="app-top-nav-actions">
        <button
          type="button"
          className={cn(
            "top-nav-action-btn top-nav-action-btn--sync",
            phase === "syncing" && "top-nav-action-btn--syncing",
            isStale && "top-nav-action-btn--stale",
          )}
          onClick={refresh}
          aria-label={`Sync state: ${syncLabel}. Click to refresh.`}
          title={syncLabel}
        >
          <span className="top-nav-sync-dot-wrap" aria-hidden="true">
            <span className="top-nav-sync-dot" />
          </span>
          <span className="top-nav-action-label">{syncLabel}</span>
        </button>

        <button
          type="button"
          className={cn("top-nav-action-btn", hasUrgentPulse && "top-nav-action-btn--pulse")}
          onClick={toggleNotifications}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <span className="top-nav-icon-wrap">
            <AppIcon name="bell" size={18} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="top-nav-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
          </span>
          <span className="top-nav-action-label">Notifications</span>
        </button>

        <button
          type="button"
          className="top-nav-action-btn"
          aria-label="Settings"
          onClick={() => setProfileOpen(true)}
        >
          <AppIcon name="settings" size={18} strokeWidth={2} />
          <span className="top-nav-action-label">Settings</span>
        </button>

        <button
          type="button"
          className="top-nav-action-btn"
          onClick={() => openContextualHelp(helpHubId)}
          aria-label="Help for current hub"
        >
          <AppIcon name="help-circle" size={18} strokeWidth={2} />
          <span className="top-nav-action-label">Help</span>
        </button>

        <SidebarProfileMenu
          variant="top"
          open={profileOpen}
          onOpenChange={setProfileOpen}
        />
      </div>
    </header>
  );
}
