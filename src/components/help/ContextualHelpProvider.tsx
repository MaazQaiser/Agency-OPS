"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HubHelpId } from "@/data/contextualHelp";
import { ContextualHelpDrawer } from "./ContextualHelpDrawer";

type ContextualHelpContextValue = {
  activeHubId: HubHelpId | null;
  open: (hubId: HubHelpId) => void;
  close: () => void;
  toggle: (hubId: HubHelpId) => void;
};

const ContextualHelpContext = createContext<ContextualHelpContextValue | null>(null);

export function ContextualHelpProvider({ children }: { children: ReactNode }) {
  const [activeHubId, setActiveHubId] = useState<HubHelpId | null>(null);

  const open = useCallback((hubId: HubHelpId) => {
    setActiveHubId(hubId);
  }, []);

  const close = useCallback(() => {
    setActiveHubId(null);
  }, []);

  const toggle = useCallback((hubId: HubHelpId) => {
    setActiveHubId((current) => (current === hubId ? null : hubId));
  }, []);

  const value = useMemo(
    () => ({ activeHubId, open, close, toggle }),
    [activeHubId, open, close, toggle],
  );

  return (
    <ContextualHelpContext.Provider value={value}>
      {children}
      <ContextualHelpDrawer hubId={activeHubId} onClose={close} />
    </ContextualHelpContext.Provider>
  );
}

export function useContextualHelp() {
  const ctx = useContext(ContextualHelpContext);
  if (!ctx) {
    throw new Error("useContextualHelp must be used within ContextualHelpProvider");
  }
  return ctx;
}
