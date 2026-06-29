"use client";

import { useMemo } from "react";
import { TIER_COLOR } from "@/lib/insights/constants";
import type { InsightEdge, InsightNode } from "@/lib/insights/types";

type Props = {
  nodes: InsightNode[];
  edges: InsightEdge[];
  activeSlugs: Set<string>;
  hover: string | null;
  onHover: (s: string | null) => void;
  onSelect: (s: string) => void;
};

export function OverlapNetwork({
  nodes,
  edges,
  activeSlugs,
  hover,
  onHover,
  onSelect,
}: Props) {
  const pos = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.slug, n])),
    [nodes],
  );

  // neighbors of the hovered node (for highlight)
  const neighbors = useMemo(() => {
    if (!hover) return null;
    const set = new Set<string>([hover]);
    for (const e of edges) {
      if (e.source === hover) set.add(e.target);
      if (e.target === hover) set.add(e.source);
    }
    return set;
  }, [hover, edges]);

  const radius = (n: InsightNode) => 5 + n.scores.viability * 1.8;

  return (
    <svg
      viewBox="0 0 1000 1000"
      className="h-[360px] w-full"
      role="img"
      aria-label="Project overlap network"
    >
      <title>Project overlap network</title>
      {/* edges */}
      {edges.map((e) => {
        const a = pos[e.source];
        const b = pos[e.target];
        if (!a || !b) return null;
        const touchesHover =
          neighbors && (e.source === hover || e.target === hover);
        const bothActive =
          activeSlugs.has(e.source) && activeSlugs.has(e.target);
        const op = touchesHover
          ? 0.9
          : neighbors
            ? 0.04
            : bothActive
              ? 0.06 + e.weight * 0.04
              : 0.02;
        return (
          <line
            key={`${e.source}-${e.target}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={touchesHover ? "#16c7e8" : "#ffffff"}
            strokeOpacity={op}
            strokeWidth={touchesHover ? 1 + e.weight * 0.5 : e.weight * 0.5}
          />
        );
      })}
      {/* nodes */}
      {nodes.map((n) => {
        const dim = !activeSlugs.has(n.slug);
        const faded = neighbors ? !neighbors.has(n.slug) : false;
        const hot = hover === n.slug;
        const r = radius(n);
        return (
          // biome-ignore lint/a11y/useSemanticElements: interactive SVG <g> node — a DOM <button> cannot be used inside an <svg>
          <g
            key={n.slug}
            transform={`translate(${n.x},${n.y})`}
            style={{ cursor: "pointer" }}
            opacity={dim ? 0.18 : faded ? 0.28 : 1}
            role="button"
            tabIndex={0}
            aria-label={`${n.name} — ${n.tier}`}
            onMouseEnter={() => onHover(n.slug)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(n.slug)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(n.slug)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(n.slug);
              }
            }}
          >
            <circle
              r={r}
              fill={TIER_COLOR[n.tier]}
              fillOpacity={hot ? 1 : 0.82}
              stroke={hot ? "#fff" : "#000"}
              strokeWidth={hot ? 2 : 1}
            />
            {(hot || r > 11) && (
              <text
                x={r + 3}
                y={3}
                fill="#fff"
                fontSize={hot ? 15 : 12}
                fontFamily="monospace"
                style={{ pointerEvents: "none" }}
              >
                {n.slug}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
