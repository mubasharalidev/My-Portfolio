"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { GraduationCap } from "lucide-react";
import { experience } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn, duration, ease } from "@/lib/motion";

const journey = [...experience].reverse();

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const [reached, setReached] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.min(journey.length, Math.floor(v * (journey.length - 1) + 1.0001)));
  });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-28 sm:py-36">
      <div className="shell">
        <SectionHeading
          id="experience-title"
          index="05"
          label="Experience"
          lines={["A journey", <span key="b">of <span className="font-serif font-normal normal-case italic tracking-[-0.02em]">building.</span></span>]}
          intro="From early experimentation to production AI systems — a continuous path from fundamentals, through full-stack engineering, to AI specialisation."
        />

        <ol ref={ref} className="relative mt-20 grid gap-0 pl-10 xl:mt-28 xl:grid-cols-5 xl:gap-6 xl:pl-0 xl:pt-14">
          {/* Rails */}
          <span aria-hidden className="absolute bottom-2 left-[0.6875rem] top-2 w-px bg-line xl:hidden" />
          <motion.span aria-hidden style={{ scaleY: progress }} className="absolute bottom-2 left-[0.6875rem] top-2 w-px origin-top bg-gradient-to-b from-cyan via-azure to-lime xl:hidden" />
          <span aria-hidden className="absolute left-0 right-0 top-[1.0625rem] hidden h-px bg-line xl:block" />
          <motion.span aria-hidden style={{ scaleX: progress }} className="absolute left-0 right-0 top-[1.0625rem] hidden h-px origin-left bg-gradient-to-r from-cyan via-azure to-lime xl:block" />

          {journey.map((m, i) => {
            const on = i < reached;
            const latest = i === journey.length - 1;
            return (
              <motion.li
                key={m.period}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: duration.narrative, delay: i * 0.06, ease: ease.expo }}
                className="relative pb-14 last:pb-0 xl:pb-0"
              >
                {/* Node */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-10 top-0.5 grid size-[1.375rem] place-items-center rounded-full border bg-void transition-colors duration-700 xl:-top-14 xl:left-0",
                    on ? (latest ? "border-lime" : "border-cyan") : "border-line-strong",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full transition-colors duration-700", on ? (latest ? "bg-lime" : "bg-cyan") : "bg-white/20")} />
                  {latest && on && <span className="absolute inset-0 rounded-full border border-lime ping-ring" />}
                </span>

                <p className={cn("label tabular-nums transition-colors duration-700", on && "text-ink", latest && on && "!text-lime")}>{m.period}</p>
                <h3 className={cn("mt-4 font-display text-[1.6rem] font-medium leading-[1.08] tracking-tight transition-colors duration-700 xl:text-[1.45rem] 2xl:text-[1.7rem]", on ? "text-ink" : "text-dim")}>
                  {m.title}
                </h3>
                {m.organisation && <p className="mt-1 text-sm text-cyan">{m.organisation}</p>}
                {m.kind === "education" && (
                  <p className="label mt-2 flex items-center gap-1.5 !text-[0.625rem]">
                    <GraduationCap className="size-3.5" aria-hidden /> Education
                  </p>
                )}
                <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-mist">{m.summary}</p>
                <ul className="mt-5 space-y-1.5">
                  {m.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-mist">
                      <span className={cn("mt-[0.45em] h-px w-3 shrink-0 transition-colors", on ? "bg-cyan" : "bg-line-strong")} aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
