"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useIsMobile } from "@/lib/useBreakpoint";
import { cn } from "@/lib/cn";
import type { ExportKind } from "@/lib/export";
import {
  exportCarrierPerformanceCsv,
  exportCarrierResponseLogCsv,
  exportCarrierResponseLogPdf,
  exportCommercialPipelineCsv,
  exportCommercialPipelinePdf,
  exportLeadVelocityCsv,
  exportNotificationHistoryCsv,
  exportOwnerKpiSummaryPdf,
  exportProducerScorecardPdf,
  exportRetentionScorecardCsv,
  exportRetentionScorecardPdf,
  exportSendCenterHistoryCsv,
  exportSendCenterHistoryPdf,
  exportSubmissionLogCsv,
  exportSubmissionLogPdf,
  printCurrentPage,
} from "@/lib/export";

type ExportMenuProps = {
  kind: ExportKind;
  className?: string;
  compact?: boolean;
  onExported?: (action: "pdf" | "csv" | "print") => void;
  /** Required for epay-invoice kind */
  invoiceExport?: () => void;
};

function runExport(kind: ExportKind, action: "pdf" | "csv" | "print", invoiceExport?: () => void): void {
  if (action === "print") {
    printCurrentPage();
    return;
  }

  if (kind === "epay-invoice" && action === "pdf" && invoiceExport) {
    invoiceExport();
    return;
  }

  const exporters: Record<ExportKind, { pdf?: () => void; csv?: () => void }> = {
    "commercial-pipeline": { pdf: exportCommercialPipelinePdf, csv: exportCommercialPipelineCsv },
    "producer-scorecard": { pdf: exportProducerScorecardPdf },
    "retention-scorecard": { pdf: exportRetentionScorecardPdf, csv: exportRetentionScorecardCsv },
    "epay-invoice": { pdf: invoiceExport },
    "submission-log": { pdf: exportSubmissionLogPdf, csv: exportSubmissionLogCsv },
    "carrier-response": { pdf: exportCarrierResponseLogPdf, csv: exportCarrierResponseLogCsv },
    "send-center-history": { pdf: exportSendCenterHistoryPdf, csv: exportSendCenterHistoryCsv },
    "owner-kpi": { pdf: exportOwnerKpiSummaryPdf },
    "lead-velocity": { csv: exportLeadVelocityCsv },
    "notification-history": { csv: exportNotificationHistoryCsv },
    "carrier-performance": { csv: exportCarrierPerformanceCsv },
  };

  const handler = exporters[kind][action];
  handler?.();
}

const ACTIONS = [
  { id: "pdf" as const, label: "Export PDF", icon: "file-text" as const },
  { id: "csv" as const, label: "Export CSV", icon: "download" as const },
  { id: "print" as const, label: "Print", icon: "clipboard" as const },
];

export function ExportMenu({ kind, className, compact, onExported, invoiceExport }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);

  const hasCsv = kind !== "producer-scorecard" && kind !== "owner-kpi" && kind !== "epay-invoice";
  const hasPdf = kind !== "lead-velocity" && kind !== "notification-history" && kind !== "carrier-performance";

  const handleAction = useCallback(
    (action: "pdf" | "csv" | "print") => {
      runExport(kind, action, invoiceExport);
      onExported?.(action);
      setOpen(false);
      setSheetOpen(false);
    },
    [kind, invoiceExport, onExported],
  );

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const visibleActions = ACTIONS.filter((a) => {
    if (a.id === "csv" && !hasCsv) return false;
    if (a.id === "pdf" && !hasPdf) return false;
    return true;
  });

  if (isMobile) {
    return (
      <div className={cn("export-menu", className)} ref={rootRef}>
        <button
          type="button"
          className={cn("export-menu-trigger", compact && "export-menu-trigger--compact")}
          onClick={() => setSheetOpen(true)}
          aria-label="Export options"
        >
          <AppIcon name="download" size={16} strokeWidth={2} />
          {!compact && <span>Export</span>}
        </button>
        {sheetOpen && (
          <div className="export-menu-sheet-root" role="presentation">
            <button
              type="button"
              className="export-menu-sheet-backdrop"
              aria-label="Close export menu"
              onClick={() => setSheetOpen(false)}
            />
            <div className="export-menu-sheet" role="dialog" aria-label="Export options">
              <div className="export-menu-sheet-handle" aria-hidden="true" />
              <h3 className="export-menu-sheet-title">Export</h3>
              <ul className="export-menu-sheet-list">
                {visibleActions.map((action) => (
                  <li key={action.id}>
                    <button
                      type="button"
                      className="export-menu-sheet-item"
                      onClick={() => handleAction(action.id)}
                    >
                      <AppIcon name={action.icon} size={20} strokeWidth={2} />
                      {action.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("export-menu", className)} ref={rootRef}>
      <button
        type="button"
        className={cn("export-menu-trigger", compact && "export-menu-trigger--compact")}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <AppIcon name="download" size={16} strokeWidth={2} />
        {!compact && <span>Export</span>}
        <AppIcon name="chevron-down" size={14} strokeWidth={2.25} className={cn("export-menu-chevron", open && "open")} />
      </button>
      {open && (
        <ul className="export-menu-dropdown" role="menu">
          {visibleActions.map((action) => (
            <li key={action.id} role="none">
              <button
                type="button"
                className="export-menu-item"
                role="menuitem"
                onClick={() => handleAction(action.id)}
              >
                <AppIcon name={action.icon} size={15} strokeWidth={2} />
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
