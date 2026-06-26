export type DataStatus = "loading" | "success" | "empty" | "error";

export type DataSourceKind =
  | "agencyzoom"
  | "supabase"
  | "sheets"
  | "ringcentral"
  | "epay"
  | "internal";

export type HubErrorSeverity = "critical" | "warning";

export type HubErrorInfo = {
  title: string;
  message: string;
  severity: HubErrorSeverity;
  source?: DataSourceKind;
};

export function resolveDisplayStatus<T>(
  loadStatus: DataStatus,
  data: T | null | undefined,
  isEmpty: (data: T) => boolean,
): DataStatus {
  if (loadStatus === "loading" || loadStatus === "error") return loadStatus;
  if (data != null && isEmpty(data)) return "empty";
  return "success";
}

export function formatLastSynced(date: Date | null): string | null {
  if (!date) return null;
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Updated just now";
  if (mins < 60) return `Updated ${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  return `Updated ${date.toLocaleDateString()}`;
}

export function isDataStale(lastSyncedAt: Date | null, staleAfterMs = 15 * 60 * 1000): boolean {
  if (!lastSyncedAt) return false;
  return Date.now() - lastSyncedAt.getTime() > staleAfterMs;
}
