"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  buildHelpSearchIndex,
  getHubHelpContent,
  helpSourceLabels,
  searchHelpEntries,
  type HubHelpId,
} from "@/data/contextualHelp";
import { cn } from "@/lib/cn";

type ContextualHelpDrawerProps = {
  hubId: HubHelpId | null;
  onClose: () => void;
};

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="help-drawer-highlight">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function ContextualHelpDrawer({ hubId, onClose }: ContextualHelpDrawerProps) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const content = hubId ? getHubHelpContent(hubId) : null;

  const searchIndex = useMemo(
    () => (content ? buildHelpSearchIndex(content) : []),
    [content],
  );

  const searchResults = useMemo(
    () => searchHelpEntries(searchIndex, query),
    [searchIndex, query],
  );

  useEffect(() => {
    if (!hubId) {
      setMounted(false);
      setQuery("");
      return undefined;
    }

    const frame = requestAnimationFrame(() => setMounted(true));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [hubId, onClose]);

  const jumpToSection = (sectionId: string) => {
    const el = bodyRef.current?.querySelector(`#${sectionId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!hubId || !content) return null;

  return (
    <div className={cn("help-drawer-root", mounted && "help-drawer-root--visible")} role="presentation">
      <button
        type="button"
        className="help-drawer-backdrop"
        aria-label="Close help drawer"
        onClick={onClose}
      />
      <aside
        className={cn(
          "help-drawer",
          `help-drawer--${content.hubAccent}`,
          mounted && "help-drawer--visible",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={`${content.title} help`}
      >
        <header className="help-drawer-header">
          <div className="help-drawer-header-icon">
            <AppIcon name={content.icon} size={20} strokeWidth={2} />
          </div>
          <div className="help-drawer-header-text">
            <h2 className="help-drawer-title">{content.title}</h2>
            <p className="help-drawer-header-meta">Contextual help</p>
          </div>
          <button type="button" className="help-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>

        <div className="help-drawer-search-wrap">
          <AppIcon name="search" size={16} strokeWidth={2} className="help-drawer-search-icon" />
          <input
            type="search"
            className="help-drawer-search"
            placeholder="Search help… e.g. folio, E&O, approval"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search help content"
          />
          {query && (
            <button
              type="button"
              className="help-drawer-search-clear"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <AppIcon name="close" size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {searchResults.length > 0 && query.trim() && (
          <ul className="help-drawer-search-hits" aria-label="Search results">
            {searchResults.slice(0, 5).map((hit) => (
              <li key={hit.id}>
                <button
                  type="button"
                  className="help-drawer-search-hit"
                  onClick={() => {
                    setQuery("");
                    jumpToSection(hit.sectionId);
                  }}
                >
                  <span className="help-drawer-search-hit-label">{hit.label}</span>
                  <span className="help-drawer-search-hit-text">{hit.text}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="help-drawer-body" ref={bodyRef}>
          <section id="help-summary" className="help-drawer-card">
            <h3 className="help-drawer-card-title">What this hub does</h3>
            <p className="help-drawer-card-body">{highlightText(content.summary, query)}</p>
          </section>

          <section id="help-sources" className="help-drawer-card">
            <h3 className="help-drawer-card-title">What data is shown here</h3>
            <div className="help-drawer-sources">
              {content.dataSources.map((source) => (
                <span
                  key={source.label}
                  className={cn("help-source-badge", `help-source-badge--${source.type}`)}
                >
                  <span className="help-source-badge-type">{helpSourceLabels[source.type]}</span>
                  {source.label}
                </span>
              ))}
            </div>
          </section>

          <section id="help-how-to" className="help-drawer-card">
            <h3 className="help-drawer-card-title">How to use it</h3>
            <ul className="help-drawer-list">
              {content.howToUse.map((item) => (
                <li key={item}>{highlightText(item, query)}</li>
              ))}
            </ul>
          </section>

          <section id="help-metrics" className="help-drawer-card">
            <h3 className="help-drawer-card-title">Key metrics explained</h3>
            <dl className="help-drawer-metrics">
              {content.metrics.map((metric) => (
                <div key={metric.id} id={`help-metric-${metric.id}`} className="help-drawer-metric">
                  <dt>{highlightText(metric.term, query)}</dt>
                  <dd>{highlightText(metric.definition, query)}</dd>
                </div>
              ))}
            </dl>
          </section>

          {content.extraSections?.map((section) => (
            <section
              key={section.id}
              id={`help-extra-${section.id}`}
              className="help-drawer-card"
            >
              <h3 className="help-drawer-card-title">{section.title}</h3>
              <ul className="help-drawer-list">
                {section.items.map((item) => (
                  <li key={item}>{highlightText(item, query)}</li>
                ))}
              </ul>
            </section>
          ))}

          <section id="help-actions" className="help-drawer-card">
            <h3 className="help-drawer-card-title">Quick actions</h3>
            <ul className="help-drawer-actions">
              {content.quickActions.map((action) => (
                <li key={action}>
                  <span className="help-drawer-action-chip">{action}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}
