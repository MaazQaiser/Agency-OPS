import { AccordionCard } from "@/components/ui/AccordionCard";
import { SectionLabel } from "@/components/ui/PageHeader";
import { primeAgencyKpis } from "@/data/retentionScorecard";

export function PrimeAgencySection() {
  return (
    <>
      <SectionLabel>Prime Agency Scorecard — Farmers-Specific Tracking</SectionLabel>

      <AccordionCard icon="clipboard" title="Prime Agency KPIs — Agency OS Must Track All of These">
        <table className="retention">
          <thead>
            <tr><th>Metric</th><th>Frequency</th><th>Data Source</th><th>Who Owns It</th></tr>
          </thead>
          <tbody>
            {primeAgencyKpis.map((row) => (
              <tr key={row.metric}>
                <td>{row.metric}</td>
                <td>{row.frequency}</td>
                <td>{row.source}</td>
                <td>{row.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="alert alert-blue" style={{ marginTop: 12 }}>
          <div className="alert-title">Display Format — All Scorecards Must Show Three Views</div>
          <p>Monthly · Quarterly · Rolling 12-month trend. Never just one view. Eva needs all three to see whether the agency is building momentum or trending down.</p>
        </div>
      </AccordionCard>
    </>
  );
}
