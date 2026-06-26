"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEntitlements } from "@/hooks/useEntitlements";
import { CommandPalette } from "./CommandPalette";
import { routes } from "@/lib/routes";

type GlobalSearchContextValue = {
  isOpen: boolean;
  open: (initialQuery?: string) => void;
  close: () => void;
  toggle: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { hasFeature } = useEntitlements();

  const open = useCallback((query = "") => {
    setInitialQuery(query);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setInitialQuery("");
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      {isOpen && (
        <CommandPalette
          initialQuery={initialQuery}
          onClose={close}
          canOpenWorkspace={hasFeature("analytics")}
          onOpenWorkspace={(query) => {
            if (!hasFeature("analytics")) return;
            close();
            const params = query ? `?q=${encodeURIComponent(query)}` : "";
            router.push(`${routes.globalSearch}${params}`);
          }}
        />
      )}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
  return ctx;
}
