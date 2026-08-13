"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CommandPalette } from "./CommandPalette";

type GlobalSearchContextValue = {
  isOpen: boolean;
  open: (initialQuery?: string) => void;
  close: () => void;
  toggle: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((query = "") => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      triggerRef.current = active;
    }
    setInitialQuery(query);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setInitialQuery("");
    const trigger = triggerRef.current;
    if (trigger) {
      requestAnimationFrame(() => trigger.focus());
    }
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setInitialQuery("");
        const trigger = triggerRef.current;
        if (trigger) requestAnimationFrame(() => trigger.focus());
        return false;
      }
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) {
        triggerRef.current = active;
      }
      return true;
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    const timeout = window.setTimeout(() => setRendered(false), 180);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      {rendered && <CommandPalette initialQuery={initialQuery} open={isOpen} onClose={close} />}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
  return ctx;
}
