"use client";

import { usePathname, useRouter } from "next/navigation";
import { pathnameToModule } from "@/data/rolePermissions";
import { getHubLocalPulse } from "@/data/hubLocalPulse";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

export function HubLocalPulse() {
  const pathname = usePathname();
  const router = useRouter();
  const moduleKey = pathnameToModule(pathname);
  const pulse = getHubLocalPulse(moduleKey === "system-health" ? null : moduleKey);

  if (!pulse) return null;

  const isIntake = moduleKey === "intake-forms";

  const handleChipClick = (chip: (typeof pulse.chips)[number]) => {
    if (!isIntake || !chip.filter) return;
    const params = new URLSearchParams();
    params.set("view", chip.filter.view);
    params.set("pulse", chip.filter.pulse);
    router.push(`${routes.intakeForms}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="hub-local-pulse" role="status" aria-label={pulse.label}>
      <span className="hub-local-pulse-label">{pulse.label}</span>
      <div className="hub-local-pulse-chips">
        {pulse.chips.map((chip) =>
          isIntake && chip.filter ? (
            <button
              key={chip.id}
              type="button"
              className={cn(
                "hub-local-pulse-chip",
                `hub-local-pulse-chip--${chip.tone}`,
                "hub-local-pulse-chip--clickable",
              )}
              onClick={() => handleChipClick(chip)}
            >
              <strong>{chip.value}</strong>
              {chip.label}
            </button>
          ) : (
            <span key={chip.id} className={cn("hub-local-pulse-chip", `hub-local-pulse-chip--${chip.tone}`)}>
              <strong>{chip.value}</strong>
              {chip.label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
