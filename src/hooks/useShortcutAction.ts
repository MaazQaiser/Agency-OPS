"use client";

import { useEffect } from "react";
import { SHORTCUT_ACTION_EVENT } from "@/lib/keyboardShortcutUtils";

export function useShortcutAction(actionId: string, handler: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const onAction = (event: Event) => {
      const detail = (event as CustomEvent<{ actionId: string }>).detail;
      if (detail?.actionId === actionId) handler();
    };

    window.addEventListener(SHORTCUT_ACTION_EVENT, onAction);
    return () => window.removeEventListener(SHORTCUT_ACTION_EVENT, onAction);
  }, [actionId, handler, enabled]);
}

export function useShortcutRefresh(handler: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const onRefresh = () => handler();
    window.addEventListener("agency-ops:refresh-module", onRefresh);
    return () => window.removeEventListener("agency-ops:refresh-module", onRefresh);
  }, [handler, enabled]);
}

export function useModalCommand(
  handlers: Partial<Record<"save" | "save-draft" | "submit", () => void>>,
  open: boolean,
): void {
  useEffect(() => {
    if (!open) return;

    const onCommand = (event: Event) => {
      const command = (event as CustomEvent<{ command: "save" | "save-draft" | "submit" }>).detail?.command;
      if (command && handlers[command]) handlers[command]!();
    };

    window.addEventListener("agency-ops:modal-command", onCommand);
    return () => window.removeEventListener("agency-ops:modal-command", onCommand);
  }, [handlers, open]);
}
