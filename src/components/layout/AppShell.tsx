import { TopHeader } from "./TopHeader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider>
      <div className="app-shell">
        <TopHeader />
        <main className="app-content">{children}</main>
      </div>
    </ThemeProvider>
  );
}
