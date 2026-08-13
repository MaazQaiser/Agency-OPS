import { cn } from "@/lib/cn";

type TargetLineProps = {
  /** Existing configured target, already converted to a percentage of chart height. */
  bottomPct: number;
  label?: string;
  className?: string;
};

export function TargetLine({ bottomPct, label = "Target", className }: TargetLineProps) {
  return (
    <span
      className={cn("aos-target-line", className)}
      style={{ bottom: `${bottomPct}%` }}
      title={label}
      aria-hidden="true"
    />
  );
}
