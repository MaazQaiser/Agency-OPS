"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  defaultGlobalSearchFilters,
  globalSearchPlaceholder,
  type GlobalSearchResult,
} from "@/data/globalSearch";
import {
  filterPaletteActions,
  hubGroupOrder,
  moduleJumpActions,
  pinnedPaletteActions,
  type CommandPaletteAction,
} from "@/data/commandPalette";
import {
  groupResultsByHub,
  highlightMatch,
  resolveAiInsight,
  searchCategories,
  searchGlobalResults,
  commandCriticalAlerts,
  getSuggestedSearchResults,
  type SearchCategory,
  type CommandAlert,
} from "@/data/globalSearchEngine";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "@/lib/globalSearchHistory";
import { resolveSearchNavigation } from "@/lib/crossModuleLinks";
import {
  displayGroupLabel,
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
import { QuickResultDrawer } from "./QuickResultDrawer";

type PaletteItem =
  | { kind: "recent"; id: string; label: string }
  | { kind: "alert"; id: string; alert: CommandAlert }
  | { kind: "action"; id: string; action: CommandPaletteAction }
  | { kind: "result"; id: string; result: GlobalSearchResult }
  | { kind: "view-all"; id: string; hub: string; query: string }
  | { kind: "ai"; id: string };

type CommandPaletteProps = {
  initialQuery?: string;
  onClose: () => void;
  onOpenWorkspace: (query: string) => void;
  canOpenWorkspace?: boolean;
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

function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes("overdue") || s.includes("failed") || s.includes("missing")) return "badge-red";
  if (s.includes("pending") || s.includes("quoted")) return "badge-yellow";
  if (s.includes("bound") || s.includes("active") || s.includes("open")) return "badge-green";
  return "badge-blue";
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
    <span className={cn("cmd-palette-row-icon", actionIcon ? "cmd-hub-action" : `cmd-hub-${accent}`)}>
      <AppIcon name={iconName} size={16} strokeWidth={2} />
    </span>
  );
}

function HubTag({ hub }: { hub: string }) {
  return <span className={cn("cmd-palette-hub-tag", hubTagClass(hub))}>{shortHubLabel(hub)}</span>;
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
      className={cn("cmd-palette-row cmd-palette-action-row", active && "active")}
      data-index={index}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      <HubIcon hub={action.hub} actionIcon={action.icon} />
      <span className="cmd-palette-action-label">
        {query ? <HighlightText text={action.label} query={query} /> : action.label}
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
      <div className="cmd-palette-result-badges">
        <span className={cn("badge", statusBadgeClass(result.status))}>{result.status}</span>
        <span className="cmd-palette-result-time">{result.lastUpdated}</span>
      </div>
      <HubTag hub={result.hub} />
    </>
  );
}

