"use client";

import { useDebouncedValue } from "@/lib/useDebouncedValue";
import {
  verticalContent,
  contentTypeLabels,
  contentTypeColors,
  type ViewId,
  type VerticalContent,
} from "@/data/farmersEdge";
import type { VerticalMeta } from "@/hooks/useFarmersEdgeData";
import { BenefitsWorkspace } from "./BenefitsWorkspace";
import { EquipmentIntelTable } from "./EquipmentIntelTable";
import { OurEdgeTable } from "./OurEdgeTable";

type ContentCardGridProps = {
  activeVertical: string;
  activeView: ViewId;
  searchQuery: string;
  verticals?: VerticalMeta[];
  liveContent?: VerticalContent | null;
  loading?: boolean;
};

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="fe-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function matchesQuery(text: string, query: string) {
  return !query.trim() || text.toLowerCase().includes(query.toLowerCase());
}

function CardEmpty({ type }: { type: string }) {
  return (
    <p className="fe-card-empty">
      Eva adds {type} content for this vertical in Sheets.
    </p>
  );
}

type ContentCardProps = {
  typeKey: string;
  colorVar: string;
  label: string;
  full?: boolean;
  children: React.ReactNode;
};

function ContentCard({ typeKey, colorVar, label, full, children }: ContentCardProps) {
  return (
    <div
      className={`fe-c-card fe-c-card--${typeKey}${full ? " fe-c-card--full" : ""}`}
      style={{ "--fe-card-color": colorVar } as React.CSSProperties}
    >
      <div className="fe-c-type-label">{label}</div>
      {children}
    </div>
  );
}

