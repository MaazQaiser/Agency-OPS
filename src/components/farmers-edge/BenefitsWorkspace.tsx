"use client";

import { useId, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type {
  BenefitsRow,
  CrossSellRow,
  GapsRow,
  ScriptRow,
} from "@/data/farmersEdge";
import { contentTypeColors, contentTypeLabels } from "@/data/farmersEdge";

type BenefitsWorkspaceProps = {
  benefits: BenefitsRow[];
  gaps: GapsRow[];
  scripts: ScriptRow[];
  xsell: CrossSellRow[];
  verticalLabel: string;
  searchQuery: string;
  highlight: (text: string, query: string) => React.ReactNode;
  matchesQuery: (text: string, query: string) => boolean;
};

const PRIMARY_COUNT = 3;

/** Presentation-only tags for scan hierarchy — does not alter source strings. */
function benefitPriorityLabel(index: number, total: number): string {
  if (index === 0) return "Lead with this";
  if (index < PRIMARY_COUNT) return "High priority";
  if (index >= total - 1 && total > PRIMARY_COUNT) return "Mention if asked";
  return "Support";
}

function valueCueForBenefit(item: string, gaps: GapsRow[]): string | null {
  const tokens = item
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 4)
    .slice(0, 4);
  if (tokens.length === 0) return null;
  const match = gaps.find((g) => {
    const lower = g.item.toLowerCase();
    return tokens.some((t) => lower.includes(t));
  });
  return match?.item ?? null;
}

