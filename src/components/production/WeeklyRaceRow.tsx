import { KpiSparklineIntelligence } from "@/components/kpi/KpiSparklineIntelligence";
import { AppIcon } from "@/components/ui/AppIcon";
import type { WeeklyRaceEntry } from "@/data/producerScorecard";
import { weeklyRaceGoal } from "@/data/producerScorecard";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { cn } from "@/lib/cn";
import { WeeklyRaceMomentum } from "./WeeklyRaceMomentum";
import { WeeklyRaceRankMovement } from "./WeeklyRaceRankMovement";

const RACE_BAR_COLORS: Record<WeeklyRaceEntry["color"], string> = {
  primary: "var(--primary)",
  blue: "var(--metric-blue)",
  purple: "var(--purple, #8b5cf6)",
  green: "var(--success-green)",
};

const AVATAR_IDS: Record<string, string> = {
  sarah: "sarah-chen",
  pedro: "pedro-va",
};

type WeeklyRaceRowProps = {
  entry: WeeklyRaceEntry;
};

export function WeeklyRaceRow({ entry }: WeeklyRaceRowProps) {
  const barWidth = entry.width || `${Math.round((entry.points / weeklyRaceGoal) * 100)}%`;

  return (
    <div
      className={cn("race-row", entry.isWeeklyWinner && "race-row--winner")}
      data-rank={entry.rank}
    >
      <WeeklyRaceRankMovement rank={entry.rank} previousRank={entry.previousRank} />

      <TeamAvatar
        userId={AVATAR_IDS[entry.id] ?? entry.id}
        name={entry.name}
        size="sm"
        showStatus={false}
        className="race-team-avatar"
      />

      <div className="race-producer">
        <div className="race-name-row">
          <span className="race-name">{entry.name}</span>
          {entry.isWeeklyWinner && (
            <span className="race-winner-chip" title="Weekly race leader">
              <AppIcon name="trophy" size={11} strokeWidth={2.25} />
              Leader
            </span>
          )}
        </div>
        <WeeklyRaceMomentum momentum={entry.momentum} />
      </div>

      <div className="race-bar-wrap" aria-hidden="true">
        <div
          className="race-bar-fill"
          style={{ width: barWidth, background: RACE_BAR_COLORS[entry.color] }}
        />
      </div>

      <div className="race-trend">
        <KpiSparklineIntelligence trend={entry.trend} polarity="higher-better" compact />
      </div>

      <div className="race-pts">{entry.points} pts</div>
    </div>
  );
}
