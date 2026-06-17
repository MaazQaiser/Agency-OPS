import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { contactWindowRules, speedToLead } from "@/data/producerScorecard";

const statusIcon: Record<string, AppIconName> = {
  green: "check",
  amber: "triangle-alert",
  red: "x",
};

export function SpeedToLeadTab() {
  return (
    <>
      <div className="section-hdr">
        <div className="sh-label">Speed-to-Lead Indicator — Agency-Wide (All Team Members)</div>
      </div>
      <p style={{ fontSize: "var(--font-size-12)", color: "var(--muted)", marginBottom: 16 }}>
        This indicator appears in EACH person&apos;s individual view AND in Eva&apos;s owner summary. Not Jazmín only.
      </p>

      {speedToLead.map((row) => (
        <div key={row.name} className={`speed-indicator speed-${row.variant}`}>
          <AppIcon name={statusIcon[row.variant]} size={16} className="speed-indicator-icon" strokeWidth={2.25} />
          <strong>{row.name}</strong>
          <span>{row.text}</span>
        </div>
      ))}

      <div className="glass-panel" style={{ marginTop: 20, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius)", padding: 20 }}>
        <div style={{ fontSize: "var(--font-size-12)", letterSpacing: 0.03, color: "var(--primary)", marginBottom: 12 }}>Contact Window Rules</div>
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
