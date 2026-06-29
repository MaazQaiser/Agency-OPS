import { routes } from "@/lib/routes";
import { isModKey } from "@/lib/keyboardShortcutUtils";

export type ShortcutCategory =
  | "global"
  | "commercial"
  | "send-center"
  | "finance"
  | "training"
  | "carrier"
  | "va-ops"
  | "system"
  | "notifications"
  | "detail"
  | "modals";

export type ShortcutActionType = "navigate" | "action" | "ui";

export type ShortcutDefinition = {
  id: string;
  label: string;
  keys: string;
  category: ShortcutCategory;
  description?: string;
  type: ShortcutActionType;
  route?: string;
  actionId?: string;
};

export const shortcutCategoryLabels: Record<ShortcutCategory, string> = {
  global: "Global",
  commercial: "Commercial",
  "send-center": "Send Center",
  finance: "Finance",
  training: "Training",
  carrier: "Carrier",
  "va-ops": "VA Ops",
  system: "System",
  notifications: "Notifications",
  detail: "Detail Views",
  modals: "Modals",
};

export const keyboardShortcutCatalog: ShortcutDefinition[] = [
  { id: "global-search", label: "Open Command Palette", keys: "Mod+K", category: "global", type: "ui", actionId: "open-search" },
  { id: "owner-quick-actions", label: "Open Owner Quick Actions", keys: "Shift+O", category: "global", type: "ui", actionId: "owner-quick-actions" },
  { id: "audit-log", label: "Open Audit Log", keys: "Mod+Shift+J", category: "global", type: "ui", actionId: "open-audit-log" },
  { id: "new-submission", label: "New Submission", keys: "N", category: "global", type: "navigate", route: `${routes.intakeForms}?view=new-submission` },
  { id: "new-draft", label: "New Draft", keys: "D", category: "global", type: "action", actionId: "new-draft", route: routes.sendCenter },
  { id: "new-invoice", label: "New Invoice", keys: "I", category: "global", type: "navigate", route: routes.epayPolicy },
  { id: "upload-training", label: "Upload Training", keys: "T", category: "global", type: "action", actionId: "upload-training", route: routes.trainingHub },
  { id: "add-carrier", label: "Add Carrier", keys: "C", category: "global", type: "action", actionId: "add-carrier", route: routes.carrierLibrary },
  { id: "pending-review", label: "Open Pending Review Queue", keys: "P", category: "global", type: "navigate", route: `${routes.sendCenter}?view=pending-review` },
  { id: "missing-docs", label: "Open Missing Docs", keys: "M", category: "global", type: "navigate", route: `${routes.commercialHub}?view=missing-docs` },
  { id: "ready-to-bind", label: "Open Ready to Bind", keys: "B", category: "global", type: "navigate", route: `${routes.commercialHub}?view=ready-to-bind` },
  { id: "lead-velocity", label: "Open Lead Velocity", keys: "L", category: "global", type: "navigate", route: `${routes.commercialHub}?view=lead-velocity` },
  { id: "submission-clock", label: "Open Submission Clock", keys: "S", category: "global", type: "navigate", route: `${routes.commercialHub}?view=submission-clock` },
  { id: "focus-search", label: "Focus Current Page Search", keys: "F", category: "global", type: "ui", actionId: "focus-search" },
  { id: "refresh-module", label: "Refresh Current Module", keys: "R", category: "global", type: "ui", actionId: "refresh-module" },
  { id: "shortcut-help", label: "Open Shortcut Help", keys: "?", category: "global", type: "ui", actionId: "shortcut-help" },

  { id: "quote-review", label: "Open Quote Review", keys: "Q", category: "commercial", type: "navigate", route: `${routes.commercialHub}?view=quote-review` },
  { id: "submission-tracker", label: "Open Submission Tracker", keys: "U", category: "commercial", type: "navigate", route: `${routes.commercialHub}?view=submissions` },
  { id: "carrier-follow-up", label: "Open Carrier Follow-Up", keys: "G", category: "commercial", type: "navigate", route: `${routes.commercialHub}?view=follow-ups` },
  { id: "outreach-queue", label: "Open Outreach Queue", keys: "O", category: "commercial", type: "navigate", route: `${routes.commercialHub}?view=outreach` },
  { id: "add-market", label: "Add Market", keys: "A", category: "commercial", type: "action", actionId: "add-market", route: `${routes.commercialHub}?view=submissions` },
  { id: "commercial-new-submission", label: "Create New Submission", keys: "Shift+N", category: "commercial", type: "navigate", route: `${routes.intakeForms}?view=new-submission` },

  { id: "sc-new-draft", label: "New Draft", keys: "Shift+D", category: "send-center", type: "action", actionId: "new-draft", route: routes.sendCenter },
  { id: "sc-pending-review", label: "Pending Review", keys: "Shift+P", category: "send-center", type: "navigate", route: `${routes.sendCenter}?view=pending-review` },
  { id: "sc-sent", label: "Sent Proposals", keys: "Shift+S", category: "send-center", type: "navigate", route: `${routes.sendCenter}?view=sent` },
  { id: "sc-templates", label: "Templates", keys: "Shift+T", category: "send-center", type: "navigate", route: `${routes.sendCenter}?view=templates` },
  { id: "sc-approved", label: "Approved Drafts", keys: "Shift+A", category: "send-center", type: "navigate", route: `${routes.sendCenter}?view=approved` },

  { id: "ep-new-invoice", label: "New Invoice", keys: "Shift+I", category: "finance", type: "navigate", route: routes.epayPolicy },
  { id: "ep-reconcile", label: "Reconcile Trust", keys: "Shift+R", category: "finance", type: "action", actionId: "reconcile-trust", route: `${routes.epayPolicy}?view=trust` },
  { id: "ep-export", label: "Export Ledger", keys: "Shift+E", category: "finance", type: "action", actionId: "export-ledger", route: routes.epayPolicy },

  { id: "th-upload", label: "Upload Training", keys: "Shift+U", category: "training", type: "action", actionId: "upload-training", route: routes.trainingHub },
  { id: "th-categories", label: "Manage Categories", keys: "Shift+C", category: "training", type: "action", actionId: "manage-tags", route: routes.trainingHub },
  { id: "th-assign", label: "Assign Training", keys: "Shift+G", category: "training", type: "action", actionId: "assign-training", route: routes.trainingHub },

  { id: "cl-market", label: "Update Market Info", keys: "Shift+M", category: "carrier", type: "action", actionId: "update-market", route: routes.carrierLibrary },
  { id: "cl-create", label: "Create Carrier", keys: "Shift+C", category: "carrier", type: "action", actionId: "add-carrier", route: routes.carrierLibrary },
  { id: "cl-rules", label: "Open Submission Rules", keys: "Shift+R", category: "carrier", type: "navigate", route: `${routes.carrierLibrary}?view=rules` },

  { id: "va-team-queue", label: "View Team Queue", keys: "Shift+V", category: "va-ops", type: "navigate", route: `${routes.vaOperations}?view=bilingual-queue` },
  { id: "va-dnc", label: "Open DNC Log", keys: "Shift+X", category: "va-ops", type: "navigate", route: `${routes.vaOperations}?view=dnc-log` },
  { id: "va-workload", label: "Open Workload", keys: "Shift+W", category: "va-ops", type: "navigate", route: `${routes.vaOperations}?view=tasks` },
  { id: "va-automation", label: "Open Automation Builder", keys: "Shift+A", category: "va-ops", type: "navigate", route: `${routes.vaOperations}?view=automations` },

  { id: "notif-open", label: "Open Notifications", keys: "Shift+N", category: "notifications", type: "ui", actionId: "open-notifications" },
  { id: "notif-clear", label: "Mark All as Read", keys: "Shift+C", category: "notifications", type: "action", actionId: "clear-notifications" },

  { id: "sys-health", label: "Open System Health", keys: "Shift+H", category: "system", type: "navigate", route: routes.systemHealth },
  { id: "sys-retry", label: "Retry System Test", keys: "Shift+T", category: "system", type: "action", actionId: "retry-system-test", route: routes.systemHealth },

  { id: "go-back", label: "Go Back", keys: "Backspace", category: "detail", type: "ui", actionId: "go-back" },
  { id: "open-row", label: "Open Selected Row", keys: "Mod+Enter", category: "detail", type: "ui", actionId: "open-selected-row" },
  { id: "expand-row", label: "Expand Row / Preview", keys: "Space", category: "detail", type: "ui", actionId: "expand-row" },

  { id: "modal-save", label: "Save", keys: "Mod+S", category: "modals", type: "ui", actionId: "modal-save" },
  { id: "modal-save-draft", label: "Save Draft", keys: "Mod+Shift+S", category: "modals", type: "ui", actionId: "modal-save-draft" },
  { id: "modal-submit", label: "Submit", keys: "Mod+Enter", category: "modals", type: "ui", actionId: "modal-submit" },
  { id: "modal-close", label: "Close Modal / Drawer", keys: "Escape", category: "modals", type: "ui", actionId: "modal-close" },
];

