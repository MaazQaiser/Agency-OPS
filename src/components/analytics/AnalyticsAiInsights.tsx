"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import type { AnalyticsAiInsight } from "@/data/analytics";

type AnalyticsAiInsightsProps = {
  insights: readonly AnalyticsAiInsight[];
};

export function AnalyticsAiInsights({ insights }: AnalyticsAiInsightsProps) {
  return (
    <section className="va-ops-panel analytics-ai-panel" aria-label="AI insights">
      <div className="analytics-ai-panel-header">
        <AppIcon name="sparkles" size={16} strokeWidth={2} />
        <h3 className="analytics-ai-panel-title">AI Insights</h3>
      </div>
      <ul className="analytics-ai-list">
        {insights.map((insight) => (
          <li key={insight.id} className="analytics-ai-item">
            <strong className="analytics-ai-item-title">{insight.title}</strong>
            <p className="analytics-ai-item-detail">{insight.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
