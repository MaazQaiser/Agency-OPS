import { useSyncExternalStore } from "react";
import {
  getCommercialHubSnapshot,
  subscribeCommercialHub,
  type CommercialHubSnapshot,
} from "@/data/commercialHubStore";

export function useCommercialHubStore(): CommercialHubSnapshot {
  return useSyncExternalStore(subscribeCommercialHub, getCommercialHubSnapshot, getCommercialHubSnapshot);
}
