"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  defaultGlobalSearchFilters,
  globalSearchFilterOptions,
  globalSearchHelper,
  globalSearchPlaceholder,
  groupSearchResults,
  recentSearchesSeed,
  savedSearchViews,
  searchActivityTimeline,
  searchGroupOrder,
  type GlobalSearchFilterState,
  type GlobalSearchResult,
} from "@/data/globalSearch";
import { highlightMatch, resolveAiInsight, searchGlobalResults } from "@/data/globalSearchEngine";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "@/lib/globalSearchHistory";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { resolveSearchNavigation } from "@/lib/crossModuleLinks";
import { useAvatarProfile } from "@/components/user-profile/AvatarProfileProvider";
import { cn } from "@/lib/cn";
import { SearchingIndicator, SearchResultsSkeleton } from "@/components/shared/loading";
import { HubEmptyState } from "@/components/state";
import { QuickResultDrawer } from "./QuickResultDrawer";

const filterLabels: Record<keyof GlobalSearchFilterState, string> = {
  hubType: "Module",
  status: "Status",
  assignedTo: "Assigned User",
  dateRange: "Date Range",
  client: "Client",
  carrier: "Carrier",
  coverageType: "Coverage Type",
  priority: "Priority",
  trainingType: "Training Type",
};

function HighlightText({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);
  return (
    <>
      {parts.map((part, i) =>
        part.match ? (
          <mark key={i} className="global-search-highlight">
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

export function UniversalSearchTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open: openPalette } = useGlobalSearch();
  const { openProfile } = useAvatarProfile();
  const initialQuery = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(initialQuery);
  const [filters, setFilters] = useState(defaultGlobalSearchFilters);
  const [selectedResult, setSelectedResult] = useState<GlobalSearchResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(recentSearchesSeed);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    const stored = getRecentSearches();
    if (stored.length > 0) setRecentSearches(stored);
  }, []);

  useEffect(() => {
    setLoading(debouncedSearch !== search);
  }, [debouncedSearch, search]);

  useEffect(() => {
    if (debouncedSearch.trim()) addRecentSearch(debouncedSearch.trim());
  }, [debouncedSearch]);

  const filteredResults = useMemo(
    () => searchGlobalResults(debouncedSearch, filters),
    [debouncedSearch, filters],
  );

  const grouped = useMemo(() => groupSearchResults(filteredResults), [filteredResults]);
  const aiInsight = useMemo(() => resolveAiInsight(debouncedSearch), [debouncedSearch]);

  useSyncBreadcrumbDetail(selectedResult?.title ?? null, {
    paramKey: "entity",
    paramValue: selectedResult?.id,
    enabled: Boolean(selectedResult),
  });

  const updateFilter = (key: keyof GlobalSearchFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyRecentSearch = (term: string) => {
    setSearch(term);
  };

  const applySavedSearch = (query: string) => {
    setSearch(query);
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const handleClearHistory = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const openResult = useCallback((result: GlobalSearchResult) => {
    setSelectedResult(result);
  }, []);

  const navigateResult = useCallback(
    (result: GlobalSearchResult) => {
      const nav = resolveSearchNavigation(result);
      if (nav.kind === "profile") {
        openProfile(nav.userId);
        return;
      }
      router.push(nav.kind === "route" ? nav.href : result.href, { scroll: false });
    },
    [openProfile, router],
  );

  const quickActionFor = (result: GlobalSearchResult) => result.cta;

  return (
    <div className="va-ops-role-view global-search">
      <section className="global-search-hero global-search-hero-sticky" aria-label="Universal search">
        <label className="global-search-input-wrap">
          <AppIcon name="search" size={22} strokeWidth={2} className="global-search-hero-icon" />
          <input
            type="search"
            className="global-search-hero-input"
            placeholder={globalSearchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="global-search-kbd global-search-kbd-btn"
            onClick={() => openPalette(search)}
            aria-label="Open command palette"
          >
            ⌘K
          </button>
        </label>
        <p className="global-search-helper">{globalSearchHelper}</p>
      </section>

      <div className="global-search-filters global-search-filters-sticky">
        <div className="global-search-filter-row">
          {(Object.keys(globalSearchFilterOptions) as (keyof GlobalSearchFilterState)[]).map((key) => (
            <label key={key} className="global-search-filter">
              <span className="global-search-filter-label">{filterLabels[key]}</span>
              <select
                className="header-filter-select global-search-select"
                value={filters[key]}
                onChange={(e) => updateFilter(key, e.target.value)}
              >
                {globalSearchFilterOptions[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      {aiInsight && (
        <section className="va-ops-panel global-search-ai-panel" aria-label="AI search insight">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">
              <AppIcon name="sparkles" size={18} strokeWidth={2} /> AI Insight
            </h3>
          </div>
          <p className="global-search-ai-summary">{aiInsight.summary}</p>
          <div className="global-search-ai-links">
            {aiInsight.links.map((link) => (
              <button
                key={link.href}
                type="button"
                className="global-search-chip"
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </button>
            ))}
            {aiInsight.action && (
              <button
                type="button"
                className="va-ops-action-btn"
                onClick={() => router.push(aiInsight.action!.href)}
              >
                {aiInsight.action.label}
              </button>
            )}
          </div>
        </section>
      )}

      <div className="global-search-results">
        {loading && debouncedSearch.trim() && <SearchingIndicator />}

        {loading && debouncedSearch.trim() && (
          <SearchResultsSkeleton rows={4} label="Searching results" />
        )}

        {!loading && !debouncedSearch.trim() && (
          <HubEmptyState preset="global-search" onAction={() => openPalette()} />
        )}

        {!loading &&
          debouncedSearch.trim() &&
          filteredResults.length === 0 && (
            <HubEmptyState
              title="No results found"
              description="Try adjusting your search or filters."
              ctaLabel="Open Command Palette"
              onAction={() => openPalette(search)}
            />
          )}

        {!loading &&
          debouncedSearch.trim() &&
          filteredResults.length > 0 &&
          searchGroupOrder.map((group) => {
            const items = grouped[group];
            if (items.length === 0) return null;
            const collapsed = collapsedGroups.has(group);

            return (
              <section key={group} className="va-ops-panel global-search-group" aria-label={group}>
                <button
                  type="button"
                  className="va-ops-panel-header global-search-group-header"
                  onClick={() => toggleGroup(group)}
                  aria-expanded={!collapsed}
                >
                  <h3 className="va-ops-section-title">{group}</h3>
                  <p className="va-ops-section-sub">
                    {items.length} result{items.length === 1 ? "" : "s"}
                  </p>
                  <AppIcon
                    name="chevron-down"
                    size={16}
                    strokeWidth={2.25}
                    className={cn("global-search-group-chevron", collapsed && "collapsed")}
                  />
                </button>
                {!collapsed && (
                  <div className="global-search-result-explorer">
                    <div className="global-search-explorer-head">
                      <span>Title</span>
                      <span>Module</span>
                      <span>Status</span>
                      <span>Owner</span>
                      <span>Updated</span>
                      <span>Action</span>
                    </div>
                    {items.map((result) => (
                      <article
                        key={result.id}
                        className="global-search-explorer-row"
                        tabIndex={0}
                        role="button"
                        onClick={() => openResult(result)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openResult(result);
                          }
                        }}
                      >
                        <span className="global-search-explorer-title">
                          <HighlightText text={result.title} query={debouncedSearch} />
                          <span className="global-search-explorer-type">{result.type}</span>
                        </span>
                        <span className="global-search-explorer-module">{result.hub}</span>
                        <span>
                          <span className={cn("badge", statusBadgeClass(result.status))}>
                            {result.status}
                          </span>
                        </span>
                        <span className="global-search-explorer-owner">{result.owner ?? "—"}</span>
                        <span className="global-search-explorer-date">{result.lastUpdated}</span>
                        <button
                          type="button"
                          className="va-ops-action-btn global-search-result-cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateResult(result);
                          }}
                        >
                          {quickActionFor(result)}
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
      </div>

      <div className="global-search-bottom-grid">
        <section className="va-ops-panel" aria-label="Recent searches">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Recent Searches</h3>
            <button type="button" className="cmd-palette-link-btn" onClick={handleClearHistory}>
              Clear
            </button>
          </div>
          <div className="global-search-chip-list">
            {(recentSearches.length > 0 ? recentSearches : recentSearchesSeed).map((term) => (
              <button
                key={term}
                type="button"
                className="global-search-chip"
                onClick={() => applyRecentSearch(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </section>

        <section className="va-ops-panel" aria-label="Saved search views">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Saved Searches</h3>
            <p className="va-ops-section-sub">Operational shortcuts.</p>
          </div>
          <div className="global-search-chip-list">
            {savedSearchViews.map((view) => (
              <button
                key={view.id}
                type="button"
                className={cn("global-search-chip", "global-search-chip-saved")}
                onClick={() => applySavedSearch(view.query)}
              >
                <AppIcon name="star" size={14} strokeWidth={2} />
                {view.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="va-ops-panel" aria-label="Team search activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Team Search Activity</h3>
          <p className="va-ops-section-sub">Usage visibility across the team.</p>
        </div>
        <ol className="outreach-activity-timeline">
          {searchActivityTimeline.map((item) => (
            <li key={item.id} className="outreach-activity-item">
              <div className="outreach-activity-dot" aria-hidden="true" />
              <div className="outreach-activity-content">
                <div className="outreach-activity-message">{item.message}</div>
                <div className="outreach-activity-time">{item.timeAgo}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <QuickResultDrawer result={selectedResult} onClose={() => setSelectedResult(null)} />
    </div>
  );
}
