"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  bilingualAlerts,
  bilingualLanguageFilterOptions,
  bilingualSupportFilterOptions,
  bilingualVaOptions,
  getClientLanguage,
  getLanguageBadgeCode,
  loadBilingualOverrides,
  mergeClientProfiles,
  saveBilingualOverrides,
  seedBilingualQueue,
  seedClientLanguageProfiles,
  type BilingualClientOverrides,
  type BilingualQueueItem,
  type ClientLanguageProfile,
} from "@/data/bilingualClient";
import type { VaOperationsRoleId } from "@/data/vaOperations";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { BilingualQueueDrawer } from "@/components/bilingual/BilingualQueueDrawer";

type BilingualQueueTabProps = {
  role: VaOperationsRoleId;
};

const queueStatusClass: Record<BilingualQueueItem["status"], string> = {
  New: "badge-gray",
  Assigned: "badge-blue",
  "In Progress": "badge-yellow",
  Waiting: "badge-amber",
  Resolved: "badge-green",
};

const priorityClass = {
  High: "badge-red",
  Medium: "badge-yellow",
  Low: "badge-gray",
} as const;

export function BilingualQueueTab({ role }: BilingualQueueTabProps) {
  const toast = useToast();
  const { can, requirePermission, logAudit } = usePermissions();
  const canAssign = can("action:assign-tasks");
  const canOverride = can("action:override-owner");
  const [queue, setQueue] = useState<BilingualQueueItem[]>(seedBilingualQueue);
  const [profiles, setProfiles] = useState<ClientLanguageProfile[]>(seedClientLanguageProfiles);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All Languages");
  const [supportFilter, setSupportFilter] = useState("All Support");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BilingualQueueItem | null>(null);

  useEffect(() => {
    const overrides = loadBilingualOverrides();
    setProfiles(mergeClientProfiles(seedClientLanguageProfiles, overrides));
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const persistProfile = useCallback((clientKey: string, patch: Partial<ClientLanguageProfile>) => {
    setProfiles((prev) => {
      const next = prev.map((p) => (p.clientKey === clientKey ? { ...p, ...patch } : p));
      const overrides: BilingualClientOverrides = loadBilingualOverrides();
      overrides[clientKey] = { ...(overrides[clientKey] ?? {}), ...patch };
      saveBilingualOverrides(overrides);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return queue.filter((item) => {
      const profile = getClientLanguage(item.client, profiles);
      if (languageFilter !== "All Languages" && profile.preferredLanguage !== languageFilter) return false;
      if (supportFilter === "Bilingual Supported" && !profile.assignedBilingualVa) return false;
      if (supportFilter === "Needs Language Support" && profile.assignedBilingualVa) return false;
      if (!q) return true;
      return [item.client, item.language, item.assignedVa, item.module, item.notes].join(" ").toLowerCase().includes(q);
    });
  }, [queue, search, languageFilter, supportFilter, profiles]);

  const needsSupportCount = useMemo(
    () => profiles.filter((p) => p.preferredLanguage !== "English" && !p.assignedBilingualVa).length,
    [profiles],
  );

  const handleAction = useCallback(
    (action: string, item: BilingualQueueItem) => {
      const profile = getClientLanguage(item.client, profiles);

      switch (action) {
        case "Assign bilingual VA": {
          requirePermission("action:assign-tasks", () => {
          const vaIdx = bilingualVaOptions.indexOf(profile.assignedBilingualVa ?? "Unassigned");
          const nextVa = bilingualVaOptions[(vaIdx + 1) % (bilingualVaOptions.length - 1)];
          persistProfile(item.clientKey, { assignedBilingualVa: nextVa });
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, assignedVa: nextVa, status: "Assigned" as const } : q,
            ),
          );
          toast.success(`Assigned ${nextVa} — ${item.client}`);
          });
          break;
        }
        case "Override language": {
          requirePermission("action:override-owner", () => {
          persistProfile(item.clientKey, { preferredLanguage: "Spanish", proposalLanguagePreference: "Spanish" });
          logAudit("override-used", `Language override — ${item.client}`);
          toast.success(`Language overridden — ${item.client}`);
          });
          break;
        }
        case "Force translation": {
          requirePermission("action:override-owner", () => {
          toast.info(`Translation queued — ${item.client}`);
          });
          break;
        }
        case "View bilingual workload":
          toast.info(`Bilingual workload: ${needsSupportCount} clients need support`);
          break;
        default:
          toast.success(`${action} — ${item.client}`);
      }
    },
    [logAudit, needsSupportCount, persistProfile, profiles, requirePermission, toast],
  );

  const selectedProfile = selected ? getClientLanguage(selected.client, profiles) : null;

  return (
    <div className="bilingual-queue-view">
      <RoleTabHeader
        title="Bilingual Queue"
        subtitle="Language preference routing — assign bilingual VAs and resolve language support gaps."
      />

      <section className="bilingual-summary-strip" aria-label="Bilingual summary">
        <div className="bilingual-summary-card">
          <span className="bilingual-summary-value">{queue.length}</span>
          <span className="bilingual-summary-label">Active Queue Items</span>
        </div>
        <div className="bilingual-summary-card">
          <span className="bilingual-summary-value">{needsSupportCount}</span>
          <span className="bilingual-summary-label">Needs Language Support</span>
        </div>
        <div className="bilingual-summary-card">
          <span className="bilingual-summary-value">{profiles.filter((p) => p.assignedBilingualVa).length}</span>
          <span className="bilingual-summary-label">Bilingual Supported</span>
        </div>
        <div className="bilingual-summary-card">
          <span className="bilingual-summary-value">{bilingualAlerts.filter((a) => a.severity === "critical").length}</span>
          <span className="bilingual-summary-label">Critical Alerts</span>
        </div>
      </section>

      <section className="va-ops-panel bilingual-alerts-panel" aria-label="Bilingual alerts">
        <div className="va-ops-panel-header">
          <h2 className="va-ops-section-title">Language Alerts</h2>
          <p className="va-ops-section-sub">Missing support, translation mismatches, and localization gaps.</p>
        </div>
        <ul className="bilingual-alerts-list">
          {bilingualAlerts.map((alert) => (
            <li key={alert.id} className={cn("bilingual-alert-item", alert.severity)}>
              <div className="bilingual-alert-header">
                <span className={cn("badge", alert.severity === "critical" ? "badge-red" : alert.severity === "warning" ? "badge-yellow" : "badge-blue")}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </span>
                <span className="badge badge-gray">{alert.module}</span>
              </div>
              <strong>{alert.title}</strong>
              <p>{alert.detail}</p>
              {alert.clientKey && (
                <button
                  type="button"
                  className="bilingual-alert-link"
                  onClick={() => {
                    const item = queue.find((q) => q.clientKey === alert.clientKey);
                    if (item) setSelected(item);
                  }}
                >
                  View client
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="va-ops-panel" aria-label="Bilingual queue">
        <div className="bilingual-toolbar">
          <div className="send-center-search-wrap">
            <AppIcon name="search" size={16} strokeWidth={2} />
            <input
              type="search"
              placeholder="Search by client, language, or VA…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search bilingual queue"
            />
          </div>
          <div className="bilingual-filter-row">
            <select className="header-filter-select" value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} aria-label="Filter by preferred language">
              {bilingualLanguageFilterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select className="header-filter-select" value={supportFilter} onChange={(e) => setSupportFilter(e.target.value)} aria-label="Filter by bilingual support">
              {bilingualSupportFilterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="send-center-skeleton" aria-busy="true" aria-label="Loading bilingual queue">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="send-center-skeleton-row" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="commercial-hub-empty-state" role="status">
            <div className="commercial-hub-empty-state-title">No bilingual queue items</div>
            <p className="commercial-hub-empty-state-desc">Try adjusting your search or language filters.</p>
          </div>
        ) : (
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table bilingual-queue-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Language</th>
                  <th>Assigned VA</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Module</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const profile = getClientLanguage(row.client, profiles);
                  return (
                    <tr key={row.id} className="commercial-hub-table-row-clickable" onClick={() => setSelected(row)}>
                      <td className="commercial-hub-client-cell">
                        <span className="bilingual-client-cell">
                          {row.client}
                          <ClientLanguageBadges profile={profile} compact />
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-blue">{getLanguageBadgeCode(row.language)}</span>
                      </td>
                      <td>{row.assignedVa === "Unassigned" ? <span className="badge badge-red">Unassigned</span> : <UserChip name={row.assignedVa} />}</td>
                      <td><span className={cn("badge", queueStatusClass[row.status])}>{row.status}</span></td>
                      <td><span className={cn("badge", priorityClass[row.priority])}>{row.priority}</span></td>
                      <td>{row.module}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="send-center-row-actions">
                          <button type="button" className="va-ops-action-btn" onClick={() => setSelected(row)}>View</button>
                          {canAssign && (
                            <button type="button" className="va-ops-action-btn" onClick={() => handleAction("Assign bilingual VA", row)}>Assign</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <BilingualQueueDrawer
        item={selected}
        profile={selectedProfile}
        canAssign={canAssign}
        canOverride={canOverride}
        onClose={() => setSelected(null)}
        onAction={handleAction}
      />
    </div>
  );
}
