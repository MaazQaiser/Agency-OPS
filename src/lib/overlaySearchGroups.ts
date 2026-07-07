import type { CommandPaletteAction } from "@/data/commandPalette";
import type { GlobalSearchResult } from "@/data/globalSearch";

/** Display order for grouped overlay results */
export const overlayGroupOrder = [
  "Clients",
  "Commercial",
  "Training",
  "Carriers",
  "People",
  "Navigation",
  "Commands",
  "Settings",
  "Recent",
] as const;

export type OverlayGroup = (typeof overlayGroupOrder)[number];

export const overlaySearchHints = [
  "Search clients…",
  "Search submissions…",
  "Jump to a hub…",
  "Run commands…",
];

export function mapResultToOverlayGroup(result: GlobalSearchResult): OverlayGroup {
  if (result.group === "Clients" || result.type === "client") return "Clients";
  if (result.group === "Users" || result.type === "user") return "People";
  if (result.group === "Carriers" || result.type === "carrier") return "Carriers";
  if (result.group === "Training" || result.type === "training") return "Training";
  if (
    result.hub.includes("Commercial") ||
    result.group === "Submissions" ||
    result.group === "Policies" ||
    result.group === "Documents" ||
    result.group === "Tasks" ||
    result.group === "Alerts" ||
    result.group === "Notes" ||
    result.type === "submission" ||
    result.type === "policy" ||
    result.type === "document"
  ) {
    return "Commercial";
  }
  return "Commercial";
}

export function groupResultsByOverlayGroup(
  results: GlobalSearchResult[],
  limitPerGroup = 5,
): Partial<Record<OverlayGroup, GlobalSearchResult[]>> {
  const groups: Partial<Record<OverlayGroup, GlobalSearchResult[]>> = {};
  for (const result of results) {
    const key = mapResultToOverlayGroup(result);
    if (!groups[key]) groups[key] = [];
    if (groups[key]!.length < limitPerGroup) groups[key]!.push(result);
  }
  return groups;
}

export function mapActionToOverlayGroup(action: CommandPaletteAction): OverlayGroup {
  const label = action.label.toLowerCase();
  const hub = action.hub.toLowerCase();
  if (label.startsWith("go to") || label.includes("jump") || label.includes("open") && hub) {
    if (hub.includes("setting")) return "Settings";
    return "Navigation";
  }
  if (hub.includes("setting")) return "Settings";
  return "Commands";
}

export function groupActionsByOverlayGroup(
  actions: CommandPaletteAction[],
): Partial<Record<OverlayGroup, CommandPaletteAction[]>> {
  const groups: Partial<Record<OverlayGroup, CommandPaletteAction[]>> = {};
  for (const action of actions) {
    const key = mapActionToOverlayGroup(action);
    if (!groups[key]) groups[key] = [];
    groups[key]!.push(action);
  }
  return groups;
}

export function orderedOverlayGroups<T>(
  groups: Partial<Record<OverlayGroup, T[]>>,
): { group: OverlayGroup; items: T[] }[] {
  return overlayGroupOrder
    .map((group) => ({ group, items: groups[group] ?? [] }))
    .filter((entry) => entry.items.length > 0);
}
