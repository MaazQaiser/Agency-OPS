"use client";

import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { farmersEdgeHeader } from "@/data/farmersEdge";

export function FarmersEdgePageHeader() {
  return (
    <header className="va-ops-page-header fe-page-header">
      <div className="va-ops-page-header-left">
        <div className="fe-hub-identity">
          <div className="fe-hub-icon" aria-hidden="true">🛡</div>
          <div className="va-ops-page-title-block">
            <div className="fe-scope-row">
              <h1 className="va-ops-page-title">{farmersEdgeHeader.title}</h1>
              <span className="fe-scope-tag">{farmersEdgeHeader.scopeTag}</span>
              <span className="fe-prd-tag">{farmersEdgeHeader.prdRef}</span>
            </div>
            <p className="va-ops-page-subtitle">{farmersEdgeHeader.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar">
        <span className="fe-freshness">{farmersEdgeHeader.freshnessLabel}</span>
        <HubHelpTrigger hubId="farmers-edge" />
      </div>
    </header>
  );
}
