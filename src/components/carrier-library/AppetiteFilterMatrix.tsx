"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  appetiteCellClass,
  appetiteLabel,
  appetiteMatrixCarriers,
  appetiteMatrixVerticals,
  type AppetiteLevel,
} from "@/data/appetiteMatrix";

/**
 * Carrier Library Signature Element — Appetite Filter Matrix
 * Rows = carriers, columns = verticals.
 * Filter by vertical collapses to a single column view.
 */
export function AppetiteFilterMatrix() {
  const [activeVertical, setActiveVertical] = useState<string>("all");
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const shownVerticals =
    activeVertical === "all" ? [...appetiteMatrixVerticals] : [activeVertical];

  return (
    <div className="appetite-matrix appetite-matrix--refined">
      <div className="appetite-matrix-header">
        <div className="appetite-matrix-title">Appetite Filter Matrix</div>
        <div className="appetite-matrix-filters">
          <button
            type="button"
            className={cn("appetite-filter-btn", activeVertical === "all" && "active")}
            onClick={() => setActiveVertical("all")}
          >
            All Verticals
          </button>
          {appetiteMatrixVerticals.map((v) => (
            <button
              key={v}
              type="button"
              className={cn("appetite-filter-btn", activeVertical === v && "active")}
              onClick={() => setActiveVertical(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="appetite-matrix-scroll">
        <table className="appetite-matrix-table" aria-label="Carrier appetite by vertical">
          <thead>
            <tr>
              <th scope="col" className="appetite-matrix-carrier-col">
                Carrier
              </th>
              {shownVerticals.map((v) => (
                <th
                  scope="col"
                  key={v}
                  className={cn(
                    "appetite-matrix-vertical-col",
                    activeVertical === v && "appetite-matrix-vertical-col--active",
                  )}
                >
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appetiteMatrixCarriers.map((carrier) => (
              <tr key={carrier.id}>
                <td className="appetite-matrix-carrier-name">{carrier.name}</td>
                {shownVerticals.map((v) => {
                  const level: AppetiteLevel = carrier.appetite[v] ?? "unknown";
                  const cellKey = `${carrier.id}-${v}`;
                  const isRecent = carrier.recentlyUpdated?.includes(v);
                  const reasoning = carrier.reasoning[v] ?? "No appetite reasoning on file.";
                  const isHovered = hoveredCell === cellKey;

                  return (
                    <td
                      key={v}
                      className={cn(
                        "appetite-cell",
                        appetiteCellClass[level],
                        isRecent && "appetite-cell--recent",
                        activeVertical === v && "appetite-cell--column-focus",
                      )}
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className="appetite-cell-label">{appetiteLabel[level]}</span>
                      {isRecent ? (
                        <span className="appetite-cell-recent-dot" aria-label="Recently updated" />
                      ) : null}
                      {isHovered ? (
                        <div className="appetite-cell-tooltip" role="tooltip">
                          <strong>{carrier.name} · {v}</strong>
                          <p>{reasoning}</p>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="appetite-legend">
        {(Object.entries(appetiteLabel) as [AppetiteLevel, string][]).map(([level, label]) => (
          <div key={level} className="appetite-legend-item">
            <span
              className={cn("appetite-legend-swatch", `appetite-cell--${level}`)}
              aria-hidden="true"
            />
            <span className="appetite-legend-label">{label}</span>
          </div>
        ))}
        <div className="appetite-legend-item appetite-legend-item--recent">
          <span className="appetite-legend-recent-dot" aria-hidden="true" />
          <span className="appetite-legend-label">Recently updated</span>
        </div>
      </div>
    </div>
  );
}