export function CommandPalette({
  initialQuery = "",
  onClose,
  onOpenWorkspace,
  canOpenWorkspace = true,
}: CommandPaletteProps) {
  const router = useRouter();
  const { openProfile } = useAvatarProfile();
  const { canOpenHref, hasFeature } = useEntitlements();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [expandedHubs, setExpandedHubs] = useState<Set<string>>(new Set());
  const [selectedResult, setSelectedResult] = useState<GlobalSearchResult | null>(null);
  const [mounted, setMounted] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 100);
  const isSearching = query.trim() !== debouncedQuery.trim();

  const accessiblePinned = useMemo(
    () => pinnedPaletteActions.filter((action) => canOpenHref(action.href)),
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
      return searchGlobalResults(debouncedQuery, defaultGlobalSearchFilters, category).filter((r) =>
        canOpenHref(r.href),
      );
    } catch {
      return [];
    }
  }, [debouncedQuery, category, canOpenHref]);

  const groupedByHub = useMemo(() => {
    const limit = expandedHubs.size > 0 ? 999 : 5;
    return groupResultsByHub(searchResults, limit);
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
    const hasQuery = debouncedQuery.trim().length > 0;

    if (!hasQuery) {
      for (const term of recentSearches) {
        items.push({ kind: "recent", id: `recent-${term}`, label: term });
      }
      for (const alert of accessibleAlerts) {
        items.push({ kind: "alert", id: alert.id, alert });
      }
      for (const action of accessiblePinned) {
        items.push({ kind: "action", id: `action-${action.id}`, action });
      }
      for (const action of accessibleJumps) {
        items.push({ kind: "action", id: `action-${action.id}`, action });
      }
      for (const result of suggestedResults) {
        items.push({ kind: "result", id: result.id, result });
      }
    } else {
      for (const action of matchedActions.slice(0, 8)) {
        items.push({ kind: "action", id: `action-${action.id}`, action });
      }
      for (const hub of hubGroupOrder) {
        const hubResults = groupedByHub[hub];
        if (!hubResults?.length) continue;
        for (const result of hubResults) {
          items.push({ kind: "result", id: result.id, result });
        }
        const totalInHub = searchResults.filter((r) => r.hub === hub).length;
        if (totalInHub > 5 && !expandedHubs.has(hub)) {
          items.push({ kind: "view-all", id: `view-all-${hub}`, hub, query: debouncedQuery });
        }
      }
      for (const hub of Object.keys(groupedByHub)) {
        if (hubGroupOrder.includes(hub)) continue;
        const hubResults = groupedByHub[hub];
        if (!hubResults?.length) continue;
        for (const result of hubResults) {
          items.push({ kind: "result", id: result.id, result });
        }
      }
      if (aiInsight) items.push({ kind: "ai", id: aiInsight.id });
    }

    return items;
  }, [
    debouncedQuery,
    recentSearches,
    matchedActions,
    groupedByHub,
    searchResults,
    expandedHubs,
    aiInsight,
    suggestedResults,
    accessibleAlerts,
    accessiblePinned,
    accessibleJumps,
  ]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    requestAnimationFrame(() => setMounted(true));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery, category, flatItems.length]);

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
          else if (canOpenWorkspace) onOpenWorkspace(debouncedQuery);
          break;
      }
    },
    [navigate, aiInsight, debouncedQuery, onOpenWorkspace, onClose, openProfile, canOpenWorkspace],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (selectedResult) setSelectedResult(null);
        else onClose();
        return;
      }

      if (event.key === "Tab" && debouncedQuery.trim()) {
        event.preventDefault();
        const idx = searchCategories.findIndex((c) => c.id === category);
        const next = event.shiftKey
          ? (idx - 1 + searchCategories.length) % searchCategories.length
          : (idx + 1) % searchCategories.length;
        setCategory(searchCategories[next].id);
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
        setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (event.key === "Enter" && flatItems[activeIndex]) {
        event.preventDefault();
        activateItem(flatItems[activeIndex], event.shiftKey);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, flatItems, activeIndex, activateItem, category, selectedResult, debouncedQuery]);

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

  const orderedHubs = useMemo(() => {
    const hubs = Object.keys(groupedByHub);
    return [
      ...hubGroupOrder.filter((h) => hubs.includes(h)),
      ...hubs.filter((h) => !hubGroupOrder.includes(h)),
    ];
  }, [groupedByHub]);

  return (
    <>
      <div
        className={cn("cmd-palette-backdrop", mounted && "cmd-palette-backdrop-visible")}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn("cmd-palette", mounted && "cmd-palette-visible")}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="cmd-palette-shell">
          <div className="cmd-palette-brand">
            <AppIcon name="search" size={14} strokeWidth={2} />
            <span>Agency OS Command</span>
            <kbd className="cmd-palette-kbd">⌘K</kbd>
          </div>

          <div className="cmd-palette-search">
            <AppIcon name="search" size={20} strokeWidth={2} className="cmd-palette-search-icon" />
            <input
              ref={inputRef}
              type="search"
              className="cmd-palette-input"
              placeholder={globalSearchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search commands and records"
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
            <kbd className="cmd-palette-kbd">ESC</kbd>
          </div>

          {debouncedQuery.trim().length > 0 && (
            <div className="cmd-palette-categories" role="tablist" aria-label="Result categories">
              {searchCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={category === cat.id}
                  className={cn("cmd-palette-category", category === cat.id && "active")}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          <div className="cmd-palette-body" ref={listRef}>
            {!debouncedQuery.trim() && (
              <>
                {recentSearches.length > 0 && (
                  <section className="cmd-palette-section">
                    <div className="cmd-palette-section-header">
                      <span className="cmd-palette-section-title">Recent</span>
                      <button type="button" className="cmd-palette-link-btn" onClick={handleClearHistory}>
                        Clear
                      </button>
                    </div>
                    <ul className="cmd-palette-list">
                      {recentSearches.map((term) => {
                        const flatIdx = flatItems.findIndex((item) => item.kind === "recent" && item.label === term);
                        return (
                          <li key={term}>
                            <button
                              type="button"
                              className={cn("cmd-palette-row", flatIdx === activeIndex && "active")}
                              data-index={flatIdx}
                              onClick={() => setQuery(term)}
                              onMouseEnter={() => setActiveIndex(flatIdx)}
                            >
                              <HubIcon hub="VA Operations" actionIcon="refresh" />
                              <span>{term}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                {accessibleAlerts.length > 0 && (
                  <section className="cmd-palette-section">
                    <div className="cmd-palette-section-header">
                      <span className="cmd-palette-section-title">Alerts</span>
                      <span className="cmd-palette-section-count">{accessibleAlerts.length}</span>
                    </div>
                    <ul className="cmd-palette-list">
                      {accessibleAlerts.map((alert) => {
                        const flatIdx = flatItems.findIndex((item) => item.kind === "alert" && item.alert.id === alert.id);
                        return (
                          <li key={alert.id}>
                            <button
                              type="button"
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

                <section className="cmd-palette-section cmd-palette-section--pinned">
                  <div className="cmd-palette-section-header">
                    <span className="cmd-palette-section-title">Commands</span>
                  </div>
                  <ul className="cmd-palette-list">
                    {accessiblePinned.map((action) => {
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

                <section className="cmd-palette-section">
                  <div className="cmd-palette-section-header">
                    <span className="cmd-palette-section-title">Jump to Module</span>
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

                {suggestedResults.length > 0 && (
                  <section className="cmd-palette-section">
                    <div className="cmd-palette-section-header">
                      <span className="cmd-palette-section-title">Suggested Records</span>
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
                              className={cn("cmd-palette-row cmd-palette-result-row", flatIdx === activeIndex && "active")}
                              data-index={flatIdx}
                              onClick={() => setSelectedResult(result)}
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

            {debouncedQuery.trim().length > 0 && (
              <>
                {isSearching && (
                  <div className="cmd-palette-empty" aria-live="polite">
                    <AppIcon name="search" size={20} strokeWidth={2} />
                    <p>Searching…</p>
                  </div>
                )}

                {!isSearching && matchedActions.length > 0 && (
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

                {!isSearching &&
                  orderedHubs.map((hub) => {
                    const items = groupedByHub[hub];
                    if (!items?.length) return null;
                    return (
                      <section key={hub} className="cmd-palette-section">
                        <div className="cmd-palette-section-header">
                          <HubTag hub={hub} />
                          <span className="cmd-palette-section-title">{displayGroupLabel(hub)}</span>
                          <span className="cmd-palette-section-count">
                            {searchResults.filter((r) => r.hub === hub).length}
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
                                  className={cn(
                                    "cmd-palette-row cmd-palette-result-row",
                                    flatIdx === activeIndex && "active",
                                  )}
                                  data-index={flatIdx}
                                  onClick={() => setSelectedResult(result)}
                                  onMouseEnter={() => setActiveIndex(flatIdx)}
                                >
                                  <ResultRowContent result={result} query={debouncedQuery} />
                                </button>
                              </li>
                            );
                          })}
                          {searchResults.filter((r) => r.hub === hub).length > 5 && !expandedHubs.has(hub) && (
                            <li>
                              <button
                                type="button"
                                className="cmd-palette-view-all"
                                data-index={flatItems.findIndex(
                                  (item) => item.kind === "view-all" && item.hub === hub,
                                )}
                                onClick={() => setExpandedHubs((prev) => new Set(prev).add(hub))}
                              >
                                View all in {shortHubLabel(hub)}
                              </button>
                            </li>
                          )}
                        </ul>
                      </section>
                    );
                  })}

                {!isSearching && aiInsight && (
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
                  <div className="cmd-palette-empty">
                    <AppIcon name="search" size={24} strokeWidth={2} />
                    <p>No results found</p>
                    <p className="cmd-palette-empty-hint">
                      Try a client name, carrier, command, or module jump.
                    </p>
                    {canOpenWorkspace && (
                      <button type="button" className="va-ops-action-btn" onClick={() => onOpenWorkspace(debouncedQuery)}>
                        Search in workspace
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="cmd-palette-footer">
            <span>
              <kbd>↑↓</kbd> navigate
            </span>
            <span>
              <kbd>↵</kbd> open
            </span>
            <span>
              <kbd>⇧↵</kbd> new tab
            </span>
            {debouncedQuery.trim() ? (
              <span>
                <kbd>Tab</kbd> filter
              </span>
            ) : null}
            {canOpenWorkspace ? (
              <button type="button" className="cmd-palette-footer-link" onClick={() => onOpenWorkspace(query)}>
                Full search →
              </button>
            ) : null}
          </footer>
        </div>
      </div>

      <QuickResultDrawer
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
        onNavigate={(href) => {
          if (query.trim()) addRecentSearch(query.trim());
          onClose();
          router.push(href);
        }}
      />
    </>
  );
}
