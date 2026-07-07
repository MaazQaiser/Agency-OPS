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
import { SIDEBAR_COLLAPSED_STORAGE_KEY } from "@/lib/sidebarNavigation";

type SidebarNavContextValue = {
  collapsed: boolean;
  hydrated: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarNavContext = createContext<SidebarNavContextValue | null>(null);

function readTabletDefault(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 768px) and (max-width: 1279px)").matches;
}

export function SidebarNavProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
      if (stored !== null) {
        setCollapsedState(stored === "true");
      } else {
        setCollapsedState(readTabletDefault());
      }
    } catch {
      setCollapsedState(readTabletDefault());
    }
    setHydrated(true);
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      collapsed,
      hydrated,
      toggleCollapsed,
      setCollapsed,
    }),
    [collapsed, hydrated, toggleCollapsed, setCollapsed],
  );

  return <SidebarNavContext.Provider value={value}>{children}</SidebarNavContext.Provider>;
}

export function useSidebarNav() {
  const ctx = useContext(SidebarNavContext);
  if (!ctx) throw new Error("useSidebarNav must be used within SidebarNavProvider");
  return ctx;
}
