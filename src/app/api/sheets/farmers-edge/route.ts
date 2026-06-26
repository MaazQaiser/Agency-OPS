/**
 * GET /api/sheets/farmers-edge?vertical=<id>
 * Returns content for a specific vertical from the Farmers Edge Sheet ranges.
 *
 * Sheet range mapping (all relative to the Farmers Edge spreadsheet):
 *   'FE Benefits'!A2:A100     — benefits rows
 *   'FE Gaps'!A2:A100         — coverage gaps
 *   'FE Equipment'!A2:C100   — equipment intel (equipment, exposure, itaRec)
 *   'FE Objections'!A2:B100  — objections + reframes
 *   'FE Scripts'!A2:B100     — cue + line
 *   'FE CrossSell'!A2:B100   — trigger + action
 *   'FE Edge'!A2:D100        — feature + ITA+Farmers + Standard + Competitors
 *
 * Returns static placeholder data when Sheets is not configured.
 */
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { readSheetRange } from "@/lib/sheetsClient";
import { verticalContent } from "@/data/farmersEdge";
import type { SheetRow } from "@/lib/sheetsClient";

export const runtime = "nodejs";
export const revalidate = 300; // 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vertical = searchParams.get("vertical") ?? "all";

  // When Sheets isn't configured, return static data immediately
  const sheetsId = process.env.GOOGLE_SHEETS_ID;
  const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT;

  if (!sheetsId || !serviceAccount) {
    const content = verticalContent[vertical] ?? verticalContent.all;
    return NextResponse.json({ content, source: "static", vertical });
  }

  // Fetch all ranges in parallel
  const [benefits, gaps, equip, objections, scripts, xsell, edge] = await Promise.all([
    readSheetRange(`'FE Benefits'!A2:A100`),
    readSheetRange(`'FE Gaps'!A2:A100`),
    readSheetRange(`'FE Equipment'!A2:C100`),
    readSheetRange(`'FE Objections'!A2:B100`),
    readSheetRange(`'FE Scripts'!A2:B100`),
    readSheetRange(`'FE CrossSell'!A2:B100`),
    readSheetRange(`'FE Edge'!A2:D100`),
  ]);

  // If any range is null (API failed), fall back to static
  if (!benefits || !gaps || !equip || !objections || !scripts || !xsell || !edge) {
    const content = verticalContent[vertical] ?? verticalContent.all;
    return NextResponse.json({ content, source: "static-fallback", vertical });
  }

  const content = {
    benefits: benefits.filter((r: SheetRow) => r[0]).map((r: SheetRow) => ({ item: String(r[0]) })),
    gaps: gaps.filter((r: SheetRow) => r[0]).map((r: SheetRow) => ({ item: String(r[0]) })),
    equip: equip
      .filter((r: SheetRow) => r[0])
      .map((r: SheetRow) => ({ equipment: String(r[0] ?? ""), exposure: String(r[1] ?? ""), itaRec: String(r[2] ?? "") })),
    objections: objections
      .filter((r: SheetRow) => r[0])
      .map((r: SheetRow) => ({ objection: String(r[0] ?? ""), reframe: String(r[1] ?? "") })),
    scripts: scripts
      .filter((r: SheetRow) => r[0])
      .map((r: SheetRow) => ({ cue: String(r[0] ?? ""), line: String(r[1] ?? "") })),
    xsell: xsell
      .filter((r: SheetRow) => r[0])
      .map((r: SheetRow) => ({ trigger: String(r[0] ?? ""), action: String(r[1] ?? "") })),
    edge: edge
      .filter((r: SheetRow) => r[0])
      .map((r: SheetRow) => ({
        feature: String(r[0] ?? ""),
        itaFarmers: String(r[1] ?? ""),
        standard: String(r[2] ?? ""),
        competitors: String(r[3] ?? ""),
      })),
  };

  return NextResponse.json({ content, source: "sheets", vertical });
}
