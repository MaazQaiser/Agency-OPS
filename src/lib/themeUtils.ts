import {
  DEFAULT_THEME_ID,
  PICK_THEME_COOKIE,
  THEME_STORAGE_KEY,
  normalizeThemeId,
  type ThemeId,
} from "@/lib/themes";

export function applyTheme(theme: ThemeId) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
}

export function persistTheme(theme: ThemeId) {
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore storage failures
  }
}

export function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return normalizeThemeId(stored);
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export function readPickThemeCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .some((entry) => entry === `${PICK_THEME_COOKIE}=1`);
}

export function clearPickThemeCookie() {
  document.cookie = `${PICK_THEME_COOKIE}=; path=/; max-age=0`;
}
