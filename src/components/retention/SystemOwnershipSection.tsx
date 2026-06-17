import { AccordionCard } from "@/components/ui/AccordionCard";
import { SectionLabel } from "@/components/ui/PageHeader";
import { futureRoadmap, systemOwnership } from "@/data/retentionScorecard";

export function SystemOwnershipSection() {
  return (
    <>
      <SectionLabel>System Ownership — Retention Layer</SectionLabel>

      <AccordionCard icon="folder" title="Who Builds What — Retention Module">
        <table className="retention">
          <thead>
            <tr><th>System</th><th>Who Builds</th><th>What They Build</th></tr>
          </thead>
          <tbody>
            {systemOwnership.map((row) => (
              <tr key={row.system}>
                <td>{row.system}</td>
                <td>{row.who}</td>
                <td>{row.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionCard>
    </>
  );
}

export function FutureRoadmapSection() {
  return (
    <>
      <SectionLabel>Future Agency OS Features — Retention Layer (Phase 3+)</SectionLabel>

      <AccordionCard icon="rocket" title="Future Development — Retention Intelligence">
        <table className="retention">
          <thead>
            <tr><th>Feature</th><th>What It Does</th><th>Phase</th></tr>
          </thead>
          <tbody>
            {futureRoadmap.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td>{row.description}</td>
                <td><span className={`pill ${row.pill}`}>{row.phase}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionCard>
    </>
  );
}
