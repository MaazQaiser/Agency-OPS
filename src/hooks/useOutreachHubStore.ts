import { useSyncExternalStore } from "react";
import { getOutreachSnapshot, subscribeOutreachHub, type OutreachSnapshot } from "@/data/outreachHubStore";

export function useOutreachHubStore(): OutreachSnapshot {
  return useSyncExternalStore(subscribeOutreachHub, getOutreachSnapshot, getOutreachSnapshot);
}
