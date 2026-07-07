"use client";

import { TeamAvatar, type TeamAvatarSize } from "@/components/user-profile/TeamAvatar";
import type { TeamAvatarStatus } from "@/lib/teamIdentity";
import { cn } from "@/lib/cn";

export type AvatarStackMember = {
  userId?: string;
  name: string;
  status?: TeamAvatarStatus;
  preferVa?: boolean;
};

type AvatarStackProps = {
  members: AvatarStackMember[];
  maxVisible?: number;
  size?: TeamAvatarSize;
  className?: string;
  onOverflowClick?: () => void;
};

export function AvatarStack({
  members,
  maxVisible = 4,
  size = "sm",
  className,
  onOverflowClick,
}: AvatarStackProps) {
  const visible = members.slice(0, maxVisible);
  const overflow = Math.max(0, members.length - maxVisible);

  return (
    <div className={cn("avatar-stack", className)} aria-label={`${members.length} team members`}>
      <div className="avatar-stack-track">
        {visible.map((member, index) => (
          <span
            key={`${member.userId ?? member.name}-${index}`}
            className="avatar-stack-item"
            style={{ zIndex: visible.length - index }}
          >
            <TeamAvatar
              userId={member.userId}
              name={member.name}
              size={size}
              status={member.status}
              preferVa={member.preferVa}
              interactive
              openProfileOnClick
              showTooltip
            />
          </span>
        ))}
      </div>
      {overflow > 0 && (
        <button
          type="button"
          className="avatar-stack-overflow"
          onClick={onOverflowClick}
          aria-label={`${overflow} more team members`}
        >
          +{overflow}
        </button>
      )}
    </div>
  );
}
