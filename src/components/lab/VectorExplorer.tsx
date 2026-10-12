"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { cn, ease } from "@/lib/motion";

/** Toy 4-D embedding space: [intelligence, infrastructure, interface, data]. */
type Vec = [number, number, number, number];
const dims = ["AI", "Infra", "UI", "Data"] as const;
const dimColor = ["#CBFF76", "#6488FF", "#59E5E8", "#F5F7FA"];

const docs: { title: string; v: Vec }[] = [
  { title: "Fine-tuning on support transcripts", v: [0.9, 0.1, 0, 0.3] },
  { title: "Prompt patterns for tool-using agents", v: [0.95, 0, 0.05, 0.1] },
  { title: "Evaluating LLM answers", v: [0.85, 0.05, 0, 0.35] },
  { title: "Autoscaling GPU workers on Kubernetes", v: [0.3, 0.9, 0, 0.1] },
  { title: "Blue-green deploys with CI/CD", v: [0, 0.95, 0.05, 0.05] },
  { title: "Tracing latency across services", v: [0.05, 0.85, 0, 0.3] },
  { title: "Streaming tokens into a React UI", v: [0.4, 0.1, 0.85, 0] },
  { title: "Accessible design-system tokens", v: [0, 0, 0.95, 0.05] },
  { title: "Optimistic updates in real-time apps", v: [0, 0.2, 0.85, 0.15] },
  { title: "Chunking strategies for RAG ingestion", v: [0.6, 0.05, 0, 0.8] },
  { title: "Hybrid search: keywords + vectors", v: [0.45, 0.1, 0, 0.85] },
  { title: "ETL pipelines for analytics", v: [0, 0.3, 0, 0.95] },
  { title: "Monitoring embedding drift", v: [0.55, 0.3, 0, 0.6] },
  { title: "Dashboards that explain metrics", v: [0.3, 0, 0.6, 0.6] },
];

const lexicon: Record<string, Vec> = {
  ai: [1, 0, 0, 0], llm: [1, 0, 0, 0], llms: [1, 0, 0, 0], model: [1, 0, 0, 0.1], models: [1, 0, 0, 0.1],
  agent: [1, 0, 0, 0], agents: [1, 0, 0, 0], prompt: [1, 0, 0.1, 0], prompts: [1, 0, 0.1, 0], tool: [0.8, 0.2, 0, 0],
  tools: [0.8, 0.2, 0, 0], eval: [0.9, 0, 0, 0.3], evaluation: [0.9, 0, 0, 0.3], fine: [0.8, 0, 0, 0.2],
  tuning: [0.8, 0, 0, 0.2], rag: [0.7, 0, 0, 0.7], embedding: [0.6, 0, 0, 0.7], embeddings: [0.6, 0, 0, 0.7],
  deploy: [0, 1, 0, 0], deploys: [0, 1, 0, 0], deployment: [0, 1, 0, 0], kubernetes: [0, 1, 0, 0], k8s: [0, 1, 0, 0],
  docker: [0, 1, 0, 0], scale: [0, 0.9, 0, 0.1], scaling: [0, 0.9, 0, 0.1], latency: [0, 0.9, 0.1, 0.1],
  cloud: [0, 1, 0, 0], aws: [0, 1, 0, 0], gpu: [0.3, 0.9, 0, 0], ci: [0, 1, 0, 0], cd: [0, 1, 0, 0],
  monitoring: [0.1, 0.8, 0, 0.3], tracing: [0, 0.9, 0, 0.2], api: [0.1, 0.7, 0.1, 0.2], apis: [0.1, 0.7, 0.1, 0.2],
  ui: [0, 0, 1, 0], ux: [0, 0, 1, 0], react: [0, 0, 1, 0], frontend: [0, 0, 1, 0], design: [0, 0, 1, 0],
  interface: [0, 0, 1, 0], accessible: [0, 0, 1, 0], accessibility: [0, 0, 1, 0], streaming: [0.3, 0.2, 0.8, 0],
  realtime: [0, 0.2, 0.9, 0.1], "real-time": [0, 0.2, 0.9, 0.1], dashboard: [0.1, 0, 0.7, 0.6],
  data: [0, 0, 0, 1], etl: [0, 0.2, 0, 1], search: [0.3, 0, 0, 0.9], vector: [0.4, 0, 0, 0.9], vectors: [0.4, 0, 0, 0.9],
  database: [0, 0.3, 0, 1], sql: [0, 0.2, 0, 1], pipeline: [0, 0.4, 0, 0.9], pipelines: [0, 0.4, 0, 0.9],
  analytics: [0, 0.1, 0.2, 1], chunking: [0.4, 0, 0, 0.9], retrieval: [0.6, 0, 0, 0.8], metrics: [0, 0.4, 0.3, 0.6],
};

const presets = ["agents that use tools", "deploy latency", "streaming react ui", "vector search for rag"];

function embed(text: string): Vec | null {
  const v: Vec = [0, 0, 0, 0];
  let hit = false;
  for (const raw of text.toLowerCase().split(/[^a-z0-9-]+/)) {
    const w = lexicon[raw] ?? lexicon[raw.replace(/s$/, "")];
    if (!w) continue;
    hit = true;
    for (let i = 0; i < 4; i++) v[i] += w[i];
  }
  return hit ? v : null;
}

const norm = (v: Vec) => Math.hypot(...v) || 1;
const cosine = (a: Vec, b: Vec) => (a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]) / (norm(a) * norm(b));

