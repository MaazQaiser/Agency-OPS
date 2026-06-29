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
  favoriteCarrierStack,
  getCarrierProfileHref,
  marketFeedEventClass,
  marketFeedEventLabel,
  marketIntelligenceFeed,
  matchesCarrierFilters,
  rankingBadgeClass,
  recommendedMarkets,
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
import { RecommendedMarketCard } from "./RecommendedMarketCard";

const riskRowClass = {
  "High Risk": "carrier-search-row--high-risk",
  Restricted: "carrier-search-row--restricted",
  Standard: "",
  Preferred: "",
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

  const openCarrierByName = (name: string) => {
    const match = allCarriers.find((c) => c.name === name);
    if (match) setSelectedCarrier(match);
  };

  const openStackCarrier = (carrierId: string) => {
    openProfile(carrierId);
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
          <p className="va-ops-section-sub">
            Intelligent decision cards — appetite match, turnaround, bind rate, and team usage signals.
          </p>
        </div>
        <div className="carrier-market-rec-grid">
          {recommendedMarkets.map((rec) => (
            <RecommendedMarketCard
              key={rec.id}
              rec={rec}
              onOpenCarrier={openCarrierByName}
            />
          ))}
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Carrier search results">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Carrier Results</h3>
          <p className="va-ops-section-sub">
            {filteredRows.length} result{filteredRows.length === 1 ? "" : "s"} — ranked by fit, speed, and appetite status.
          </p>
        </div>
        <div className="commercial-hub-table-wrap carrier-search-table-wrap">
          <table className="commercial-hub-table carrier-search-table carrier-search-table--ranked">
            <thead>
              <tr>
                <th>Carrier</th>
                <th>Product</th>
                <th>Appetite</th>
                <th>State</th>
                <th>Method</th>
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
                  <td className="carrier-search-carrier-cell">
                    <span className="commercial-hub-carrier-name">{row.name}</span>
                    {row.rankingBadges && row.rankingBadges.length > 0 ? (
                      <div className="carrier-rank-badges">
                        {row.rankingBadges.map((badge) => (
                          <span
                            key={badge}
                            className={cn("carrier-rank-badge", rankingBadgeClass[badge])}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <span className="carrier-search-product-name">{row.product}</span>
                  </td>
                  <td>
                    <span className={cn("badge", carrierStatusClass[row.status])}>{row.status}</span>
                  </td>
                  <td className="carrier-search-state-cell">{row.states}</td>
                  <td>{row.submissionMethod}</td>
                  <td className="carrier-search-action-cell">
                    <button
                      type="button"
                      className="va-ops-action-btn carrier-search-profile-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProfile(row.id);
                      }}
                    >
                      View Profile
                    </button>
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
        <section className="va-ops-panel carrier-market-feed" aria-label="Live market intelligence">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Live Market Feed</h3>
            <p className="va-ops-section-sub">Real-time appetite shifts, product launches, and restriction alerts.</p>
          </div>
          <ol className="carrier-market-feed-list">
            {marketIntelligenceFeed.map((item) => (
              <li key={item.id} className="carrier-market-feed-item">
                <span className={cn("carrier-feed-type", marketFeedEventClass[item.type])}>
                  {marketFeedEventLabel[item.type]}
                </span>
                <div className="carrier-market-feed-body">
                  <div className="carrier-market-feed-carrier">{item.carrier}</div>
                  <div className="carrier-market-feed-message">{item.message}</div>
                  <div className="carrier-market-feed-time">{item.timeAgo}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="va-ops-panel" aria-label="Favorite carrier stack">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Favorite Carrier Stack</h3>
            <p className="va-ops-section-sub">Reusable broker memory — your team&apos;s go-to markets.</p>
          </div>
          <div className="carrier-stack-list">
            {favoriteCarrierStack.map((item) => (
              <article key={item.id} className="carrier-stack-card">
                <div className="carrier-stack-card-top">
                  <strong className="carrier-stack-name">{item.name}</strong>
                  <span className={cn("badge", carrierStatusClass[item.appetiteStatus])}>
                    {item.appetiteStatus}
                  </span>
                </div>
                <dl className="carrier-stack-meta">
                  <div>
                    <dt>Preferred vertical</dt>
                    <dd>{item.preferredVertical}</dd>
                  </div>
                  <div>
                    <dt>Avg turnaround</dt>
                    <dd>{item.avgTurnaround}</dd>
                  </div>
                  <div>
                    <dt>Last successful bind</dt>
                    <dd>{item.lastSuccessfulBind}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="carrier-stack-open-btn"
                  onClick={() => openStackCarrier(item.carrierId)}
                >
                  <AppIcon name="arrow-right-left" size={14} strokeWidth={2} />
                  Quick open
                </button>
              </article>
            ))}
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
