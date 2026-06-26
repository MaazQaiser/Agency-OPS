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
  countUnread,
  filterNotifications,
  hasDangerUnread,
  hasUrgentUnread,
  isNotificationVisible,
  loadNotificationOverrides,
  mergeNotificationsWithOverrides,
  saveNotificationOverrides,
  seedNotifications,
  type AppNotification,
  type NotificationFilterTab,
  type NotificationOverrides,
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
  clearAll: () => void;
};

const NotificationCenterContext = createContext<NotificationCenterContextValue | null>(null);

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

  const dismiss = useCallback(
    (id: string) => {
      updateNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "dismissed" as const } : n)),
      );
    },
    [updateNotifications],
  );

  const clearAll = useCallback(() => {
    updateNotifications((prev) =>
      prev.map((n) =>
        isNotificationVisible(n) ? { ...n, status: "dismissed" as const } : n,
      ),
    );
    toast.success("All notifications cleared");
    close();
  }, [close, updateNotifications, toast]);

  const openNotification = useCallback(
    (notification: AppNotification) => {
      close();
      router.push(getNotificationRoute(notification));
    },
    [close, router],
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
      clearAll,
    }),
    [isOpen, open, close, toggle, unreadCount, hasDanger, hasUrgentPulse, loading, clearAll],
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
          onClearAll={clearAll}
          onOpenNotification={openNotification}
          onDismiss={dismiss}
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
