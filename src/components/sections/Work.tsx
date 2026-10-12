"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { cn, duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

export function Work() {
  const [active, setActive] = useState(0);

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-28 sm:py-36">
      <div className="shell">
        <SectionHeading
          id="work-title"
          index="03"
          label="Selected work"
          lines={["Real projects.", <span key="b" className="text-signal">Real systems.</span>]}
          intro="A selection of AI-powered products, platforms and systems I’ve built — each one a different layer of the same craft."
        />

        <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-14">
          <div className="hidden lg:col-span-6 lg:block">
            <Stage active={active} />
          </div>
          <div className="space-y-24 lg:col-span-6 lg:space-y-0">
            {projects.map((p, i) => (
              <ProjectEntry key={p.slug} project={p} index={i} onActive={setActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Sticky frame that swaps artwork as entries cross the viewport centre. */
function Stage({ active }: { active: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });

  function onMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <div className="sticky top-[calc(var(--nav-h)+1.5rem)] flex h-[calc(100svh-var(--nav-h)-3rem)] max-h-[860px] flex-col">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="relative flex-1 [perspective:1400px]"
      >
        <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative size-full [transform-style:preserve-3d]">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: i === active ? 1 : 0,
                scale: i === active ? 1 : 0.94,
                filter: i === active ? "blur(0px)" : "blur(8px)",
              }}
              transition={{ duration: duration.narrative, ease: ease.expo }}
              aria-hidden={i !== active}
            >
              <ProjectVisual project={p} uid="stage" className="size-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-5 flex items-center gap-4" aria-hidden>
        <span className="label tabular-nums text-ink">{projects[active].index}</span>
        <div className="flex flex-1 gap-1.5">
          {projects.map((p, i) => (
            <span key={p.slug} className="relative h-px flex-1 overflow-hidden bg-line-strong">
              <motion.span
                className="absolute inset-0 origin-left bg-lime"
                initial={false}
                animate={{ scaleX: i <= active ? 1 : 0 }}
                transition={{ duration: duration.narrative, ease: ease.expo }}
              />
            </span>
          ))}
        </div>
        <span className="label tabular-nums">{String(projects.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

function ProjectEntry({ project: p, index, onActive }: { project: Project; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const centred = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (centred) onActive(index);
  }, [centred, index, onActive]);

  const rows = [
    { k: "Problem", v: p.problem },
    { k: "Role", v: p.role },
    { k: "Solution", v: p.solution },
  ];

  return (
    <article ref={ref} aria-labelledby={`proj-${p.slug}`} className="lg:flex lg:min-h-[88svh] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: duration.cinematic, ease: ease.expo }}
        className="w-full"
      >
        <Link href={`/work/${p.slug}`} tabIndex={-1} aria-hidden className="mb-10 block lg:hidden">
          <ProjectVisual project={p} uid="inline" className="aspect-[4/3.6] w-full" />
        </Link>

        <div className="flex items-center gap-4">
          <span className="label tabular-nums text-ink">
            {p.index} <span className="text-dim">/ {String(projects.length).padStart(2, "0")}</span>
          </span>
          <span className="h-px w-8 bg-line-strong" />
          <span
            className={cn(
              "label rounded-full border px-2.5 py-1 !text-[0.625rem]",
              p.accent === "lime" ? "border-lime/30 !text-lime" : p.accent === "azure" ? "border-azure/40 !text-azure" : "border-cyan/30 !text-cyan",
            )}
          >
            {p.category}
          </span>
        </div>

        <h3 id={`proj-${p.slug}`} className="mt-6">
          <Link href={`/work/${p.slug}`} className="group inline-flex items-start gap-3">
            <span className="display text-[clamp(2.3rem,4.6vw,4.4rem)] transition-colors duration-500 group-hover:text-cyan">
              {p.title}
            </span>
            <ArrowUpRight
              className="mt-[0.3em] size-7 shrink-0 text-dim transition-all duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan"
              aria-hidden
            />
          </Link>
        </h3>
        <p className="mt-5 max-w-lg font-serif text-[1.45rem] italic leading-snug text-mist">{p.tagline}</p>

        <dl className="mt-10 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <div key={r.k} className="grid gap-2 py-5 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <dt className="label pt-0.5">{r.k}</dt>
              <dd className="text-[0.9375rem] leading-relaxed text-mist">{r.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <ul className="flex flex-wrap gap-2" aria-label="Technology stack">
            {p.stack.map((s) => (
              <li key={s} className="rounded-full border border-line bg-white/[0.03] px-3 py-1.5 font-mono text-[0.6875rem] tracking-wide text-ink">
                {s}
              </li>
            ))}
          </ul>
          <Link
            href={`/work/${p.slug}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
          >
            <span className="link-line pb-0.5">Read case study</span>
            <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-45" aria-hidden />
          </Link>
        </div>
      </motion.div>
    </article>
  );
}
