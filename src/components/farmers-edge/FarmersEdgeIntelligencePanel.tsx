"use client";

import Link from "next/link";
import { useEffect } from "react";
import { VaOpsDrawerRoot } from "@/components/ui/VaOpsDrawerRoot";
import { AppIcon } from "@/components/ui/AppIcon";
import { routes } from "@/lib/routes";
import {
  farmersEdgeIntelModeDescription,
  farmersEdgeIntelModeLabel,
  type FarmersEdgeIntelRequest,
} from "@/lib/farmersEdgeIntel";
import { FarmersEdgeWorkspace } from "./FarmersEdgeWorkspace";

type FarmersEdgeIntelligencePanelProps = {
  request: FarmersEdgeIntelRequest;
  onClose: () => void;
};

export function FarmersEdgeIntelligencePanel({
  request,
  onClose,
}: FarmersEdgeIntelligencePanelProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const modeLabel = farmersEdgeIntelModeLabel(request.mode);

  return (
    <VaOpsDrawerRoot className="farmers-edge-intel-root">
      <button
        type="button"
        className="va-ops-drawer-backdrop farmers-edge-intel-backdrop"
        aria-label="Close Farmers Edge intelligence"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer farmers-edge-intelligence-drawer module-farmers-edge"
        role="dialog"
        aria-modal="true"
        aria-label={`${modeLabel} — Farmers Edge intelligence`}
      >
        <header className="fe-intel-drawer-header">
          <div className="fe-intel-drawer-identity">
            <div className="fe-hub-icon" aria-hidden="true">
              ▣
            </div>
            <div>
              <p className="fe-intel-drawer-eyebrow">Commercial Hub · Intelligence Mode</p>
              <h2 className="fe-intel-drawer-title">{modeLabel}</h2>
              <p className="fe-intel-drawer-subtitle">{request.contextLine}</p>
            </div>
          </div>
          <div className="fe-intel-drawer-header-actions">
            <Link
              href={routes.farmersEdge}
              className="fe-intel-full-hub-link"
              onClick={onClose}
            >
              Open full hub
            </Link>
            <button
              type="button"
              className="va-ops-drawer-close"
              aria-label="Close intelligence panel"
              onClick={onClose}
            >
              <AppIcon name="close" size={18} strokeWidth={2} />
            </button>
          </div>
        </header>

        <div className="fe-intel-context-banner" role="status">
          <span className="fe-scope-tag">Farmers Edge</span>
          <p>{farmersEdgeIntelModeDescription(request.mode)}</p>
          {request.client && (
            <p className="fe-intel-context-client">
              <strong>{request.client}</strong>
              {request.coverage ? ` · ${request.coverage}` : ""}
            </p>
          )}
          {request.coverageGaps && request.coverageGaps.length > 0 && (
            <ul className="fe-intel-context-gaps">
              {request.coverageGaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          )}
          {request.missingDocs && request.missingDocs.length > 0 && (
            <ul className="fe-intel-context-gaps">
              {request.missingDocs.map((doc) => (
                <li key={doc}>Missing: {doc}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="fe-intel-drawer-body">
          <FarmersEdgeWorkspace
            key={`${request.mode}-${request.submissionId ?? request.client ?? "general"}`}
            initialVertical={request.verticalId ?? "all"}
            initialView={request.initialView ?? "playbook"}
            compact
          />
        </div>
      </aside>
    </VaOpsDrawerRoot>
  );
}
