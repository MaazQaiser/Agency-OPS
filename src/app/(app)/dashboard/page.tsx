import Link from "next/link";
import { AlertBox } from "@/components/ui/Alert";
import { KpiCard, KpiGrid } from "@/components/ui/KpiCard";
import { PageHeader, SectionLabel } from "@/components/ui/PageHeader";
import {
  dashboardAlerts,
  dashboardExecutiveKpis,
  dashboardHeader,
  dashboardMetricHighlights,
  dashboardTeamSnapshots,
} from "@/data/dashboard";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

type SnapshotRowProps = {
  name: string;
  role: string;
  metric: string;
  metricClassName?: string;
};

function SnapshotRow({ name, role, metric, metricClassName }: SnapshotRowProps) {
  return (
    <div className="snapshot-row">
      <div className="snapshot-member">
        <span className="snapshot-avatar" aria-hidden="true">
          {getNameInitials(name)}
        </span>
        <div>
          <div className="snapshot-name">{name}</div>
          <div className="snapshot-role">{role}</div>
        </div>
      </div>
      <div className={cn("snapshot-metric", metricClassName)}>{metric}</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="module-dashboard">
      <div className="page-container">
        <PageHeader
          title={dashboardHeader.title}
          titleEmphasis={dashboardHeader.titleEmphasis}
          patent={dashboardHeader.patent}
          variant="dashboard"
        />

        <SectionLabel>Executive KPIs — All Modules</SectionLabel>
        <KpiGrid>
          {dashboardExecutiveKpis.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              sub={`${kpi.module} · ${kpi.sub}`}
              variant="commercial"
              color={
                ["primary", "green", "red", "yellow"].includes(kpi.variant)
                  ? (kpi.variant as "primary" | "green" | "red" | "yellow")
                  : undefined
              }
              valueStyle={kpi.variant === "blue" ? { color: "var(--blue)" } : undefined}
            />
          ))}
        </KpiGrid>

        <SectionLabel>Alerts &amp; Flags</SectionLabel>
        <div className="dashboard-alerts">
          {dashboardAlerts.map((alert) => (
            <AlertBox
              key={`${alert.source}-${alert.title}`}
              variant={alert.variant}
              title={`[${alert.source}] ${alert.title}`}
              body={alert.body}
            />
          ))}
        </div>

        <SectionLabel>Team Snapshots</SectionLabel>
        <div className="dashboard-snapshots">
          <div className="snapshot-card">
            <div className="snapshot-header">
              <span>Production</span>
              <Link href={routes.producer} className="snapshot-link">
                View scorecard →
              </Link>
            </div>
            <div className="snapshot-list">
              {dashboardTeamSnapshots.production.map((member) => (
                <SnapshotRow
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  metric={member.metric}
                />
              ))}
            </div>
          </div>

          <div className="snapshot-card">
            <div className="snapshot-header">
              <span>Retention</span>
              <Link href={routes.retention} className="snapshot-link">
                View scorecard →
              </Link>
            </div>
            <div className="snapshot-list">
              {dashboardTeamSnapshots.retention.map((member) => (
                <SnapshotRow
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  metric={member.metric}
                />
              ))}
            </div>
          </div>

          <div className="snapshot-card">
            <div className="snapshot-header">
              <span>Commercial VAs</span>
              <Link href={routes.commercial} className="snapshot-link">
                View tracker →
              </Link>
            </div>
            <div className="snapshot-list">
              {dashboardTeamSnapshots.commercial.map((member) => (
                <SnapshotRow
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  metric={member.metric}
                  metricClassName={`pace-${member.paceVariant}`}
                />
              ))}
            </div>
          </div>
        </div>

        <SectionLabel>Important Metrics</SectionLabel>
        <div className="dashboard-metrics-grid">
          {dashboardMetricHighlights.map((item) => (
            <div key={item.label} className="metric-highlight">
              <div className="metric-highlight-label">{item.label}</div>
              <div className="metric-highlight-value">{item.value}</div>
              <div className="metric-highlight-goal">{item.goal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
