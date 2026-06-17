import { cn } from "@/lib/cn";

export type TableVariant = "production" | "retention" | "commercial" | "default";

type DataTableProps = {
  variant?: TableVariant;
  children: React.ReactNode;
  className?: string;
};

export function DataTable({ variant = "default", children, className }: DataTableProps) {
  const tableClass = variant === "default" ? undefined : variant;

  return <table className={cn(tableClass, className)}>{children}</table>;
}
