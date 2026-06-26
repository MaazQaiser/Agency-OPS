import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import "./notification-drawer.css";
import "./audit-log.css";
import "./epay-broker-fee-trigger.css";
import "./retention-language.css";
import "./subscription.css";
import "./command-palette.css";
import "./mobile-first.css";
import "./global-utility-strip.css";
import "./va-operations-refine.css";
import "./commercial-hub-refine.css";
import "./intake-forms-refine.css";
import "./training-hub-refine.css";
import "./carrier-library-refine.css";
import "./epay-policy-refine.css";
import "./hubs-unified-refine.css";
import "./send-center-refine.css";
import "./hub-color-environments.css";
import "./contextual-help.css";
import "./farmers-edge.css";
import "./signature-elements.css";
import "./analytics.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

const korean = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-korean",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Agency OS — Insurance Town",
  description: "Insurance Town Agency OS — Dashboard, Production, Retention, Commercial, and Prime Agency",
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
      className={`${display.variable} ${sans.variable} ${mono.variable} ${korean.variable}`}
      data-theme="obsidian"
      suppressHydrationWarning
    >
      <body className={sans.className}>{children}</body>
    </html>
  );
}
