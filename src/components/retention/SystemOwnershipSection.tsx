"use client";

import { AccordionCard } from "@/components/ui/AccordionCard";
import { SectionLabel } from "@/components/ui/PageHeader";
import { useRetentionLocale } from "@/components/retention/RetentionLanguageProvider";

export function SystemOwnershipSection() {
  const { copy } = useRetentionLocale();
  const { systemOwnership } = copy;

  return (
    <>
      <SectionLabel>{systemOwnership.section}</SectionLabel>

      <AccordionCard icon="folder" title={systemOwnership.title}>
        <div className="retention-table-wrap">
          <table className="retention">
            <thead>
              <tr>
                {systemOwnership.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {systemOwnership.rows.map((row) => (
                <tr key={row.system}>
                  <td>{row.system}</td>
                  <td>{row.who}</td>
                  <td>{row.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionCard>
    </>
  );
}

export function FutureRoadmapSection() {
  const { copy } = useRetentionLocale();
  const { futureRoadmap } = copy;

  return (
    <>
      <SectionLabel>{futureRoadmap.section}</SectionLabel>

      <AccordionCard icon="rocket" title={futureRoadmap.title}>
        <div className="retention-table-wrap">
          <table className="retention">
            <thead>
              <tr>
                {futureRoadmap.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {futureRoadmap.rows.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  <td>{row.description}</td>
                  <td>
                    <span className={`pill ${row.pill}`}>{row.phase}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionCard>
    </>
  );
}
