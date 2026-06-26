"use client";

import { useCallback, useState } from "react";
import { farmersEdgeViews, type ViewId } from "@/data/farmersEdge";
import { useFarmersEdgeData } from "@/hooks/useFarmersEdgeData";
import { FarmersEdgePageHeader } from "./FarmersEdgePageHeader";
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
      <FarmersEdgePageHeader
        activeVertical={activeVertical}
        onVerticalSelect={handleVerticalSelect}
        verticals={verticals}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="fe-content-area va-ops-tab-content">
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
    </>
  );
}
