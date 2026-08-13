"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { HubHelpId } from "@/data/contextualHelp";
import { ContextualHelpDrawer } from "./ContextualHelpDrawer";

type ContextualHelpContextValue = {
  activeHubId: HubHelpId | null;
  open: (hubId: HubHelpId, trigger?: HTMLElement | null) => void;
  close: () => void;
  toggle: (hubId: HubHelpId, trigger?: HTMLElement | null) => void;
};

const ContextualHelpContext = createContext<ContextualHelpContextValue | null>(null);

export function ContextualHelpProvider({ children }: { children: ReactNode }) {
  const [activeHubId, setActiveHubId] = useState<HubHelpId | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((hubId: HubHelpId, trigger?: HTMLElement | null) => {
    if (trigger) triggerRef.current = trigger;
    setActiveHubId(hubId);
  }, []);

  const close = useCallback(() => {
    setActiveHubId(null);
    const trigger = triggerRef.current;
    if (trigger) {
      requestAnimationFrame(() => trigger.focus());
    }
  }, []);

  const toggle = useCallback((hubId: HubHelpId, trigger?: HTMLElement | null) => {
    setActiveHubId((current) => {
      if (current === hubId) {
        const el = triggerRef.current;
        if (el) requestAnimationFrame(() => el.focus());
        return null;
      }
      if (trigger) triggerRef.current = trigger;
      return hubId;
    });
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