export const quickActionShortcutHints: Record<string, string> = {
  "new-submission": "N",
  "add-market": "A",
  "new-draft": "D",
  "new-invoice": "I",
  upload: "T",
  "add-carrier": "C",
  "add-resource": "Shift+G",
  "manage-tags": "Shift+C",
  "export-log": "Shift+E",
  reconcile: "Shift+R",
  export: "Shift+E",
  "update-market": "Shift+M",
};

export function getShortcutHintForAction(actionId: string): string | undefined {
  return quickActionShortcutHints[actionId];
}

export function matchShortcutKeys(event: KeyboardEvent, keys: string): boolean {
  const normalized = keys.trim();

  if (normalized === "Escape") return event.key === "Escape";
  if (normalized === "Backspace") return event.key === "Backspace";
  if (normalized === "Space") return event.key === " " || event.code === "Space";
  if (normalized === "?") return event.key === "?" || (event.shiftKey && event.key === "/");

  const parts = normalized.split("+");
  const key = parts[parts.length - 1].toLowerCase();
  const wantsShift = parts.includes("Shift");
  const wantsMod = parts.includes("Mod");
  const wantsAlt = parts.includes("Alt");

  if (wantsMod) {
    if (!isModKey(event)) return false;
    if (event.altKey !== wantsAlt) return false;
    if (event.shiftKey !== wantsShift) return false;
    return event.key.toLowerCase() === key;
  }

  if (wantsShift) {
    if (!event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return false;
    return event.key.toLowerCase() === key;
  }

  if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return false;
  return event.key.toLowerCase() === key;
}

export function shortcutsForModule(pathname: string): ShortcutDefinition[] {
  if (pathname.startsWith(routes.commercialHub)) {
    return keyboardShortcutCatalog.filter((s) => s.category === "commercial");
  }
  if (pathname.startsWith(routes.sendCenter)) {
    return keyboardShortcutCatalog.filter((s) => s.category === "send-center");
  }
  if (pathname.startsWith(routes.epayPolicy)) {
    return keyboardShortcutCatalog.filter((s) => s.category === "finance");
  }
  if (pathname.startsWith(routes.trainingHub)) {
    return keyboardShortcutCatalog.filter((s) => s.category === "training");
  }
  if (pathname.startsWith(routes.carrierLibrary)) {
    return keyboardShortcutCatalog.filter((s) => s.category === "carrier");
  }
  if (pathname.startsWith(routes.vaOperations)) {
    return keyboardShortcutCatalog.filter((s) => s.category === "va-ops");
  }
  if (pathname.startsWith(routes.systemHealth)) {
    return keyboardShortcutCatalog.filter((s) => s.category === "system");
  }
  return [];
}

export function globalSingleKeyShortcuts(): ShortcutDefinition[] {
  return keyboardShortcutCatalog.filter(
    (s) =>
      s.category === "global" &&
      !s.keys.startsWith("Mod") &&
      !s.keys.startsWith("Shift") &&
      s.id !== "shortcut-help",
  );
}

export function globalShiftShortcuts(pathname: string): ShortcutDefinition[] {
  const items: ShortcutDefinition[] = keyboardShortcutCatalog.filter(
    (s) => s.id === "owner-quick-actions",
  );

  if (pathname.startsWith(routes.commercialHub)) {
    items.push(...keyboardShortcutCatalog.filter((s) => s.id === "commercial-new-submission"));
  } else {
    items.push(...keyboardShortcutCatalog.filter((s) => s.category === "notifications"));
  }

  return items;
}

export function modShortcuts(): ShortcutDefinition[] {
  return keyboardShortcutCatalog.filter((s) => s.keys.startsWith("Mod"));
}

export function detailShortcuts(): ShortcutDefinition[] {
  return keyboardShortcutCatalog.filter((s) => s.category === "detail");
}
