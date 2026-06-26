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
import { usePathname } from "next/navigation";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import {
  appendAuditLogEntry,
  loadAuditLogEntries,
  mergeAuditLog,
  seedAuditLog,
  type AuditLogEntry,
} from "@/data/auditLog";
import { AuditLogDrawer } from "./AuditLogDrawer";

type AuditLogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  entries: AuditLogEntry[];
  logEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp" | "timestampMs">) => void;
  canView: boolean;
};

const AuditLogContext = createContext<AuditLogContextValue | null>(null);

export function AuditLogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isOwner } = usePermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<AuditLogEntry[]>(seedAuditLog);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const canView = isOwner;

  const open = useCallback(() => {
    if (!canView) return;
    setIsOpen(true);
  }, [canView]);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    if (!canView) return;
    setIsOpen((prev) => !prev);
  }, [canView]);

  useEffect(() => {
    const persisted = loadAuditLogEntries();
    setEntries(mergeAuditLog(seedAuditLog, persisted));
    setHydrated(true);
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const logEntry = useCallback(
    (entry: Omit<AuditLogEntry, "id" | "timestamp" | "timestampMs">) => {
      setEntries((prev) => appendAuditLogEntry(entry, prev));
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      entries,
      logEntry,
      canView,
    }),
    [isOpen, open, close, toggle, entries, logEntry, canView],
  );

  return (
    <AuditLogContext.Provider value={contextValue}>
      {children}
      {hydrated && canView && isOpen && (
        <AuditLogDrawer entries={entries} loading={loading} onClose={close} />
      )}
    </AuditLogContext.Provider>
  );
}

export function useAuditLog() {
  const ctx = useContext(AuditLogContext);
  if (!ctx) throw new Error("useAuditLog must be used within AuditLogProvider");
  return ctx;
}
