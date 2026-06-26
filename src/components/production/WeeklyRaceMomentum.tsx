import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";
import type { WeeklyRaceMomentum as MomentumKind } from "@/data/producerScorecard";

const MOMENTUM_META: Record<
  MomentumKind,
  { label: string; icon: AppIconName; hint: string }
> = {
  surging: {
    label: "Surging",
    icon: "zap",
    hint: "Accelerating pace vs prior days",
  },
  steady: {
    label: "Steady",
    icon: "trending-up",
    hint: "Consistent weekly accumulation",
  },
  cooling: {
    label: "Cooling",
    icon: "triangle-alert",
    hint: "Pace slowing vs early-week peak",
  },
};

type WeeklyRaceMomentumProps = {
  momentum: MomentumKind;
  className?: string;
};

export function WeeklyRaceMomentum({ momentum, className }: WeeklyRaceMomentumProps) {
  const meta = MOMENTUM_META[momentum];

  return (
    <span
      className={cn("race-momentum", `race-momentum--${momentum}`, className)}
      title={meta.hint}
    >
      <AppIcon name={meta.icon} size={12} strokeWidth={2.25} />
      {meta.label}
    </span>
  );
}
