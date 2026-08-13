"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { DrawerSkeleton } from "@/components/shared/loading";
import { HubEmptyState } from "@/components/state";
import { getHubHelpContent, type HelpMetric, type HubHelpContent, type HubHelpId } from "@/data/contextualHelp";
import { useDrawerLoading } from "@/hooks/useHubDataState";
import { cn } from "@/lib/cn";
import { HUB_THEMES, hubThemeCssVars, hubThemeIdFromHelpAccent } from "@/lib/hubThemes";

type ContextualHelpDrawerProps = {
  hubId: HubHelpId | null;
  onClose: () => void;
};

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function metricIcon(metric: HelpMetric, fallback: AppIconName): AppIconName {
  const hay = `${metric.term} ${metric.keywords.join(" ")}`.toLowerCase();
  if (hay.includes("pipeline") || hay.includes("premium") || hay.includes("pace")) return "bar-chart";
  if (hay.includes("sla") || hay.includes("clock") || hay.includes("velocity") || hay.includes("turnaround")) {
    return "clock";
  }
  if (hay.includes("e&o") || hay.includes("risk") || hay.includes("exposure") || hay.includes("at-risk")) {
    return "triangle-alert";
  }
  if (hay.includes("approval") || hay.includes("review")) return "user-check";
  if (hay.includes("task") || hay.includes("due")) return "clipboard";
  if (hay.includes("retention") || hay.includes("renewal") || hay.includes("save")) return "users";
  if (hay.includes("invoice") || hay.includes("fee") || hay.includes("payment") || hay.includes("bill")) {
    return "dollar";
  }
  if (hay.includes("draft") || hay.includes("proposal") || hay.includes("sent")) return "send";
  if (hay.includes("carrier") || hay.includes("appetite") || hay.includes("rules") || hay.includes("coverage")) {
    return "shield";
  }
  if (hay.includes("training") || hay.includes("sop") || hay.includes("completion")) return "trophy";
  if (hay.includes("search") || hay.includes("saved") || hay.includes("result")) return "search";
  if (hay.includes("lead") || hay.includes("speed")) return "zap";
  return fallback;
}

function hasHelpBody(content: HubHelpContent) {
  return Boolean(content.summary || content.metrics.length || content.howToUse.length);
}

export function ContextualHelpDrawer({ hubId, onClose }: ContextualHelpDrawerProps) {
  const [renderedHubId, setRenderedHubId] = useState<HubHelpId | null>(hubId);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hubId) {
      setRenderedHubId(hubId);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setRenderedHubId(null), 220);
    return () => window.clearTimeout(timeout);
  }, [hubId]);

  useEffect(() => {
    if (!visible || !renderedHubId) return undefined;

    const panel = panelRef.current;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [visible, renderedHubId, onClose]);

  const loading = useDrawerLoading(renderedHubId);

  if (!renderedHubId) return null;

  const content = getHubHelpContent(renderedHubId);
  const themeId = hubThemeIdFromHelpAccent(content.hubAccent);
  const themeStyle = themeId ? (hubThemeCssVars(HUB_THEMES[themeId]) as CSSProperties) : undefined;
  const empty = !hasHelpBody(content);

  return (
    <div className={cn("help-drawer-root", visible && "help-drawer-root--visible")} role="presentation">
      <button
        type="button"
        className="help-drawer-backdrop"
        tabIndex={-1}
        aria-label="Close contextual help"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        id="contextual-help-drawer"
        className={cn(
          "help-drawer",
          `help-drawer--${content.hubAccent}`,
          visible && "help-drawer--visible",
        )}
        style={themeStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contextual-help-title"
      >
        <header className="help-drawer-header">
          <div className="help-drawer-header-icon" aria-hidden="true">
            <AppIcon name={content.icon} size={18} strokeWidth={2} />
          </div>
          <div className="help-drawer-header-text">
            <p className="help-drawer-header-kicker">{content.title}</p>
            <h2 id="contextual-help-title" className="help-drawer-title">
              Contextual Help
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="help-drawer-close"
            aria-label="Close contextual help"
            onClick={onClose}
          >
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>

        <div className="help-drawer-body">
          {loading ? (
            <DrawerSkeleton label="Loading help" />
          ) : (
            <>
          <div className="help-drawer-hero">
            <h3 className="help-drawer-hero-title">{content.title}</h3>
            {content.summary ? (
              <p className="help-drawer-hero-desc">{content.summary}</p>
            ) : null}
          </div>

          {empty ? (
            <HubEmptyState
              compact
              icon={content.icon}
              title="Help is being prepared"
              description="Contextual guidance for this hub will appear here."
            />
          ) : (
            <>
              <section className="help-drawer-section" aria-labelledby="help-what-it-does">
                <h4 id="help-what-it-does" className="help-drawer-section-title">
                  What it does
                </h4>
                <p className="help-drawer-section-body">{content.summary}</p>
              </section>

              <section className="help-drawer-section" aria-labelledby="help-what-you-see">
                <h4 id="help-what-you-see" className="help-drawer-section-title">
                  What you see
                </h4>
                {content.metrics.length > 0 ? (
                  <ul className="help-drawer-see-list">
                    {content.metrics.map((metric) => (
                      <li key={metric.id} className="help-drawer-see-item">
                        <span className="help-drawer-see-icon" aria-hidden="true">
                          <AppIcon name={metricIcon(metric, content.icon)} size={16} strokeWidth={2} />
                        </span>
                        <span>
                          <span className="help-drawer-see-label">{metric.term}</span>
                          <span className="help-drawer-see-text">{metric.definition}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="help-drawer-section-body">Help content is being prepared.</p>
                )}
              </section>

              <section className="help-drawer-section" aria-labelledby="help-how-to">
                <h4 id="help-how-to" className="help-drawer-section-title">
                  How to use it
                </h4>
                {content.howToUse.length > 0 ? (
                  <ol className="help-drawer-steps">
                    {content.howToUse.map((step, index) => (
                      <li key={step} className="help-drawer-step">
                        <span className="help-drawer-step-index" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="help-drawer-step-text">{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="help-drawer-section-body">Help content is being prepared.</p>
                )}
              </section>
            </>
          )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
