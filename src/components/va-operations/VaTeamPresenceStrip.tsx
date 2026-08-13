"use client";

import { teamMembers, teamPresenceStrip, type TeamPresenceStatus } from "@/data/vaOperations";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { vaPresenceToAvatarStatus } from "@/lib/teamIdentity";
import { cn } from "@/lib/cn";

const presenceLabels: Record<TeamPresenceStatus, string> = {
  online: "Online",
  "on-call": "On Call",
  busy: "Busy",
  offline: "Offline",
};

type VaTeamPresenceStripProps = {
  variant?: "default" | "hero";
};

export function VaTeamPresenceStrip({ variant = "default" }: VaTeamPresenceStripProps) {
  const roster = teamPresenceStrip.filter((person) => {
    const member = teamMembers.find((item) => item.id === person.id);
    if (!member) return false;
    return member.status !== "offline";
  });

  return (
    <section
      className={cn("va-ops-team-presence-strip", variant === "hero" && "va-ops-team-presence-strip--hero")}
      aria-label="Team presence"
    >
      <span className="va-ops-team-presence-label">Team presence</span>
      <div className="va-ops-team-presence-row">
        {roster.map((member) => {
          const avatarStatus = vaPresenceToAvatarStatus(member.presence);
          return (
            <div
              key={member.id}
              className={cn(
                "va-ops-team-presence-member-btn",
                member.presence === "offline" && "va-ops-team-presence-member-btn--offline",
                member.presence === "busy" && "va-ops-team-presence-member-btn--busy",
              )}
            >
              <TeamAvatar
                userId={member.id}
                name={member.name}
                size="md"
                status={avatarStatus}
                interactive
                openProfileOnClick
                pulse={member.presence === "online"}
                muted={member.presence === "offline"}
                showTooltip={false}
                aria-label={`View profile for ${member.name}, ${presenceLabels[member.presence]}`}
              />
              <div className="va-ops-team-presence-copy">
                <span className="va-ops-team-presence-name">{member.name}</span>
                <span className={cn("va-ops-team-presence-status", `va-ops-team-presence-status--${member.presence}`)}>
                  {presenceLabels[member.presence]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
