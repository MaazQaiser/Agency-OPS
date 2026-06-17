"use client";

import { useState } from "react";
import { AppIcon, type AppIconName } from "./AppIcon";

type AccordionCardProps = {
  icon: AppIconName;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function AccordionCard({ icon, title, defaultOpen = true, children }: AccordionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`card${open ? " open" : ""}`}>
      <div
        className="card-header"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!open)}
      >
        <div className="card-title">
          <span className="card-icon">
            <AppIcon name={icon} size={16} strokeWidth={2.25} />
          </span>
          {title}
        </div>
        <div className={`card-toggle${open ? " open" : ""}`}>
          <AppIcon name="chevron-down" size={18} strokeWidth={2.25} />
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
