"use client";

import { useEffect, useRef } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  notificationFilterTabs,
  notificationTypeLabels,
  tabCount,
  type AppNotification,
  type NotificationFilterTab,
} from "@/data/notifications";
import { cn } from "@/lib/cn";
import { NotificationListSkeleton } from "@/components/shared/loading";
import { HubEmptyState, HubErrorState } from "@/components/state";
import { ExportMenu } from "@/components/export/ExportMenu";
import { NotificationCard } from "./NotificationCard";

type NotificationCenterPanelProps = {
  notifications: AppNotification[];
  allNotifications: AppNotification[];
  activeTab: NotificationFilterTab;
  loading: boolean;
  error?: boolean;
  onRetry?: () => void;
  retrying?: boolean;
  lastSyncedAt?: Date | null;
  unreadCount: number;
  onTabChange: (tab: NotificationFilterTab) => void;
  onClose: () => void;
  onClearAll: () => void;
  onOpenNotification: (notification: AppNotification) => void;
  onDismiss: (id: string) => void;
};

export function NotificationCenterPanel({
  notifications,
  allNotifications,
  activeTab,
  loading,
  error = false,
  onRetry,
  retrying = false,
  lastSyncedAt,
  unreadCount,
  onTabChange,
  onClose,
  onClearAll,
  onOpenNotification,
  onDismiss,
}: NotificationCenterPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const hasClearable = allNotifications.some(
    (n) => n.status !== "dismissed" && n.status !== "snoozed",
  );

  return (
    <div className="va-ops-drawer-root notification-center-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop notification-center-backdrop"
        aria-label="Close notifications"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className="va-ops-drawer notification-center-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <header className="notification-center-header">
          <div className="notification-center-header-title">
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <span className="badge badge-blue notification-center-unread-badge" aria-live="polite">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="notification-center-header-actions">
            <ExportMenu kind="notification-history" compact />
            <button
              type="button"
              className="notification-center-header-btn notification-center-header-btn--clear"
              onClick={onClearAll}
              disabled={!hasClearable}
            >
              Clear all
            </button>
            <button
              type="button"
              className="va-ops-drawer-close"
              aria-label="Close notifications"
              onClick={onClose}
            >
              <AppIcon name="close" size={18} strokeWidth={2.25} />
            </button>
          </div>
        </header>

        <nav className="notification-center-tabs" aria-label="Notification filters">
          {notificationFilterTabs.map((tab) => {
            const count = tabCount(allNotifications, tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "notification-center-tab",
                  activeTab === tab.id && "active",
                  tab.id !== "all" && `notification-center-tab--${tab.id}`,
                )}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
                {count > 0 && <span className="notification-center-tab-count">{count}</span>}
              </button>
            );
          })}
        </nav>

        <div className="notification-center-body">
          {loading ? (
            <NotificationListSkeleton count={5} />
          ) : error ? (
            <HubErrorState
              preset="supabase-timeout"
              onRetry={onRetry}
              retrying={retrying}
              lastSyncedAt={lastSyncedAt}
              compact
            />
          ) : notifications.length === 0 ? (
            <HubEmptyState
              preset="notifications"
              title={activeTab === "all" ? undefined : `No ${notificationTypeLabels[activeTab].toLowerCase()} notifications`}
              description={
                activeTab === "all"
                  ? undefined
                  : `Switch to All to see every alert, or check back when new ${notificationTypeLabels[activeTab].toLowerCase()} signals arrive.`
              }
              compact
            />
          ) : (
            <ul className="notification-center-list">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onOpen={() => onOpenNotification(notification)}
                  onDismiss={() => onDismiss(notification.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
