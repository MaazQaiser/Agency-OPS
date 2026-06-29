"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import type { CommandCenterSection } from "@/data/globalSearchCommandCenter";
import { commandCenterSectionSubtitles } from "@/data/globalSearchCommandCenter";
import type { GlobalSearchResult } from "@/data/globalSearch";
import { cn } from "@/lib/cn";
import { SearchResultRow } from "./SearchResultRow";

type SearchGroupSectionProps = {
  section: CommandCenterSection;
  items: GlobalSearchResult[];
  totalCount: number;
  query: string;
  selectedId?: string;
  collapsed?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  onViewAll?: () => void;
  onSelect: (result: GlobalSearchResult) => void;
};

export function SearchGroupSection({
  section,
  items,
  totalCount,
  query,
  selectedId,
  collapsed = true,
  expanded = false,
  onToggle,
  onViewAll,
  onSelect,
}: SearchGroupSectionProps) {
  if (totalCount === 0) return null;

  const showViewAll = !expanded && totalCount > items.length;

  return (
    <section className="global-search-command-section" aria-label={section}>
      <button
        type="button"
        className="global-search-command-section-header"
        onClick={onToggle}
        aria-expanded={!collapsed}
      >
        <div>
          <h3 className="global-search-command-section-title">{section}</h3>
          <p className="global-search-command-section-sub">{commandCenterSectionSubtitles[section]}</p>
        </div>
        <div className="global-search-command-section-meta">
          <span className="global-search-command-section-count">{totalCount}</span>
          <AppIcon
            name="chevron-down"
            size={16}
            strokeWidth={2.25}
            className={cn("global-search-group-chevron", collapsed && "collapsed")}
          />
        </div>
      </button>

      {!collapsed && (
        <div className="global-search-result-list">
          {items.map((result) => (
            <SearchResultRow
              key={result.id}
              result={result}
              query={query}
              selected={selectedId === result.id}
              onSelect={onSelect}
            />
          ))}
          {showViewAll && onViewAll ? (
            <button type="button" className="global-search-view-all-btn" onClick={onViewAll}>
              View all ({totalCount})
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
}
