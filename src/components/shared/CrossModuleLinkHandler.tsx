"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAvatarProfile } from "@/components/user-profile/AvatarProfileProvider";

export function CrossModuleLinkHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openProfile } = useAvatarProfile();
  const handledProfileRef = useRef<string | null>(null);
  const openProfileId = searchParams.get("openProfile");

  useEffect(() => {
    if (!openProfileId) {
      handledProfileRef.current = null;
      return;
    }
    if (handledProfileRef.current === openProfileId) return;

    openProfile(openProfileId);
    handledProfileRef.current = openProfileId;

    const params = new URLSearchParams(window.location.search);
    params.delete("openProfile");
    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    if (`${pathname}${window.location.search}` !== next) {
      router.replace(next, { scroll: false });
    }
  }, [openProfile, openProfileId, pathname, router]);

  return null;
}
