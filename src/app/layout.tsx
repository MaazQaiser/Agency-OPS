import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Agency OS — Insurance Town",
  description: "Insurance Town Agency OS — Dashboard, Production, Retention, Commercial, and Prime Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={urbanist.variable} data-theme="obsidian" suppressHydrationWarning>
      <body className={urbanist.className}>{children}</body>
    </html>
  );
}
