export type KpiColor = "green" | "amber" | "red" | "primary" | "blue" | "white" | "yellow";

export type KpiItem = {
  label: string;
  value: string;
  sub: string;
  color?: KpiColor;
  progress?: { width: string; color: KpiColor };
  featured?: boolean;
};

export type Producer = {
  id: string;
  name: string;
  role: string;
  score: string;
};

export type RetentionKpi = {
  label: string;
  value: string;
  sub: string;
  color?: KpiColor;
};
