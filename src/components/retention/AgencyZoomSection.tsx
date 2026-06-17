import { AppIcon } from "@/components/ui/AppIcon";
import { SectionLabel } from "@/components/ui/PageHeader";
import { agencyZoomPipelines } from "@/data/retentionScorecard";

export function AgencyZoomSection() {
  return (
    <>
      <SectionLabel>
        AgencyZoom Pipelines — Retention Layer (Arminda Manages Data Entry)
      </SectionLabel>

      <div className="alert alert-amber">
        <div className="alert-title alert-title-with-icon">
          <AppIcon name="triangle-alert" size={14} strokeWidth={2.25} />
          Arminda&apos;s Role Clarification
        </div>
        <p>Arminda Sumido is confirmed as <strong>CERT + AgencyZoom data entry only</strong>. She does not own pipeline setup or operational workflows. Her role is to support pipeline maintenance and data accuracy — not to design or modify pipelines. Pipeline ownership = Eva (design) + Kyle (automation). Arminda executes data entry tasks assigned to her via Monday board.</p>
      </div>

      <table className="retention">
        <thead>
          <tr><th>Pipeline</th><th>Owner (AZ)</th><th>Kyle Automation</th><th>Monday Board Owner</th></tr>
        </thead>
        <tbody>
          {agencyZoomPipelines.map((row) => (
            <tr key={row.pipeline}>
              <td>{row.pipeline}</td>
              <td>{row.owner}</td>
              <td>{row.automation}</td>
              <td>{row.monday}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
