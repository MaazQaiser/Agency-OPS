"use client";

import { useEffect, useRef } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  notificationCategoryLabels,
  notificationFilterTabs,
  priorityBadgeClass,
  priorityLabels,
  tabCount,
  type AppNotification,
  type NotificationFilterTab,
  type NotificationPriority,
} from "@/data/notifications";
import { cn } from "@/lib/cn";
import { NotificationCard } from "./NotificationCard";

type NotificationCenterPanelProps = {
  notifications: AppNotification[];
  allNotifications: AppNotification[];
  activeTab: NotificationFilterTab;
  priorityFilter: NotificationPriority | "all";
  filterOpen: boolean;
  loading: boolean;
  unreadCount: number;
  onTabChange: (tab: NotificationFilterTab) => void;
  onPriorityFilterChange: (priority: NotificationPriority | "all") => void;
  onFilterToggle: () => void;
  onClose: () => void;
  onMarkAllRead: () => void;
  onClearResolved: () => void;
  onOpenNotification: (notification: AppNotification) => void;
  onMarkAsRead: (id: string) => void;
  onSnooze: (id: string) => void;
  onDismiss: (id: string) => void;
  onResolve: (id: string) => void;
  onAction: (notification: AppNotification, actionLabel: string) => void;
};

const priorityOptions: { id: NotificationPriority | "all"; label: string }[] = [
  { id: "all", label: "All priorities" },
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export function NotificationCenterPanel({
  notifications,
  allNotifications,
  activeTab,
  priorityFilter,
  filterOpen,
  loading,
  unreadCount,
  onTabChange,
  onPriorityFilterChange,
  onFilterToggle,
  onClose,
  onMarkAllRead,
  onClearResolved,
  onOpenNotification,
  onMarkAsRead,
  onSnooze,
  onDismiss,
  onResolve,
  onAction,
}: NotificationCenterPanelProps) {
  const filterRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!filterOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (filterRef.current?.contains(event.target as Node)) return;
      onFilterToggle();
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [filterOpen, onFilterToggle]);

  const hasResolved = allNotifications.some((n) => n.status === "resolved");

  return (
    <div className="va-ops-drawer-root notification-center-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop notification-center-backdrop"
        aria-label="Close notifications"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer notification-center-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <header className="notification-center-header">
          <div className="notification-center-header-title">
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <span className="badge badge-blue notification-center-unread-badge">{unreadCount}</span>
            )}
          </div>
          <div className="notification-center-header-actions">
            <button
              type="button"
              className="notification-center-header-btn"
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
            <div className="notification-center-filter-wrap" ref={filterRef}>
              <button
                type="button"
                className={cn("notification-center-header-icon-btn", filterOpen && "active")}
                aria-label="Filter by priority"
                aria-expanded={filterOpen}
                onClick={onFilterToggle}
              >
                <AppIcon name="settings" size={16} strokeWidth={2} />
              </button>
              {filterOpen && (
                <div className="notification-center-filter-menu" role="menu">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="menuitem"
                      className={cn(
                        "notification-center-filter-item",
                        priorityFilter === opt.id && "active",
                      )}
                      onClick={() => {
                        onPriorityFilterChange(opt.id);
                        onFilterToggle();
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="va-ops-drawer-close"
              aria-label="Close"
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
                className={cn("notification-center-tab", activeTab === tab.id && "active")}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
                {count > 0 && <span className="notification-center-tab-count">{count}</span>}
              </button>
            );
          })}
        </nav>

        {priorityFilter !== "all" && (
          <div className="notification-center-active-filter">
            <span className={cn("badge", priorityBadgeClass[priorityFilter])}>
              {priorityLabels[priorityFilter]}
            </span>
            <button type="button" onClick={() => onPriorityFilterChange("all")}>
              Clear filter
            </button>
          </div>
        )}

        <div className="notification-center-body">
          {loading ? (
            <div className="notification-center-skeleton" aria-busy="true" aria-label="Loading notifications">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="notification-center-skeleton-card" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-center-empty" role="status">
              <AppIcon name="bell" size={32} strokeWidth={1.75} />
              <p className="notification-center-empty-title">No new notifications</p>
              <p className="notification-center-empty-desc">
                {activeTab === "all"
                  ? priorityFilter !== "all"
                    ? `No ${priorityLabels[priorityFilter].toLowerCase()} priority notifications right now.`
                    : "You're all caught up. Alerts from across Agency OPS will appear here."
                  : `No ${notificationCategoryLabels[activeTab].toLowerCase()} notifications right now.`}
              </p>
            </div>
          ) : (
            <ul className="notification-center-list">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onOpen={() => onOpenNotification(notification)}
                  onMarkAsRead={() => onMarkAsRead(notification.id)}
                  onSnooze={() => onSnooze(notification.id)}
                  onDismiss={() => onDismiss(notification.id)}
                  onResolve={() => onResolve(notification.id)}
                  onAction={(label) => onAction(notification, label)}
                />
              ))}
            </ul>
          )}
        </div>

        {hasResolved && (
          <footer className="notification-center-footer">
            <button type="button" className="notification-center-footer-btn" onClick={onClearResolved}>
              Clear resolved
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
