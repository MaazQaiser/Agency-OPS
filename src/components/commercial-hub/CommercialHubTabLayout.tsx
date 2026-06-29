"use client";

import type { ReactNode } from "react";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { VaOpsKpiCard, type VaOpsKpiCardProps } from "@/components/kpi/VaOpsKpiCard";
import { cn } from "@/lib/cn";

export type CommercialHubTabAction = {
  id: string;
  label: string;
  icon?: AppIconName;
  variant?: "primary" | "secondary" | "utility";
};

type CommercialHubTabShellProps = {
  children: ReactNode;
  className?: string;
};

export function CommercialHubTabShell({ children, className }: CommercialHubTabShellProps) {
  return <div className={cn("commercial-hub-tab-shell", className)}>{children}</div>;
}

type CommercialHubTabHeaderProps = {
  title: string;
  subtitle: string;
  strategic?: boolean;
  actions?: CommercialHubTabAction[];
  onActionClick?: (actionId: string) => void;
  utilities?: ReactNode;
};

export function CommercialHubTabHeader({
  title,
  subtitle,
  strategic = false,
  actions,
  onActionClick,
  utilities,
}: CommercialHubTabHeaderProps) {
  const primary = actions?.filter((action) => action.variant === "primary") ?? [];
  const secondary = actions?.filter((action) => action.variant !== "primary" && action.variant !== "utility") ?? [];
  const utility = actions?.filter((action) => action.variant === "utility") ?? [];

  return (
    <header className="commercial-hub-tab-header">
      <div className="commercial-hub-tab-header-copy">
        <h2 className={cn("commercial-hub-tab-title", strategic && "commercial-hub-tab-title--strategic")}>{title}</h2>
        <p className="commercial-hub-tab-subtitle">{subtitle}</p>
      </div>
      {(primary.length > 0 || secondary.length > 0 || utility.length > 0 || utilities) && (
        <div className="commercial-hub-tab-header-actions">
          {secondary.map((action) => (
            <button
              key={action.id}
              type="button"
              className="commercial-hub-btn commercial-hub-btn-secondary"
              onClick={() => onActionClick?.(action.id)}
            >
              {action.icon && <AppIcon name={action.icon} size={15} strokeWidth={2} />}
              {action.label}
            </button>
          ))}
          {primary.map((action) => (
            <button
              key={action.id}
              type="button"
              className="commercial-hub-btn commercial-hub-btn-primary"
              onClick={() => onActionClick?.(action.id)}
            >
              {action.icon && <AppIcon name={action.icon} size={15} strokeWidth={2} />}
              {action.label}
            </button>
          ))}
          {utility.map((action) => (
            <button
              key={action.id}
              type="button"
              className="commercial-hub-btn commercial-hub-btn-utility"
              aria-label={action.label}
              title={action.label}
              onClick={() => onActionClick?.(action.id)}
            >
              {action.icon && <AppIcon name={action.icon} size={16} strokeWidth={2} />}
            </button>
          ))}
          {utilities}
        </div>
      )}
    </header>
  );
}

type CommercialHubKpiStripProps = {
  kpis: VaOpsKpiCardProps[];
  columns?: 4 | 5 | 6;
  className?: string;
};

export function CommercialHubKpiStrip({ kpis, columns = 4, className }: CommercialHubKpiStripProps) {
  return (
    <section className={cn("commercial-hub-tab-kpi", className)} aria-label="Operational KPI summary">
      <div className={cn("commercial-hub-kpi-grid", `commercial-hub-kpi-grid--${columns}`)}>
        {kpis.map((kpi) => (
          <VaOpsKpiCard
            key={kpi.label}
            {...kpi}
            className={cn("commercial-hub-kpi-uniform", kpi.className)}
            sparkline={kpi.sparkline ?? true}
          />
        ))}
      </div>
    </section>
  );
}

type CommercialHubWorkspaceProps = {
  title?: string;
  subtitle?: string;
  strategicTitle?: boolean;
  actions?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function CommercialHubWorkspace({
  title,
  subtitle,
  strategicTitle = false,
  actions,
  toolbar,
  children,
  className,
  ariaLabel,
}: CommercialHubWorkspaceProps) {
  return (
    <section className={cn("commercial-hub-tab-workspace va-ops-panel", className)} aria-label={ariaLabel}>
      {(title || subtitle || actions) && (
        <div className="commercial-hub-workspace-header">
          <div className="commercial-hub-workspace-heading">
            {title && (
              <h3 className={cn("va-ops-section-title", strategicTitle && "commercial-hub-section-title--strategic")}>
                {title}
              </h3>
            )}
            {subtitle && <p className="va-ops-section-sub">{subtitle}</p>}
          </div>
          {actions && <div className="commercial-hub-workspace-actions">{actions}</div>}
        </div>
      )}
      {toolbar && <div className="commercial-hub-workspace-toolbar">{toolbar}</div>}
      <div className="commercial-hub-workspace-body">{children}</div>
    </section>
  );
}

type CommercialHubIntelPanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
};

export function CommercialHubIntelPanel({
  title,
  subtitle,
  children,
  className,
  actions,
}: CommercialHubIntelPanelProps) {
  return (
    <section className={cn("commercial-hub-tab-intel va-ops-panel", className)} aria-label={title}>
      <div className="commercial-hub-intel-header">
        <div>
          <h3 className="va-ops-section-title">{title}</h3>
          {subtitle && <p className="va-ops-section-sub">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="commercial-hub-intel-body">{children}</div>
    </section>
  );
}

type CommercialHubIntelGridProps = {
  children: ReactNode;
  className?: string;
};

export function CommercialHubIntelGrid({ children, className }: CommercialHubIntelGridProps) {
  return <div className={cn("commercial-hub-tab-intel-grid", className)}>{children}</div>;
}

type CommercialHubTabFooterProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function CommercialHubTabFooter({ title, subtitle, children, className }: CommercialHubTabFooterProps) {
  return (
    <footer className={cn("commercial-hub-tab-footer va-ops-panel", className)}>
      <div className="commercial-hub-footer-header">
        <h3 className="va-ops-section-title">{title}</h3>
        {subtitle && <p className="va-ops-section-sub">{subtitle}</p>}
      </div>
      <div className="commercial-hub-footer-body">{children}</div>
    </footer>
  );
}