/** 2-D layout: barycentric blend toward each dimension's corner. */
const corners: [number, number][] = [[80, 20], [20, 22], [20, 80], [80, 78]];
function project(v: Vec): [number, number] {
  const s = v.reduce((a, b) => a + b, 0) || 1;
  let x = 0;
  let y = 0;
  v.forEach((w, i) => {
    x += (w / s) * corners[i][0];
    y += (w / s) * corners[i][1];
  });
  return [+x.toFixed(2), +y.toFixed(2)];
}
const docPts = docs.map((d) => project(d.v));

export default function VectorExplorer() {
  const inputId = useId();
  const [query, setQuery] = useState(presets[0]);
  const [k, setK] = useState(3);

  const qv = useMemo(() => embed(query), [query]);
  const ranked = useMemo(() => {
    if (!qv) return [];
    return docs.map((d, i) => ({ ...d, i, score: cosine(qv, d.v) })).sort((a, b) => b.score - a.score);
  }, [qv]);
  const top = ranked.slice(0, k);
  const topSet = new Set(top.map((t) => t.i));
  const qp = qv ? project(qv) : null;
  const qn = qv ? norm(qv) : 1;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-5">
        <label htmlFor={inputId} className="label mb-3 block">
          Query
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 focus-within:border-cyan/60">
          <Search className="size-4 shrink-0 text-mist" aria-hidden />
          <input
            id={inputId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “agents”, “latency”, “react”…"
            className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-dim"
            autoComplete="off"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setQuery(p)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[0.6875rem] transition-colors",
                query === p ? "border-cyan/50 text-cyan" : "border-line text-mist hover:text-ink",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <p className="label mb-3">Query vector · 4 dimensions</p>
          <div className="grid grid-cols-4 gap-3">
            {dims.map((d, i) => {
              const val = qv ? qv[i] / qn : 0;
              return (
                <div key={d}>
                  <div className="relative h-20 overflow-hidden rounded-lg border border-line bg-white/[0.02]">
                    <motion.div
                      className="absolute inset-x-0 bottom-0"
                      style={{ background: dimColor[i], opacity: 0.75 }}
                      animate={{ height: `${Math.max(0, val) * 100}%` }}
                      transition={{ duration: 0.5, ease: ease.expo }}
                    />
                  </div>
                  <p className="mt-1.5 flex justify-between font-mono text-[0.625rem] text-mist">
                    <span>{d}</span>
                    <span className="tabular-nums">{val.toFixed(2)}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <label className="label flex items-center justify-between">
            <span>Top-k</span>
            <span className="tabular-nums text-ink">{k}</span>
          </label>
          <input type="range" min={1} max={6} value={k} onChange={(e) => setK(+e.target.value)} className="mt-3 w-full accent-[#59E5E8]" />
        </div>
        <p className="mt-6 text-xs leading-relaxed text-dim">
          Toy embeddings: query words map to hand-set weights across four concepts, ranked by real cosine similarity. A
          production system would use a learned model with hundreds of dimensions.
        </p>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-abyss sm:aspect-[4/3]">
          <div aria-hidden className="absolute inset-0 grid-field opacity-60" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full" role="img" aria-label={qv ? `Nearest documents: ${top.map((t) => t.title).join(", ")}` : "No query vector"}>
            {dims.map((d, i) => (
              <text key={d} x={corners[i][0] + (i === 0 || i === 3 ? 8 : -8)} y={corners[i][1] + (i < 2 ? -9 : 12)} textAnchor="middle" fontSize="2.6" letterSpacing="0.4" fill={dimColor[i]} opacity=".7" className="font-mono">
                {d.toUpperCase()}
              </text>
            ))}
            {qp &&
              top.map((t) => (
                <motion.line
                  key={`l-${t.i}`}
                  x1={qp[0]}
                  y1={qp[1]}
                  x2={docPts[t.i][0]}
                  y2={docPts[t.i][1]}
                  stroke="#CBFF76"
                  strokeWidth="0.3"
                  strokeOpacity={0.3 + t.score * 0.6}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: ease.expo }}
                />
              ))}
            {docs.map((d, i) => {
              const on = topSet.has(i);
              return (
                <g key={d.title}>
                  <circle cx={docPts[i][0]} cy={docPts[i][1]} r={on ? 1.6 : 1.1} fill={on ? "#59E5E8" : "#6488FF"} fillOpacity={on ? 1 : 0.5} className="transition-all duration-500" />
                  {on && (
                    <text x={docPts[i][0]} y={docPts[i][1] - 2.6} textAnchor="middle" fontSize="2.2" fill="#F5F7FA" className="font-sans">
                      {d.title.length > 26 ? d.title.slice(0, 25) + "…" : d.title}
                    </text>
                  )}
                </g>
              );
            })}
            {qp && (
              <motion.g animate={{ x: qp[0], y: qp[1] }} initial={false} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
                <circle r="2.2" fill="#CBFF76" />
                <circle r="2.2" fill="none" stroke="#CBFF76" strokeWidth="0.3" className="ping-ring" />
              </motion.g>
            )}
          </svg>
          {!qv && (
            <p className="absolute inset-x-6 bottom-6 text-center text-sm text-mist">
              No known terms — try “agents”, “latency”, “react” or “vector search”.
            </p>
          )}
        </div>

        <ol className="mt-5 space-y-2" aria-label="Ranked results">
          {top.map((t, rank) => (
            <li key={t.i} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-3 text-sm">
              <span className="font-mono text-xs text-dim">{rank + 1}</span>
              <span className="truncate text-ink">{t.title}</span>
              <span className="flex items-center gap-2">
                <span className="hidden h-1 w-20 overflow-hidden rounded-full bg-white/10 sm:block">
                  <motion.span className="block h-full bg-cyan" animate={{ width: `${Math.max(0, t.score) * 100}%` }} transition={{ duration: 0.5, ease: ease.expo }} />
                </span>
                <span className="font-mono text-xs tabular-nums text-cyan">{t.score.toFixed(3)}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
