"use client";

import type { EdgeRow } from "@/data/farmersEdge";
import { HubEmptyState } from "@/components/state";

type OurEdgeTableProps = {
  rows: EdgeRow[];
};

export function OurEdgeTable({ rows }: OurEdgeTableProps) {
  if (rows.length === 0) {
    return (
      <HubEmptyState
        compact
        preset="farmers-edge-content"
        title="No comparison rows yet"
        description="Eva adds Our Edge comparison rows in Google Sheets."
      />
    );
  }

  return (
    <div className="fe-edge-table-wrap">
      <table className="fe-edge-table" aria-label="ITA + Farmers vs Competitors comparison">
        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th scope="col">ITA + Farmers</th>
            <th scope="col">Standard Market</th>
            <th scope="col">Named Competitors</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.feature}</td>
              <td className="fe-edge-win">{row.itaFarmers}</td>
              <td className="fe-edge-lose">{row.standard}</td>
              <td className="fe-edge-lose">{row.competitors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
