import { cn } from "@/lib/cn";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn("section-label", className)}>
      <div className="sl-text">{children}</div>
    </div>
  );
}

type PageHeaderProps = {
  tag?: string;
  title: string;
  titleEmphasis: string;
  meta?: { label: string; value: string }[];
  patent?: string;
  variant?: "production" | "retention" | "commercial" | "dashboard";
};

export function PageHeader({
  tag,
  title,
  titleEmphasis,
  meta,
  patent,
  variant = "production",
}: PageHeaderProps) {
  const parts = title.split(titleEmphasis);
  const headerVariant =
    variant === "retention"
      ? " retention"
      : variant === "commercial"
        ? " commercial"
        : variant === "dashboard"
          ? " dashboard"
          : "";

  return (
    <header className={`app-header page-module-header${headerVariant}`}>
      {tag && <div className="h-tag">{tag}</div>}
      <h1>
        {parts[0]}
        <em>{titleEmphasis}</em>
        {parts[1] ?? ""}
      </h1>
      {meta && meta.length > 0 && (
        <div className="h-meta">
          {meta.map((item) => (
            <div key={item.label}>
              <strong>{item.label}:</strong> {item.value}
            </div>
          ))}
        </div>
      )}
      {patent && <div className="patent">{patent}</div>}
    </header>
  );
}
