"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  defaultGlobalSearchFilters,
  globalSearchPlaceholder,
  searchGroupOrder,
  type GlobalSearchResult,
} from "@/data/globalSearch";
import {
  filterPaletteActions,
  moduleJumpActions,
  paletteAiGuidance,
  paletteTabs,
  suggestedPaletteActions,
  type CommandPaletteAction,
  type PaletteTabId,
} from "@/data/commandPalette";
import {
  highlightMatch,
  resolveAiInsight,
  searchGlobalResults,
  commandCriticalAlerts,
  getSuggestedSearchResults,
  type CommandAlert,
} from "@/data/globalSearchEngine";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "@/lib/globalSearchHistory";
import { resolveSearchNavigation } from "@/lib/crossModuleLinks";
import {
  actionDescription,
  displayGroupLabel,
  hubAccentClass,
  hubTagClass,
  resolveHubAccent,
  resultSubtitle,
  resultTypeIcon,
  shortHubLabel,
} from "@/lib/commandPaletteTheme";
import { useAvatarProfile } from "@/components/user-profile/AvatarProfileProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { routes } from "@/lib/routes";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { cn } from "@/lib/cn";
import { CommandPaletteSkeleton } from "@/components/shared/loading";

type PaletteItem =
  | { kind: "recent"; id: string; label: string }
  | { kind: "alert"; id: string; alert: CommandAlert }
  | { kind: "action"; id: string; action: CommandPaletteAction }
  | { kind: "result"; id: string; result: GlobalSearchResult }
  | { kind: "view-all"; id: string; hub: string; query: string }
  | { kind: "ai"; id: string };

type CommandPaletteProps = {
  initialQuery?: string;
  open?: boolean;
  onClose: () => void;
};

