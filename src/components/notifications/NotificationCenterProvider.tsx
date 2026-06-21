"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNotificationRoute } from "@/lib/crossModuleLinks";
import { useToast } from "@/hooks/useToast";
import {
  countUnread,
  filterNotifications,
  hasCriticalUnread,
  hasUrgentUnread,
  loadNotificationOverrides,
  mergeNotificationsWithOverrides,
  saveNotificationOverrides,
  seedNotifications,
  type AppNotification,
  type NotificationFilterTab,
  type NotificationOverrides,
  type NotificationPriority,
} from "@/data/notifications";
import { NotificationCenterPanel } from "./NotificationCenterPanel";

type NotificationCenterContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  unreadCount: number;
  hasCritical: boolean;
  hasUrgentPulse: boolean;
  loading: boolean;
  clearResolved: () => void;
};

const NotificationCenterContext = createContext<NotificationCenterContextValue | null>(null);

const SNOOZE_MS = 24 * 60 * 60 * 1000;

export function NotificationCenterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>("all");
  const [priorityFilter, setPriorityFilter] = useState<NotificationPriority | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setFilterOpen(false);
  }, []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const overrides = loadNotificationOverrides();
    setNotifications(mergeNotificationsWithOverrides(seedNotifications, overrides));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 380);
    return () => window.clearTimeout(timer);
  }, [isOpen, activeTab]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  const persistOverrides = useCallback((next: AppNotification[]) => {
    const overrides: NotificationOverrides = {};
    for (const n of next) {
      const seed = seedNotifications.find((s) => s.id === n.id);
      if (!seed) continue;
      if (seed.status !== n.status || seed.snoozedUntil !== n.snoozedUntil) {
        overrides[n.id] = { status: n.status, snoozedUntil: n.snoozedUntil };
      }
    }
    saveNotificationOverrides(overrides);
  }, []);

  const updateNotifications = useCallback(
    (updater: (prev: AppNotification[]) => AppNotification[]) => {
      setNotifications((prev) => {
        const next = updater(prev);
        persistOverrides(next);
        return next;
      });
    },
    [persistOverrides],
  );

  const markAsRead = useCallback(
    (id: string) => {
      updateNotifications((prev) =>
        prev.map((n) => (n.id === id && n.status === "unread" ? { ...n, status: "read" as const } : n)),
      );
    },
    [updateNotifications],
  );

  const markAllRead = useCallback(() => {
    updateNotifications((prev) =>
      prev.map((n) => (n.status === "unread" ? { ...n, status: "read" as const } : n)),
    );
    toast.success("All notifications marked as read");
  }, [updateNotifications, toast]);

  const snooze = useCallback(
    (id: string) => {
      const until = Date.now() + SNOOZE_MS;
      updateNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: "snoozed" as const, snoozedUntil: until } : n,
        ),
      );
      toast.success("Notification snoozed for 24 hours");
    },
    [updateNotifications, toast],
  );

  const dismiss = useCallback(
    (id: string) => {
      updateNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "dismissed" as const } : n)),
      );
      toast.success("Notification dismissed");
    },
    [updateNotifications, toast],
  );

  const resolve = useCallback(
    (id: string) => {
      updateNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "resolved" as const } : n)),
      );
      toast.success("Notification resolved");
    },
    [updateNotifications, toast],
  );

  const clearResolved = useCallback(() => {
    updateNotifications((prev) =>
      prev.map((n) => (n.status === "resolved" ? { ...n, status: "dismissed" as const } : n)),
    );
    toast.success("Resolved notifications cleared");
  }, [updateNotifications, toast]);

  const openNotification = useCallback(
    (notification: AppNotification) => {
      markAsRead(notification.id);
      close();
      router.push(getNotificationRoute(notification));
    },
    [markAsRead, close, router],
  );

  const handleAction = useCallback(
    (notification: AppNotification, actionLabel: string) => {
      markAsRead(notification.id);
      if (actionLabel === "Resolve" || actionLabel === "Mark Complete") {
        resolve(notification.id);
      }
      toast.success(`${actionLabel} — ${notification.title}`);
      if (actionLabel !== "Dismiss" && actionLabel !== "Snooze") {
        close();
        router.push(getNotificationRoute(notification));
      }
    },
    [markAsRead, resolve, toast, close, router],
  );

  const filtered = useMemo(
    () => filterNotifications(notifications, activeTab, priorityFilter),
    [notifications, activeTab, priorityFilter],
  );

  const unreadCount = useMemo(() => countUnread(notifications), [notifications]);
  const hasCritical = useMemo(() => hasCriticalUnread(notifications), [notifications]);
  const hasUrgentPulse = useMemo(() => hasUrgentUnread(notifications), [notifications]);

  const contextValue = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      unreadCount,
      hasCritical,
      hasUrgentPulse,
      loading,
      clearResolved,
    }),
    [isOpen, open, close, toggle, unreadCount, hasCritical, hasUrgentPulse, loading, clearResolved],
  );

  return (
    <NotificationCenterContext.Provider value={contextValue}>
      {children}
      {hydrated && isOpen && (
        <NotificationCenterPanel
          notifications={filtered}
          allNotifications={notifications}
          activeTab={activeTab}
          priorityFilter={priorityFilter}
          filterOpen={filterOpen}
          loading={loading}
          unreadCount={unreadCount}
          onTabChange={setActiveTab}
          onPriorityFilterChange={setPriorityFilter}
          onFilterToggle={() => setFilterOpen((o) => !o)}
          onClose={close}
          onMarkAllRead={markAllRead}
          onClearResolved={clearResolved}
          onOpenNotification={openNotification}
          onMarkAsRead={markAsRead}
          onSnooze={snooze}
          onDismiss={dismiss}
          onResolve={resolve}
          onAction={handleAction}
        />
      )}
    </NotificationCenterContext.Provider>
  );
}

export function useNotificationCenter() {
  const ctx = useContext(NotificationCenterContext);
  if (!ctx) throw new Error("useNotificationCenter must be used within NotificationCenterProvider");
  return ctx;
}
