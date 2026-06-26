"use client";

import type { EquipRow } from "@/data/farmersEdge";

type EquipmentIntelTableProps = {
  rows: EquipRow[];
  verticalLabel: string;
};

export function EquipmentIntelTable({ rows, verticalLabel }: EquipmentIntelTableProps) {
  if (rows.length === 0) {
    return (
      <p className="fe-card-empty">
        Eva adds Equipment Intel for {verticalLabel} in Sheets.
      </p>
    );
  }

  return (
    <div className="fe-intel-table-wrap">
      <table className="fe-intel-table" aria-label={`Equipment intel for ${verticalLabel}`}>
        <thead>
          <tr>
            <th scope="col">Equipment</th>
            <th scope="col">Exposure</th>
            <th scope="col">ITA Rec.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.equipment}</td>
              <td>{row.exposure}</td>
              <td className="fe-intel-rec">{row.itaRec}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