export function ContentCardGrid({ activeVertical, activeView, searchQuery, verticals = [], liveContent, loading }: ContentCardGridProps) {
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const content = liveContent ?? verticalContent[activeVertical] ?? verticalContent.all;
  const verticalMeta = verticals.find((v) => v.id === activeVertical);
  const verticalLabel = verticalMeta?.label ?? "All Verticals";

  if (loading) {
    return (
      <div className="fe-content-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="fe-c-card">
            <div className="ops-skeleton-shimmer" style={{ height: 10, borderRadius: 4, marginBottom: 8, width: "60%" }} />
            <div className="ops-skeleton-shimmer" style={{ height: 16, borderRadius: 4, marginBottom: 12, width: "80%" }} />
            <div className="ops-skeleton-shimmer" style={{ height: 100, borderRadius: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  const showAll = activeView === "playbook";
  const showBenefits = activeView === "benefits" || showAll;
  const showScripts = activeView === "scripts" || showAll;
  const showEdge = activeView === "edge" || showAll;
  const showGaps = showAll;
  const showEquip = showAll;
  const showObj = showAll;
  const showXsell = showAll;

  const q = debouncedQuery;

  if (activeView === "benefits") {
    return (
      <BenefitsWorkspace
        benefits={content.benefits}
        gaps={content.gaps}
        scripts={content.scripts}
        xsell={content.xsell}
        verticalLabel={verticalLabel}
        searchQuery={q}
        highlight={highlight}
        matchesQuery={matchesQuery}
      />
    );
  }

  return (
    <div className={`fe-content-grid${activeView !== "playbook" ? " fe-content-grid--focused" : ""}`}>

      {showBenefits && (
        <ContentCard typeKey="benefits" colorVar={contentTypeColors.benefits} label={contentTypeLabels.benefits}>
          <h3 className="fe-c-card-title">What Farmers Includes</h3>
          <div className="fe-c-card-body">
            {content.benefits.length === 0 ? (
              <CardEmpty type="Farmers Benefits" />
            ) : (
              <ul>
                {content.benefits
                  .filter((r) => matchesQuery(r.item, q))
                  .map((r, i) => (
                    <li key={i}>{highlight(r.item, q)}</li>
                  ))}
              </ul>
            )}
          </div>
        </ContentCard>
      )}

      {showGaps && (
        <ContentCard typeKey="gaps" colorVar={contentTypeColors.gaps} label={contentTypeLabels.gaps}>
          <h3 className="fe-c-card-title">What Competitors Miss</h3>
          <div className="fe-c-card-body">
            {content.gaps.length === 0 ? (
              <CardEmpty type="Coverage Gaps" />
            ) : (
              <ul>
                {content.gaps
                  .filter((r) => matchesQuery(r.item, q))
                  .map((r, i) => (
                    <li key={i}>{highlight(r.item, q)}</li>
                  ))}
              </ul>
            )}
          </div>
        </ContentCard>
      )}

      {showEquip && (
        <ContentCard typeKey="equip" colorVar={contentTypeColors.equip} label={contentTypeLabels.equip}>
          <h3 className="fe-c-card-title">Equipment Risks by Vertical</h3>
          <div className="fe-c-card-body fe-c-card-body--table">
            <EquipmentIntelTable
              rows={content.equip.filter(
                (r) => matchesQuery(r.equipment, q) || matchesQuery(r.exposure, q) || matchesQuery(r.itaRec, q),
              )}
              verticalLabel={verticalLabel}
            />
          </div>
        </ContentCard>
      )}

      {showObj && (
        <ContentCard typeKey="objections" colorVar={contentTypeColors.objections} label={contentTypeLabels.objections}>
          <h3 className="fe-c-card-title">When They Push Back</h3>
          <div className="fe-c-card-body">
            {content.objections.length === 0 ? (
              <CardEmpty type="Objection Reframes" />
            ) : (
              <ul className="fe-objection-list">
                {content.objections
                  .filter((r) => matchesQuery(r.objection, q) || matchesQuery(r.reframe, q))
                  .map((r, i) => (
                    <li key={i}>
                      <strong className="fe-obj-q">{highlight(r.objection, q)}</strong>
                      <span className="fe-obj-a">{highlight(r.reframe, q)}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </ContentCard>
      )}

      {showScripts && (
        <ContentCard typeKey="scripts" colorVar={contentTypeColors.scripts} label={contentTypeLabels.scripts}>
          <h3 className="fe-c-card-title">What to Say on the Call</h3>
          <div className="fe-c-card-body">
            {content.scripts.length === 0 ? (
              <CardEmpty type="Script Lines" />
            ) : (
              <ul className="fe-script-list">
                {content.scripts
                  .filter((r) => matchesQuery(r.cue, q) || matchesQuery(r.line, q))
                  .map((r, i) => (
                    <li key={i}>
                      <strong className="fe-script-cue">{r.cue}:</strong>
                      <span className="fe-script-line">{highlight(r.line, q)}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </ContentCard>
      )}

      {showXsell && (
        <ContentCard typeKey="xsell" colorVar={contentTypeColors.xsell} label={contentTypeLabels.xsell}>
          <h3 className="fe-c-card-title">What Else to Surface</h3>
          <div className="fe-c-card-body">
            {content.xsell.length === 0 ? (
              <CardEmpty type="Cross-Sell" />
            ) : (
              <ul>
                {content.xsell
                  .filter((r) => matchesQuery(r.trigger, q) || matchesQuery(r.action, q))
                  .map((r, i) => (
                    <li key={i}>
                      <strong className="fe-xsell-trigger">{highlight(r.trigger, q)}:</strong>{" "}
                      {highlight(r.action, q)}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </ContentCard>
      )}

      {showEdge && (
        <ContentCard typeKey="edge" colorVar={contentTypeColors.edge} label={contentTypeLabels.edge} full>
          <h3 className="fe-c-card-title">Side-by-Side Comparison</h3>
          <div className="fe-c-card-body fe-c-card-body--table">
            <OurEdgeTable
              rows={content.edge.filter(
                (r) =>
                  matchesQuery(r.feature, q) ||
                  matchesQuery(r.itaFarmers, q) ||
                  matchesQuery(r.standard, q) ||
                  matchesQuery(r.competitors, q),
              )}
            />
          </div>
        </ContentCard>
      )}
    </div>
  );
}
