"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SEVERITY_RANK,
  TIER_COLOR,
  TIER_LABEL,
} from "@/lib/insights/constants";
import type { InsightNode } from "@/lib/insights/types";

type SortKey =
  | "viability"
  | "production"
  | "product"
  | "diffusion"
  | "maturity"
  | "stars"
  | "loc"
  | "severity";

const COLS: { key: SortKey; label: string }[] = [
  { key: "viability", label: "Viab" },
  { key: "production", label: "Prod" },
  { key: "product", label: "Prod-Q" },
  { key: "diffusion", label: "Diff" },
  { key: "maturity", label: "Mat" },
  { key: "severity", label: "Sev" },
  { key: "stars", label: "★" },
  { key: "loc", label: "LOC" },
];

function val(n: InsightNode, k: SortKey): number {
  if (k === "stars") return n.signals.stars;
  if (k === "loc") return n.signals.loc;
  if (k === "severity") return SEVERITY_RANK[n.severity];
  return n.scores[k];
}

export function Leaderboard({
  nodes,
  hover,
  onHover,
  onSelect,
}: {
  nodes: InsightNode[];
  hover: string | null;
  onHover: (s: string | null) => void;
  onSelect: (s: string) => void;
}) {
  const [sort, setSort] = useState<SortKey>("viability");

  const rows = useMemo(
    () =>
      [...nodes].sort((a, b) => {
        const d = val(b, sort) - val(a, sort);
        return d !== 0 ? d : b.scores.viability - a.scores.viability;
      }),
    [nodes, sort],
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="font-mono text-[10px] uppercase tracking-widest">
            Project
          </TableHead>
          <TableHead className="font-mono text-[10px] uppercase tracking-widest">
            Tier
          </TableHead>
          {COLS.map((c) => (
            <TableHead key={c.key} className="text-right">
              <button
                type="button"
                onClick={() => setSort(c.key)}
                className={`font-mono text-[10px] uppercase tracking-widest hover:text-foreground ${
                  sort === c.key ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {c.label}
                {sort === c.key ? " ↓" : ""}
              </button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((n) => (
          <TableRow
            key={n.slug}
            onMouseEnter={() => onHover(n.slug)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(n.slug)}
            className={`cursor-pointer border-border ${
              hover === n.slug ? "bg-muted" : ""
            }`}
          >
            <TableCell className="max-w-[260px]">
              <div className="truncate font-mono font-bold">{n.name}</div>
              <div className="truncate font-mono text-[10px] text-muted-foreground">
                {n.type}
              </div>
            </TableCell>
            <TableCell>
              <span
                className="inline-block whitespace-nowrap border px-1.5 py-0.5 font-mono text-[10px]"
                style={{
                  color: TIER_COLOR[n.tier],
                  borderColor: TIER_COLOR[n.tier],
                }}
              >
                {TIER_LABEL[n.tier]}
              </span>
            </TableCell>
            <ScoreCell v={n.scores.viability} />
            <ScoreCell v={n.scores.production} />
            <ScoreCell v={n.scores.product} />
            <ScoreCell v={n.scores.diffusion} />
            <ScoreCell v={n.scores.maturity} />
            <TableCell className="text-right font-mono text-[10px] text-muted-foreground uppercase">
              {n.severity}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {n.signals.stars}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
              {n.signals.loc >= 1000
                ? `${Math.round(n.signals.loc / 1000)}k`
                : n.signals.loc}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ScoreCell({ v }: { v: number }) {
  const color =
    v >= 4 ? "#ffd83d" : v >= 3 ? "#16c7e8" : v >= 2 ? "#a6a6a6" : "#ff4a63";
  return (
    <TableCell className="text-right">
      <span className="font-mono font-bold tabular-nums" style={{ color }}>
        {v || "–"}
      </span>
    </TableCell>
  );
}
