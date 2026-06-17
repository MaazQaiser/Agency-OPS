import { AccordionCard } from "@/components/ui/AccordionCard";
import { SectionLabel } from "@/components/ui/PageHeader";
import {
  cancellationSaveEligibility,
  cancellationSaveTypes,
  crossSellPoints,
  retentionBonusTiers,
} from "@/data/retentionScorecard";

export function CompensationSection() {
  return (
    <>
      <SectionLabel>Compensation Structure — Retention Ecosystem</SectionLabel>

      <div className="alert alert-blue">
        <div className="alert-title">Compensation Formula</div>
        <p>Base Hourly + Retention Score Bonus + Cross-Sell Point Bonus + Cancellation Save Bonus + Prime Agency Alignment Bonus + Agency Achievement Bonus</p>
        <p style={{ marginTop: 6, fontSize: "var(--font-size-12)", color: "var(--muted)" }}>Not commission-heavy. Stability first. Performance bonuses reward preservation and growth — not production volume alone.</p>
      </div>

      <AccordionCard icon="trending-up" title="Retention Score Bonus — Monthly Tiers">
        <p style={{ fontSize: "var(--font-size-12)", color: "var(--muted)", marginBottom: 14 }}>Measured monthly on folio period dates. Uses retained premium + household retention + cancellation prevention + rewrite prevention + PIF preservation. Not raw policy count alone.</p>
        {retentionBonusTiers.map((tier) => (
          <div key={tier.badge} className="tier-row">
            <div className={`tier-badge ${tier.tierClass}`}>{tier.badge}</div>
            <div className="tier-body">
              {tier.strong ? (
                <>
                  <strong>{tier.strong}</strong>
                  {tier.body.slice(tier.strong.length)}
                </>
              ) : (
                tier.body
              )}
            </div>
          </div>
        ))}
        <div className="alert alert-amber" style={{ marginTop: 12 }}>
          <div className="alert-title">Hassan Builds This — Agency OS Calculates It Automatically</div>
          <p>Eva sets the dollar values per tier once. Agency OS reads retention % from Kyle&apos;s Sheets layer, applies the tier formula, and shows the calculated bonus amount in each person&apos;s scorecard view. No manual calculation ever.</p>
        </div>
      </AccordionCard>

      <AccordionCard icon="star" title="Cross-Sell Point System">
        <table className="retention">
          <thead>
            <tr><th>Activity</th><th>Points</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {crossSellPoints.map((row) => (
              <tr key={row.activity}>
                <td>{row.activity}</td>
                <td><span className={`pill ${row.pill}`}>{row.points}</span></td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="alert alert-blue" style={{ marginTop: 12 }}>
          <div className="alert-title">Where This Lives</div>
          <p>Cross-sell points tracked in: AgencyZoom pipeline activity · Monday.com cross-sell task group · Agency OS weighted scoring engine (Hassan builds) · Kyle automates point calculation from AZ activity log.</p>
        </div>
      </AccordionCard>

      <AccordionCard icon="shield" title="Cancellation Save Bonus Rules">
        <div className="alert alert-amber">
          <div className="alert-title">Save Bonus Eligibility — All 4 Conditions Required</div>
          <ul>
            {cancellationSaveEligibility.map((item) => (
              <li key={item}>{item.includes("60+") ? <>Policy remains active for <strong>60+ days</strong> after the save</> : item}</li>
            ))}
          </ul>
        </div>
        <table className="retention" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Save Type</th><th>Weighted Value</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {cancellationSaveTypes.map((row) => (
              <tr key={row.type}>
                <td>{row.type}</td>
                <td><span className={`pill ${row.pill}`}>{row.value}</span></td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionCard>
    </>
  );
}
