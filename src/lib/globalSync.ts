export type GlobalSyncPhase = "idle" | "syncing" | "synced" | "stale" | "error";

export type GlobalSyncEventDetail = {
  phase: GlobalSyncPhase;
  at?: string;
};

export const GLOBAL_SYNC_EVENT = "agency-ops-sync";

export function emitGlobalSync(detail: GlobalSyncEventDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<GlobalSyncEventDetail>(GLOBAL_SYNC_EVENT, { detail }));
}
