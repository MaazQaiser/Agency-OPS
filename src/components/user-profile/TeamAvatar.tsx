"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { getNameInitials } from "@/lib/nameInitials";
import {
  resolveTeamIdentity,
  resolveRoleRingGradient,
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
  preferVa?: boolean;
  className?: string;
  imageSrc?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
};

const sizeClass: Record<TeamAvatarSize, string> = {
  xs: "team-avatar-xs",
  sm: "team-avatar-sm",
  md: "team-avatar-md",
  lg: "team-avatar-lg",
  xl: "team-avatar-xl",
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
  preferVa = false,
  className,
  imageSrc,
  onClick,
  "aria-label": ariaLabel,
}: TeamAvatarProps) {
  const identity = useMemo(
    () => resolveIdentity(userId, name, preferVa),
    [userId, name, preferVa],
  );
  const label = name ?? identity?.name ?? userId ?? "Team member";
  const [imgError, setImgError] = useState(false);
  const photo = imageSrc ?? identity?.photoUrl;

  useEffect(() => {
    setImgError(false);
  }, [photo]);
  const ring = identity?.ringGradient ?? (identity ? resolveRoleRingGradient(identity.role) : undefined);
  const resolvedStatus = status ?? identity?.defaultStatus ?? "offline";

  const avatarVisual = (
    <span
      className={cn("team-avatar", sizeClass[size], interactive && "interactive", className)}
      style={ring ? ({ "--team-ring": ring } as React.CSSProperties) : undefined}
    >
      {showTooltip && !interactive && !onClick && (
        <span className="team-avatar-tooltip" role="tooltip">
          {label}
          {identity?.role ? ` · ${identity.role}` : ""}
        </span>
      )}
      <span className="team-avatar-inner">
        {photo && !imgError ? (
          <img
            src={photo}
            alt=""
            className="team-avatar-photo"
            onError={() => setImgError(true)}
          />
        ) : (
          /* M2 correction: real photos only — fallback is shimmer, never initials */
          <span className="team-avatar-shimmer ops-skeleton-shimmer" aria-hidden="true" />
        )}
      </span>
      {showStatus && (
        <span
          className={cn("team-avatar-status", statusClass[resolvedStatus])}
          aria-label={`Status: ${resolvedStatus}`}
        />
      )}
    </span>
  );

  if (!interactive && !onClick) {
    return avatarVisual;
  }

  return (
    <button
      type="button"
      className={cn("team-avatar-btn", interactive && "team-avatar-btn-interactive")}
      aria-label={ariaLabel ?? `View profile for ${label}`}
      onClick={onClick}
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
