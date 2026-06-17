import Link from "next/link";
import { routes } from "@/lib/routes";

type ModuleNavProps = {
  active: "production" | "retention" | "commercial";
};

export function ModuleNav({ active }: ModuleNavProps) {
  const links = [
    { key: "production" as const, label: "Production", href: routes.production },
    { key: "retention" as const, label: "Retention", href: routes.retention },
    { key: "commercial" as const, label: "Commercial", href: routes.commercial },
  ];

  return (
    <nav className="module-nav">
      <div className="module-nav-brand">Agency OS</div>
      <div className="module-nav-links">
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={`module-nav-link${active === link.key ? " active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
