type AppHeaderProps = {
  tag: string;
  title: string;
  titleEmphasis: string;
  meta: { label: string; value: string }[];
  patent: string;
  variant?: "production" | "retention";
};

export function AppHeader({ tag, title, titleEmphasis, meta, patent, variant = "production" }: AppHeaderProps) {
  const parts = title.split(titleEmphasis);

  return (
    <header className={`app-header${variant === "retention" ? " retention" : ""}`}>
      <div className="h-tag">{tag}</div>
      <h1>
        {parts[0]}
        <em>{titleEmphasis}</em>
        {parts[1] ?? ""}
      </h1>
      <div className="h-meta">
        {meta.map((item) => (
          <div key={item.label}>
            <strong>{item.label}:</strong> {item.value}
          </div>
        ))}
      </div>
      <div className="patent">{patent}</div>
    </header>
  );
}
