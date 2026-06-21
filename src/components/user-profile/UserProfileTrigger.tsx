"use client";

import { cn } from "@/lib/cn";
import { getNameInitials } from "@/lib/nameInitials";
import { useAvatarProfile } from "./AvatarProfileProvider";

type ClickableAvatarProps = {
  userId?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
  onImageError?: () => void;
};

const sizeClass = {
  sm: "clickable-avatar-sm",
  md: "clickable-avatar-md",
  lg: "clickable-avatar-lg",
};

export function ClickableAvatar({
  userId,
  name,
  size = "md",
  className,
  imageSrc,
  imageAlt,
  onImageError,
}: ClickableAvatarProps) {
  const { openProfile } = useAvatarProfile();
  const label = name ?? userId ?? "User";
  const initials = getNameInitials(label);

  return (
    <button
      type="button"
      className={cn("clickable-avatar", sizeClass[size], className)}
      aria-label={`View profile for ${label}`}
      onClick={(e) => {
        e.stopPropagation();
        openProfile(userId ?? name ?? "");
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt ?? label}
          className="clickable-avatar-img"
          onError={onImageError}
        />
      ) : (
        <span className="clickable-avatar-initials" aria-hidden="true">
          {initials}
        </span>
      )}
    </button>
  );
}

type UserChipProps = {
  userId?: string;
  name: string;
  className?: string;
  showAvatar?: boolean;
};

export function UserChip({ userId, name, className, showAvatar = true }: UserChipProps) {
  const { openProfile } = useAvatarProfile();

  return (
    <button
      type="button"
      className={cn("user-chip", className)}
      onClick={(e) => {
        e.stopPropagation();
        openProfile(userId ?? name);
      }}
    >
      {showAvatar && (
        <span className="user-chip-avatar" aria-hidden="true">
          {getNameInitials(name)}
        </span>
      )}
      <span className="user-chip-label">{name}</span>
    </button>
  );
}
