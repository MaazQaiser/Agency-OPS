"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { canOpenFarmersEdgeIntel } from "@/lib/farmersEdgeAccess";
import {
  buildFarmersEdgeIntelRequest,
  type FarmersEdgeIntelRequest,
} from "@/lib/farmersEdgeIntel";
import { FarmersEdgeIntelligencePanel } from "./FarmersEdgeIntelligencePanel";

type FarmersEdgeIntelContextValue = {
  canOpen: boolean;
  isOpen: boolean;
  request: FarmersEdgeIntelRequest | null;
  openIntel: (request: FarmersEdgeIntelRequest) => void;
  closeIntel: () => void;
};

const FarmersEdgeIntelContext = createContext<FarmersEdgeIntelContextValue | null>(null);

export function FarmersEdgeIntelligenceProvider({ children }: { children: ReactNode }) {
  const { role } = usePermissions();
  const canOpen = canOpenFarmersEdgeIntel(role);
  const [request, setRequest] = useState<FarmersEdgeIntelRequest | null>(null);

  const openIntel = useCallback(
    (partial: FarmersEdgeIntelRequest) => {
      if (!canOpenFarmersEdgeIntel(role)) return;
      setRequest(buildFarmersEdgeIntelRequest(partial));
    },
    [role],
  );

  const closeIntel = useCallback(() => {
    setRequest(null);
  }, []);

  const value = useMemo(
    () => ({
      canOpen,
      isOpen: request !== null,
      request,
      openIntel,
      closeIntel,
    }),
    [canOpen, request, openIntel, closeIntel],
  );

  return (
    <FarmersEdgeIntelContext.Provider value={value}>
      {children}
      {request && <FarmersEdgeIntelligencePanel request={request} onClose={closeIntel} />}
    </FarmersEdgeIntelContext.Provider>
  );
}

export function useFarmersEdgeIntel(): FarmersEdgeIntelContextValue {
  const ctx = useContext(FarmersEdgeIntelContext);
  if (!ctx) {
    throw new Error("useFarmersEdgeIntel must be used within FarmersEdgeIntelligenceProvider");
  }
  return ctx;
}

export function useFarmersEdgeIntelOptional(): FarmersEdgeIntelContextValue | null {
  return useContext(FarmersEdgeIntelContext);
}
