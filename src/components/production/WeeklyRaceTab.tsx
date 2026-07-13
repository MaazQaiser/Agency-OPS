import { AppIcon } from "@/components/ui/AppIcon";
import { weeklyRace, weeklyRaceGoal, weeklyRaceRules } from "@/data/producerScorecard";
import { WeeklyRaceRow } from "./WeeklyRaceRow";

export function WeeklyRaceTab() {
  const winner = weeklyRace.find((row) => row.isWeeklyWinner);

  return (
    <>
      <div className="section-hdr">
        <div className="sh-label">
          Weekly Race: {weeklyRaceGoal} Pt Goal · Points configurable in Sheets tab Eva controls
        </div>
      </div>

      <div className="weekly-race-panel glass-panel">
        <div className="weekly-race-title">
          <AppIcon name="flag" size={14} strokeWidth={2.25} />
          Weekly Activity Race
        </div>

        {winner && (
          <div className="weekly-race-winner-banner" role="status">
            <div className="weekly-race-winner-icon" aria-hidden="true">
              <AppIcon name="trophy" size={20} strokeWidth={2} />
            </div>
            <div className="weekly-race-winner-copy">
              <span className="weekly-race-winner-label">Weekly winner</span>
              <strong>{winner.name}</strong>
              <span className="weekly-race-winner-meta">
                {winner.points} pts · {Math.round((winner.points / weeklyRaceGoal) * 100)}% of goal
              </span>
            </div>
          </div>
        )}

        <div className="weekly-race-leaderboard">
          <div className="weekly-race-col-hdr" aria-hidden="true">
            <span>Rank</span>
            <span className="weekly-race-col-hdr-spacer" />
            <span>Producer</span>
            <span>Progress</span>
            <span>7-day trend</span>
            <span>Points</span>
          </div>

          {weeklyRace.map((row) => (
            <WeeklyRaceRow key={row.id} entry={row} />
          ))}
        </div>

        <div className="weekly-race-rules">{weeklyRaceRules}</div>
      </div>
    </>
  );
}
