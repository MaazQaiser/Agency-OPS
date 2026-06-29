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
import { useHubDataState } from "@/hooks/useHubDataState";
import {
  computeSnoozeUntil,
  countUnread,
  filterNotifications,
  hasDangerUnread,
  hasUrgentUnread,
  isNotificationVisible,
  loadNotificationOverrides,
  mergeNotificationsWithOverrides,
  saveNotificationOverrides,
  seedNotifications,
  snoozeOptionLabels,
  type AppNotification,
  type NotificationFilterTab,
  type NotificationOverrides,
  type SnoozeOption,
} from "@/data/notifications";
import { NotificationCenterPanel } from "./NotificationCenterPanel";

type NotificationCenterContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  unreadCount: number;
  hasDanger: boolean;
  hasUrgentPulse: boolean;
  loading: boolean;
  markAllAsRead: () => void;
  /** @deprecated Use markAllAsRead */
  clearAll: () => void;
};

const NotificationCenterContext = createContext<NotificationCenterContextValue | null>(null);

function pickOverrides(seed: AppNotification, current: AppNotification): NotificationOverrides[string] | null {
  const diff: NotificationOverrides[string] = {};
  if (seed.status !== current.status) diff.status = current.status;
  if (seed.snoozedUntil !== current.snoozedUntil) diff.snoozedUntil = current.snoozedUntil;
  if ((seed.pinned ?? false) !== (current.pinned ?? false)) diff.pinned = current.pinned;
  if (seed.resolutionState !== current.resolutionState) diff.resolutionState = current.resolutionState;
  return Object.keys(diff).length > 0 ? diff : null;
}

export function NotificationCenterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>("all");
  const [hydrated, setHydrated] = useState(false);

  const {
    status: panelStatus,
    retry: retryPanel,
    lastSyncedAt: panelSyncedAt,
    retrying: panelRetrying,
  } = useHubDataState({
    load: () => filterNotifications(notifications, activeTab),
    isEmpty: () => false,
    delayMs: 200,
    deps: [isOpen, activeTab, notifications],
    errorPreset: "supabase-timeout",
  });

  const loading = isOpen && panelStatus === "loading";
  const panelError = isOpen && panelStatus === "error";

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const overrides = loadNotificationOverrides();
    setNotifications(mergeNotificationsWithOverrides(seedNotifications, overrides));
    setHydrated(true);
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  const persistOverrides = useCallback((next: AppNotification[]) => {
    const overrides: NotificationOverrides = {};
    for (const n of next) {
      const seed = seedNotifications.find((s) => s.id === n.id);
      if (!seed) continue;
      const diff = pickOverrides(seed, n);
      if (diff) overrides[n.id] = diff;
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

  const dismiss = useCallback(
    (id: string) => {
      updateNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, status: "dismissed" as const, resolutionState: "dismissed" as const }
            : n,
        ),
      );
    },
    [updateNotifications],
  );

  const markAllAsRead = useCallback(() => {
    updateNotifications((prev) =>
      prev.map((n) =>
        isNotificationVisible(n) && n.status === "unread" ? { ...n, status: "read" as const } : n,
      ),
    );
    toast.success("All notifications marked as read");
  }, [updateNotifications, toast]);

  const clearResolved = useCallback(() => {
    updateNotifications((prev) =>
      prev.map((n) =>
        n.resolutionState === "resolved" && n.status !== "dismissed"
          ? { ...n, status: "dismissed" as const }
          : n,
      ),
    );
    toast.success("Resolved notifications cleared");
  }, [updateNotifications, toast]);

  const togglePin = useCallback(
    (id: string) => {
      updateNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
      );
    },
    [updateNotifications],
  );

  const snooze = useCallback(
    (id: string, option: SnoozeOption) => {
      const until = computeSnoozeUntil(option);
      updateNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: "snoozed" as const, snoozedUntil: until } : n,
        ),
      );
      toast.success(snoozeOptionLabels[option]);
    },
    [updateNotifications, toast],
  );

  const handleAction = useCallback(
    (notification: AppNotification, actionId: string) => {
      updateNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? {
                ...n,
                status: n.status === "unread" ? ("read" as const) : n.status,
                resolutionState:
                  n.resolutionState === "open" ? ("in_progress" as const) : n.resolutionState,
              }
            : n,
        ),
      );
      close();
      router.push(getNotificationRoute(notification));
      toast.success(`Action: ${actionId.replace(/-/g, " ")}`);
    },
    [close, router, toast, updateNotifications],
  );

  const openNotification = useCallback(
    (notification: AppNotification) => {
      updateNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id && n.status === "unread" ? { ...n, status: "read" as const } : n,
        ),
      );
      close();
      router.push(getNotificationRoute(notification));
    },
    [close, router, updateNotifications],
  );

  const filtered = useMemo(
    () => filterNotifications(notifications, activeTab),
    [notifications, activeTab],
  );

  const unreadCount = useMemo(() => countUnread(notifications), [notifications]);
  const hasDanger = useMemo(() => hasDangerUnread(notifications), [notifications]);
  const hasUrgentPulse = useMemo(() => hasUrgentUnread(notifications), [notifications]);

  const contextValue = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      unreadCount,
      hasDanger,
      hasUrgentPulse,
      loading,
      markAllAsRead,
      clearAll: markAllAsRead,
    }),
    [isOpen, open, close, toggle, unreadCount, hasDanger, hasUrgentPulse, loading, markAllAsRead],
  );

  return (
    <NotificationCenterContext.Provider value={contextValue}>
      {children}
      {hydrated && isOpen && (
        <NotificationCenterPanel
          notifications={filtered}
          allNotifications={notifications}
          activeTab={activeTab}
          loading={loading}
          error={panelError}
          onRetry={retryPanel}
          retrying={panelRetrying}
          lastSyncedAt={panelSyncedAt}
          unreadCount={unreadCount}
          onTabChange={setActiveTab}
          onClose={close}
          onMarkAllRead={markAllAsRead}
          onClearResolved={clearResolved}
          onOpenNotification={openNotification}
          onDismiss={dismiss}
          onTogglePin={togglePin}
          onSnooze={snooze}
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
