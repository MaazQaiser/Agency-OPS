"use client";

import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { farmersEdgeHeader } from "@/data/farmersEdge";
import type { VerticalMeta } from "@/hooks/useFarmersEdgeData";
import { VerticalChipSelector } from "./VerticalChipSelector";

type FarmersEdgePageHeaderProps = {
  activeVertical: string;
  onVerticalSelect: (verticalId: string) => void;
  verticals: VerticalMeta[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function FarmersEdgePageHeader({
  activeVertical,
  onVerticalSelect,
  verticals,
  searchQuery,
  onSearchChange,
}: FarmersEdgePageHeaderProps) {
  return (
    <header className="va-ops-page-header fe-page-header">
      <div className="va-ops-page-header-left">
        <div className="fe-hub-identity">
          <div className="va-ops-page-title-block">
            <h1 className="va-ops-page-title">{farmersEdgeHeader.title}</h1>
            <p className="va-ops-page-subtitle">{farmersEdgeHeader.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar fe-page-header-toolbar">
        <VerticalChipSelector
          activeVertical={activeVertical}
          onSelect={onVerticalSelect}
          verticals={verticals}
        />
        <label className="va-ops-search fe-header-search" aria-label="Search Farmers Edge content">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="fe-search-icon">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="va-ops-search-input fe-search-input"
            placeholder="Search across all content for this vertical…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="fe-search-clear"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
            >
              ×
            </button>
          )}
        </label>
        <HubHelpTrigger hubId="farmers-edge" />
      </div>
    </header>
  );
}
