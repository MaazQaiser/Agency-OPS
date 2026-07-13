import { DataTable } from "@/components/ui/DataTable";
import { KpiGrid } from "@/components/ui/KpiCard";
import { pipelineKpi, pipelineKpiTotals, pipelineSummaryKpis } from "@/data/producerScorecard";
import { PipelineKpiBlock } from "./PipelineKpiBlock";

export function PipelineKpiTab() {
  return (
    <>
      <div className="pipeline-kpi-section">
        <div className="section-hdr">
          <div className="sh-label">Pipeline Summary: Folio Period</div>
        </div>
        <p className="pipeline-kpi-section-desc">
          Modular KPI blocks sourced from Kyle&apos;s Sales_Scorecard · All lines + all pipelines
        </p>

        <KpiGrid variant="production" className="pipeline-kpi-blocks">
          {pipelineSummaryKpis.map((kpi) => (
            <PipelineKpiBlock key={kpi.id} kpi={kpi} />
          ))}
        </KpiGrid>
      </div>

      <div className="section-hdr">
        <div className="sh-label">Pipeline Breakdown: By Source</div>
      </div>
      <DataTable variant="production">
        <thead>
          <tr>
            <th>Pipeline</th>
            <th>Line</th>
            <th>New Leads</th>
            <th>Contacted</th>
            <th>Quoted</th>
            <th>Bound</th>
            <th>Contact %</th>
            <th>Close %</th>
            <th>CPA</th>
          </tr>
        </thead>
        <tbody>
          {pipelineKpi.map((row) => (
            <tr key={row.pipeline}>
              <td>{row.pipeline}</td>
              <td>
                <span className={`lob-tag lob-${row.lineType}`}>{row.line}</span>
              </td>
              <td>{row.newLeads}</td>
              <td>{row.contacted}</td>
              <td>{row.quoted}</td>
              <td>{row.bound}</td>
              <td>{row.contactPct}</td>
              <td>{row.closePct}</td>
              <td>{row.cpa}</td>
            </tr>
          ))}
          <tr className="pipeline-kpi-totals-row">
            <td colSpan={2}>TOTALS</td>
            <td>{pipelineKpiTotals.newLeads}</td>
            <td>{pipelineKpiTotals.contacted}</td>
            <td>{pipelineKpiTotals.quoted}</td>
            <td>{pipelineKpiTotals.bound}</td>
            <td>{pipelineKpiTotals.contactPct}</td>
            <td>{pipelineKpiTotals.closePct}</td>
            <td>{pipelineKpiTotals.cpa}</td>
          </tr>
        </tbody>
      </DataTable>
    </>
  );
}
