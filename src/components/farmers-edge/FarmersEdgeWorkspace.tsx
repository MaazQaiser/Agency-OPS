"use client";

import { useCallback, useState } from "react";
import { farmersEdgeViews, type ViewId } from "@/data/farmersEdge";
import { useFarmersEdgeData } from "@/hooks/useFarmersEdgeData";
import { VerticalChipSelector } from "./VerticalChipSelector";
import { ContentCardGrid } from "./ContentCardGrid";

type FarmersEdgeWorkspaceProps = {
  initialVertical?: string;
  initialView?: ViewId;
  compact?: boolean;
  vertical?: string;
  onVerticalChange?: (verticalId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showToolbar?: boolean;
};

export function FarmersEdgeWorkspace({
  initialVertical = "all",
  initialView = "playbook",
  compact = false,
  vertical: controlledVertical,
  onVerticalChange,
  searchQuery: controlledSearch,
  onSearchChange,
  showToolbar = true,
}: FarmersEdgeWorkspaceProps) {
  const [internalVertical, setInternalVertical] = useState(initialVertical);
  const [activeView, setActiveView] = useState<ViewId>(initialView);
  const [internalSearch, setInternalSearch] = useState("");

  const activeVertical = controlledVertical ?? internalVertical;
  const searchQuery = controlledSearch ?? internalSearch;

  const handleVerticalSelect = useCallback(
    (id: string) => {
      if (onVerticalChange) onVerticalChange(id);
      else setInternalVertical(id);
    },
    [onVerticalChange],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      if (onSearchChange) onSearchChange(query);
      else setInternalSearch(query);
    },
    [onSearchChange],
  );

  const { verticals, content, contentLoading } = useFarmersEdgeData(activeVertical);

  const selectedMeta = verticals.find((v) => v.id === activeVertical);

  return (
    <div className={`fe-content-area va-ops-tab-content${compact ? " fe-content-area--embedded" : ""}`}>
      {showToolbar && (
        <div className={`fe-intel-toolbar${compact ? " fe-intel-toolbar--compact" : ""}`}>
          <VerticalChipSelector
            activeVertical={activeVertical}
            onSelect={handleVerticalSelect}
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
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="fe-search-clear"
                aria-label="Clear search"
                onClick={() => handleSearchChange("")}
              >
                ×
              </button>
            )}
          </label>
        </div>
      )}

      <nav className="fe-view-tabs" aria-label="Content view">
        {farmersEdgeViews.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`fe-view-tab${activeView === v.id ? " active" : ""}`}
            onClick={() => setActiveView(v.id)}
            aria-pressed={activeView === v.id}
          >
            {v.label}
          </button>
        ))}
      </nav>

      <div className="fe-vertical-heading">
        <h2 className="fe-vertical-name">{selectedMeta?.label ?? "All Verticals"}</h2>
        <span className="fe-vertical-sub">{selectedMeta?.sub ?? "Showing all commercial intelligence"}</span>
      </div>

      <ContentCardGrid
        activeVertical={activeVertical}
        activeView={activeView}
        searchQuery={searchQuery}
        verticals={verticals}
        liveContent={content}
        loading={contentLoading}
      />
    </div>
  );
}
