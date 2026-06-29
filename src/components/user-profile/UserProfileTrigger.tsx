"use client";

import { cn } from "@/lib/cn";
import { TeamAvatar, type TeamAvatarSize } from "./TeamAvatar";
import { useAvatarProfile } from "./AvatarProfileProvider";
import { resolveTeamIdentity, type TeamAvatarStatus } from "@/lib/teamIdentity";

type ClickableAvatarProps = {
  userId?: string;
  name?: string;
  size?: TeamAvatarSize;
  className?: string;
  imageSrc?: string;
  status?: TeamAvatarStatus;
  showStatus?: boolean;
  preferVa?: boolean;
};

export function ClickableAvatar({
  userId,
  name,
  size = "md",
  className,
  imageSrc,
  status,
  showStatus = true,
  preferVa = false,
}: ClickableAvatarProps) {
  const { openProfile } = useAvatarProfile();
  const label = name ?? userId ?? "User";

  return (
    <TeamAvatar
      userId={userId}
      name={name}
      size={size}
      status={status}
      showStatus={showStatus}
      preferVa={preferVa}
      imageSrc={imageSrc}
      interactive
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        openProfile(userId ?? name ?? "");
      }}
      aria-label={`View profile for ${label}`}
    />
  );
}

type UserChipProps = {
  userId?: string;
  name: string;
  className?: string;
  showAvatar?: boolean;
  status?: TeamAvatarStatus;
  preferVa?: boolean;
};

export function UserChip({
  userId,
  name,
  className,
  showAvatar = true,
  status,
  preferVa = false,
}: UserChipProps) {
  const { openProfile } = useAvatarProfile();
  const resolvedUserId = userId ?? resolveTeamIdentity(name)?.id;

  return (
    <button
      type="button"
      className={cn("user-chip", className)}
      onClick={(e) => {
        e.stopPropagation();
        openProfile(resolvedUserId ?? name);
      }}
    >
      {showAvatar && (
        <TeamAvatar
          userId={resolvedUserId}
          name={name}
          size="sm"
          status={status}
          preferVa={preferVa}
          showTooltip={false}
        />
      )}
      <span className="user-chip-label">{name}</span>
    </button>
  );
}
