"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  carrierFilterOptions,
  carrierRecords,
  carrierSearchKpis,
  carrierSearchPlaceholder,
  carrierStatusClass,
  defaultCarrierFilters,
  getCarrierProfileHref,
  matchesCarrierFilters,
  recentMarketActivity,
  recommendedMarkets,
  riskTypeClass,
  savedMarkets,
  type CarrierFilterState,
  type CarrierRecord,
} from "@/data/carrierLibrary";
import { routes } from "@/lib/routes";
import { crossModuleRoutes, navigateWithHandoff } from "@/lib/crossModuleLinks";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { cn } from "@/lib/cn";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { CarrierSearchDrawer } from "./CarrierSearchDrawer";
import { AppetiteFilterMatrix } from "./AppetiteFilterMatrix";

const riskRowClass = {
  "High Risk": "carrier-search-row--high-risk",
  Restricted: "carrier-search-row--restricted",
  Standard: "",
  Preferred: "",
} as const;

const riskLevelClass = {
  Open: "badge-green",
  Conditional: "badge-amber",
  Restricted: "badge-amber",
  "High Risk": "badge-rose",
} as const;

const filterLabels: Record<keyof CarrierFilterState, string> = {
  state: "State",
  productType: "Product Type",
  vertical: "Vertical",
  riskType: "Risk Type",
  admitted: "Admitted / Non-Admitted",
  submissionType: "Submission Method",
};

