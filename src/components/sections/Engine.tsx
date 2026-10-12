"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { engineEdges, engineNodes, engineTrace, type EngineEdge, type EngineNode, type EngineNodeId } from "@/data/engine";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn, duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const nodeById = Object.fromEntries(engineNodes.map((n) => [n.id, n])) as Record<EngineNodeId, EngineNode>;

/** Hand-tuned curves in the 1000×560 diagram space. Paired edges run on parallel offsets. */
const edgePaths: Record<string, string> = {
  "ui-api": "M162 280 H216",
  "api-orc": "M362 280 H446",
  "orc-ret": "M590 292 C670 292 660 430 690 430",
  "ret-orc": "M690 452 C640 452 640 312 590 312",
  "orc-llm": "M590 268 C670 268 660 130 690 130",
  "llm-orc": "M690 108 C640 108 640 248 590 248",
  "llm-res": "M830 120 C890 120 900 220 920 240",
  "res-ui": "M920 320 C940 560 120 600 90 320",
};

const STEP_MS = 1600;

export function Engine() {
  const reduce = useReducedMotionSafe();
  const [selected, setSelected] = useState<EngineNodeId>("orchestrator");
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s + 1 >= engineTrace.length) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const tracing = step >= 0;
  const current = tracing ? engineTrace[step] : null;
  const focus = current ? current.node : selected;

  function select(id: EngineNodeId) {
    setPlaying(false);
    setStep(-1);
    setSelected(id);
  }

  function togglePlay() {
    if (playing) return setPlaying(false);
    if (step >= engineTrace.length - 1 || step < 0) setStep(0);
    setPlaying(true);
  }

  function reset() {
    setPlaying(false);
    setStep(-1);
  }

  const edgeState = (e: EngineEdge) => {
    if (current?.edge === e.id) return "live";
    if (!tracing && (e.from === selected || e.to === selected)) return "related";
    return "idle";
  };

  return (
    <section id="engine" aria-labelledby="engine-title" className="relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-void via-abyss to-void" />
        <div className="absolute left-1/2 top-1/2 size-[80vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(89,229,232,0.07),transparent_60%)]" />
      </div>

      <div className="shell">
        <SectionHeading
          id="engine-title"
          index="04"
          label="Inside the engine"
          lines={["From idea", <span key="b">to <span className="text-signal">intelligence.</span></span>]}
          intro="How I architect a production AI application — a reference design for a grounded, tool-using assistant. Select a component, or trace a single request through the system."
        />

        {/* Controls */}
        <div className="mt-14 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-ink pl-4 pr-5 text-sm font-medium text-void transition-colors hover:bg-lime"
            >
              {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
              {playing ? "Pause trace" : tracing ? "Resume trace" : "Trace a request"}
            </button>
            {tracing && (
              <button
                type="button"
                onClick={reset}
                className="grid size-11 place-items-center rounded-full border border-line text-mist transition-colors hover:text-ink"
                aria-label="Reset trace"
              >
                <RotateCcw className="size-4" aria-hidden />
              </button>
            )}
          </div>
          <div className="flex min-h-11 flex-1 items-center gap-4 sm:justify-end" aria-live="polite">
            {current ? (
              <AnimatePresence mode="wait">
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: duration.micro }}
                  className="flex items-baseline gap-4 sm:justify-end"
                >
                  <span className="label shrink-0 tabular-nums !text-lime">
                    {String(step + 1).padStart(2, "0")}/{String(engineTrace.length).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-ink sm:text-right">{current.caption}</span>
                </motion.span>
              </AnimatePresence>
            ) : (
              <span className="label">Illustrative reference architecture · not a live system</span>
            )}
          </div>
        </div>

        {/* Desktop diagram */}
        <div className="relative -mt-2 hidden aspect-[1000/560] w-full lg:block">
          <svg viewBox="0 0 1000 560" className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <marker id="eng-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 1 L9 5 L0 9" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </marker>
            </defs>
            <rect x="436" y="66" width="404" height="428" rx="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 7" />
            <text x="452" y="88" fontSize="10" letterSpacing="2" className="fill-dim font-mono">AI CORE</text>

            {engineEdges.map((e) => {
              const s = edgeState(e);
              const d = edgePaths[e.id];
              const color = s === "live" ? "#CBFF76" : s === "related" ? "#59E5E8" : "rgba(255,255,255,0.14)";
              return (
                <g key={e.id} style={{ color }}>
                  <path d={d} fill="none" stroke="currentColor" strokeWidth={s === "idle" ? 1 : 1.6} markerEnd="url(#eng-arrow)" className="transition-[stroke] duration-500" />
                  {s !== "idle" && <path d={d} fill="none" stroke="currentColor" strokeOpacity=".7" strokeWidth="1.6" className="flow-dash" />}
                </g>
              );
            })}

            {engineEdges.map((e) => {
              const s = edgeState(e);
              if (s === "idle") return null;
              const mid = labelPos[e.id];
              return (
                <text key={`l-${e.id}`} x={mid[0]} y={mid[1]} textAnchor="middle" fontSize="10" letterSpacing="1.5" className={cn("font-mono uppercase", s === "live" ? "fill-lime" : "fill-cyan")}>
                  {e.label}
                </text>
              );
            })}

            {current?.edge && !reduce && (
              <circle key={step} r="6" fill="#CBFF76">
                <animateMotion dur="1.1s" fill="freeze" path={edgePaths[current.edge]} calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0;1" />
              </circle>
            )}
          </svg>

          {engineNodes.map((n) => (
            <DiagramNode
              key={n.id}
              node={n}
              state={n.id === focus ? "active" : !tracing && engineEdges.some((e) => (e.from === selected && e.to === n.id) || (e.to === selected && e.from === n.id)) ? "related" : "idle"}
              onSelect={() => select(n.id)}
            />
          ))}
        </div>

        {/* Desktop detail */}
        <div className="mt-8 hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={focus}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: duration.micro, ease: ease.quint }}
            >
              <NodeDetail node={nodeById[focus]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile vertical flow */}
        <ol className="mt-10 lg:hidden">
          {mobileOrder.map((id, i) => {
            const n = nodeById[id];
            const open = id === focus;
            const edge = mobileEdges[i];
            return (
              <li key={id}>
                <div className={cn("rounded-2xl border transition-colors duration-500", open ? "border-lime/40 bg-deep" : "border-line bg-void")}>
                  <button
                    type="button"
                    onClick={() => select(id)}
                    aria-expanded={open}
                    aria-controls={`eng-m-${id}`}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-full border font-mono text-xs", open ? "border-lime text-lime" : "border-line text-mist")}>
                      {n.index}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-lg font-medium tracking-tight">{n.title}</span>
                      <span className="label !text-[0.625rem]">{n.kicker}</span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`eng-m-${id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: ease.expo }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6">
                          <NodeDetail node={n} compact />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {edge && (
                  <div className="flex items-center gap-3 py-2 pl-[2.45rem]" aria-hidden>
                    <span className="h-8 w-px bg-gradient-to-b from-cyan/60 to-cyan/10" />
                    <span className="label !text-[0.625rem] text-dim">{edge}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const labelPos: Record<string, [number, number]> = {
  "ui-api": [190, 268],
  "api-orc": [400, 268],
  "orc-ret": [712, 350],
  "ret-orc": [588, 392],
  "orc-llm": [712, 222],
  "llm-orc": [588, 178],
  "llm-res": [905, 168],
  "res-ui": [520, 522],
};

const mobileOrder: EngineNodeId[] = ["interface", "api", "orchestrator", "retrieval", "llm", "response"];
const mobileEdges = ["request", "validated job", "query ⇄ context", "grounded prompt ⇄ tool calls", "tokens", "stream back to interface"];

function DiagramNode({ node, state, onSelect }: { node: EngineNode; state: "active" | "related" | "idle"; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={state === "active"}
      className="group absolute w-[14%] min-w-[128px] -translate-x-1/2 -translate-y-1/2 text-left"
      style={{ left: `${node.x / 10}%`, top: `${(node.y / 560) * 100}%` }}
    >
      <span
        className={cn(
          "relative block rounded-2xl border p-3.5 backdrop-blur-md transition-all duration-500 ease-[var(--ease-expo)]",
          state === "active"
            ? "border-lime/60 bg-deep/90 shadow-[0_0_0_4px_rgba(203,255,118,0.06),0_20px_60px_-10px_rgba(203,255,118,0.25)]"
            : state === "related"
              ? "border-cyan/40 bg-abyss/80"
              : "border-line bg-abyss/70 group-hover:border-line-strong",
        )}
      >
        <span className="flex items-center justify-between">
          <span className={cn("font-mono text-[0.625rem] tracking-[0.18em]", state === "active" ? "text-lime" : state === "related" ? "text-cyan" : "text-dim")}>
            {node.index}
          </span>
          <span className={cn("size-1.5 rounded-full transition-colors", state === "active" ? "bg-lime pulse-dot" : state === "related" ? "bg-cyan" : "bg-white/20")} />
        </span>
        <span className="mt-2 block font-display text-[0.95rem] font-medium leading-tight tracking-tight text-ink">{node.title}</span>
        <span className="mt-1 block font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-mist">{node.kicker}</span>
      </span>
    </button>
  );
}

function NodeDetail({ node, compact }: { node: EngineNode; compact?: boolean }) {
  return (
    <div className={cn("grid gap-6", compact ? "" : "panel rounded-3xl p-8 lg:grid-cols-12 lg:gap-10")}>
      {!compact && (
        <div className="lg:col-span-5">
          <p className="label !text-lime">
            {node.index} · {node.kicker}
          </p>
          <h3 className="mt-3 font-display text-3xl font-medium tracking-tight">{node.title}</h3>
          <p className="mt-4 leading-relaxed text-mist">{node.description}</p>
        </div>
      )}
      {compact && <p className="text-[0.9375rem] leading-relaxed text-mist">{node.description}</p>}
      <dl className={cn("grid gap-4", !compact && "lg:col-span-4")}>
        <div className="rounded-xl border border-line p-4">
          <dt className="label !text-[0.625rem]">Receives</dt>
          <dd className="mt-1.5 text-sm text-ink">{node.receives}</dd>
        </div>
        <div className="rounded-xl border border-line p-4">
          <dt className="label !text-[0.625rem]">Emits</dt>
          <dd className="mt-1.5 text-sm text-ink">{node.emits}</dd>
        </div>
      </dl>
      <div className={cn(!compact && "lg:col-span-3")}>
        <p className="label !text-[0.625rem]">Design concerns</p>
        <ul className="mt-3 space-y-2">
          {node.concerns.map((c) => (
            <li key={c} className="flex items-center gap-2.5 text-sm text-ink">
              <span className="size-1 rounded-full bg-cyan" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
        <p className="label mt-6 !text-[0.625rem]">Typical stack</p>
        <p className="mt-2 font-mono text-xs text-mist">{node.tech.join(" · ")}</p>
      </div>
    </div>
  );
}
