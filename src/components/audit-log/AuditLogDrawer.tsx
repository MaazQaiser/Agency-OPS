"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  auditActionTypes,
  auditActionLabels,
  auditHubSources,
  auditSeverityLabels,
  auditSeverityOptions,
  AUDIT_LOG_PAGE_SIZE,
  computeAuditMetrics,
  defaultAuditLogFilters,
  exportAuditLogCsv,
  filterAuditLog,
  groupAuditLogByDate,
  type AuditLogEntry,
  type AuditLogFilters,
} from "@/data/auditLog";
import { agencyRoles } from "@/data/rolePermissions";
import { cn } from "@/lib/cn";
import { HubEmptyState } from "@/components/state";
import { AuditLogItem } from "./AuditLogItem";

type AuditLogDrawerProps = {
  entries: AuditLogEntry[];
  loading?: boolean;
  onClose: () => void;
};

export function AuditLogDrawer({ entries, loading = false, onClose }: AuditLogDrawerProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<AuditLogFilters>(defaultAuditLogFilters);
  const [visibleCount, setVisibleCount] = useState(AUDIT_LOG_PAGE_SIZE);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    setVisibleCount(AUDIT_LOG_PAGE_SIZE);
  }, [search, filters]);

  const filtered = useMemo(
    () => filterAuditLog(entries, search, filters),
    [entries, search, filters],
  );

  const visibleEntries = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const grouped = useMemo(() => groupAuditLogByDate(visibleEntries), [visibleEntries]);

  const metrics = useMemo(() => computeAuditMetrics(entries), [entries]);

  const updateFilter = <K extends keyof AuditLogFilters>(key: K, value: AuditLogFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters =
    filters.action !== "all" ||
    filters.hub !== "all" ||
    filters.role !== "all" ||
    filters.severity !== "all";

  const clearFilters = () => {
    setFilters(defaultAuditLogFilters);
    setSearch("");
  };

  const showingCount = Math.min(visibleCount, filtered.length);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + AUDIT_LOG_PAGE_SIZE);
  };

  const handleExport = () => {
    exportAuditLogCsv(filtered);
  };

  return (
    <div className="va-ops-drawer-root audit-log-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop audit-log-backdrop"
        aria-label="Close audit log"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer audit-log-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Audit log"
      >
        <header className="audit-log-header">
          <div>
            <h2>Audit Log</h2>
            <p>Cross-hub activity trail — owner view</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close audit log" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>

        <div className="audit-log-toolbar">
          <div className="audit-log-search-wrap">
            <AppIcon name="search" size={15} strokeWidth={2} className="audit-log-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="audit-log-search"
              placeholder="Search who, what, record, hub…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search audit log"
            />
          </div>

          <div className="audit-log-filters" aria-label="Audit log filters">
            <label className="audit-log-filter">
              <span className="audit-log-filter-label">Action</span>
              <select
                value={filters.action}
                onChange={(e) => updateFilter("action", e.target.value as AuditLogFilters["action"])}
                aria-label="Filter by action type"
              >
                <option value="all">All actions</option>
                {auditActionTypes.map((action) => (
                  <option key={action} value={action}>
                    {auditActionLabels[action]}
                  </option>
                ))}
              </select>
            </label>

            <label className="audit-log-filter">
              <span className="audit-log-filter-label">Hub</span>
              <select
                value={filters.hub}
                onChange={(e) => updateFilter("hub", e.target.value as AuditLogFilters["hub"])}
                aria-label="Filter by hub source"
              >
                <option value="all">All hubs</option>
                {auditHubSources.map((hub) => (
                  <option key={hub} value={hub}>
                    {hub}
                  </option>
                ))}
              </select>
            </label>

            <label className="audit-log-filter">
              <span className="audit-log-filter-label">Role</span>
              <select
                value={filters.role}
                onChange={(e) => updateFilter("role", e.target.value as AuditLogFilters["role"])}
                aria-label="Filter by role"
              >
                <option value="all">All roles</option>
                {agencyRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="audit-log-filter">
              <span className="audit-log-filter-label">Severity</span>
              <select
                value={filters.severity}
                onChange={(e) => updateFilter("severity", e.target.value as AuditLogFilters["severity"])}
                aria-label="Filter by severity"
              >
                {auditSeverityOptions.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity === "all" ? "All" : auditSeverityLabels[severity]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {(hasActiveFilters || search) && (
            <button type="button" className="audit-log-clear-filters" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        <div className="audit-log-metrics" aria-label="Audit log summary metrics">
          <div className="audit-log-metric">
            <span className="audit-log-metric-value">{metrics.totalEventsToday}</span>
            <span className="audit-log-metric-label">Total Events Today</span>
          </div>
          <div className="audit-log-metric audit-log-metric--critical">
            <span className="audit-log-metric-value">{metrics.criticalActions}</span>
            <span className="audit-log-metric-label">Critical Actions</span>
          </div>
          <div className="audit-log-metric audit-log-metric--failed">
            <span className="audit-log-metric-value">{metrics.failedActions}</span>
            <span className="audit-log-metric-label">Failed Actions</span>
          </div>
          <div className="audit-log-metric audit-log-metric--pending">
            <span className="audit-log-metric-value">{metrics.pendingReviews}</span>
            <span className="audit-log-metric-label">Pending Reviews</span>
          </div>
        </div>

        <div className="audit-log-body">
          {loading ? (
            <div className="audit-log-skeleton" aria-busy="true" aria-label="Loading audit log">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="audit-log-skeleton-row" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <HubEmptyState
              title="No audit entries"
              description={
                hasActiveFilters || search
                  ? "No log entries match your search or filters. Try broadening your criteria."
                  : "Activity across hubs will appear here as actions are recorded."
              }
              compact
            />
          ) : (
            <div className="audit-log-groups">
              {grouped.map((group) => (
                <section key={group.label} className="audit-log-group" aria-label={group.label}>
                  <h3 className="audit-log-group-label">{group.label}</h3>
                  <ul className="audit-log-list">
                    {group.entries.map((entry) => (
                      <AuditLogItem key={entry.id} entry={entry} onNavigate={onClose} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        <footer className="audit-log-footer">
          <span className="audit-log-footer-count">
            Showing {showingCount} of {filtered.length} events
          </span>
          <div className="audit-log-footer-actions">
            {hasMore && (
              <button type="button" className="audit-log-footer-btn" onClick={handleLoadMore}>
                Load More
              </button>
            )}
            <button
              type="button"
              className={cn("audit-log-footer-btn", "audit-log-footer-btn--primary")}
              onClick={handleExport}
              disabled={filtered.length === 0}
            >
              Export Audit Log
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
