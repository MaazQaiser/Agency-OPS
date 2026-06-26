import { cn } from "@/lib/cn";

type WeeklyRaceRankMovementProps = {
  rank: number;
  previousRank: number;
  className?: string;
};

function describeMovement(rank: number, previousRank: number): string {
  const delta = previousRank - rank;
  if (delta > 0) return `Moved up ${delta} place${delta === 1 ? "" : "s"} from rank ${previousRank}`;
  if (delta < 0) return `Moved down ${Math.abs(delta)} place${Math.abs(delta) === 1 ? "" : "s"} from rank ${previousRank}`;
  return `Unchanged at rank ${rank}`;
}

export function WeeklyRaceRankMovement({ rank, previousRank, className }: WeeklyRaceRankMovementProps) {
  const delta = previousRank - rank;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "same";

  return (
    <div
      className={cn("race-rank-move", `race-rank-move--${direction}`, className)}
      aria-label={describeMovement(rank, previousRank)}
    >
      <span className="race-rank-num">#{rank}</span>
      <span className="race-rank-arrow" aria-hidden="true">
        {direction === "up" && `↑${delta}`}
        {direction === "down" && `↓${Math.abs(delta)}`}
        {direction === "same" && "→"}
      </span>
    </div>
  );
}
