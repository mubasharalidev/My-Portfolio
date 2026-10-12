"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Check, Play, RotateCcw } from "lucide-react";
import { cn, ease } from "@/lib/motion";

type AgentId = "planner" | "research" | "analyst" | "coder" | "critic" | "synth";
type Event = { at: number; agent: AgentId; kind: "think" | "tool" | "handoff" | "done"; text: string; to?: AgentId };

const agents: { id: AgentId; label: string; x: number; y: number }[] = [
  { id: "planner", label: "Planner", x: 200, y: 40 },
  { id: "research", label: "Research", x: 70, y: 140 },
  { id: "analyst", label: "Analyst", x: 200, y: 140 },
  { id: "coder", label: "Coder", x: 330, y: 140 },
  { id: "critic", label: "Critic", x: 200, y: 232 },
  { id: "synth", label: "Synthesis", x: 200, y: 314 },
];
const pos = Object.fromEntries(agents.map((a) => [a.id, a])) as Record<AgentId, (typeof agents)[number]>;
const links: [AgentId, AgentId][] = [
  ["planner", "research"], ["planner", "analyst"], ["planner", "coder"],
  ["research", "critic"], ["analyst", "critic"], ["coder", "critic"], ["critic", "synth"],
];

const tasks: { id: string; title: string; events: Event[] }[] = [
  {
    id: "compare",
    title: "Compare vector databases for a RAG product",
    events: [
      { at: 0, agent: "planner", kind: "think", text: "Decomposing goal into 3 subtasks" },
      { at: 900, agent: "planner", kind: "handoff", to: "research", text: "Gather docs on candidate stores" },
      { at: 1500, agent: "planner", kind: "handoff", to: "analyst", text: "Define evaluation criteria" },
      { at: 2300, agent: "research", kind: "tool", text: "web_search(\"vector db metadata filtering\")" },
      { at: 3000, agent: "analyst", kind: "think", text: "Criteria: filtering, latency, ops cost, hybrid search" },
      { at: 3900, agent: "research", kind: "tool", text: "fetch_docs(sources=3)" },
      { at: 4800, agent: "research", kind: "done", text: "Candidate profiles collected" },
      { at: 5500, agent: "analyst", kind: "tool", text: "score_matrix(candidates × criteria)" },
      { at: 6400, agent: "analyst", kind: "done", text: "Weighted comparison ready" },
      { at: 7200, agent: "critic", kind: "think", text: "Checking every claim has a source" },
      { at: 8200, agent: "critic", kind: "done", text: "One unsourced claim removed" },
      { at: 9000, agent: "synth", kind: "done", text: "Recommendation with trade-offs and citations" },
    ],
  },
  {
    id: "tickets",
    title: "Triage this week’s support tickets and draft a fix",
    events: [
      { at: 0, agent: "planner", kind: "think", text: "Plan: collect → cluster → diagnose → fix" },
      { at: 900, agent: "planner", kind: "handoff", to: "research", text: "Pull tickets from the last 7 days" },
      { at: 1700, agent: "research", kind: "tool", text: "tickets.query(since=\"7d\")" },
      { at: 2500, agent: "research", kind: "done", text: "Tickets retrieved" },
      { at: 2900, agent: "planner", kind: "handoff", to: "analyst", text: "Cluster by root cause" },
      { at: 3700, agent: "analyst", kind: "tool", text: "embed(tickets) → cluster(k=auto)" },
      { at: 4600, agent: "analyst", kind: "done", text: "Largest cluster: auth token timeouts" },
      { at: 5000, agent: "planner", kind: "handoff", to: "coder", text: "Draft fix for token refresh" },
      { at: 5900, agent: "coder", kind: "tool", text: "repo.search(\"refreshToken\")" },
      { at: 6900, agent: "coder", kind: "done", text: "Patch drafted: refresh with backoff" },
      { at: 7700, agent: "critic", kind: "done", text: "Patch reviewed against tests — approved" },
      { at: 8600, agent: "synth", kind: "done", text: "Weekly digest + proposed patch" },
    ],
  },
  {
    id: "audit",
    title: "Find the slowest API endpoints and propose fixes",
    events: [
      { at: 0, agent: "planner", kind: "think", text: "Plan: measure → locate → propose" },
      { at: 800, agent: "planner", kind: "handoff", to: "coder", text: "Query latency traces" },
      { at: 1600, agent: "coder", kind: "tool", text: "traces.query(p95 > 800ms)" },
      { at: 2400, agent: "planner", kind: "handoff", to: "analyst", text: "Group slow spans by endpoint" },
      { at: 3300, agent: "analyst", kind: "think", text: "/search dominates slow spans" },
      { at: 4200, agent: "coder", kind: "tool", text: "profile(\"/search\")" },
      { at: 5100, agent: "analyst", kind: "done", text: "Root cause: N+1 queries" },
      { at: 5900, agent: "coder", kind: "done", text: "Proposal: batch loading + composite index" },
      { at: 6800, agent: "critic", kind: "think", text: "Assessing migration risk" },
      { at: 7600, agent: "critic", kind: "done", text: "Low risk — ship behind a flag" },
      { at: 8400, agent: "synth", kind: "done", text: "Audit report with ranked fixes" },
    ],
  },
];

