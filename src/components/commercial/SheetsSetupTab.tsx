import { AccordionCard } from "@/components/ui/AccordionCard";
import {
  appsScript,
  columnMap,
  conditionalFormatting,
  formulas,
  triggerSetup,
} from "@/data/sheetsSetup";

export function SheetsSetupTab() {
  return (
    <>
      <div className="section-header">
        <div className="section-title">Google Sheets Setup Guide</div>
        <div className="section-sub">Formulas · Conditional Formatting · Apps Script</div>
      </div>

      <div className="sheets-setup-accordions">
        <AccordionCard icon="clipboard" title='Column Map: Row 1 Headers (Sheet: "Submissions")' defaultOpen>
          <div className="column-map-grid">
            {columnMap.map((col) => (
              <div key={col.col} className="column-map-item">
                <span className="column-map-col">{col.col}</span> {col.name}
              </div>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard icon="settings" title="Key Column Formulas (paste in row 2, drag down)">
          {formulas.map((f) => (
            <div key={f.label} className="formula-row">
              <div className="formula-col-label">{f.label}</div>
              <div className="formula-code">{f.code}</div>
            </div>
          ))}
        </AccordionCard>

        <AccordionCard
          icon="sparkles"
          title="Conditional Formatting Rules (Format → Conditional Formatting → Custom Formula)"
        >
          <p className="formula-note">
            Apply all rules to range A2:U500. Rules evaluate top-to-bottom; put higher-priority rules first.
          </p>
          {conditionalFormatting.map((rule, i) => (
            <div key={i} className="formula-row">
              <div className="formula-col-label" style={{ color: `var(--${rule.color})` }}>
                {rule.label}
              </div>
              <div className="formula-code">{rule.code}</div>
            </div>
          ))}
        </AccordionCard>

        <AccordionCard
          icon="rocket"
          title="Google Apps Script: Full Automation (Tools → Apps Script → paste and save)"
        >
          <div className="formula-row formula-row-inline">
            <div className="formula-col-label">Triggers:</div>
            <p className="formula-note formula-note-inline">
              Set two triggers in Apps Script: <strong>dailyDigest</strong> → Time-driven → Day timer → 8:00am.{" "}
              <strong>onEdit</strong> → From spreadsheet → On edit.
            </p>
          </div>

          <div className="script-block">{appsScript}</div>

          <div className="trigger-setup-note">{triggerSetup}</div>
        </AccordionCard>
      </div>
    </>
  );
}
