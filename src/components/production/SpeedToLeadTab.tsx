import { contactWindowRules, speedToLead } from "@/data/producerScorecard";
import { SpeedToLeadCard } from "./SpeedToLeadCard";

export function SpeedToLeadTab() {
  return (
    <>
      <div className="section-hdr">
        <div className="sh-label">Speed-to-Lead Indicator — Agency-Wide (All Team Members)</div>
      </div>
      <p className="speed-stl-intro">
        Live timers update every second. This indicator appears in each person&apos;s individual view and in
        Eva&apos;s owner summary — not Jazmín only.
      </p>

      <div className="speed-stl-grid">
        {speedToLead.map((entry) => (
          <SpeedToLeadCard key={entry.id} entry={entry} />
        ))}
      </div>

      <div className="glass-panel speed-stl-rules-panel">
        <div className="speed-stl-rules-title">Contact Window Rules</div>
        <table className="production">
          <thead>
            <tr>
              <th>Team Member</th>
              <th>Lead Source</th>
              <th>Window</th>
              <th>Missed Action</th>
            </tr>
          </thead>
          <tbody>
            {contactWindowRules.map((row) => (
              <tr key={row.member}>
                <td>{row.member}</td>
                <td>{row.source}</td>
                <td>{row.window}</td>
                <td>{row.missed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
