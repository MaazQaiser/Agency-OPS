"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type AppetiteLevel = "writes" | "conditional" | "no" | "unknown";

type CarrierRow = {
  id: string;
  name: string;
  appetite: Record<string, AppetiteLevel>;
};

const verticals = ["Contractors", "Landscapers", "Restaurants", "Cleaning", "Trucking", "Beauty", "Auto Repair"];

const carriers: CarrierRow[] = [
  { id: "c1", name: "Farmers", appetite: { Contractors: "writes", Landscapers: "writes", Restaurants: "writes", Cleaning: "writes", Trucking: "conditional", Beauty: "writes", "Auto Repair": "conditional" } },
  { id: "c2", name: "Employers", appetite: { Contractors: "writes", Landscapers: "writes", Restaurants: "conditional", Cleaning: "writes", Trucking: "no", Beauty: "writes", "Auto Repair": "writes" } },
  { id: "c3", name: "Guard Insurance", appetite: { Contractors: "conditional", Landscapers: "writes", Restaurants: "writes", Cleaning: "writes", Trucking: "no", Beauty: "conditional", "Auto Repair": "conditional" } },
  { id: "c4", name: "Gainsco", appetite: { Contractors: "unknown", Landscapers: "unknown", Restaurants: "no", Cleaning: "unknown", Trucking: "writes", Beauty: "no", "Auto Repair": "writes" } },
  { id: "c5", name: "KraftLake", appetite: { Contractors: "writes", Landscapers: "conditional", Restaurants: "writes", Cleaning: "conditional", Trucking: "no", Beauty: "no", "Auto Repair": "writes" } },
  { id: "c6", name: "Progressive Comm.", appetite: { Contractors: "conditional", Landscapers: "writes", Restaurants: "no", Cleaning: "conditional", Trucking: "writes", Beauty: "no", "Auto Repair": "writes" } },
];

const appetiteLabel: Record<AppetiteLevel, string> = {
  writes: "Writes",
  conditional: "Conditional",
  no: "No appetite",
  unknown: "Unknown",
};

const appetiteCellClass: Record<AppetiteLevel, string> = {
  writes: "appetite-cell--writes",
  conditional: "appetite-cell--conditional",
  no: "appetite-cell--no",
  unknown: "appetite-cell--unknown",
};

/**
 * Carrier Library Signature Element — Appetite Filter Matrix
 * Rows = carriers, columns = verticals.
 * Filter by vertical collapses to a single column view.
 */
export function AppetiteFilterMatrix() {
  const [activeVertical, setActiveVertical] = useState<string>("all");

  const shownVerticals = activeVertical === "all" ? verticals : [activeVertical];

  return (
    <div className="appetite-matrix">
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
          {verticals.map((v) => (
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
              <th scope="col" className="appetite-matrix-carrier-col">Carrier</th>
              {shownVerticals.map((v) => (
                <th scope="col" key={v} className="appetite-matrix-vertical-col">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carriers.map((carrier) => (
              <tr key={carrier.id}>
                <td className="appetite-matrix-carrier-name">{carrier.name}</td>
                {shownVerticals.map((v) => {
                  const level: AppetiteLevel = carrier.appetite[v] ?? "unknown";
                  return (
                    <td key={v} className={cn("appetite-cell", appetiteCellClass[level])}>
                      <span className="appetite-cell-label">{appetiteLabel[level]}</span>
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
            <span className={cn("appetite-legend-swatch", `appetite-cell--${level}`)} aria-hidden="true" />
            <span className="appetite-legend-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
