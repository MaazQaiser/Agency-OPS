const SCROLL_PREFIX = "agency-ops-scroll:";
const FILTER_PREFIX = "agency-ops-filters:";

export function saveScrollPosition(url: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${SCROLL_PREFIX}${url}`, String(window.scrollY));
  } catch {
    /* ignore */
  }
}

export function restoreScrollPosition(url: string): void {
  if (typeof window === "undefined") return;
  try {
    const saved = sessionStorage.getItem(`${SCROLL_PREFIX}${url}`);
    if (saved == null) return;
    const y = Number.parseInt(saved, 10);
    if (Number.isNaN(y)) return;
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "auto" }));
  } catch {
    /* ignore */
  }
}

export function saveFilterState(key: string, state: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${FILTER_PREFIX}${key}`, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function loadFilterState(key: string): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${FILTER_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}
