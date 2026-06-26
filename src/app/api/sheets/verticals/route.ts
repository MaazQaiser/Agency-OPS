/**
 * GET /api/sheets/verticals
 * Returns the commercial vertical list from Tab 12.
 * Tab 12 is the sole source of truth for the Farmers Edge vertical selector.
 * Column A: vertical ID (slug), Column B: label, Column C: emoji, Column D: sub-description
 *
 * Returns the static placeholder list when Sheets is not configured.
 */
import { NextResponse } from "next/server";
import { readSheetRange } from "@/lib/sheetsClient";
import { farmersEdgeVerticals } from "@/data/farmersEdge";
import type { SheetRow } from "@/lib/sheetsClient";

export const runtime = "nodejs";
export const revalidate = 300; // 5 minutes

export async function GET() {
  const rows = await readSheetRange("'Tab 12'!A2:D100");

  if (!rows || rows.length === 0) {
    return NextResponse.json({ verticals: farmersEdgeVerticals, source: "static" });
  }

  const verticals = rows
    .filter((row: SheetRow) => row[0] && row[1])
    .map((row: SheetRow) => ({
      id: String(row[0] ?? "").toLowerCase().trim(),
      label: String(row[1] ?? ""),
      emoji: String(row[2] ?? ""),
      sub: String(row[3] ?? ""),
    }));

  return NextResponse.json({ verticals: [{ id: "all", label: "All Verticals", emoji: "", sub: "Showing all commercial intelligence" }, ...verticals], source: "sheets" });
}
