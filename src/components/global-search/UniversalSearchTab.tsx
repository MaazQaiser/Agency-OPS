"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  commandCenterSectionOrder,
  commandCenterResultsPerSection,
  getSectionTotals,
  groupByCommandCenterSection,
  resolveRecentSearchCard,
  savedSearchShortcuts,
  teamSearchActivityFeed,
} from "@/data/globalSearchCommandCenter";
import {
  defaultGlobalSearchFilters,
  globalSearchFilterOptions,
  globalSearchHelper,
  globalSearchPlaceholder,
  searchResults,
  type GlobalSearchFilterState,
  type GlobalSearchResult,
} from "@/data/globalSearch";
import { resolveAiInsight, searchGlobalResults } from "@/data/globalSearchEngine";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "@/lib/globalSearchHistory";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { SearchingIndicator, SearchResultsSkeleton } from "@/components/shared/loading";
import { HubEmptyState } from "@/components/state";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { cn } from "@/lib/cn";
import { SearchGroupSection } from "./SearchGroupSection";
import { SearchPreviewPanel } from "./SearchPreviewPanel";

const filterLabels: Record<keyof GlobalSearchFilterState, string> = {
  hubType: "Module",
  status: "Status",
  assignedTo: "Assignee",
  dateRange: "Date",
  client: "Client",
  carrier: "Carrier",
  coverageType: "Coverage",
  priority: "Priority",
  trainingType: "Training",
  riskLevel: "Risk Level",
  pendingApproval: "Pending Approval",
  missingDocs: "Missing Docs",
};