export function BenefitsWorkspace({
  benefits,
  gaps,
  scripts,
  xsell,
  verticalLabel,
  searchQuery,
  highlight,
  matchesQuery,
}: BenefitsWorkspaceProps) {
  const q = searchQuery;
  const panelId = useId();
  const [supportingOpen, setSupportingOpen] = useState(true);
  const [talkTracksOpen, setTalkTracksOpen] = useState(true);
  const [xsellOpen, setXsellOpen] = useState(false);

  const filteredBenefits = useMemo(
    () => benefits.filter((r) => matchesQuery(r.item, q)),
    [benefits, matchesQuery, q],
  );

  const filteredGaps = useMemo(
    () => gaps.filter((r) => matchesQuery(r.item, q)),
    [gaps, matchesQuery, q],
  );

  const filteredScripts = useMemo(
    () => scripts.filter((r) => matchesQuery(r.cue, q) || matchesQuery(r.line, q)),
    [scripts, matchesQuery, q],
  );

  const filteredXsell = useMemo(
    () =>
      xsell.filter(
        (r) => matchesQuery(r.trigger, q) || matchesQuery(r.action, q),
      ),
    [xsell, matchesQuery, q],
  );

  const primary = filteredBenefits.slice(0, PRIMARY_COUNT);
  const supporting = filteredBenefits.slice(PRIMARY_COUNT);

  if (benefits.length === 0) {
    return (
      <div className="fe-c-card fe-c-card--benefits fe-benefits-workspace" style={{ "--fe-card-color": contentTypeColors.benefits } as React.CSSProperties}>
        <div className="fe-c-type-label">{contentTypeLabels.benefits}</div>
        <h3 className="fe-c-card-title">What Farmers Includes</h3>
        <p className="fe-card-empty">Eva adds Farmers Benefits content for this vertical in Sheets.</p>
      </div>
    );
  }

  if (filteredBenefits.length === 0 && q.trim()) {
    return (
      <div className="fe-c-card fe-c-card--benefits fe-benefits-workspace" style={{ "--fe-card-color": contentTypeColors.benefits } as React.CSSProperties}>
        <div className="fe-c-type-label">{contentTypeLabels.benefits}</div>
        <h3 className="fe-c-card-title">What Farmers Includes</h3>
        <p className="fe-card-empty">No benefits match “{q.trim()}”. Try a broader search.</p>
      </div>
    );
  }

  return (
    <div className="fe-benefits-workspace" aria-label="Farmers benefits knowledge workspace">
      {/* Scan summary */}
      <section
        className="fe-c-card fe-c-card--benefits fe-benefits-hero"
        style={{ "--fe-card-color": contentTypeColors.benefits } as React.CSSProperties}
      >
        <div className="fe-c-type-label">{contentTypeLabels.benefits}</div>
        <div className="fe-benefits-hero-top">
          <div>
            <h3 className="fe-c-card-title fe-benefits-hero-title">What Farmers Includes</h3>
            <p className="fe-benefits-hero-sub">
              Scan primary wins for {verticalLabel}, then expand supporting coverage and talk tracks when you need depth.
            </p>
          </div>
          <div className="fe-benefits-stat-row" aria-label="Benefits workspace summary">
            <div className="fe-benefits-stat">
              <span className="fe-benefits-stat-value">{filteredBenefits.length}</span>
              <span className="fe-benefits-stat-label">Benefits</span>
            </div>
            <div className="fe-benefits-stat">
              <span className="fe-benefits-stat-value">{primary.length}</span>
              <span className="fe-benefits-stat-label">Lead first</span>
            </div>
            <div className="fe-benefits-stat">
              <span className="fe-benefits-stat-value">{filteredScripts.length}</span>
              <span className="fe-benefits-stat-label">Talk tracks</span>
            </div>
          </div>
        </div>
        <div className="fe-benefits-tip" role="note">
          <AppIcon name="zap" size={14} className="fe-benefits-tip-icon" />
          <p>
            Lead with the top cards on the call. Use coverage contrast when price comes up, then close with a talk track.
          </p>
        </div>
      </section>

      {/* Primary benefits */}
      <section className="fe-benefits-section" aria-labelledby={`${panelId}-primary`}>
        <div className="fe-benefits-section-head">
          <h4 id={`${panelId}-primary`} className="fe-benefits-section-title">
            Primary benefits
          </h4>
          <span className="fe-benefits-section-meta">Open with these</span>
        </div>
        <div className="fe-benefits-primary-grid">
          {primary.map((row, i) => {
            const valueCue = valueCueForBenefit(row.item, filteredGaps.length ? filteredGaps : gaps);
            return (
              <article
                key={`primary-${i}`}
                className="fe-benefit-feature-card"
                style={{ "--fe-card-color": contentTypeColors.benefits } as React.CSSProperties}
              >
                <div className="fe-benefit-feature-top">
                  <span className="fe-benefit-rank" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="fe-benefit-priority">{benefitPriorityLabel(i, filteredBenefits.length)}</span>
                </div>
                <h5 className="fe-benefit-feature-title">{highlight(row.item, q)}</h5>
                {valueCue ? (
                  <p className="fe-benefit-value">
                    <span className="fe-benefit-value-label">Why it matters</span>
                    {highlight(valueCue, q)}
                  </p>
                ) : (
                  <p className="fe-benefit-value fe-benefit-value--muted">
                    <span className="fe-benefit-value-label">Customer value</span>
                    Surface this as included standard so the prospect sees what other markets often charge for.
                  </p>
                )}
                <div className="fe-benefit-quick">
                  <AppIcon name="message-square" size={12} />
                  <span>Communicate in under 15 seconds on the call</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Supporting benefits */}
      {supporting.length > 0 && (
        <section className="fe-benefits-section" aria-labelledby={`${panelId}-supporting`}>
          <button
            type="button"
            className="fe-benefits-disclosure"
            aria-expanded={supportingOpen}
            aria-controls={`${panelId}-supporting-panel`}
            id={`${panelId}-supporting`}
            onClick={() => setSupportingOpen((v) => !v)}
          >
            <span className="fe-benefits-disclosure-left">
              <AppIcon name="shield" size={14} />
              <span className="fe-benefits-section-title">Supporting benefits</span>
              <span className="fe-benefits-count">{supporting.length}</span>
            </span>
            <span className="fe-benefits-disclosure-hint">
              {supportingOpen ? "Hide" : "Show"} · deepen the quote review
            </span>
          </button>
          {supportingOpen && (
            <ul id={`${panelId}-supporting-panel`} className="fe-benefits-support-list">
              {supporting.map((row, i) => {
                const absIndex = i + PRIMARY_COUNT;
                return (
                  <li key={`support-${i}`} className="fe-benefits-support-item">
                    <div className="fe-benefits-support-main">
                      <span className="fe-benefits-support-bullet" aria-hidden="true" />
                      <span className="fe-benefits-support-text">{highlight(row.item, q)}</span>
                    </div>
                    <span className="fe-benefit-priority fe-benefit-priority--quiet">
                      {benefitPriorityLabel(absIndex, filteredBenefits.length)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* Coverage + value + talk tracks */}
      <div className="fe-benefits-split">
        <section
          className="fe-c-card fe-benefits-panel fe-benefits-panel--contrast"
          style={{ "--fe-card-color": contentTypeColors.gaps } as React.CSSProperties}
          aria-labelledby={`${panelId}-coverage`}
        >
          <div className="fe-c-type-label">{contentTypeLabels.gaps}</div>
          <h4 id={`${panelId}-coverage`} className="fe-benefits-panel-title">
            Coverage highlights
          </h4>
          <p className="fe-benefits-panel-sub">Where Farmers pulls ahead · use when price is challenged</p>
          {filteredGaps.length === 0 ? (
            <p className="fe-card-empty">No coverage contrast for this filter.</p>
          ) : (
            <ul className="fe-benefits-contrast-list">
              {filteredGaps.map((row, i) => (
                <li key={`gap-${i}`}>
                  <AppIcon name="triangle-alert" size={13} className="fe-benefits-contrast-icon" />
                  <span>{highlight(row.item, q)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          className="fe-c-card fe-benefits-panel fe-benefits-panel--talk"
          style={{ "--fe-card-color": contentTypeColors.scripts } as React.CSSProperties}
          aria-labelledby={`${panelId}-talk`}
        >
          <button
            type="button"
            className="fe-benefits-panel-toggle"
            aria-expanded={talkTracksOpen}
            aria-controls={`${panelId}-talk-panel`}
            id={`${panelId}-talk`}
            onClick={() => setTalkTracksOpen((v) => !v)}
          >
            <div>
              <div className="fe-c-type-label">{contentTypeLabels.scripts}</div>
              <h4 className="fe-benefits-panel-title">Quick talking points</h4>
              <p className="fe-benefits-panel-sub">Ready-to-say lines for this vertical</p>
            </div>
            <span className="fe-benefits-panel-toggle-meta">{talkTracksOpen ? "Collapse" : "Expand"}</span>
          </button>
          {talkTracksOpen && (
            <div id={`${panelId}-talk-panel`}>
              {filteredScripts.length === 0 ? (
                <p className="fe-card-empty">No talk tracks for this filter.</p>
              ) : (
                <ol className="fe-benefits-talk-list">
                  {filteredScripts.map((row, i) => (
                    <li key={`script-${i}`}>
                      <span className="fe-benefits-talk-cue">{row.cue}</span>
                      <p className="fe-benefits-talk-line">{highlight(row.line, q)}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Cross-sell */}
      {filteredXsell.length > 0 && (
        <section
          className="fe-c-card fe-benefits-panel fe-benefits-panel--xsell"
          style={{ "--fe-card-color": contentTypeColors.xsell } as React.CSSProperties}
          aria-labelledby={`${panelId}-xsell`}
        >
          <button
            type="button"
            className="fe-benefits-panel-toggle"
            aria-expanded={xsellOpen}
            aria-controls={`${panelId}-xsell-panel`}
            id={`${panelId}-xsell`}
            onClick={() => setXsellOpen((v) => !v)}
          >
            <div>
              <div className="fe-c-type-label">{contentTypeLabels.xsell}</div>
              <h4 className="fe-benefits-panel-title">Cross-sell opportunities</h4>
              <p className="fe-benefits-panel-sub">After the benefit lands · what else to surface</p>
            </div>
            <span className="fe-benefits-count">{filteredXsell.length}</span>
          </button>
          {xsellOpen && (
            <ul id={`${panelId}-xsell-panel`} className="fe-benefits-xsell-grid">
              {filteredXsell.map((row, i) => (
                <li key={`xsell-${i}`} className="fe-benefits-xsell-card">
                  <strong className="fe-benefits-xsell-trigger">{highlight(row.trigger, q)}</strong>
                  <span className="fe-benefits-xsell-action">{highlight(row.action, q)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
