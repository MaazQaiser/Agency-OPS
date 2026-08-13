import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type HubSectionLevel = "primary" | "secondary" | "supporting";

type HubSectionProps = {
  level?: HubSectionLevel;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
};

export function HubSection({
  level = "secondary",
  title,
  description,
  children,
  className,
  actions,
}: HubSectionProps) {
  return (
    <section className={cn("ih-section", `ih-section--${level}`, className)}>
      {(title || description || actions) && (
        <header className="ih-section-header">
          <div className="ih-section-heading">
            {title && <h2 className="ih-section-title">{title}</h2>}
            {description && <p className="ih-section-desc">{description}</p>}
          </div>
          {actions && <div className="ih-section-actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function PrimaryPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ih-panel ih-panel--primary", className)}>{children}</div>;
}

export function SecondaryPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ih-panel ih-panel--secondary", className)}>{children}</div>;
}

export function SupportingPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ih-panel ih-panel--supporting", className)}>{children}</div>;
}
