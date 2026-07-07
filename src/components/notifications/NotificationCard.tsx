"use client";

import { useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import {
  getModuleSourceClass,
  getNotificationActions,
  getNotificationIcon,
  notificationTypeLabels,
  resolutionStateBadgeClass,
  resolutionStateLabels,
  snoozeOptionLabels,
  typeBadgeClass,
  type AppNotification,
  type SnoozeOption,
} from "@/data/notifications";
import { cn } from "@/lib/cn";

type NotificationCardProps = {
  notification: AppNotification;
  onOpen: () => void;
  onDismiss: () => void;
  onTogglePin: () => void;
  onSnooze: (option: SnoozeOption) => void;
  onAction: (actionId: string) => void;
};

const SNOOZE_OPTIONS: SnoozeOption[] = ["1h", "tomorrow", "next-folio"];

export function NotificationCard({
  notification,
  onOpen,
  onDismiss,
  onTogglePin,
  onSnooze,
  onAction,
}: NotificationCardProps) {
  const [dismissing, setDismissing] = useState(false);
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const snoozeRef = useRef<HTMLDivElement>(null);
  const isUnread = notification.status === "unread";
  const isResolved = notification.resolutionState === "resolved";
  const actions = getNotificationActions(notification);
  const iconName = getNotificationIcon(notification);

  useEffect(() => {
    if (!snoozeOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (snoozeRef.current && !snoozeRef.current.contains(event.target as Node)) {
        setSnoozeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [snoozeOpen]);

  const handleDismiss = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDismissing(true);
    window.setTimeout(() => onDismiss(), 200);
  };

  const handlePin = (event: React.MouseEvent) => {
    event.stopPropagation();
    onTogglePin();
  };

  const handleSnoozeSelect = (option: SnoozeOption) => {
    setSnoozeOpen(false);
    onSnooze(option);
  };

  const handleAction = (event: React.MouseEvent, actionId: string) => {
    event.stopPropagation();
    onAction(actionId);
  };

  return (
    <li
      className={cn(
        "notification-card",
        `notification-card--${notification.type}`,
        isUnread && "unread",
        !isUnread && "read",
        notification.pinned && "pinned",
        isResolved && "notification-card--resolved",
        dismissing && "notification-card--dismissing",
      )}
    >
      <div className="notification-card-toolbar">
        <button
          type="button"
          className={cn(
            "notification-card-pin",
            notification.pinned && "notification-card-pin--active",
          )}
          aria-label={notification.pinned ? "Unpin notification" : "Pin notification"}
          aria-pressed={notification.pinned}
          onClick={handlePin}
        >
          <AppIcon name="pin" size={13} strokeWidth={2.25} />
        </button>

        <div className="notification-card-snooze-wrap" ref={snoozeRef}>
          <button
            type="button"
            className="notification-card-snooze"
            aria-label="Snooze notification"
            aria-expanded={snoozeOpen}
            onClick={(event) => {
              event.stopPropagation();
              setSnoozeOpen((prev) => !prev);
            }}
          >
            <AppIcon name="clock" size={13} strokeWidth={2.25} />
          </button>
          {snoozeOpen && (
            <div className="notification-card-snooze-menu" role="menu">
              {SNOOZE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="menuitem"
                  className="notification-card-snooze-item"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSnoozeSelect(option);
                  }}
                >
                  {snoozeOptionLabels[option]}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="notification-card-close"
          aria-label={`Dismiss ${notification.title}`}
          onClick={handleDismiss}
        >
          <AppIcon name="close" size={14} strokeWidth={2.25} />
        </button>
      </div>

      <div className="notification-card-body">
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
            <AppIcon name={iconName} size={16} strokeWidth={2.25} />
          </span>

          <span className="notification-card-content notification-card-avatar-row">
            {notification.relatedUserName && (
              <TeamAvatar
                name={notification.relatedUserName}
                size="sm"
                showStatus={false}
                showTooltip={false}
                className="notification-card-avatar"
              />
            )}
            <span className="notification-card-content-inner">
            <span className="notification-card-top">
              <span className={cn("badge notification-card-type-badge", typeBadgeClass[notification.type])}>
                {notificationTypeLabels[notification.type]}
              </span>
              <span
                className={cn(
                  "notification-card-resolution",
                  resolutionStateBadgeClass[notification.resolutionState],
                )}
              >
                {resolutionStateLabels[notification.resolutionState]}
              </span>
              {isUnread && <span className="notification-card-unread-dot" aria-label="Unread" />}
            </span>

            <span className="notification-card-title">{notification.title}</span>
            <span className="notification-card-desc">{notification.description}</span>

            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <span className="notification-card-metadata">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <span key={key} className="notification-card-meta-item">
                    <span className="notification-card-meta-key">{key}</span>
                    <span className="notification-card-meta-value">{value}</span>
                  </span>
                ))}
              </span>
            )}

            <span className="notification-card-meta">
              <time className="notification-card-time" dateTime={new Date(notification.timestampMs).toISOString()}>
                {notification.timestamp}
              </time>
              {notification.relatedUserName && (
                <span className="notification-card-assignee-chip">
                  <span className="notification-card-assignee">{notification.relatedUserName}</span>
                </span>
              )}
              <span
                className={cn(
                  "notification-card-hub-label",
                  getModuleSourceClass(notification.module),
                )}
              >
                {notification.module}
              </span>
            </span>
            </span>
          </span>
        </button>

        <div className="notification-card-actions" role="group" aria-label="Quick actions">
          {actions.map((action, index) => (
            <button
              key={action.id}
              type="button"
              className={cn(
                "notification-card-action-btn",
                index === 0 && "notification-card-action-btn--primary",
                `notification-card-action-btn--${notification.type}`,
              )}
              onClick={(event) => handleAction(event, action.id)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </li>
  );
}
