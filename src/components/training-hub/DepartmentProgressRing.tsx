"use client";

import { MetricRing } from "@/components/kpi/MetricRing";

type DepartmentProgressRingProps = {
  completion: number;
  size?: number;
  label?: string;
};

/**
 * Training Hub Signature Element: Circular progress ring per department
 * Ring stroke uses hub identity via MetricRing tone="hub".
 */
export function DepartmentProgressRing({ completion, size = 64, label }: DepartmentProgressRingProps) {
  return (
    <MetricRing
      value={completion}
      size={size}
      thickness={8}
      tone="hub"
      label={label}
      className="dept-progress-ring"
    />
  );
}
