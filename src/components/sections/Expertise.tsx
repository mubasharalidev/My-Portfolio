"use client";

import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { capabilities, capabilityLinks, type Capability, type CapabilityId } from "@/data/capabilities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn, duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const byId = Object.fromEntries(capabilities.map((c) => [c.id, c])) as Record<CapabilityId, Capability>;

function connectionsOf(id: CapabilityId) {
  return capabilityLinks
    .filter((l) => l.a === id || l.b === id)
    .map((l) => ({ other: byId[l.a === id ? l.b : l.a], note: l.note }));
}

export function Expertise() {
  const [active, setActive] = useState<CapabilityId>("ai");

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = capabilities.findIndex((c) => c.id === active);
    const n = capabilities.length;
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? n - 1 : e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % n : (i - 1 + n) % n;
    setActive(capabilities[next].id);
    document.getElementById(`cap-tab-${capabilities[next].id}`)?.focus();
  }

  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="shell">
        <SectionHeading
            id="expertise-title"
            index="02"
            label="Capabilities"
            lines={["A full-stack", <span key="b">approach to <span className="text-signal">AI.</span></span>]}
            intro="End-to-end expertise to design, build and scale intelligent systems. Each discipline matters most where it meets the others — select one to see how it connects."
          />

        {/* Desktop: index + live system map */}
        <div className="mt-20 hidden gap-10 lg:grid lg:grid-cols-12">
          <div
            role="tablist"
            aria-label="Capability areas"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="col-span-5 flex flex-col border-t border-line"
          >
            {capabilities.map((c) => {
              const isActive = c.id === active;
              return (
                <button
                  key={c.id}
                  id={`cap-tab-${c.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="cap-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(c.id)}
                  onMouseEnter={() => setActive(c.id)}
                  className="group relative flex items-baseline gap-6 border-b border-line py-6 text-left"
                >
                  {isActive && (
                    <motion.span
                      layoutId="cap-bar"
                      className="absolute -left-px bottom-[-1px] top-[-1px] w-px bg-lime"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={cn("label w-6 pl-4 transition-colors", isActive ? "!text-lime" : "")}>{c.index}</span>
                  <span
                    className={cn(
                      "font-display text-[clamp(1.4rem,2.2vw,2.1rem)] font-medium leading-tight tracking-tight transition-[color,transform] duration-500 ease-[var(--ease-expo)]",
                      isActive ? "translate-x-2 text-ink" : "text-dim group-hover:text-mist",
                    )}
                  >
                    {c.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="col-span-7">
            <div id="cap-panel" role="tabpanel" aria-labelledby={`cap-tab-${active}`} className="panel relative overflow-hidden rounded-3xl">
              <Constellation active={active} onSelect={setActive} />
              <div className="border-t border-line p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: duration.micro, ease: ease.quint }}
                  >
                    <CapabilityDetail cap={byId[active]} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: accessible accordion */}
        <ul className="mt-14 border-t border-line lg:hidden">
          {capabilities.map((c, i) => {
            const open = c.id === active;
            return (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: duration.narrative, delay: i * 0.04, ease: ease.expo }}
                className="border-b border-line"
              >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`cap-m-${c.id}`}
                      onClick={() => setActive(c.id)}
                      className="flex w-full items-center gap-4 py-6 text-left"
                    >
                      <span className={cn("label w-6", open && "!text-lime")}>{c.index}</span>
                      <span className={cn("flex-1 font-display text-2xl font-medium tracking-tight", open ? "text-ink" : "text-mist")}>
                        {c.title}
                      </span>
                      <Plus
                        className={cn("size-5 shrink-0 text-mist transition-transform duration-500 ease-[var(--ease-expo)]", open && "rotate-45 text-lime")}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`cap-m-${c.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: ease.expo }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pl-10">
                          <CapabilityDetail cap={c} compact />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function CapabilityDetail({ cap, compact }: { cap: Capability; compact?: boolean }) {
  const links = connectionsOf(cap.id);
  return (
    <div className={cn("grid gap-8", !compact && "md:grid-cols-2")}>
      <div>
        {!compact && <p className="label mb-3 text-cyan">{cap.short}</p>}
        <p className="text-[0.975rem] leading-relaxed text-mist">{cap.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {cap.skills.map((s) => (
            <li key={s} className="rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-[0.8125rem] text-ink">
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="label mb-4">Connects to</p>
        <ul className="space-y-3">
          {links.map(({ other, note }) => (
            <li key={other.id} className="flex gap-3 text-sm">
              <span className="mt-[0.45em] h-px w-4 shrink-0 bg-cyan" aria-hidden />
              <span>
                <span className="text-ink">{other.title}</span>
                <span className="block text-mist">{note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Constellation({ active, onSelect }: { active: CapabilityId; onSelect: (id: CapabilityId) => void }) {
  const reduce = useReducedMotionSafe();
  return (
    <div className="relative aspect-[16/10] w-full" aria-hidden>
      <div className="absolute inset-0 grid-field fade-edges opacity-70" />
      <svg viewBox="0 14 100 76" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="cap-node-glow">
            <stop offset="0" stopColor="#CBFF76" stopOpacity="0.45" />
            <stop offset="1" stopColor="#CBFF76" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="50" cy="54" rx="46" ry="34" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.15" strokeDasharray="0.6 1.2" />
        <text x="50" y="18.6" textAnchor="middle" className="fill-dim font-mono" fontSize="1.5" letterSpacing="0.4">
          PRODUCTION SYSTEM
        </text>

        {capabilityLinks.map((l) => {
          const a = byId[l.a].pos;
          const b = byId[l.b].pos;
          const on = l.a === active || l.b === active;
          const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
          return (
            <g key={`${l.a}-${l.b}`}>
              <path d={d} stroke={on ? "#59E5E8" : "rgba(255,255,255,0.1)"} strokeWidth={on ? 0.3 : 0.18} fill="none" className="transition-[stroke] duration-500" />
              {on && <path d={d} stroke="#59E5E8" strokeOpacity="0.8" strokeWidth="0.32" fill="none" className="flow-dash" />}
              {on && !reduce && (
                <circle r="0.7" fill="#CBFF76">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path={l.a === active ? d : `M ${b.x} ${b.y} L ${a.x} ${a.y}`} />
                </circle>
              )}
            </g>
          );
        })}

        {capabilities.map((c) => {
          const on = c.id === active;
          const linked = capabilityLinks.some((l) => (l.a === active && l.b === c.id) || (l.b === active && l.a === c.id));
          return (
            <g
              key={c.id}
              transform={`translate(${c.pos.x} ${c.pos.y})`}
              onClick={() => onSelect(c.id)}
              onMouseEnter={() => onSelect(c.id)}
              className="cursor-pointer"
              data-cursor
            >
              {on && <circle r="9" fill="url(#cap-node-glow)" />}
              {on && !reduce && <circle r="4" fill="none" stroke="#CBFF76" strokeWidth="0.2" className="ping-ring" />}
              <circle
                r={on ? 4 : 3.2}
                fill="#0B0F18"
                stroke={on ? "#CBFF76" : linked ? "#59E5E8" : "rgba(255,255,255,0.22)"}
                strokeWidth={on ? 0.4 : 0.25}
                className="transition-all duration-500"
              />
              <circle r={on ? 1.3 : 0.8} fill={on ? "#CBFF76" : linked ? "#59E5E8" : "#7A8699"} className="transition-all duration-500" />
              <text y="7.6" textAnchor="middle" fontSize="2.1" className={cn("font-display transition-colors", on ? "fill-ink" : "fill-mist")}>
                {c.short}
              </text>
              <text y="10.2" textAnchor="middle" fontSize="1.35" letterSpacing="0.3" className="fill-dim font-mono">
                {c.index}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