export function UniversalSearchTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open: openPalette } = useGlobalSearch();
  const initialQuery = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(initialQuery);
  const [filters, setFilters] = useState(defaultGlobalSearchFilters);
  const [selectedResult, setSelectedResult] = useState<GlobalSearchResult | null>(null);
  const [recentTerms, setRecentTerms] = useState<string[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(commandCenterSectionOrder),
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);
  const hasQuery = debouncedSearch.trim().length > 0;

  useEffect(() => {
    const stored = getRecentSearches();
    if (stored.length > 0) setRecentTerms(stored);
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

  const groupedFull = useMemo(() => {
    if (hasQuery) return groupByCommandCenterSection(filteredResults);
    return groupByCommandCenterSection(searchResults);
  }, [filteredResults, hasQuery]);

  const sectionTotals = useMemo(() => {
    if (hasQuery) return getSectionTotals(filteredResults);
    return getSectionTotals(searchResults);
  }, [filteredResults, hasQuery]);

  const groupedSections = useMemo(() => {
    const trimmed = {} as Record<string, GlobalSearchResult[]>;
    for (const section of commandCenterSectionOrder) {
      const all = groupedFull[section];
      if (expandedSections.has(section)) {
        trimmed[section] = all;
      } else {
        trimmed[section] = all.slice(0, commandCenterResultsPerSection);
      }
    }
    return trimmed;
  }, [groupedFull, expandedSections]);

  const aiInsight = useMemo(() => resolveAiInsight(debouncedSearch), [debouncedSearch]);

  const firstResult = useMemo(() => {
    for (const section of commandCenterSectionOrder) {
      const item = groupedSections[section][0];
      if (item) return item;
    }
    return null;
  }, [groupedSections]);

  const activePreview = selectedResult ?? (hasQuery ? firstResult : null);

  useSyncBreadcrumbDetail(activePreview?.title ?? null, {
    paramKey: "entity",
    paramValue: activePreview?.id,
    enabled: Boolean(activePreview),
  });

  const updateFilter = (key: keyof GlobalSearchFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyRecentSearch = (term: string) => setSearch(term);
  const applySavedSearch = (query: string) => setSearch(query);

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const expandSection = (section: string) => {
    setExpandedSections((prev) => new Set(prev).add(section));
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.delete(section);
      return next;
    });
  };

  const handleClearHistory = () => {
    clearRecentSearches();
    setRecentTerms([]);
  };

  const openResult = useCallback((result: GlobalSearchResult) => {
    setSelectedResult(result);
  }, []);

  const recentCards = (recentTerms.length > 0 ? recentTerms : getRecentSearches()).map(resolveRecentSearchCard);

  return (
    <div className="va-ops-role-view global-search global-search-command-center">
      <div className="global-search-toolbar global-search-toolbar-sticky">
        <section className="global-search-hero" aria-label="Universal search">
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

        <section className="global-search-recent-inline" aria-label="Recent searches">
          <div className="global-search-recent-inline-header">
            <h3 className="global-search-recent-inline-title">Recent Searches</h3>
            <button type="button" className="cmd-palette-link-btn" onClick={handleClearHistory}>
              Clear
            </button>
          </div>
          <div className="global-search-recent-inline-grid">
            {recentCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="global-search-recent-inline-card"
                onClick={() => applyRecentSearch(card.term)}
              >
                <span className="global-search-recent-card-term">{card.term}</span>
                <span className="global-search-recent-card-hub">{card.hub}</span>
                <span
                  className={cn(
                    "global-search-recent-card-status",
                    card.riskLevel === "High" && "is-high-risk",
                  )}
                >
                  {card.status}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {aiInsight && (
        <section className="va-ops-panel global-search-ai-panel global-search-ai-panel--compact" aria-label="AI search insight">
          <div className="global-search-ai-inline">
            <AppIcon name="sparkles" size={16} strokeWidth={2} />
            <p className="global-search-ai-summary">{aiInsight.summary}</p>
          </div>
        </section>
      )}

      <div className="global-search-command-layout">
        <div className="global-search-command-main">
          {loading && hasQuery && <SearchingIndicator />}
          {loading && hasQuery && <SearchResultsSkeleton rows={4} label="Searching results" />}

          {!loading && hasQuery && filteredResults.length === 0 && (
            <HubEmptyState
              title="No results found"
              description="Try adjusting your search or filters."
              ctaLabel="Open Command Palette"
              onAction={() => openPalette(search)}
            />
          )}

          {!loading && (
            <div className="global-search-command-sections">
              {commandCenterSectionOrder.map((section) => (
                <SearchGroupSection
                  key={section}
                  section={section}
                  items={groupedSections[section]}
                  totalCount={sectionTotals[section] ?? 0}
                  query={debouncedSearch}
                  selectedId={activePreview?.id}
                  collapsed={collapsedSections.has(section)}
                  expanded={expandedSections.has(section)}
                  onToggle={() => toggleSection(section)}
                  onViewAll={() => expandSection(section)}
                  onSelect={openResult}
                />
              ))}
            </div>
          )}

          <section className="va-ops-panel global-search-saved-panel global-search-panel-compact" aria-label="Saved search shortcuts">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Saved Searches</h3>
              <p className="va-ops-section-sub">Operational shortcuts with live counts.</p>
            </div>
            <div className="global-search-saved-grid">
              {savedSearchShortcuts.map((shortcut) => (
                <button
                  key={shortcut.id}
                  type="button"
                  className="global-search-saved-card"
                  onClick={() => applySavedSearch(shortcut.query)}
                >
                  <span className="global-search-saved-label">
                    <AppIcon name="star" size={14} strokeWidth={2} />
                    {shortcut.label}
                  </span>
                  <span className="global-search-saved-count">{shortcut.count}</span>
                  <span className="global-search-saved-hub">{shortcut.hub}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="va-ops-panel global-search-activity-panel global-search-panel-compact" aria-label="Team search activity">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Team Activity</h3>
              <p className="va-ops-section-sub">Live operational feed across hubs.</p>
            </div>
            <ul className="global-search-activity-feed">
              {teamSearchActivityFeed.map((item) => (
                <li key={item.id} className="global-search-activity-item">
                  <UserChip name={item.user} userId={item.userId} />
                  <div className="global-search-activity-copy">
                    <span className="global-search-activity-action">
                      <strong>{item.user}</strong> {item.action}
                    </span>
                    <span className="global-search-activity-module">{item.module}</span>
                  </div>
                  <time className="global-search-activity-time">{item.timestamp}</time>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <SearchPreviewPanel result={activePreview} />
      </div>
    </div>
  );
}
