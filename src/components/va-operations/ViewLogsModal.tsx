"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { ExecutionLogDetail } from "@/data/automationBuilder";
import { cn } from "@/lib/cn";

type ViewLogsModalProps = {
  open: boolean;
  logs: ExecutionLogDetail[];
  onClose: () => void;
};

type LogFilter = "all" | "success" | "failed";

const filters: { id: LogFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "success", label: "Success" },
  { id: "failed", label: "Failed" },
];

export function ViewLogsModal({ open, logs, onClose }: ViewLogsModalProps) {
  const [filter, setFilter] = useState<LogFilter>("all");

  useEffect(() => {
    if (!open) return;
    setFilter("all");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const visible = useMemo(() => {
    if (filter === "all") return logs;
    return logs.filter((log) => log.status === filter);
  }, [filter, logs]);

  if (!open) return null;

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close view logs modal" onClick={onClose} />
      <div className="va-ops-modal va-ops-modal-wide" role="dialog" aria-modal="true" aria-label="Execution logs">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Execution Logs</h2>
            <p className="va-ops-modal-subtitle">Recent workflow runs from execution history and failed jobs.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <div className="va-ops-filter-row" role="tablist" aria-label="Log filters">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                className={cn("va-ops-filter-btn", filter === item.id && "active")}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="va-ops-logs-table-wrap">
            <table className="va-ops-logs-table">
              <thead>
                <tr>
                  <th>Workflow Name</th>
                  <th>Status</th>
                  <th>Executed At</th>
                  <th>Duration</th>
                  <th>Result</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="va-ops-logs-empty">No logs match this filter.</td>
                  </tr>
                ) : (
                  visible.map((log) => (
                    <tr key={log.id} className={cn("va-ops-logs-row", log.status)}>
                      <td><span className="va-ops-lead-name">{log.workflowName}</span></td>
                      <td>
                        <span className={cn("badge", log.status === "failed" ? "badge-red" : "badge-green")}>
                          {log.status === "failed" ? "Failed" : "Success"}
                        </span>
                      </td>
                      <td>{log.executedAt}</td>
                      <td className="va-ops-lead-time">{log.duration}</td>
                      <td>{log.result}</td>
                      <td className="va-ops-logs-error">{log.errors ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
