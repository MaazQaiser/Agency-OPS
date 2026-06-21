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
import { cn } from "@/lib/cn";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { CarrierSearchDrawer } from "./CarrierSearchDrawer";

const filterLabels: Record<keyof CarrierFilterState, string> = {
  state: "State",
  productType: "Product Type",
  vertical: "Vertical",
  riskType: "Risk Type",
  admitted: "Admitted / Non-Admitted",
  submissionType: "Submission Type",
};

export function CarrierSearchTab({ addedCarriers = [] }: { addedCarriers?: CarrierRecord[] }) {
  const loading = useTabLoading();
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="va-ops-role-view carrier-search">
        <KpiSkeletonGrid count={4} />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view carrier-search">
      <section className="va-ops-kpi-strip" aria-label="Carrier library KPI summary">
        <div className="commercial-hub-kpi-grid carrier-kpi-grid">
          {carrierSearchKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
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
                <th>Carrier Name</th>
                <th>Product</th>
                <th>Vertical Appetite</th>
                <th>States</th>
                <th>Risk Type</th>
                <th>Submission Method</th>
                <th>MGA Contact</th>
                <th>Response Time</th>
                <th>Status</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="carrier-search-row"
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
                  <td>{row.product}</td>
                  <td>{row.verticalAppetite}</td>
                  <td>{row.states}</td>
                  <td>
                    <span className={cn("badge", riskTypeClass[row.riskType])}>{row.riskType}</span>
                  </td>
                  <td>{row.submissionMethod}</td>
                  <td>{row.mgaContact}</td>
                  <td>{row.responseTime}</td>
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

      <section className="va-ops-panel" aria-label="Recommended markets">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Recommended Markets</h3>
          <p className="va-ops-section-sub">Smart suggestions based on vertical, product, and state fit.</p>
        </div>
        <div className="carrier-recommended-grid">
          {recommendedMarkets.map((rec) => (
            <article key={rec.id} className="carrier-recommended-card">
              <h4 className="carrier-recommended-label">{rec.label}</h4>
              <p className="carrier-recommended-sub">Recommended:</p>
              <ul className="carrier-recommended-list">
                {rec.carriers.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      className="carrier-recommended-link"
                      onClick={() => {
                        const match = allCarriers.find((c) => c.name === name);
                        if (match) setSelectedCarrier(match);
                      }}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          ))}
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
          <div className="commercial-hub-table-wrap">
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

      <CarrierSearchDrawer
        carrier={selectedCarrier}
        onClose={() => setSelectedCarrier(null)}
        onViewProfile={openProfile}
        onStartSubmission={startSubmission}
        onUseCarrier={useCarrier}
      />
    </div>
  );
}
