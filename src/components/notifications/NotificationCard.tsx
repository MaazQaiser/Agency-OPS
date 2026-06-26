"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  notificationTypeLabels,
  typeBadgeClass,
  type AppNotification,
} from "@/data/notifications";
import { cn } from "@/lib/cn";

type NotificationCardProps = {
  notification: AppNotification;
  onOpen: () => void;
  onDismiss: () => void;
};

export function NotificationCard({ notification, onOpen, onDismiss }: NotificationCardProps) {
  const [dismissing, setDismissing] = useState(false);
  const isUnread = notification.status === "unread";

  const handleDismiss = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDismissing(true);
    window.setTimeout(() => onDismiss(), 200);
  };

  return (
    <li
      className={cn(
        "notification-card",
        `notification-card--${notification.type}`,
        isUnread && "unread",
        dismissing && "notification-card--dismissing",
      )}
    >
      <button
        type="button"
        className="notification-card-row no-motion"
        onClick={onOpen}
        aria-label={`${notification.title}. ${isUnread ? "Unread. " : ""}Open in ${notification.module}`}
      >
        <span
          className={cn("notification-card-icon", `notification-card-icon--${notification.type}`)}
          aria-hidden="true"
        >
          <AppIcon name={notification.icon} size={16} strokeWidth={2.25} />
        </span>

        <span className="notification-card-content">
          <span className="notification-card-top">
            <span className={cn("badge notification-card-type-badge", typeBadgeClass[notification.type])}>
              {notificationTypeLabels[notification.type]}
            </span>
            {isUnread && <span className="notification-card-unread-dot" aria-label="Unread" />}
          </span>

          <span className="notification-card-title">{notification.title}</span>
          <span className="notification-card-desc">{notification.description}</span>

          <span className="notification-card-meta">
            <time className="notification-card-time" dateTime={new Date(notification.timestampMs).toISOString()}>
              {notification.timestamp}
            </time>
            <span className="notification-card-hub-label">{notification.module}</span>
          </span>
        </span>
      </button>

      <button
        type="button"
        className="notification-card-close"
        aria-label={`Dismiss ${notification.title}`}
        onClick={handleDismiss}
      >
        <AppIcon name="close" size={14} strokeWidth={2.25} />
      </button>
    </li>
  );
}