export function CarrierSearchTab({ addedCarriers = [] }: { addedCarriers?: CarrierRecord[] }) {
  const router = useRouter();
  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => carrierRecords,
    errorPreset: "sheets-cache-failed",
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultCarrierFilters);
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierRecord | null>(null);

  const allCarriers = useMemo(
    () => [...carrierRecords, ...addedCarriers],
    [addedCarriers],
  );

  const filteredRows = useMemo(
    () => allCarriers.filter((row) => matchesCarrierFilters(row, search, filters)),
    [allCarriers, search, filters],
  );

  const status = resolveDisplayStatus(loadStatus, filteredRows, (d) => d.length === 0);

  const updateFilter = (key: keyof CarrierFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openProfile = (carrierId: string) => {
    setSelectedCarrier(null);
    router.push(getCarrierProfileHref(carrierId), { scroll: false });
  };

  const startSubmission = (carrierId: string) => {
    setSelectedCarrier(null);
    router.push(routes.intakeForms, { scroll: false });
  };

  const useCarrier = (carrier: CarrierRecord) => {
    setSelectedCarrier(null);
    navigateWithHandoff(
      router,
      crossModuleRoutes.carrierFollowUp(
        { carrier: carrier.id, carrierName: carrier.name },
        { href: routes.carrierLibrary, label: "Carrier Library" },
      ),
      {
        type: "carrier-to-followup",
        sourcePath: routes.carrierLibrary,
        returnLabel: "Carrier Library",
        payload: {
          carrierId: carrier.id,
          carrierName: carrier.name,
          appetite: carrier.verticalAppetite,
          docs: carrier.drawer.submissionRequirements.join("; "),
        },
      },
      { href: routes.carrierLibrary, label: "Carrier Library" },
    );
  };

  const openSavedMarket = (name: string) => {
    const match = allCarriers.find((c) => c.name === name);
    if (match) setSelectedCarrier(match);
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view carrier-search">
          <KpiSkeletonGrid count={4} />
          <TableSkeleton rows={6} />
        </div>
      }
      empty={<HubEmptyState preset="carrier-search" />}
      error={
        <HubErrorState
          preset="sheets-cache-failed"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
    <div className="va-ops-role-view carrier-search">
      <section className="va-ops-kpi-strip" aria-label="Carrier library KPI summary">
        <div className="commercial-hub-kpi-grid hub-kpi-grid carrier-kpi-grid">
          {carrierSearchKpis.map((kpi) => (
            <VaOpsKpiCard key={kpi.label} {...kpi} className="commercial-hub-kpi-uniform" sparkline={false} />
          ))}
        </div>
      </section>

      <div className="carrier-search-filters">
        <label className="va-ops-search carrier-search-input-wrap" aria-label="Search carriers">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input
            type="search"
            className="va-ops-search-input"
            placeholder={carrierSearchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        {(Object.keys(carrierFilterOptions) as (keyof CarrierFilterState)[]).map((key) => (
          <label key={key} className="carrier-search-filter">
            <select
              className="header-filter-select carrier-search-select"
              aria-label={filterLabels[key]}
              value={filters[key]}
              onChange={(e) => updateFilter(key, e.target.value)}
            >
              {carrierFilterOptions[key].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <section className="va-ops-panel carrier-intel-primary" aria-label="Recommended markets">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Recommended Markets</h3>
          <p className="va-ops-section-sub">Primary decision intelligence — appetite, vertical, and turnaround fit.</p>
        </div>
        <div className="carrier-market-rec-grid">
          {recommendedMarkets.map((rec) => (
            <article key={rec.id} className="carrier-market-rec-card">
              <div className="carrier-market-rec-context">
                <span className="carrier-market-rec-chip">{rec.vertical}</span>
                <span className="carrier-market-rec-chip">{rec.product}</span>
                <span className="carrier-market-rec-chip">{rec.state}</span>
                <span className={cn("badge", riskLevelClass[rec.riskLevel])}>{rec.riskLevel}</span>
              </div>
              <div className="carrier-market-rec-best">
                <span className="carrier-market-rec-best-label">Best Market</span>
                <button
                  type="button"
                  className="carrier-market-rec-carrier"
                  onClick={() => {
                    const match = allCarriers.find((c) => c.name === rec.bestCarrier);
                    if (match) setSelectedCarrier(match);
                  }}
                >
                  {rec.bestCarrier}
                </button>
              </div>
              <p className="carrier-market-rec-reason">{rec.reason}</p>
              <dl className="carrier-market-rec-intel">
                <div><dt>Appetite Fit</dt><dd>{rec.appetiteFit}</dd></div>
                <div><dt>Vertical Fit</dt><dd>{rec.verticalFit}</dd></div>
                <div><dt>Turnaround</dt><dd>{rec.turnaround}</dd></div>
                {rec.restrictions && (
                  <div><dt>Restrictions</dt><dd>{rec.restrictions}</dd></div>
                )}
              </dl>
              {rec.alternateCarriers.length > 0 && (
                <div className="carrier-market-rec-alternates">
                  <span className="carrier-market-rec-alt-label">Also consider:</span>
                  {rec.alternateCarriers.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className="carrier-market-rec-alt-link"
                      onClick={() => {
                        const match = allCarriers.find((c) => c.name === name);
                        if (match) setSelectedCarrier(match);
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Carrier search results">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Carrier Results</h3>
          <p className="va-ops-section-sub">
            {filteredRows.length} result{filteredRows.length === 1 ? "" : "s"} — click a row to view details.
          </p>
        </div>
        <div className="commercial-hub-table-wrap carrier-search-table-wrap">
          <table className="commercial-hub-table carrier-search-table">
            <thead>
              <tr>
                <th>Carrier</th>
                <th>Product / Risk</th>
                <th>Vertical</th>
                <th>States</th>
                <th>Submission</th>
                <th>Status</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className={cn("carrier-search-row", riskRowClass[row.riskType])}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelectedCarrier(row)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCarrier(row);
                    }
                  }}
                >
                  <td className="commercial-hub-carrier-name">{row.name}</td>
                  <td>
                    <div className="carrier-search-product-cell">
                      <span className="carrier-search-product-name">{row.product}</span>
                      <span className={cn("badge carrier-search-product-risk", riskTypeClass[row.riskType])}>
                        {row.riskType}
                      </span>
                    </div>
                  </td>
                  <td>{row.verticalAppetite}</td>
                  <td>{row.states}</td>
                  <td>{row.submissionMethod}</td>
                  <td>
                    <span className={cn("badge", carrierStatusClass[row.status])}>{row.status}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="va-ops-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        useCarrier(row);
                      }}
                    >
                      Use Carrier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="commercial-hub-mid-grid">
        <section className="va-ops-panel" aria-label="Recent market activity">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Recent Market Activity</h3>
            <p className="va-ops-section-sub">Market changes and appetite updates.</p>
          </div>
          <ol className="outreach-activity-timeline">
            {recentMarketActivity.map((item) => (
              <li key={item.id} className="outreach-activity-item">
                <div className="outreach-activity-dot" aria-hidden="true" />
                <div className="outreach-activity-content">
                  <div className="outreach-activity-message">{item.message}</div>
                  <div className="outreach-activity-time">{item.timeAgo}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="va-ops-panel" aria-label="Saved markets">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Saved Markets</h3>
            <p className="va-ops-section-sub">Quick access to favorite carriers.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Carrier</th>
                  <th>Last Used</th>
                  <th>Top Vertical</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {savedMarkets.map((row) => (
                  <tr key={row.id}>
                    <td className="commercial-hub-carrier-name">{row.name}</td>
                    <td>{row.lastUsed}</td>
                    <td>{row.topVertical}</td>
                    <td>
                      <button
                        type="button"
                        className="va-ops-action-btn"
                        onClick={() => openSavedMarket(row.name)}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="va-ops-panel" aria-label="Appetite filter matrix">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Appetite Filter Matrix</h3>
          <p className="va-ops-section-sub">Select a vertical to filter carrier appetite at a glance.</p>
        </div>
        <AppetiteFilterMatrix />
      </section>

      <CarrierSearchDrawer
        carrier={selectedCarrier}
        onClose={() => setSelectedCarrier(null)}
        onViewProfile={openProfile}
        onStartSubmission={startSubmission}
        onUseCarrier={useCarrier}
      />
    </div>
    </DataStateView>
  );
}
