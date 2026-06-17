"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { submissions } from "@/data/commercialSubmissions";
import {
  filterSubmissions,
  getRowClass,
  getStatusBadgeClass,
  needsMarketWarning,
} from "@/lib/commercialHelpers";

const PAGE_SIZE = 5;

export function PipelineTab() {
  const [lobFilter, setLobFilter] = useState("all");
  const [producerFilter, setProducerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterSubmissions(submissions, { lob: lobFilter, producer: producerFilter, status: statusFilter }),
    [lobFilter, producerFilter, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);

  useEffect(() => {
    setPage(1);
  }, [lobFilter, producerFilter, statusFilter]);

  return (
    <div className="pipeline-tab">
      <div className="section-header section-header-with-filter">
        <div className="section-header-main">
          <div className="section-title">Full Pipeline View</div>
        </div>
        <div className="header-filter-group section-header-filters">
          <select
            className="header-filter-select"
            value={lobFilter}
            onChange={(e) => setLobFilter(e.target.value)}
            aria-label="Filter by line of business"
          >
            <option value="all">All LOBs</option>
            <option value="BOP">BOP</option>
            <option value="GL">GL</option>
            <option value="WC">WC</option>
            <option value="Comm Auto">Comm Auto</option>
            <option value="Contractors">Contractors</option>
          </select>
          <select
            className="header-filter-select"
            value={producerFilter}
            onChange={(e) => setProducerFilter(e.target.value)}
            aria-label="Filter by producer"
          >
            <option value="all">All Producers</option>
            <option value="Eva">Eva</option>
            <option value="Tracie">Tracie</option>
          </select>
          <select
            className="header-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="Quoted">Quoted</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Declined">Declined</option>
            <option value="Bound">Bound</option>
          </select>
        </div>
      </div>

      <div className="pipeline-table-block">
        <div className="table-wrap pipeline-table-wrap">
          <table style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Producer</th>
                <th>VA</th>
                <th>LOB</th>
                <th>Sub Date</th>
                <th>Markets</th>
                <th>Quotes</th>
                <th>Declines</th>
                <th>Premium</th>
                <th>Follow-Up</th>
                <th>Days</th>
                <th>Status</th>
                <th>Missing Docs</th>
                <th>UW</th>
                <th>Binding</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((s) => (
                <tr key={s.id} className={getRowClass(s.status, s.daysOpen)}>
                  <td style={{ fontSize: "var(--font-size-12)", color: "var(--text-muted)" }}>{s.id}</td>
                  <td><strong>{s.client}</strong></td>
                  <td>{s.producer}</td>
                  <td>{s.va}</td>
                  <td><span className="badge badge-blue">{s.lob}</span></td>
                  <td style={{ fontSize: "var(--font-size-12)" }}>{s.subDate}</td>
                  <td>{s.markets} {needsMarketWarning(s) && <span className="mkt-warn"><AppIcon name="triangle-alert" size={12} strokeWidth={2.5} /></span>}</td>
                  <td>{s.quotes}</td>
                  <td>{s.declines}</td>
                  <td>{s.premium ? `$${s.premium.toLocaleString()}` : "—"}</td>
                  <td style={{ fontSize: "var(--font-size-12)" }}>{s.followUp || "—"}</td>
                  <td style={{ color: s.daysOpen > 10 ? "var(--red)" : s.daysOpen > 5 ? "var(--yellow)" : "var(--text-main)" }}>{s.daysOpen}</td>
                  <td><span className={`badge ${getStatusBadgeClass(s.status, s.daysOpen)}`}>{s.status}</span></td>
                  <td style={{ fontSize: "var(--font-size-12)", color: s.missingDocs !== "None" && s.missingDocs !== "N/A" ? "var(--red)" : "var(--text-muted)" }}>{s.missingDocs}</td>
                  <td style={{ fontSize: "var(--font-size-12)", color: "var(--text-muted)" }}>{s.uw}</td>
                  <td style={{ fontSize: "var(--font-size-12)" }}>{s.binding || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination table-pagination-bar">
          <span className="table-pagination-meta">
            {filtered.length === 0
              ? "No submissions"
              : `${rangeStart}–${rangeEnd} of ${filtered.length}`}
          </span>
          <div className="table-pagination-controls">
            <button
              type="button"
              className="table-pagination-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`table-pagination-btn${currentPage === pageNumber ? " active" : ""}`}
                onClick={() => setPage(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className="table-pagination-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="pipeline-legend-bar">
        <div className="pipeline-legend">
          <span className="pipeline-legend-item">
            <span className="pipeline-legend-swatch quoted" />
            Quoted / Bound
          </span>
          <span className="pipeline-legend-item">
            <span className="pipeline-legend-swatch pending" />
            Pending Follow-Up
          </span>
          <span className="pipeline-legend-item">
            <span className="pipeline-legend-swatch overdue" />
            Overdue (48h+)
          </span>
          <span className="pipeline-legend-item">
            <span className="pipeline-legend-swatch declined" />
            Declined
          </span>
          <span className="pipeline-legend-item pipeline-legend-warning">
            <AppIcon name="triangle-alert" size={12} strokeWidth={2.5} />
            &lt;3 markets = violation
          </span>
        </div>
      </div>
    </div>
  );
}
