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
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useNotificationCenter } from "@/components/notifications/NotificationCenterProvider";
import { useAuditLog } from "@/components/audit-log/AuditLogProvider";
import { useOwnerQuickActions } from "@/components/owner-quick-actions/OwnerQuickActionsProvider";
import {
  detailShortcuts,
  globalShiftShortcuts,
  globalSingleKeyShortcuts,
  matchShortcutKeys,
  modShortcuts,
  shortcutsForModule,
  type ShortcutDefinition,
} from "@/data/keyboardShortcuts";
import {
  dispatchEscapeLayer,
  dispatchFocusSearch,
  dispatchModalCommand,
  dispatchRefreshModule,
  dispatchShortcutAction,
  focusPageSearchInput,
  isHelpKey,
  isModKey,
  isTypingContext,
} from "@/lib/keyboardShortcutUtils";
import { ShortcutHelpModal } from "./ShortcutHelpModal";

type KeyboardShortcutsContextValue = {
  helpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
};

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | null>(null);

function findMatch(candidates: ShortcutDefinition[], event: KeyboardEvent): ShortcutDefinition | null {
  for (const shortcut of candidates) {
    if (matchShortcutKeys(event, shortcut.keys)) return shortcut;
  }
  return null;
}

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen: searchOpen, open: openSearch, close: closeSearch, toggle: toggleSearch } = useGlobalSearch();
  const { isOpen: notificationsOpen, open: openNotifications, close: closeNotifications, clearAll } =
    useNotificationCenter();
  const { isOpen: ownerOpen, toggle: toggleOwner, close: closeOwner, isOwner } = useOwnerQuickActions();
  const { isOpen: auditOpen, toggle: toggleAuditLog, close: closeAuditLog, canView: canViewAuditLog } = useAuditLog();
  const { hasFeature, canOpenHref } = useEntitlements();
  const [helpOpen, setHelpOpen] = useState(false);

  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  const executeShortcut = useCallback(
    (shortcut: ShortcutDefinition) => {
      const actionId = shortcut.actionId;

      if (actionId === "open-search") {
        toggleSearch();
        return;
      }
      if (actionId === "owner-quick-actions") {
        if (isOwner) toggleOwner();
        return;
      }
      if (actionId === "open-audit-log") {
        if (canViewAuditLog) toggleAuditLog();
        return;
      }
      if (actionId === "shortcut-help") {
        openHelp();
        return;
      }
      if (actionId === "focus-search") {
        if (!focusPageSearchInput()) dispatchFocusSearch();
        return;
      }
      if (actionId === "refresh-module") {
        dispatchRefreshModule();
        router.refresh();
        return;
      }
      if (actionId === "open-notifications") {
        openNotifications();
        return;
      }
      if (actionId === "clear-notifications") {
        clearAll();
        return;
      }
      if (actionId === "go-back") {
        router.back();
        return;
      }
      if (actionId === "open-selected-row" || actionId === "expand-row") {
        dispatchShortcutAction(actionId);
        return;
      }
      if (actionId === "modal-save") {
        dispatchModalCommand("save");
        return;
      }
      if (actionId === "modal-save-draft") {
        dispatchModalCommand("save-draft");
        return;
      }
      if (actionId === "modal-submit") {
        dispatchModalCommand("submit");
        return;
      }

      if (shortcut.type === "navigate" && shortcut.route) {
        if (!canOpenHref(shortcut.route)) return;
        router.push(shortcut.route, { scroll: false });
        return;
      }

      if (shortcut.type === "action" && actionId) {
        if (shortcut.route) {
          if (!canOpenHref(shortcut.route)) return;
          const routePath = shortcut.route.split("?")[0];
          if (pathname !== routePath && !pathname.startsWith(`${routePath}/`)) {
            router.push(shortcut.route, { scroll: false });
            window.setTimeout(() => dispatchShortcutAction(actionId), 120);
            return;
          }
        }
        dispatchShortcutAction(actionId);
        return;
      }

      if (actionId) dispatchShortcutAction(actionId);
    },
    [
      clearAll,
      isOwner,
      openHelp,
      openNotifications,
      toggleSearch,
      toggleOwner,
      canViewAuditLog,
      toggleAuditLog,
      pathname,
      router,
      hasFeature,
      canOpenHref,
    ],
  );

  const handleEscape = useCallback(() => {
    if (helpOpen) {
      closeHelp();
      return true;
    }
    if (searchOpen) {
      closeSearch();
      return true;
    }
    if (notificationsOpen) {
      closeNotifications();
      return true;
    }
    if (ownerOpen) {
      closeOwner();
      return true;
    }
    if (auditOpen) {
      closeAuditLog();
      return true;
    }
    dispatchEscapeLayer();
    return false;
  }, [helpOpen, closeHelp, searchOpen, closeSearch, notificationsOpen, closeNotifications, ownerOpen, closeOwner, auditOpen, closeAuditLog]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (handleEscape()) {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      if (helpOpen && event.key !== "Escape") return;

      // Mod + Shift + S before Mod + S
      const modCandidates = modShortcuts().sort((a, b) => b.keys.length - a.keys.length);
      const modMatch = findMatch(modCandidates, event);
      if (modMatch) {
        event.preventDefault();
        executeShortcut(modMatch);
        return;
      }

      if (isHelpKey(event) && !isModKey(event) && !event.altKey && !isTypingContext(event.target)) {
        event.preventDefault();
        openHelp();
        return;
      }

      const typing = isTypingContext(event.target);

      if (!typing) {
        const moduleShift = shortcutsForModule(pathname).filter((s) => s.keys.startsWith("Shift+"));
        const moduleShiftMatch = findMatch(moduleShift, event);
        if (moduleShiftMatch) {
          event.preventDefault();
          executeShortcut(moduleShiftMatch);
          return;
        }

        const globalShift = globalShiftShortcuts(pathname);
        const globalShiftMatch = findMatch(globalShift, event);
        if (globalShiftMatch) {
          event.preventDefault();
          executeShortcut(globalShiftMatch);
          return;
        }
      }

      if (!typing) {
        const moduleSingle = shortcutsForModule(pathname).filter(
          (s) => !s.keys.startsWith("Shift+") && !s.keys.startsWith("Mod"),
        );
        const moduleMatch = findMatch(moduleSingle, event);
        if (moduleMatch) {
          event.preventDefault();
          executeShortcut(moduleMatch);
          return;
        }

        const globalMatch = findMatch(globalSingleKeyShortcuts(), event);
        if (globalMatch) {
          event.preventDefault();
          executeShortcut(globalMatch);
          return;
        }

        const detailMatch = findMatch(detailShortcuts(), event);
        if (detailMatch) {
          event.preventDefault();
          executeShortcut(detailMatch);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [executeShortcut, handleEscape, helpOpen, openHelp, pathname]);

  const value = useMemo(
    () => ({ helpOpen, openHelp, closeHelp }),
    [helpOpen, openHelp, closeHelp],
  );

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <ShortcutHelpModal open={helpOpen} onClose={closeHelp} />
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const ctx = useContext(KeyboardShortcutsContext);
  if (!ctx) throw new Error("useKeyboardShortcuts must be used within KeyboardShortcutsProvider");
  return ctx;
}
