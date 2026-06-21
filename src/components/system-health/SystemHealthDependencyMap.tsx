import { cn } from "@/lib/cn";
import type { DependencyEdge, DependencyNode } from "@/data/systemHealth";

type SystemHealthDependencyMapProps = {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  compact?: boolean;
};

export function SystemHealthDependencyMap({ nodes, edges, compact = false }: SystemHealthDependencyMapProps) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className={cn("system-health-dep-map", compact && "compact")} role="img" aria-label="System dependency map">
      {edges.map((edge) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;
        const broken = edge.broken || from.broken || to.broken;
        return (
          <div key={`${edge.from}-${edge.to}`} className={cn("system-health-dep-chain", broken && "broken")}>
            <span className={cn("system-health-dep-node", from.broken && "broken")}>{from.label}</span>
            <span className="system-health-dep-arrow" aria-hidden="true">→</span>
            <span className={cn("system-health-dep-node", to.broken && "broken")}>{to.label}</span>
          </div>
        );
      })}
    </div>
  );
}

type InlineDependencyChainProps = {
  chain: string[];
};

export function InlineDependencyChain({ chain }: InlineDependencyChainProps) {
  return (
    <div className="system-health-inline-chain" role="list" aria-label="Dependency chain">
      {chain.map((step, i) => (
        <span key={step} className="system-health-inline-step" role="listitem">
          {i > 0 && <span className="system-health-dep-arrow" aria-hidden="true">→</span>}
          <span className="system-health-dep-node">{step}</span>
        </span>
      ))}
    </div>
  );
}
