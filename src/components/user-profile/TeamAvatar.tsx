"use client";

import { useEffect, useMemo, useState } from "react";
import { useAvatarProfile } from "@/components/user-profile/AvatarProfileProvider";
import { cn } from "@/lib/cn";
import {
  getGeneratedInitialAvatar,
  resolveAvatarVisual,
  resolveRoleRingGradient,
  resolveTeamIdentity,
  type TeamAvatarStatus,
  type TeamIdentity,
} from "@/lib/teamIdentity";

export type TeamAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type TeamAvatarProps = {
  userId?: string;
  name?: string;
  size?: TeamAvatarSize;
  status?: TeamAvatarStatus;
  showStatus?: boolean;
  showTooltip?: boolean;
  interactive?: boolean;
  openProfileOnClick?: boolean;
  preferVa?: boolean;
  muted?: boolean;
  pulse?: boolean;
  className?: string;
  imageSrc?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
};

const sizeClass: Record<TeamAvatarSize, string> = {
  xs: "team-avatar-size-xs",
  sm: "team-avatar-size-sm",
  md: "team-avatar-size-md",
  lg: "team-avatar-size-lg",
  xl: "team-avatar-size-lg",
};

const statusClass: Record<TeamAvatarStatus, string> = {
  online: "team-avatar-status-online",
  away: "team-avatar-status-away",
  busy: "team-avatar-status-busy",
  offline: "team-avatar-status-offline",
};

function resolveIdentity(
  userId?: string,
  name?: string,
  preferVa?: boolean,
): TeamIdentity | undefined {
  if (userId) {
    const byId = resolveTeamIdentity(userId, { preferVa });
    if (byId) return byId;
  }
  if (name) return resolveTeamIdentity(name, { preferVa });
  return undefined;
}

export function TeamAvatar({
  userId,
  name,
  size = "md",
  status,
  showStatus = true,
  showTooltip = true,
  interactive = false,
  openProfileOnClick = false,
  preferVa = false,
  muted = false,
  pulse = false,
  className,
  imageSrc,
  onClick,
  "aria-label": ariaLabel,
}: TeamAvatarProps) {
  const { openProfile } = useAvatarProfile();
  const identity = useMemo(
    () => resolveIdentity(userId, name, preferVa),
    [userId, name, preferVa],
  );
  const label = name ?? identity?.name ?? userId ?? "Team member";
  const [imgError, setImgError] = useState(false);
  const photo = imageSrc ?? identity?.photoUrl;
  const visualMode = resolveAvatarVisual(identity, imgError, imageSrc);
  const ring = identity?.ringGradient ?? (identity ? resolveRoleRingGradient(identity.role) : undefined);
  const resolvedStatus = status ?? identity?.defaultStatus ?? "offline";
  const generated = getGeneratedInitialAvatar(label, ring);

  useEffect(() => {
    setImgError(false);
  }, [photo]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
      return;
    }
    if (openProfileOnClick || interactive) {
      event.stopPropagation();
      openProfile(userId ?? name ?? label);
    }
  };

  const avatarVisual = (
    <span
      className={cn(
        "team-avatar-root",
        sizeClass[size],
        muted && "team-avatar-root--muted",
        pulse && resolvedStatus === "online" && "team-avatar-root--pulse",
        (interactive || openProfileOnClick || onClick) && "team-avatar-root--interactive",
        className,
      )}
      style={ring ? ({ "--team-ring": ring } as React.CSSProperties) : undefined}
    >
      {showTooltip && !interactive && !onClick && !openProfileOnClick && (
        <span className="team-avatar-tooltip" role="tooltip">
          {label}
          {identity?.role ? ` · ${identity.role}` : ""}
        </span>
      )}
      <span className="team-avatar-ring" aria-hidden="true">
        <span className="team-avatar-gap">
          <span className="team-avatar-inner">
            {visualMode === "photo" && photo && !imgError ? (
              <img
                src={photo}
                alt=""
                className="team-avatar-photo"
                onError={() => setImgError(true)}
              />
            ) : visualMode === "animated" && identity?.animatedAvatarUrl ? (
              <img src={identity.animatedAvatarUrl} alt="" className="team-avatar-photo team-avatar-photo--animated" />
            ) : (
              <span
                className="team-avatar-initials"
                style={{ background: generated.gradient }}
                aria-hidden="true"
              >
                {generated.initials}
              </span>
            )}
          </span>
        </span>
      </span>
      {showStatus && (
        <span
          className={cn("team-avatar-status", statusClass[resolvedStatus])}
          aria-label={`Status: ${resolvedStatus}`}
        />
      )}
    </span>
  );

  if (!interactive && !onClick && !openProfileOnClick) {
    return avatarVisual;
  }

  return (
    <button
      type="button"
      className="team-avatar-btn"
      aria-label={ariaLabel ?? `View profile for ${label}`}
      onClick={handleClick}
    >
      {showTooltip && (
        <span className="team-avatar-tooltip" role="tooltip">
          {label}
          {identity?.role ? ` · ${identity.role}` : ""}
        </span>
      )}
      {avatarVisual}
    </button>
  );
}
