"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatLastSynced, isDataStale } from "@/lib/dataState";
import {
  emitGlobalSync,
  GLOBAL_SYNC_EVENT,
  type GlobalSyncEventDetail,
  type GlobalSyncPhase,
} from "@/lib/globalSync";
import { dispatchRefreshModule } from "@/lib/keyboardShortcutUtils";

type GlobalSyncContextValue = {
  phase: GlobalSyncPhase;
  lastSyncedAt: Date | null;
  label: string;
  isStale: boolean;
  refresh: () => void;
};

const GlobalSyncContext = createContext<GlobalSyncContextValue | null>(null);

const STALE_MS = 15 * 60 * 1000;

function phaseLabel(phase: GlobalSyncPhase, lastSyncedAt: Date | null, stale: boolean): string {
  if (phase === "syncing") return "Syncing…";
  if (phase === "error") return "Sync issue";
  if (stale && lastSyncedAt) return "Data stale";
  const synced = formatLastSynced(lastSyncedAt);
  if (synced) return synced;
  if (phase === "synced") return "Synced";
  return "Ready";
}

export function GlobalSyncProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<GlobalSyncPhase>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const applyDetail = useCallback((detail: GlobalSyncEventDetail) => {
    setPhase(detail.phase);
    if (detail.at) setLastSyncedAt(new Date(detail.at));
    else if (detail.phase === "synced") setLastSyncedAt(new Date());
  }, []);

  useEffect(() => {
    setPhase("syncing");
    emitGlobalSync({ phase: "syncing" });
    const timer = window.setTimeout(() => {
      const at = new Date().toISOString();
      setPhase("synced");
      setLastSyncedAt(new Date(at));
      emitGlobalSync({ phase: "synced", at });
    }, 480);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleSync = (event: Event) => {
      const detail = (event as CustomEvent<GlobalSyncEventDetail>).detail;
      if (!detail) return;
      applyDetail(detail);
    };
    window.addEventListener(GLOBAL_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(GLOBAL_SYNC_EVENT, handleSync);
  }, [applyDetail]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (!lastSyncedAt) return;
      if (isDataStale(lastSyncedAt, STALE_MS) && phase === "synced") {
        setPhase("stale");
      }
    }, 60_000);
    return () => window.clearInterval(tick);
  }, [lastSyncedAt, phase]);

  const isStale = isDataStale(lastSyncedAt, STALE_MS) || phase === "stale";

  const refresh = useCallback(() => {
    setPhase("syncing");
    emitGlobalSync({ phase: "syncing" });
    dispatchRefreshModule();
    window.setTimeout(() => {
      const at = new Date().toISOString();
      setPhase("synced");
      setLastSyncedAt(new Date(at));
      emitGlobalSync({ phase: "synced", at });
    }, 520);
  }, []);

  const value = useMemo<GlobalSyncContextValue>(
    () => ({
      phase,
      lastSyncedAt,
      label: phaseLabel(phase, lastSyncedAt, isStale),
      isStale,
      refresh,
    }),
    [phase, lastSyncedAt, isStale, refresh],
  );

  return <GlobalSyncContext.Provider value={value}>{children}</GlobalSyncContext.Provider>;
}

export function useGlobalSync() {
  const ctx = useContext(GlobalSyncContext);
  if (!ctx) {
    return {
      phase: "idle" as GlobalSyncPhase,
      lastSyncedAt: null,
      label: "Ready",
      isStale: false,
      refresh: () => dispatchRefreshModule(),
    };
  }
  return ctx;
}
