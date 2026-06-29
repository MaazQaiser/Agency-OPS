"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import type { GlobalSearchResult } from "@/data/globalSearch";
import { getResultPriority } from "@/data/globalSearchCommandCenter";
import { cn } from "@/lib/cn";

type HighlightTextProps = { text: string; query: string };

function HighlightText({ text, query }: HighlightTextProps) {
  if (!query.trim()) return <>{text}</>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="global-search-highlight">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes("overdue") || s.includes("failed") || s.includes("missing") || s.includes("critical")) {
    return "badge-red";
  }
  if (s.includes("pending") || s.includes("quoted") || s.includes("warning")) return "badge-yellow";
  if (s.includes("bound") || s.includes("active") || s.includes("open")) return "badge-green";
  return "badge-blue";
}

function priorityBadgeClass(priority: string) {
  const p = priority.toLowerCase();
  if (p.includes("high") || p.includes("critical")) return "badge-red";
  if (p.includes("medium")) return "badge-yellow";
  return "badge-gray";
}

type SearchResultCardProps = {
  result: GlobalSearchResult;
  query: string;
  selected?: boolean;
  onSelect: (result: GlobalSearchResult) => void;
};

export function SearchResultCard({ result, query, selected, onSelect }: SearchResultCardProps) {
  const priority = getResultPriority(result);
  const policyCount = result.policyCount ?? result.fields.find((f) => f.label === "Policy Count")?.value;
  const riskState = result.riskState ?? result.fields.find((f) => f.label === "E&O Risk")?.value;

  return (
    <article
      className={cn("global-search-command-card", selected && "is-selected")}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(result)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(result);
        }
      }}
    >
      <header className="global-search-command-card-header">
        <div>
          <h4 className="global-search-command-card-title">
            <HighlightText text={result.title} query={query} />
          </h4>
          <p className="global-search-command-card-source">{result.hub}</p>
        </div>
        <span className={cn("badge", priorityBadgeClass(priority))}>{priority.toLowerCase()}</span>
      </header>

      <div className="global-search-command-card-meta">
        <span className={cn("badge", statusBadgeClass(result.status))}>{result.status.toLowerCase()}</span>
        {result.owner && <span className="global-search-command-card-owner">{result.owner}</span>}
        <span className="global-search-command-card-time">{result.lastUpdated}</span>
      </div>

      <dl className="global-search-command-card-fields">
        {policyCount && (
          <div>
            <dt>Policies</dt>
            <dd>{policyCount}</dd>
          </div>
        )}
        {riskState && (
          <div>
            <dt>Risk</dt>
            <dd>{riskState}</dd>
          </div>
        )}
        {result.fields.slice(0, 2).map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>

      <footer className="global-search-command-card-footer">
        <span className="global-search-command-card-type">{result.group}</span>
        <AppIcon name="chevron-down" size={14} strokeWidth={2.25} className="global-search-command-card-chevron" />
      </footer>
    </article>
  );
}
