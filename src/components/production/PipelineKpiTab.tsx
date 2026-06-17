import { pipelineKpi, pipelineKpiTotals } from "@/data/producerScorecard";

export function PipelineKpiTab() {
  return (
    <>
      <div className="section-hdr">
        <div className="sh-label">Pipeline KPI — All Lines + All Pipelines</div>
      </div>
      <table className="production">
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
              <td><span className={`lob-tag lob-${row.lineType}`}>{row.line}</span></td>
              <td>{row.newLeads}</td>
              <td>{row.contacted}</td>
              <td>{row.quoted}</td>
              <td>{row.bound}</td>
              <td>{row.contactPct}</td>
              <td>{row.closePct}</td>
              <td>{row.cpa}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 700, background: "var(--primary-muted)" }}>
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
      </table>
    </>
  );
}
