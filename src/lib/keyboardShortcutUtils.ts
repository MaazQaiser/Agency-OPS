export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.platform.toUpperCase().includes("MAC");
}

export function isModKey(event: KeyboardEvent): boolean {
  return isMacPlatform() ? event.metaKey : event.ctrlKey;
}

export function isTypingContext(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  if (target.closest("[data-shortcut-ignore]")) return true;
  return false;
}

export function isHelpKey(event: KeyboardEvent): boolean {
  return event.key === "?" || (event.shiftKey && event.key === "/");
}

export function formatShortcutKeys(keys: string): string {
  const mac = isMacPlatform();
  return keys
    .replace(/Mod\+/g, mac ? "⌘" : "Ctrl+")
    .replace(/Shift\+/g, "⇧")
    .replace(/Alt\+/g, mac ? "⌥" : "Alt+")
    .replace(/\+/g, mac ? "" : "+");
}

export const SHORTCUT_ACTION_EVENT = "agency-ops:shortcut-action";
export const SHORTCUT_REFRESH_EVENT = "agency-ops:refresh-module";
export const SHORTCUT_FOCUS_SEARCH_EVENT = "agency-ops:focus-search";
export const SHORTCUT_ESCAPE_EVENT = "agency-ops:escape";
export const MODAL_COMMAND_EVENT = "agency-ops:modal-command";

export type ModalCommand = "save" | "save-draft" | "submit";

export function dispatchShortcutAction(actionId: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SHORTCUT_ACTION_EVENT, { detail: { actionId } }));
}

export function dispatchRefreshModule(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SHORTCUT_REFRESH_EVENT));
}

export function dispatchFocusSearch(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SHORTCUT_FOCUS_SEARCH_EVENT));
}

export function dispatchEscapeLayer(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SHORTCUT_ESCAPE_EVENT));
}

export function dispatchModalCommand(command: ModalCommand): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MODAL_COMMAND_EVENT, { detail: { command } }));
}

export function focusPageSearchInput(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.querySelector(".app-content");
  if (!root) return false;

  const selectors = [
    ".global-search-hero-input",
    ".va-ops-search-input",
    ".send-center-search-wrap input",
    ".commercial-hub-search-input",
    ".system-health-toolbar input[type='search']",
    "input[type='search']",
  ];

  for (const selector of selectors) {
    const el = root.querySelector<HTMLInputElement>(selector);
    if (el && !el.disabled && el.offsetParent !== null) {
      el.focus();
      el.select();
      return true;
    }
  }
  return false;
}
