export type ThemeId = "obsidian" | "midnight";

export type ThemeOption = {
  id: ThemeId;
  label: string;
  description: string;
  swatch: [string, string, string];
};

export const THEME_STORAGE_KEY = "agency-os-theme";
export const PICK_THEME_COOKIE = "agency-os-pick-theme";

/** Current production look — navy surfaces, blue intelligence accents */
export const themeOptions: ThemeOption[] = [
  {
    id: "obsidian",
    label: "Obsidian Intelligence",
    description: "Current Agency OPS — navy glass, balanced blue accents",
    swatch: ["#0A0C10", "#1A2035", "#3B82F6"],
  },
  {
    id: "midnight",
    label: "Midnight Command Center",
    description: "Black command deck — electric blue, pill nav, no glass",
    swatch: ["#000000", "#121212", "#2B59FF"],
  },
];

/** Default matches the live product today */
export const DEFAULT_THEME_ID: ThemeId = "obsidian";

const legacyThemeMap: Record<string, ThemeId> = {
  obsidian: "obsidian",
  midnight: "midnight",
  ocean: "obsidian",
  violet: "obsidian",
  emerald: "obsidian",
  amber: "obsidian",
};

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value === "midnight" || value === "obsidian";
}

export function normalizeThemeId(value: string | null | undefined): ThemeId {
  if (!value) return DEFAULT_THEME_ID;
  if (isThemeId(value)) return value;
  return legacyThemeMap[value] ?? DEFAULT_THEME_ID;
}
