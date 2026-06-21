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
  filterQuickActions,
  groupResultsByCategory,
  highlightMatch,
  resolveAiInsight,
  searchCategories,
  searchGlobalResults,
  type QuickAction,
  type SearchCategory,
} from "@/data/globalSearchEngine";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "@/lib/globalSearchHistory";
import { crossModuleRoutes, resolveSearchNavigation } from "@/lib/crossModuleLinks";
import { useAvatarProfile } from "@/components/user-profile/AvatarProfileProvider";
import { routes } from "@/lib/routes";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { cn } from "@/lib/cn";
import { AiThinkingLoader, CommandPaletteSkeleton } from "@/components/shared/loading";
import { QuickResultDrawer } from "./QuickResultDrawer";

type PaletteItem =
  | { kind: "recent"; id: string; label: string }
  | { kind: "action"; id: string; action: QuickAction }
  | { kind: "result"; id: string; result: GlobalSearchResult }
  | { kind: "view-all"; id: string; group: string; query: string }
  | { kind: "ai"; id: string };

type CommandPaletteProps = {
  initialQuery?: string;
  onClose: () => void;
  onOpenWorkspace: (query: string) => void;
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

export function CommandPalette({ initialQuery = "", onClose, onOpenWorkspace }: CommandPaletteProps) {
  const router = useRouter();
  const { openProfile } = useAvatarProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedResult, setSelectedResult] = useState<GlobalSearchResult | null>(null);
  const [mounted, setMounted] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 280);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    requestAnimationFrame(() => setMounted(true));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debouncedQuery !== query) {
      setLoading(true);
      setError(false);
    } else {
      setLoading(false);
    }
  }, [debouncedQuery, query]);

  const filteredActions = useMemo(() => filterQuickActions(debouncedQuery), [debouncedQuery]);

  const searchResults = useMemo(() => {
    try {
      return searchGlobalResults(debouncedQuery, defaultGlobalSearchFilters, category);
    } catch {
      setError(true);
      return [];
    }
  }, [debouncedQuery, category]);

  const groupedResults = useMemo(() => {
    const limit = expandedGroups.size > 0 ? 999 : 3;
    return groupResultsByCategory(searchResults, limit);
  }, [searchResults, expandedGroups]);

  const aiInsight = useMemo(() => resolveAiInsight(debouncedQuery), [debouncedQuery]);

  const flatItems = useMemo((): PaletteItem[] => {
    const items: PaletteItem[] = [];
    const hasQuery = debouncedQuery.trim().length > 0;

    if (!hasQuery) {
      for (const term of recentSearches) {
        items.push({ kind: "recent", id: `recent-${term}`, label: term });
      }
      for (const action of filteredActions) {
        items.push({ kind: "action", id: `action-${action.id}`, action });
      }
    } else {
      for (const action of filteredActions.slice(0, 4)) {
        items.push({ kind: "action", id: `action-${action.id}`, action });
      }
      for (const group of searchGroupOrder) {
        const groupResults = groupedResults[group];
        if (!groupResults?.length) continue;
        for (const result of groupResults) {
          items.push({ kind: "result", id: result.id, result });
        }
        const totalInGroup = searchResults.filter((r) => r.group === group).length;
        if (totalInGroup > 3 && !expandedGroups.has(group)) {
          items.push({ kind: "view-all", id: `view-all-${group}`, group, query: debouncedQuery });
        }
      }
      if (aiInsight) items.push({ kind: "ai", id: aiInsight.id });
    }

    return items;
  }, [debouncedQuery, recentSearches, filteredActions, groupedResults, searchResults, expandedGroups, aiInsight]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery, category, flatItems.length]);

  const navigate = useCallback(
    (href: string, newTab = false) => {
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
    [debouncedQuery, onClose, router],
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
          if (newTab) {
            navigate(item.result.href, true);
          } else {
            setSelectedResult(item.result);
          }
          break;
        }
        case "view-all":
          setExpandedGroups((prev) => new Set(prev).add(item.group));
          break;
        case "ai":
          if (aiInsight?.action) navigate(aiInsight.action.href, newTab);
          else onOpenWorkspace(debouncedQuery);
          break;
      }
    },
    [navigate, aiInsight, debouncedQuery, onOpenWorkspace, onClose, openProfile],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (selectedResult) setSelectedResult(null);
        else onClose();
        return;
      }

      if (event.key === "Tab") {
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
  }, [onClose, flatItems, activeIndex, activateItem, category, selectedResult]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleClearHistory = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const showEmpty = debouncedQuery.trim().length > 0 && searchResults.length === 0 && !loading && !aiInsight;

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
        aria-label="Global search"
      >
        <div className="cmd-palette-search">
          <AppIcon name="search" size={20} strokeWidth={2} className="cmd-palette-search-icon" />
          <input
            ref={inputRef}
            type="search"
            className="cmd-palette-input"
            placeholder={globalSearchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
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
          {loading && debouncedQuery.trim() && (
            <>
              <AiThinkingLoader message="Searching across modules…" />
              <CommandPaletteSkeleton rows={4} />
            </>
          )}

          {!loading && debouncedQuery.trim() && aiInsight && category === "all" && (
            <div className="cmd-palette-ai-thinking-wrap">
              <AiThinkingLoader message="Analyzing search context…" />
            </div>
          )}

          {loading && !debouncedQuery.trim() && (
            <CommandPaletteSkeleton rows={3} />
          )}

          {error && (
            <div className="cmd-palette-empty">
              <AppIcon name="x" size={20} strokeWidth={2} />
              <p>Search unavailable. Try again or open the full workspace.</p>
              <button type="button" className="va-ops-action-btn" onClick={() => onOpenWorkspace(query)}>
                Open Global Search
              </button>
            </div>
          )}

          {!loading && !error && !debouncedQuery.trim() && (
            <>
              {recentSearches.length > 0 && (
                <section className="cmd-palette-section">
                  <div className="cmd-palette-section-header">
                    <span className="cmd-palette-section-title">Recent Searches</span>
                    <button type="button" className="cmd-palette-link-btn" onClick={handleClearHistory}>
                      Clear history
                    </button>
                  </div>
                  <ul className="cmd-palette-list">
                    {recentSearches.map((term, idx) => {
                      const flatIdx = flatItems.findIndex((item) => item.kind === "recent" && item.label === term);
                      return (
                        <li key={term}>
                          <button
                            type="button"
                            className={cn("cmd-palette-row", flatIdx === activeIndex && "active")}
                            data-index={flatIdx}
                            onClick={() => {
                              setQuery(term);
                              addRecentSearch(term);
                            }}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                          >
                            <AppIcon name="refresh" size={16} strokeWidth={2} />
                            <span>{term}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              <section className="cmd-palette-section">
                <div className="cmd-palette-section-header">
                  <span className="cmd-palette-section-title">Quick Actions</span>
                </div>
                <ul className="cmd-palette-list">
                  {filteredActions.map((action) => {
                    const flatIdx = flatItems.findIndex(
                      (item) => item.kind === "action" && item.action.id === action.id,
                    );
                    return (
                      <li key={action.id}>
                        <button
                          type="button"
                          className={cn("cmd-palette-row", flatIdx === activeIndex && "active")}
                          data-index={flatIdx}
                          onClick={() => navigate(action.href)}
                          onMouseEnter={() => setActiveIndex(flatIdx)}
                        >
                          <AppIcon name={action.icon} size={16} strokeWidth={2} />
                          <span>{action.label}</span>
                          <kbd className="cmd-palette-row-kbd">↵</kbd>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          )}

          {!loading && !error && debouncedQuery.trim().length > 0 && (
            <>
              {filteredActions.length > 0 && (
                <section className="cmd-palette-section">
                  <div className="cmd-palette-section-header">
                    <span className="cmd-palette-section-title">Quick Actions</span>
                  </div>
                  <ul className="cmd-palette-list">
                    {filteredActions.slice(0, 4).map((action) => {
                      const flatIdx = flatItems.findIndex(
                        (item) => item.kind === "action" && item.action.id === action.id,
                      );
                      return (
                        <li key={action.id}>
                          <button
                            type="button"
                            className={cn("cmd-palette-row", flatIdx === activeIndex && "active")}
                            data-index={flatIdx}
                            onClick={() => navigate(action.href)}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                          >
                            <AppIcon name={action.icon} size={16} strokeWidth={2} />
                            <span>
                              <HighlightText text={action.label} query={debouncedQuery} />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {searchGroupOrder.map((group) => {
                const items = groupedResults[group];
                if (!items?.length) return null;
                return (
                  <section key={group} className="cmd-palette-section">
                    <div className="cmd-palette-section-header">
                      <span className="cmd-palette-section-title">{group}</span>
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
                              className={cn("cmd-palette-row cmd-palette-result-row", flatIdx === activeIndex && "active")}
                              data-index={flatIdx}
                              onClick={() => setSelectedResult(result)}
                              onMouseEnter={() => setActiveIndex(flatIdx)}
                            >
                              <div className="cmd-palette-result-main">
                                <span className="cmd-palette-result-title">
                                  <HighlightText text={result.title} query={debouncedQuery} />
                                </span>
                                <span className="cmd-palette-result-meta">
                                  {result.group.replace(/s$/, "")} • {result.hub}
                                </span>
                              </div>
                              <div className="cmd-palette-result-badges">
                                <span className={cn("badge", statusBadgeClass(result.status))}>
                                  {result.status}
                                </span>
                                <span className="cmd-palette-result-time">{result.lastUpdated}</span>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                      {searchResults.filter((r) => r.group === group).length > 3 &&
                        !expandedGroups.has(group) && (
                          <li>
                            <button
                              type="button"
                              className="cmd-palette-view-all"
                              data-index={flatItems.findIndex(
                                (item) => item.kind === "view-all" && item.group === group,
                              )}
                              onClick={() => setExpandedGroups((prev) => new Set(prev).add(group))}
                            >
                              View all {group.toLowerCase()}
                            </button>
                          </li>
                        )}
                    </ul>
                  </section>
                );
              })}

              {aiInsight && (
                <section className="cmd-palette-section cmd-palette-ai">
                  <div className="cmd-palette-section-header">
                    <AppIcon name="sparkles" size={16} strokeWidth={2} />
                    <span className="cmd-palette-section-title">AI Search Assistant</span>
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
                  <p>No results for &ldquo;{debouncedQuery}&rdquo;</p>
                  <button type="button" className="va-ops-action-btn" onClick={() => onOpenWorkspace(debouncedQuery)}>
                    Search in workspace
                  </button>
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
          <span>
            <kbd>Tab</kbd> category
          </span>
          <button type="button" className="cmd-palette-footer-link" onClick={() => onOpenWorkspace(query)}>
            Full search →
          </button>
        </footer>
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
