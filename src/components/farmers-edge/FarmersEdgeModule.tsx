"use client";

import { useCallback, useState } from "react";
import { farmersEdgeViews, type ViewId } from "@/data/farmersEdge";
import { useFarmersEdgeData } from "@/hooks/useFarmersEdgeData";
import { FarmersEdgePageHeader } from "./FarmersEdgePageHeader";
import { VerticalChipSelector } from "./VerticalChipSelector";
import { ContentCardGrid } from "./ContentCardGrid";

export function FarmersEdgeModule() {
  const [activeVertical, setActiveVertical] = useState("all");
  const [activeView, setActiveView] = useState<ViewId>("playbook");
  const [searchQuery, setSearchQuery] = useState("");

  const { verticals, content, contentLoading } = useFarmersEdgeData(activeVertical);

  const handleVerticalSelect = useCallback((id: string) => {
    setActiveVertical(id);
  }, []);

  const selectedMeta = verticals.find((v) => v.id === activeVertical);

  return (
    <>
      <FarmersEdgePageHeader />

      {/* ── Hero: Vertical Chip Selector (primary navigation) — Tab 12 driven ── */}
      <VerticalChipSelector
        activeVertical={activeVertical}
        onSelect={handleVerticalSelect}
        verticals={verticals}
      />

      {/* ── Search bar ── */}
      <div className="fe-hub-search">
        <div className="fe-search-inner">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="fe-search-icon">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="fe-search-input"
            placeholder="Search across all content for this vertical…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Farmers Edge content"
          />
          {searchQuery && (
            <button
              type="button"
              className="fe-search-clear"
              aria-label="Clear search"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="fe-content-area va-ops-tab-content">
        {/* View selector tabs — secondary nav, lower visual weight than vertical chips */}
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

        {/* Vertical heading */}
        <div className="fe-vertical-heading">
          <h2 className="fe-vertical-name">{selectedMeta?.label ?? "All Verticals"}</h2>
          <span className="fe-vertical-sub">{selectedMeta?.sub ?? "Showing all commercial intelligence"}</span>
        </div>

        {/* Color-coded content card grid — live Sheets content when available */}
        <ContentCardGrid
          activeVertical={activeVertical}
          activeView={activeView}
          searchQuery={searchQuery}
          verticals={verticals}
          liveContent={content}
          loading={contentLoading}
        />
      </div>
    </>
  );
}
