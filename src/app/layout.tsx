import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./design-tokens.css";
import "./table-scrollbars.css";
import "./notification-drawer.css";
import "./audit-log.css";
import "./epay-broker-fee-trigger.css";
import "./retention-language.css";
import "./retention-scorecard-refine.css";
import "./subscription.css";
import "./command-palette.css";
import "./global-search-command-center.css";
import "./folio-global.css";
import "./mobile-first.css";
import "./global-utility-strip.css";
import "./sidebar-nav.css";
import "./avatar-system.css";
import "./va-operations-refine.css";
import "./commercial-hub-refine.css";
import "./intake-forms-refine.css";
import "./training-hub-refine.css";
import "./carrier-library-refine.css";
import "./epay-policy-refine.css";
import "./hubs-unified-refine.css";
import "./send-center-refine.css";
import "./hub-color-environments.css";
import "./farmers-edge.css";
import "./signature-elements.css";
import "./analytics.css";
import "./analytics-refine.css";
import "./typography-system.css";
import "./universal-search-overlay.css";
import "./card-hierarchy.css";
import "./motion-polish.css";
import "./light-foundation.css";
import "./owner-overview.css";
import "./commercial-hub-flagship.css";
import "./kpi-system.css";
import "./hub-identity.css";
import "./information-hierarchy.css";
import "./global-shell.css";
import "./contextual-help.css";
import "./command-palette-upgrade.css";
import "./skeleton-empty-system.css";
import "./retention-scorecard-refresh.css";
import "./interaction-motion-system.css";
import "./print-export.css";
import "./visual-qa-fixes.css";
import "./obsidian-mode.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Agency OS: Insurance Town",
  description: "Insurance Town Agency OS: Dashboard, Production, Retention, Commercial, and Prime Agency",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      data-theme="obsidian"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;var light=p==="/commercial-hub"||p.indexOf("/commercial-hub/")===0||p==="/commercial"||p.indexOf("/commercial/")===0;document.documentElement.setAttribute("data-theme",light?"light":"obsidian");document.documentElement.style.colorScheme=light?"light":"dark";}catch(e){}})();`,
          }}
        />
      </head>
      <body className={sans.className}>{children}</body>
    </html>
  );
}
