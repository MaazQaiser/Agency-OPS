"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveUserProfile, type UserProfile } from "@/data/userProfiles";
import { routes } from "@/lib/routes";
import { useToast } from "@/hooks/useToast";
import { AvatarProfilePanel } from "./AvatarProfilePanel";

type AvatarProfileContextValue = {
  isOpen: boolean;
  activeProfile: UserProfile | null;
  openProfile: (userIdOrName: string) => void;
  closeProfile: () => void;
};

const AvatarProfileContext = createContext<AvatarProfileContextValue | null>(null);

export function AvatarProfileProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const openProfile = useCallback((userIdOrName: string) => {
    const profile = resolveUserProfile(userIdOrName);
    if (!profile) {
      toast.error(`Profile not found for ${userIdOrName}`);
      return;
    }
    setActiveProfile(profile);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 120);
  }, [toast]);

  const closeProfile = useCallback(() => {
    setActiveProfile(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    closeProfile();
  }, [pathname, closeProfile]);

  const handleNavigate = useCallback(
    (route: string) => {
      closeProfile();
      router.push(route);
    },
    [closeProfile, router],
  );

  const handleAction = useCallback(
    (action: string, profile: UserProfile) => {
      if (action === "View Full Profile") {
        closeProfile();
        router.push(routes.vaOperations);
        toast.success(`Opening full profile — ${profile.name}`);
        return;
      }
      if (action === "Assign Task" || action === "Reassign workload") {
        toast.success(`${action} — ${profile.name}`);
        return;
      }
      if (action === "Message") {
        toast.success(`Message sent to ${profile.name}`);
        return;
      }
      toast.success(`${action} — ${profile.name}`);
    },
    [closeProfile, router, toast],
  );

  const handleNotesSave = useCallback(() => {
    toast.success("Manager notes saved");
  }, [toast]);

  const contextValue = useMemo(
    () => ({
      isOpen: Boolean(activeProfile),
      activeProfile,
      openProfile,
      closeProfile,
    }),
    [activeProfile, openProfile, closeProfile],
  );

  return (
    <AvatarProfileContext.Provider value={contextValue}>
      {children}
      {activeProfile && (
        <AvatarProfilePanel
          profile={activeProfile}
          loading={loading}
          onClose={closeProfile}
          onNavigate={handleNavigate}
          onAction={handleAction}
          onNotesSave={handleNotesSave}
        />
      )}
    </AvatarProfileContext.Provider>
  );
}

export function useAvatarProfile() {
  const ctx = useContext(AvatarProfileContext);
  if (!ctx) throw new Error("useAvatarProfile must be used within AvatarProfileProvider");
  return ctx;
}
