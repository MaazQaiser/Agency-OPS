import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { HUB_THEMES, hubThemeCssVars, type HubThemeId } from "@/lib/hubThemes";

type HubShellProps = {
  hub: HubThemeId;
  children: ReactNode;
  className?: string;
};

export function HubShell({ hub, children, className }: HubShellProps) {
  const theme = HUB_THEMES[hub];

  return (
    <div
      className={cn("hub-shell", theme.moduleClass, className)}
      data-hub={hub}
      style={hubThemeCssVars(theme) as CSSProperties}
    >
      {children}
    </div>
  );
}
