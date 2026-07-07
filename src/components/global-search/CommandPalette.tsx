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
  paletteAiGuidance,
  paletteTabs,
  suggestedPaletteActions,
  type CommandPaletteAction,
  type PaletteTabId,
} from "@/data/commandPalette";
import {
  groupResultsByHub,
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
import { overlaySearchHints } from "@/lib/overlaySearchGroups";
import { CommandPaletteSkeleton } from "@/components/shared/loading";
import { SearchPreviewPanel } from "./SearchPreviewPanel";

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
  const accent = resolveHubAccent(hub);
  const map: Record<string, string> = {
    commercial: "cmd-hub-accent-commercial",
    va: "cmd-hub-accent-va",
    training: "cmd-hub-accent-training",
    carrier: "cmd-hub-accent-carrier",
    analytics: "cmd-hub-accent-analytics",
    send: "cmd-hub-accent-send",
    farmers: "cmd-hub-accent-farmers",
    epay: "cmd-hub-accent-epay",
    intake: "cmd-hub-accent-intake",
  };
  return map[accent] ?? "cmd-hub-accent-va";
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
      className={cn("cmd-palette-row cmd-palette-action-row", hubRowAccentClass(action.hub), active && "active")}
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
      <AppIcon name="chevron-down" size={14} strokeWidth={2.25} className="cmd-palette-row-chevron" />
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
      <AppIcon name="chevron-down" size={14} strokeWidth={2.25} className="cmd-palette-row-chevron" />
    </>
  );
}

export function CommandPalette({
  initialQuery = "",
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
  const [previewResult, setPreviewResult] = useState<GlobalSearchResult | null>(null);
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
  const showJumps = !hasQuery && (paletteTab === "all" || paletteTab === "actions");
  const showSearchResults = hasQuery && (paletteTab === "all" || paletteTab === "search");
  const showMatchedActions = hasQuery && (paletteTab === "all" || paletteTab === "actions");
  const showAiPanel = paletteTab === "all" || paletteTab === "ai";
  const showSuggestedRecords = !hasQuery && paletteTab === "search";
  const showAiGuidance = paletteTab === "ai" || paletteTab === "all";

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

    if (!hasQuery) {
      if (showRecent) {
        for (const term of recentSearches) {
          items.push({ kind: "recent", id: `recent-${term}`, label: term });
        }
      }
      if (showSuggestedActions) {
        for (const action of accessiblePinned) {
          items.push({ kind: "action", id: `action-${action.id}`, action });
        }
      }
      if (showAlerts) {
        for (const alert of accessibleAlerts) {
          items.push({ kind: "alert", id: alert.id, alert });
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
      }
      if (showAiPanel && aiInsight) items.push({ kind: "ai", id: aiInsight.id });
    }

    return items;
  }, [
    hasQuery,
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
    groupedByHub,
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
        if (previewResult) setPreviewResult(null);
        else onClose();
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
        activateItem(flatItems[activeIndex], mod);
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, flatItems, activeIndex, activateItem, paletteTab, previewResult, debouncedQuery]);

  useEffect(() => {
    const item = flatItems[activeIndex];
    if (item?.kind === "result") setPreviewResult(item.result);
    else setPreviewResult(null);
  }, [activeIndex, flatItems]);

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
        ref={panelRef}
        className={cn("cmd-palette", mounted && "cmd-palette-visible")}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        <div className="cmd-palette-panel">
          <div className="cmd-palette-layout">
            <div className="cmd-palette-main">
              <div className="cmd-palette-shell">
                <div className="cmd-palette-header">
                  <div className="cmd-palette-header-top">
                    <span className="cmd-palette-eyebrow">Agency OS Search</span>
                    <kbd className="cmd-palette-header-kbd" aria-hidden="true">
                      {typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC") ? "⌘K" : "Ctrl K"}
                    </kbd>
                  </div>
                  <div className="cmd-palette-search">
                    <AppIcon name="search" size={22} strokeWidth={2} className="cmd-palette-search-icon" />
                    <input
                      ref={inputRef}
                      type="search"
                      className="cmd-palette-input"
                      placeholder="Search clients, hubs, commands…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Search across Agency OS"
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
                  </div>
                  {!hasQuery && (
                    <div className="cmd-palette-hints" aria-hidden="true">
                      {overlaySearchHints.map((hint) => (
                        <span key={hint} className="cmd-palette-hint">
                          {hint}
                        </span>
                      ))}
                    </div>
                  )}
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

          <div className="cmd-palette-body" ref={listRef}>
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

                {showAlerts && accessibleAlerts.length > 0 && (
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

                {showSuggestedActions && (
                <section className="cmd-palette-section cmd-palette-section--pinned">
                  <div className="cmd-palette-section-header">
                    <span className="cmd-palette-section-title">Pinned Items</span>
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
                              className={cn(
                                "cmd-palette-row cmd-palette-result-row",
                                hubRowAccentClass(result.hub),
                                flatIdx === activeIndex && "active",
                              )}
                              data-index={flatIdx}
                              onClick={() => {
                                setPreviewResult(result);
                                const idx = flatItems.findIndex(
                                  (item) => item.kind === "result" && item.result.id === result.id,
                                );
                                if (idx >= 0) setActiveIndex(idx);
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
                                    hubRowAccentClass(result.hub),
                                    flatIdx === activeIndex && "active",
                                  )}
                                  data-index={flatIdx}
                                  onClick={() => {
                                setPreviewResult(result);
                                const idx = flatItems.findIndex(
                                  (item) => item.kind === "result" && item.result.id === result.id,
                                );
                                if (idx >= 0) setActiveIndex(idx);
                              }}
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
                    <div className="cmd-palette-empty-illustration" aria-hidden="true">
                      <AppIcon name="search" size={28} strokeWidth={1.75} />
                    </div>
                    <h3>No results found</h3>
                    <p>
                      We couldn&apos;t find anything matching &ldquo;{debouncedQuery}&rdquo;. Try a different term or browse a hub.
                    </p>
                    <div className="cmd-palette-empty-actions">
                      <button type="button" className="cmd-palette-empty-btn" onClick={() => setQuery("commercial")}>
                        Search Commercial
                      </button>
                      <button type="button" className="cmd-palette-empty-btn" onClick={() => setQuery("carrier")}>
                        Search Carriers
                      </button>
                      <button
                        type="button"
                        className="cmd-palette-empty-btn"
                        onClick={() => {
                          setQuery("");
                          inputRef.current?.focus();
                        }}
                      >
                        View Recent
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="cmd-palette-footer">
            <span><kbd>↵</kbd> Execute</span>
            <span><kbd>⌘↵</kbd> Open in new tab</span>
            <span><kbd>↑↓</kbd> Navigate</span>
            <span><kbd>Tab</kbd> Sections</span>
            <span><kbd>Esc</kbd> Close</span>
          </footer>
              </div>
            </div>
            <div className="cmd-palette-preview-slot" aria-live="polite">
              <SearchPreviewPanel result={previewResult} onNavigate={onClose} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