export default function AgentOrchestrator() {
  const [taskId, setTaskId] = useState(tasks[0].id);
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const logRef = useRef<HTMLOListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const seen = useInView(rootRef, { once: true, amount: 0.4 });
  const task = tasks.find((t) => t.id === taskId)!;
  const events = task.events;

  useEffect(() => {
    if (!running || shown >= events.length) return;
    const wait = shown === 0 ? 250 : events[shown].at - events[shown - 1].at;
    const id = window.setTimeout(() => {
      setShown(shown + 1);
      if (shown + 1 >= events.length) setRunning(false);
    }, wait);
    return () => window.clearTimeout(id);
  }, [running, shown, events]);

  // Play the first trace once when the demo scrolls into view.
  useEffect(() => {
    if (!seen) return;
    const id = window.setTimeout(() => setRunning(true), 400);
    return () => window.clearTimeout(id);
  }, [seen]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown]);

  const visible = events.slice(0, shown);
  const latest = visible[visible.length - 1];
  const done = new Set(visible.filter((e) => e.kind === "done").map((e) => e.agent));
  const started = new Set(visible.flatMap((e) => [e.agent, ...(e.to ? [e.to] : [])]));
  if (done.has("synth")) done.add("planner");

  function run() {
    setShown(0);
    setRunning(true);
  }

  function pick(id: string) {
    setTaskId(id);
    setShown(0);
    setRunning(false);
  }

  const linkActive = ([a, b]: [AgentId, AgentId]) =>
    (latest?.kind === "handoff" && latest.agent === a && latest.to === b) ||
    (latest?.agent === b && done.has(a)) ||
    (started.has(a) && started.has(b));

  return (
    <div ref={rootRef} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="min-w-0 lg:col-span-5">
        <p className="label mb-3">Choose a task</p>
        <div className="space-y-2" role="radiogroup" aria-label="Task">
          {tasks.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={t.id === taskId}
              onClick={() => pick(t.id)}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-300",
                t.id === taskId ? "border-cyan/50 bg-cyan/[0.06] text-ink" : "border-line text-mist hover:border-line-strong hover:text-ink",
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="mt-5 inline-flex h-11 items-center gap-2.5 rounded-full bg-ink px-5 text-sm font-medium text-void transition-colors hover:bg-lime disabled:opacity-60"
        >
          {shown > 0 && !running ? <RotateCcw className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          {running ? "Running…" : shown > 0 ? "Run again" : "Run agents"}
        </button>

        <svg viewBox="0 0 400 362" className="mx-auto mt-8 w-full max-w-md" role="img" aria-label="Agent graph: planner delegates to research, analyst and coder agents, whose work is reviewed by a critic and merged by a synthesis agent.">
          {links.map(([a, b]) => {
            const on = linkActive([a, b]);
            return (
              <line
                key={`${a}-${b}`}
                x1={pos[a].x}
                y1={pos[a].y}
                x2={pos[b].x}
                y2={pos[b].y}
                stroke={on ? "#59E5E8" : "rgba(255,255,255,0.1)"}
                strokeWidth={on ? 1.4 : 1}
                className={cn("transition-[stroke] duration-500", on && running && "flow-dash")}
              />
            );
          })}
          {agents.map((a) => {
            const isLatest = latest?.agent === a.id || latest?.to === a.id;
            const isDone = done.has(a.id);
            return (
              <g key={a.id} transform={`translate(${a.x} ${a.y})`}>
                {isLatest && running && <circle r="22" fill="none" stroke="#CBFF76" strokeWidth="1" className="ping-ring" />}
                <circle
                  r="22"
                  fill="#0B0F18"
                  stroke={isLatest ? "#CBFF76" : isDone ? "#59E5E8" : started.has(a.id) ? "rgba(89,229,232,0.5)" : "rgba(255,255,255,0.16)"}
                  strokeWidth="1.4"
                  className="transition-[stroke] duration-500"
                />
                {isDone ? (
                  <path d="M-6 0 l4 4 8 -8" fill="none" stroke="#59E5E8" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <circle r="3.5" fill={isLatest ? "#CBFF76" : "rgba(255,255,255,0.25)"} />
                )}
                <text y="38" textAnchor="middle" fontSize="11" className="fill-mist font-mono uppercase" letterSpacing="1">
                  {a.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
          <p className="label">Execution trace</p>
          <p className="label !text-[0.625rem] text-dim">Simulated · scripted, no model calls</p>
        </div>
        <ol ref={logRef} className="mt-4 h-[22rem] space-y-2 overflow-y-auto pr-2 font-mono text-[0.75rem] lg:h-[30rem]" aria-live="polite">
          {visible.length === 0 && (
            <li className="grid h-full place-items-center text-center text-mist">Run the agents to watch the plan unfold.</li>
          )}
          <AnimatePresence initial={false}>
            {visible.map((e, i) => (
              <motion.li
                key={`${taskId}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: ease.expo }}
                className={cn(
                  "grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-lg border px-3 py-2.5 sm:grid-cols-[3.5rem_5.5rem_minmax(0,1fr)]",
                  i === visible.length - 1 && running ? "border-lime/30 bg-lime/[0.04]" : "border-line bg-white/[0.015]",
                )}
              >
                <span className="tabular-nums text-dim">{(e.at / 1000).toFixed(1)}s</span>
                <span className={cn("uppercase tracking-wide", e.kind === "done" ? "text-cyan" : "text-ink")}>{pos[e.agent].label}</span>
                <span className="col-start-2 min-w-0 text-mist sm:col-start-auto">
                  <span className={cn("mr-2 uppercase", e.kind === "tool" ? "text-azure" : e.kind === "handoff" ? "text-lime" : e.kind === "done" ? "text-cyan" : "text-dim")}>
                    {e.kind === "done" ? <Check className="inline size-3" aria-label="done" /> : e.kind}
                    {e.to && ` → ${pos[e.to].label}`}
                  </span>
                  <span className="text-ink/90 [overflow-wrap:anywhere]">{e.text}</span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </div>
  );
}
