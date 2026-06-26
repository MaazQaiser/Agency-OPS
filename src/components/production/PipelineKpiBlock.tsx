import { KpiCard } from "@/components/ui/KpiCard";
import type { PipelineSummaryKpi } from "@/data/producerScorecard";

type PipelineKpiBlockProps = {
  kpi: PipelineSummaryKpi;
};

/** Modular pipeline KPI tile with 7-day sparkline trend. */
export function PipelineKpiBlock({ kpi }: PipelineKpiBlockProps) {
  return (
    <KpiCard
      label={kpi.label}
      value={kpi.value}
      sub={kpi.sub}
      color={kpi.color}
      variant="production"
      trend={kpi.trend}
      polarity={kpi.polarity}
      className="pipeline-kpi-block"
    />
  );
}
