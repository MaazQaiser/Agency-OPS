"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  notificationCategoryLabels,
  priorityBadgeClass,
  priorityLabels,
  type AppNotification,
} from "@/data/notifications";
import { cn } from "@/lib/cn";

type NotificationCardProps = {
  notification: AppNotification;
  onOpen: () => void;
  onMarkAsRead: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
  onResolve: () => void;
  onAction: (label: string) => void;
};

export function NotificationCard({
  notification,
  onOpen,
  onMarkAsRead,
  onSnooze,
  onDismiss,
  onResolve,
  onAction,
}: NotificationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isUnread = notification.status === "unread";
  const isResolved = notification.status === "resolved";

  const priorityClass = isResolved ? "badge-gray" : priorityBadgeClass[notification.priority];

  return (
    <li
      className={cn(
        "notification-card",
        isUnread && "unread",
        isResolved && "resolved",
      )}
    >
      <button type="button" className="notification-card-main" onClick={onOpen}>
        <span
          className={cn(
            "notification-card-icon",
            `notification-card-icon-${notification.category}`,
          )}
          aria-hidden="true"
        >
          <AppIcon name={notification.icon} size={16} strokeWidth={2} />
        </span>
        <span className="notification-card-content">
          <span className="notification-card-top">
            <span className={cn("badge", priorityClass)}>
              {isResolved ? "Resolved" : notificationCategoryLabels[notification.category]}
            </span>
            {isUnread && <span className="notification-card-unread-dot" aria-label="Unread" />}
          </span>
          <span className="notification-card-title">{notification.title}</span>
          <span className="notification-card-desc">{notification.description}</span>
          <span className="notification-card-meta">
            <time>{notification.timestamp}</time>
            <span className="notification-card-module">{notification.module}</span>
          </span>
        </span>
      </button>

      <div className="notification-card-actions">
        {notification.actions.slice(0, 2).map((action) => (
          <button
            key={action.id}
            type="button"
            className="notification-card-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAction(action.label);
            }}
          >
            {action.label}
          </button>
        ))}

        <div className="notification-card-menu-wrap">
          <button
            type="button"
            className="notification-card-menu-trigger"
            aria-label="More actions"
            aria-expanded={menuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
          >
            <AppIcon name="chevron-down" size={14} strokeWidth={2.25} />
          </button>
          {menuOpen && (
            <div className="notification-card-menu" role="menu">
              {isUnread && (
                <button type="button" role="menuitem" onClick={() => { onMarkAsRead(); setMenuOpen(false); }}>
                  Mark as read
                </button>
              )}
              <button type="button" role="menuitem" onClick={() => { onSnooze(); setMenuOpen(false); }}>
                Snooze
              </button>
              {!isResolved && (
                <button type="button" role="menuitem" onClick={() => { onResolve(); setMenuOpen(false); }}>
                  Resolve
                </button>
              )}
              <button type="button" role="menuitem" onClick={() => { onDismiss(); setMenuOpen(false); }}>
                Dismiss
              </button>
              {notification.actions.slice(2).map((action) => (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onAction(action.label);
                    setMenuOpen(false);
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isResolved && (
        <span className={cn("badge notification-card-priority", priorityClass)}>
          {priorityLabels[notification.priority]}
        </span>
      )}
    </li>
  );
}
