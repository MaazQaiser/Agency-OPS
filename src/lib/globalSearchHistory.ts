const STORAGE_KEY = "agency-os-recent-searches";
const MAX_RECENT = 5;

const DEFAULT_RECENT = [
  "Martinez Landscaping",
  "Pending Bind",
  "Markel BOP",
  "Overdue Invoices",
  "Missing Loss Runs",
];

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return DEFAULT_RECENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RECENT;
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed.slice(0, MAX_RECENT) : DEFAULT_RECENT;
  } catch {
    return DEFAULT_RECENT;
  }
}

export function addRecentSearch(term: string) {
  const trimmed = term.trim();
  if (!trimmed || typeof window === "undefined") return;
  const current = getRecentSearches().filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
  const next = [trimmed, ...current].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
