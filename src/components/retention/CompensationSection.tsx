"use client";

import { AccordionCard } from "@/components/ui/AccordionCard";
import { SectionLabel } from "@/components/ui/PageHeader";
import { useRetentionLocale } from "@/components/retention/RetentionLanguageProvider";

export function CompensationSection() {
  const { copy } = useRetentionLocale();
  const { compensation } = copy;

  return (
    <>
      <SectionLabel>{compensation.section}</SectionLabel>

      <div className="alert alert-blue aos-card--info">
        <div className="alert-title">{compensation.formulaTitle}</div>
        <p>{compensation.formulaBody}</p>
        <p className="retention-alert-note">{compensation.formulaSub}</p>
      </div>

      <AccordionCard icon="trending-up" title={compensation.tierTitle}>
        <p className="retention-kpi-footnote" style={{ marginBottom: 14 }}>
          {compensation.tierSub}
        </p>
        {copy.bonusTiers.map((tier) => (
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
        <div className="alert alert-amber aos-card--action" style={{ marginTop: 12 }}>
          <div className="alert-title">Hassan Builds This: Agency OS Calculates It Automatically</div>
          <p>
            Eva sets the dollar values per tier once. Agency OS reads retention % from Kyle&apos;s Sheets layer,
            applies the tier formula, and shows the calculated bonus amount in each person&apos;s scorecard view. No
            manual calculation ever.
          </p>
        </div>
      </AccordionCard>

      <AccordionCard icon="star" title={compensation.crossSellTitle}>
        <div className="retention-table-wrap">
          <table className="retention">
            <thead>
              <tr>
                {compensation.crossSellHeaders.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.crossSellPoints.map((row) => (
                <tr key={row.activity}>
                  <td>{row.activity}</td>
                  <td>
                    <span className={`pill ${row.pill}`}>{row.points}</span>
                  </td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="alert alert-blue aos-card--info" style={{ marginTop: 12 }}>
          <div className="alert-title">Where This Lives</div>
          <p>
            Cross-sell points tracked in: AgencyZoom pipeline activity · Monday.com cross-sell task group · Agency OS
            weighted scoring engine (Hassan builds) · Kyle automates point calculation from AZ activity log.
          </p>
        </div>
      </AccordionCard>

      <AccordionCard icon="shield" title={compensation.saveTitle}>
        <div className="alert alert-amber aos-card--action">
          <div className="alert-title">{compensation.saveEligibilityTitle}</div>
          <ul>
            {copy.cancellationSaveEligibility.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="retention-table-wrap" style={{ marginTop: 12 }}>
          <table className="retention">
            <thead>
              <tr>
                {compensation.saveHeaders.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.cancellationSaveTypes.map((row) => (
                <tr key={row.type}>
                  <td>{row.type}</td>
                  <td>
                    <span className={`pill ${row.pill}`}>{row.value}</span>
                  </td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionCard>
    </>
  );
}
