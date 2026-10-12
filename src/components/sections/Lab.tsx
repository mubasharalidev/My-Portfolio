"use client";

import dynamic from "next/dynamic";
import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Boxes, Network, Waypoints } from "lucide-react";
import { notebook } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn, duration, ease } from "@/lib/motion";

const Loading = () => <div className="h-[34rem] animate-pulse rounded-2xl bg-white/[0.02]" />;
const demos = [
  {
    id: "agents",
    short: "Agents",
    title: "Agent Orchestration",
    blurb: "Watch a planner delegate to specialised agents, review their work, and synthesise a result.",
    icon: Waypoints,
    Component: dynamic(() => import("@/components/lab/AgentOrchestrator"), { ssr: false, loading: Loading }),
  },
  {
    id: "vectors",
    short: "Vectors",
    title: "Vector Search Explorer",
    blurb: "Type a query and see how semantic similarity picks the nearest documents in embedding space.",
    icon: Boxes,
    Component: dynamic(() => import("@/components/lab/VectorExplorer"), { ssr: false, loading: Loading }),
  },
  {
    id: "neurons",
    short: "Neurons",
    title: "Neural Network Playground",
    blurb: "Reshape a small network and drive its inputs — every change runs a real forward pass.",
    icon: Network,
    Component: dynamic(() => import("@/components/lab/NeuralPlayground"), { ssr: false, loading: Loading }),
  },
];

export function Lab() {
  const [active, setActive] = useState(0);
  const Demo = demos[active].Component;

  function onKey(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (active + (e.key === "ArrowRight" ? 1 : demos.length - 1)) % demos.length;
    setActive(next);
    document.getElementById(`lab-tab-${demos[next].id}`)?.focus();
  }

  return (
    <section id="lab" aria-labelledby="lab-title" className="relative py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="shell">
        <SectionHeading
          id="lab-title"
          index="06"
          label="Experiments"
          lines={["The lab.", <span key="b" className="text-outline">Play with it.</span>]}
          intro="Small, honest demonstrations of the ideas behind my work. Everything here runs in your browser — no servers and no model calls, and simulated behaviour is labelled."
        />

        <div className="mt-16">
          <div role="tablist" aria-label="Experiments" onKeyDown={onKey} className="grid grid-cols-3 gap-2 sm:gap-3">
            {demos.map((d, i) => {
              const on = i === active;
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  id={`lab-tab-${d.id}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="lab-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-500 sm:p-6",
                    on ? "border-cyan/40 bg-deep" : "border-line hover:border-line-strong hover:bg-white/[0.02]",
                  )}
                >
                  {on && <motion.span layoutId="lab-glow" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan via-azure to-lime" />}
                  <div className="flex items-center justify-between">
                    <span className={cn("label !text-[0.625rem]", on && "!text-cyan")}>{String(i + 1).padStart(2, "0")}</span>
                    <Icon className={cn("size-4 transition-colors", on ? "text-lime" : "text-dim")} aria-hidden />
                  </div>
                  <p className="mt-4 font-display text-base font-medium tracking-tight sm:hidden">{d.short}</p>
                  <p className="mt-6 hidden font-display text-xl font-medium tracking-tight sm:block">{d.title}</p>
                  <p className="mt-2 hidden text-sm leading-relaxed text-mist md:block">{d.blurb}</p>
                </button>
              );
            })}
          </div>

          <div id="lab-panel" role="tabpanel" aria-labelledby={`lab-tab-${demos[active].id}`} className="panel mt-4 rounded-3xl p-5 sm:p-8 lg:p-10">
            <p className="mb-8 text-sm text-mist md:hidden">{demos[active].blurb}</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={demos[active].id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: duration.micro, ease: ease.quint }}
              >
                <Demo />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="label">From the notebook</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">Further explorations across models, modalities and agent design.</p>
          </Reveal>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:col-span-8">
            {notebook.map((n, i) => {
              const inner = (
                <>
                  <span className="label !text-[0.625rem] text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-lg font-medium tracking-tight">{n.title}</span>
                    <span className="block text-sm text-mist">{n.note}</span>
                  </span>
                </>
              );
              return (
                <li key={n.title} className="bg-void">
                  {n.href ? (
                    <a href={n.href} target="_blank" rel="noreferrer" className="flex h-full gap-5 p-6 transition-colors hover:bg-deep">
                      {inner}
                    </a>
                  ) : (
                    <div className="flex h-full gap-5 p-6">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