function HighlightText({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);
  return (
    <>
      {parts.map((part, i) =>
        part.match ? (
          <mark key={i} className="cmd-palette-highlight">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

function hubRowAccentClass(hub: string) {
  return `cmd-hub-accent-${resolveHubAccent(hub)}`;
}

function HubTag({ hub }: { hub: string }) {
  return <span className={cn("cmd-palette-hub-tag", hubTagClass(hub))}>{shortHubLabel(hub)}</span>;
}

function HubIcon({
  hub,
  type,
  actionIcon,
}: {
  hub: string;
  type?: GlobalSearchResult["type"];
  actionIcon?: CommandPaletteAction["icon"];
}) {
  const accent = resolveHubAccent(hub);
  const iconName = actionIcon ?? (type ? resultTypeIcon(type) : "search");
  return (
    <span className={cn("cmd-palette-row-icon", actionIcon ? `cmd-hub-action ${hubAccentClass(hub)}` : `cmd-hub-${accent}`)}>
      <AppIcon name={iconName} size={18} strokeWidth={2} />
    </span>
  );
}

function ActionRow({
  action,
  query,
  active,
  index,
  onSelect,
  onHover,
}: {
  action: CommandPaletteAction;
  query: string;
  active: boolean;
  index: number;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      id={`cmd-option-${index}`}
      role="option"
      aria-selected={active}
      className={cn("cmd-palette-row cmd-palette-action-row", hubRowAccentClass(action.hub), active && "active")}
      data-index={index}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      <HubIcon hub={action.hub} actionIcon={action.icon} />
      <span className="cmd-palette-result-main">
        <span className="cmd-palette-action-label">
          {query ? <HighlightText text={action.label} query={query} /> : action.label}
        </span>
        <span className="cmd-palette-result-subtitle">{actionDescription(action)}</span>
      </span>
      <HubTag hub={action.hub} />
      <kbd className="cmd-palette-row-kbd">↵</kbd>
    </button>
  );
}

function ResultRowContent({
  result,
  query,
}: {
  result: GlobalSearchResult;
  query: string;
}) {
  return (
    <>
      <HubIcon hub={result.hub} type={result.type} />
      <div className="cmd-palette-result-main">
        <span className="cmd-palette-result-title">
          <HighlightText text={result.title} query={query} />
        </span>
        <span className="cmd-palette-result-subtitle">{resultSubtitle(result)}</span>
      </div>
      <HubTag hub={result.hub} />
    </>
  );
}

export function CommandPalette({
  initialQuery = "",
  open = true,
  onClose,
}: CommandPaletteProps) {
  const router = useRouter();
  const { openProfile } = useAvatarProfile();
  const { canOpenHref, hasFeature } = useEntitlements();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [paletteTab, setPaletteTab] = useState<PaletteTabId>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [expandedHubs, setExpandedHubs] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(query, 100);
  const isSearching = query.trim() !== debouncedQuery.trim();

  const accessiblePinned = useMemo(
    () => suggestedPaletteActions.filter((action) => canOpenHref(action.href)),
    [canOpenHref],
  );

  const accessibleJumps = useMemo(
    () => moduleJumpActions.filter((action) => canOpenHref(action.href)),
    [canOpenHref],
  );

  const accessibleAlerts = useMemo(
    () => commandCriticalAlerts.filter((alert) => canOpenHref(alert.href)),
    [canOpenHref],
  );

  const matchedActions = useMemo(() => {
    const pool = filterPaletteActions(debouncedQuery);
    return pool.filter((action) => canOpenHref(action.href));
  }, [debouncedQuery, canOpenHref]);

  const suggestedResults = useMemo(
    () => getSuggestedSearchResults().filter((r) => canOpenHref(r.href)),
    [canOpenHref],
  );

  const searchResults = useMemo(() => {
    try {
      return searchGlobalResults(debouncedQuery, defaultGlobalSearchFilters, "all").filter((r) =>
        canOpenHref(r.href),
      );
    } catch {
      return [];
    }
  }, [debouncedQuery, canOpenHref]);

  const hasQuery = debouncedQuery.trim().length > 0;
  const showRecent = !hasQuery && (paletteTab === "all" || paletteTab === "search");
  const showSuggestedActions = paletteTab === "all" || paletteTab === "actions";
  const showAlerts = !hasQuery && paletteTab === "all";
  const showJumps = !hasQuery && paletteTab === "actions";
  const showSearchResults = hasQuery && (paletteTab === "all" || paletteTab === "search");
  const showMatchedActions = hasQuery && (paletteTab === "all" || paletteTab === "actions");
  const showAiPanel = paletteTab === "all" || paletteTab === "ai";
  const showSuggestedRecords = !hasQuery && paletteTab === "search";
  const showAiGuidance = paletteTab === "ai";

  const groupedByType = useMemo(() => {
    const groups: Record<string, GlobalSearchResult[]> = {};
    for (const result of searchResults) {
      const key = result.group;
      if (!groups[key]) groups[key] = [];
      const expanded = expandedHubs.has(key);
      if (expanded || groups[key].length < 5) groups[key].push(result);
    }
    return groups;
  }, [searchResults, expandedHubs]);

  const aiInsight = useMemo(() => {
    if (!hasFeature("analytics")) return null;
    const insight = resolveAiInsight(debouncedQuery);
    if (!insight) return null;
    const links = insight.links?.filter((link) => canOpenHref(link.href)) ?? [];
    const action =
      insight.action && canOpenHref(insight.action.href) ? insight.action : undefined;
    if (!links.length && !action && !insight.summary) return null;
    return { ...insight, links, action };
  }, [debouncedQuery, hasFeature, canOpenHref]);

  const flatItems = useMemo((): PaletteItem[] => {
    const items: PaletteItem[] = [];
    const emptyBudget = paletteTab === "all" && !hasQuery ? 8 : Number.POSITIVE_INFINITY;

    if (!hasQuery) {
      if (showRecent) {
        for (const term of recentSearches) {
          if (items.length >= emptyBudget) break;
          items.push({ kind: "recent", id: `recent-${term}`, label: term });
        }
      }
      if (showAlerts) {
        for (const alert of accessibleAlerts) {
          if (items.length >= emptyBudget) break;
          items.push({ kind: "alert", id: alert.id, alert });
        }
      }
      if (showSuggestedActions) {
        for (const action of accessiblePinned) {
          if (items.length >= emptyBudget) break;
          items.push({ kind: "action", id: `action-${action.id}`, action });
        }
      }
      if (showJumps) {
        for (const action of accessibleJumps) {
          items.push({ kind: "action", id: `action-${action.id}`, action });
        }
      }
      if (showSuggestedRecords) {
        for (const result of suggestedResults) {
          items.push({ kind: "result", id: result.id, result });
        }
      }
    } else {
      if (showMatchedActions) {
        for (const action of matchedActions.slice(0, 8)) {
          items.push({ kind: "action", id: `action-${action.id}`, action });
        }
      }
      if (showSearchResults) {
        const orderedGroups = [
          ...searchGroupOrder.filter((group) => groupedByType[group]?.length),
          ...Object.keys(groupedByType).filter((group) => !searchGroupOrder.includes(group as (typeof searchGroupOrder)[number])),
        ];
        for (const group of orderedGroups) {
          const groupResults = groupedByType[group];
          if (!groupResults?.length) continue;
          for (const result of groupResults) {
            items.push({ kind: "result", id: result.id, result });
          }
          const totalInGroup = searchResults.filter((r) => r.group === group).length;
          if (totalInGroup > 5 && !expandedHubs.has(group)) {
            items.push({ kind: "view-all", id: `view-all-${group}`, hub: group, query: debouncedQuery });
          }
        }
      }
      if (showAiPanel && aiInsight) items.push({ kind: "ai", id: aiInsight.id });
    }

    return items;
  }, [
    hasQuery,
    paletteTab,
    showRecent,
    showSuggestedActions,
    showAlerts,
    showJumps,
    showSuggestedRecords,
    showMatchedActions,
    showSearchResults,
    showAiPanel,
    recentSearches,
    matchedActions,
    groupedByType,
    searchResults,
    expandedHubs,
    aiInsight,
    suggestedResults,
    accessibleAlerts,
    accessiblePinned,
    accessibleJumps,
    debouncedQuery,
  ]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    requestAnimationFrame(() => setMounted(true));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery, paletteTab, flatItems.length]);

  const navigate = useCallback(
    (href: string, newTab = false) => {
      if (!canOpenHref(href)) return;
      if (debouncedQuery.trim()) {
        addRecentSearch(debouncedQuery.trim());
        setRecentSearches(getRecentSearches());
      }
      if (newTab) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        onClose();
        router.push(href);
      }
    },
    [debouncedQuery, onClose, router, canOpenHref],
  );

  const activateItem = useCallback(
    (item: PaletteItem, newTab = false) => {
      switch (item.kind) {
        case "recent":
          setQuery(item.label);
          addRecentSearch(item.label);
          break;
        case "action":
          navigate(item.action.href, newTab);
          break;
        case "alert":
          navigate(item.alert.href, newTab);
          break;
        case "result": {
          const nav = resolveSearchNavigation(item.result);
          if (nav.kind === "profile") {
            if (newTab) {
              navigate(`${routes.vaOperations}?openProfile=${encodeURIComponent(nav.userId)}`, true);
            } else {
              onClose();
              openProfile(nav.userId);
            }
            break;
          }
          navigate(item.result.href, newTab);
          break;
        }
        case "view-all":
          setExpandedHubs((prev) => new Set(prev).add(item.hub));
          break;
        case "ai":
          if (aiInsight?.action) navigate(aiInsight.action.href, newTab);
          break;
      }
    },
    [navigate, aiInsight, onClose, openProfile],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && debouncedQuery.trim()) {
        event.preventDefault();
        const idx = paletteTabs.findIndex((t) => t.id === paletteTab);
        const next = event.shiftKey
          ? (idx - 1 + paletteTabs.length) % paletteTabs.length
          : (idx + 1) % paletteTabs.length;
        setPaletteTab(paletteTabs[next].id);
        return;
      }

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? event.metaKey : event.ctrlKey;

      if (mod && event.key === "Backspace") {
        event.preventDefault();
        setQuery("");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(flatItems.length - 1, 0)));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (event.key === "Enter" && flatItems[activeIndex]) {
        event.preventDefault();
        activateItem(flatItems[activeIndex], mod);
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, flatItems, activeIndex, activateItem, paletteTab, debouncedQuery]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusable.length === 0) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    panel.addEventListener("keydown", trap);
    return () => panel.removeEventListener("keydown", trap);
  }, [mounted]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleClearHistory = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const showEmpty =
    debouncedQuery.trim().length > 0 &&
    !isSearching &&
    searchResults.length === 0 &&
    matchedActions.length === 0 &&
    !aiInsight;

  const orderedGroups = useMemo(() => {
    const groups = Object.keys(groupedByType);
    return [
      ...searchGroupOrder.filter((group) => groups.includes(group)),
      ...groups.filter((group) => !searchGroupOrder.includes(group as (typeof searchGroupOrder)[number])),
    ];
  }, [groupedByType]);

  return (
    <>
      <div
        className={cn("cmd-palette-backdrop", open && mounted && "cmd-palette-backdrop-visible")}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={cn("cmd-palette", open && mounted && "cmd-palette-visible")}
        role="dialog"
        aria-modal="true"
        aria-label="Search Agency OS"
      >
        <div className="cmd-palette-panel">
          <div className="cmd-palette-layout">
            <div className="cmd-palette-main">
              <div className="cmd-palette-shell">
                <div className="cmd-palette-header">
                  <div className="cmd-palette-search">
                    <AppIcon name="search" size={20} strokeWidth={2} className="cmd-palette-search-icon" />
                    <input
                      ref={inputRef}
                      type="search"
                      className="cmd-palette-input"
                      placeholder={globalSearchPlaceholder}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded="true"
                      aria-controls="cmd-palette-results"
                      aria-activedescendant={flatItems[activeIndex] ? `cmd-option-${activeIndex}` : undefined}
                      aria-label="Search Agency OS"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {query && (
                      <button
                        type="button"
                        className="cmd-palette-clear"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                      >
                        <AppIcon name="close" size={16} strokeWidth={2} />
                      </button>
                    )}
                    <kbd className="cmd-palette-header-kbd" aria-hidden="true">
                      ESC
                    </kbd>
                  </div>
                  {showAiGuidance && !hasQuery && (
                    <div className="cmd-palette-ai-guidance" aria-label="AI search suggestions">
                      {paletteAiGuidance.map((hint) => (
                        <button
                          key={hint.id}
                          type="button"
                          className="cmd-palette-ai-hint"
                          onClick={() => {
                            setQuery(hint.query);
                            setPaletteTab("ai");
                          }}
                        >
                          <AppIcon name="sparkles" size={12} strokeWidth={2} />
                          {hint.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

          <div className="cmd-palette-categories" role="tablist" aria-label="Command palette views">
            {paletteTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={paletteTab === tab.id}
                className={cn("cmd-palette-category", paletteTab === tab.id && "active")}
                onClick={() => setPaletteTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="cmd-palette-body" ref={listRef} id="cmd-palette-results" role="listbox" aria-label="Search results">
            {!hasQuery && (
              <>
                {showRecent && recentSearches.length > 0 && (
                  <section className="cmd-palette-section">
                    <div className="cmd-palette-section-header">
                      <span className="cmd-palette-section-title">Recent Searches</span>
                      <button type="button" className="cmd-palette-link-btn" onClick={handleClearHistory}>
                        Clear
                      </button>
                    </div>
                    <ul className="cmd-palette-list">
                      {recentSearches
                        .filter((term) => flatItems.some((item) => item.kind === "recent" && item.label === term))
                        .map((term) => {
                        const flatIdx = flatItems.findIndex((item) => item.kind === "recent" && item.label === term);
                        return (
                          <li key={term}>
                            <button
                              type="button"
                              id={`cmd-option-${flatIdx}`}
                              role="option"
                              aria-selected={flatIdx === activeIndex}
                              className={cn("cmd-palette-row", flatIdx === activeIndex && "active")}
                              data-index={flatIdx}
                              onClick={() => setQuery(term)}
                              onMouseEnter={() => setActiveIndex(flatIdx)}
                            >
                              <HubIcon hub="VA Operations" actionIcon="clock" />
                              <span className="cmd-palette-result-main">
                                <span className="cmd-palette-result-title">{term}</span>
                                <span className="cmd-palette-result-subtitle">Recent search</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                {showAlerts && accessibleAlerts.some((alert) => flatItems.some((item) => item.kind === "alert" && item.alert.id === alert.id)) && (
                  <section className="cmd-palette-section">
                    <div className="cmd-palette-section-header">
                      <span className="cmd-palette-section-title">Alerts</span>
                      <span className="cmd-palette-section-count">{accessibleAlerts.length}</span>
                    </div>
                    <ul className="cmd-palette-list">
                      {accessibleAlerts
                        .filter((alert) => flatItems.some((item) => item.kind === "alert" && item.alert.id === alert.id))
                        .map((alert) => {
                        const flatIdx = flatItems.findIndex((item) => item.kind === "alert" && item.alert.id === alert.id);
                        return (
                          <li key={alert.id}>
                            <button
                              type="button"
                              id={`cmd-option-${flatIdx}`}
                              role="option"
                              aria-selected={flatIdx === activeIndex}
                              className={cn(
                                "cmd-palette-row cmd-palette-alert-row",
                                alert.level,
                                flatIdx === activeIndex && "active",
                              )}
                              data-index={flatIdx}
                              onClick={() => navigate(alert.href)}
                              onMouseEnter={() => setActiveIndex(flatIdx)}
                            >
                              <span className={cn("cmd-palette-alert-dot", alert.level)} aria-hidden="true" />
                              <div className="cmd-palette-result-main">
                                <span className="cmd-palette-result-title">{alert.title}</span>
                                <span className="cmd-palette-result-subtitle">{alert.subtitle}</span>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                {showSuggestedActions && accessiblePinned.some((action) => flatItems.some((item) => item.kind === "action" && item.action.id === action.id)) && (
                <section className="cmd-palette-section cmd-palette-section--pinned">
                  <div className="cmd-palette-section-header">
                    <span className="cmd-palette-section-title">Pinned Items</span>
                  </div>
                  <ul className="cmd-palette-list">
                    {accessiblePinned
                      .filter((action) =>
                        flatItems.some((item) => item.kind === "action" && item.action.id === action.id),
                      )
                      .map((action) => {
                      const flatIdx = flatItems.findIndex(
                        (item) => item.kind === "action" && item.action.id === action.id,
                      );
                      return (
                        <li key={`pinned-${action.id}`}>
                          <ActionRow
                            action={action}
                            query=""
                            active={flatIdx === activeIndex}
                            index={flatIdx}
                            onSelect={() => navigate(action.href)}
                            onHover={() => setActiveIndex(flatIdx)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </section>
                )}

                {showJumps && (
                <section className="cmd-palette-section">
                  <div className="cmd-palette-section-header">
                    <span className="cmd-palette-section-title">Frequently Used Hubs</span>
                  </div>
                  <ul className="cmd-palette-list">
                    {accessibleJumps.map((action) => {
                      const flatIdx = flatItems.findIndex(
                        (item) => item.kind === "action" && item.action.id === action.id,
                      );
                      return (
                        <li key={`jump-${action.id}`}>
                          <ActionRow
                            action={action}
                            query=""
                            active={flatIdx === activeIndex}
                            index={flatIdx}
                            onSelect={() => navigate(action.href)}
                            onHover={() => setActiveIndex(flatIdx)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </section>
                )}

                {showSuggestedRecords && suggestedResults.length > 0 && (
                  <section className="cmd-palette-section">
                    <div className="cmd-palette-section-header">
                      <span className="cmd-palette-section-title">Recent Clients</span>
                    </div>
                    <ul className="cmd-palette-list">
                      {suggestedResults.map((result) => {
                        const flatIdx = flatItems.findIndex(
                          (item) => item.kind === "result" && item.result.id === result.id,
                        );
                        return (
                          <li key={result.id}>
                            <button
                              type="button"
                              id={`cmd-option-${flatIdx}`}
                              role="option"
                              aria-selected={flatIdx === activeIndex}
                              className={cn(
                                "cmd-palette-row cmd-palette-result-row",
                                hubRowAccentClass(result.hub),
                                flatIdx === activeIndex && "active",
                              )}
                              data-index={flatIdx}
                              onClick={() => {
                                const item = flatItems[flatIdx];
                                if (item) activateItem(item);
                              }}
                              onMouseEnter={() => setActiveIndex(flatIdx)}
                            >
                              <ResultRowContent result={result} query="" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
              </>
            )}

            {!hasQuery && paletteTab === "ai" && (
              <section className="cmd-palette-section cmd-palette-ai">
                <div className="cmd-palette-section-header">
                  <AppIcon name="sparkles" size={16} strokeWidth={2} />
                  <span className="cmd-palette-section-title">AI Assistant</span>
                </div>
                <div className="cmd-palette-ai-card">
                  <p>Ask in plain language or pick a suggestion above. Agency OS will route you to the right hub, record, or action.</p>
                </div>
              </section>
            )}

            {hasQuery && (
              <>
                {isSearching && <CommandPaletteSkeleton rows={5} />}

                {!isSearching && showMatchedActions && matchedActions.length > 0 && (
                  <section className="cmd-palette-section">
                    <div className="cmd-palette-section-header">
                      <span className="cmd-palette-section-title">Commands</span>
                    </div>
                    <ul className="cmd-palette-list">
                      {matchedActions.slice(0, 8).map((action) => {
                        const flatIdx = flatItems.findIndex(
                          (item) => item.kind === "action" && item.action.id === action.id,
                        );
                        return (
                          <li key={`match-${action.id}`}>
                            <ActionRow
                              action={action}
                              query={debouncedQuery}
                              active={flatIdx === activeIndex}
                              index={flatIdx}
                              onSelect={() => navigate(action.href)}
                              onHover={() => setActiveIndex(flatIdx)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                {!isSearching && showSearchResults &&
                  orderedGroups.map((group) => {
                    const items = groupedByType[group];
                    if (!items?.length) return null;
                    return (
                      <section key={group} className="cmd-palette-section">
                        <div className="cmd-palette-section-header">
                          <span className="cmd-palette-section-title">{displayGroupLabel(group)}</span>
                          <span className="cmd-palette-section-count">
                            {searchResults.filter((r) => r.group === group).length}
                          </span>
                        </div>
                        <ul className="cmd-palette-list">
                          {items.map((result) => {
                            const flatIdx = flatItems.findIndex(
                              (item) => item.kind === "result" && item.result.id === result.id,
                            );
                            return (
                              <li key={result.id}>
                                <button
                                  type="button"
                                  id={`cmd-option-${flatIdx}`}
                                  role="option"
                                  aria-selected={flatIdx === activeIndex}
                                  className={cn(
                                    "cmd-palette-row cmd-palette-result-row",
                                    hubRowAccentClass(result.hub),
                                    flatIdx === activeIndex && "active",
                                  )}
                                  data-index={flatIdx}
                                  onClick={() => {
                                    const item = flatItems[flatIdx];
                                    if (item) activateItem(item);
                                  }}
                                  onMouseEnter={() => setActiveIndex(flatIdx)}
                                >
                                  <ResultRowContent result={result} query={debouncedQuery} />
                                </button>
                              </li>
                            );
                          })}
                          {searchResults.filter((r) => r.group === group).length > 5 && !expandedHubs.has(group) && (
                            <li>
                              <button
                                type="button"
                                id={`cmd-option-${flatItems.findIndex((item) => item.kind === "view-all" && item.hub === group)}`}
                                role="option"
                                aria-selected={
                                  flatItems.findIndex((item) => item.kind === "view-all" && item.hub === group) ===
                                  activeIndex
                                }
                                className={cn(
                                  "cmd-palette-view-all",
                                  flatItems.findIndex((item) => item.kind === "view-all" && item.hub === group) ===
                                    activeIndex && "active",
                                )}
                                data-index={flatItems.findIndex(
                                  (item) => item.kind === "view-all" && item.hub === group,
                                )}
                                onClick={() => setExpandedHubs((prev) => new Set(prev).add(group))}
                                onMouseEnter={() => {
                                  const idx = flatItems.findIndex(
                                    (item) => item.kind === "view-all" && item.hub === group,
                                  );
                                  if (idx >= 0) setActiveIndex(idx);
                                }}
                              >
                                View all {displayGroupLabel(group).toLowerCase()}
                              </button>
                            </li>
                          )}
                        </ul>
                      </section>
                    );
                  })}

                {!isSearching && showAiPanel && aiInsight && (
                  <section className="cmd-palette-section cmd-palette-ai">
                    <div className="cmd-palette-section-header">
                      <AppIcon name="sparkles" size={16} strokeWidth={2} />
                      <span className="cmd-palette-section-title">AI Assistant</span>
                    </div>
                    <div className="cmd-palette-ai-card">
                      <p>{aiInsight.summary}</p>
                      <div className="cmd-palette-ai-links">
                        {aiInsight.links.map((link) => (
                          <Link key={link.href} href={link.href} className="cmd-palette-ai-link" onClick={onClose}>
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      {aiInsight.action && (
                        <button
                          type="button"
                          className="va-ops-action-btn cmd-palette-ai-action"
                          onClick={() => navigate(aiInsight.action!.href)}
                        >
                          {aiInsight.action.label}
                        </button>
                      )}
                    </div>
                  </section>
                )}

                {showEmpty && (
                  <div className="cmd-palette-empty" role="status">
                    <h3>No results found</h3>
                    <p>
                      Search for a client, submission, carrier, task, or other available Agency OS record.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="cmd-palette-footer">
            <span><kbd>↵</kbd> Open</span>
            <span><kbd>↑↓</kbd> Navigate</span>
            <span><kbd>Esc</kbd> Close</span>
          </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
