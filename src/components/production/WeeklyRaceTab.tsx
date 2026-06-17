import { AppIcon } from "@/components/ui/AppIcon";
import { weeklyRace, weeklyRaceRules } from "@/data/producerScorecard";

const colorMap: Record<string, { bg: string; color: string; border: string }> = {
  primary: { bg: "var(--primary-glow)", color: "var(--primary)", border: "var(--primary)" },
  blue: { bg: "var(--blue-bg)", color: "var(--blue)", border: "var(--blue)" },
  purple: { bg: "var(--purple-bg)", color: "var(--purple)", border: "var(--purple)" },
  green: { bg: "var(--green-bg)", color: "var(--green)", border: "var(--green)" },
};

export function WeeklyRaceTab() {
  return (
    <>
      <div className="section-hdr">
        <div className="sh-label">Weekly Race — 300 Pt Goal · Points configurable in Sheets tab Eva controls</div>
      </div>
      <div className="glass-panel" style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius)", padding: 20 }}>
        <div className="weekly-race-title">
          <AppIcon name="flag" size={14} strokeWidth={2.25} />
          Weekly Activity Race
        </div>
        {weeklyRace.map((row) => {
          const c = colorMap[row.color];
          return (
            <div key={row.name} className="race-row">
              <div className="race-avatar" style={{ background: c.bg, color: c.color, borderColor: c.border }}>{row.initial}</div>
              <div className="race-name">{row.name}</div>
              <div className="race-bar-wrap">
                <div className="race-bar-fill" style={{ width: row.width, background: c.color }} />
              </div>
              <div className="race-pts">{row.points} pts</div>
            </div>
          );
        })}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--navy-light)", fontSize: "var(--font-size-12)", color: "var(--muted)" }}>
          {weeklyRaceRules}
        </div>
      </div>
    </>
  );
}
