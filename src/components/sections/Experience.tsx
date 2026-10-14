"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { GraduationCap, MapPin } from "lucide-react";
import { experience } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn, duration, ease } from "@/lib/motion";

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const [reached, setReached] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.max(1, Math.min(experience.length, Math.floor(v * (experience.length - 1) + 1.0001))));
  });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-28 sm:py-36">
      <div className="shell">
        <SectionHeading
          id="experience-title"
          index="05"
          label="Experience"
          lines={["A journey", <span key="b">of <span className="font-serif font-normal normal-case italic tracking-[-0.02em]">building.</span></span>]}
          intro="5+ years shipping AI products and scalable SaaS and fintech platforms for clients in the UK, the Netherlands and Pakistan — from sole backend engineer to team lead."
        />

        <ol ref={ref} className="relative mt-20 pl-10 sm:pl-14 lg:mt-28">
          <span aria-hidden className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-line sm:left-[1.1875rem]" />
          <motion.span
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute bottom-3 left-[0.6875rem] top-3 w-px origin-top bg-gradient-to-b from-lime via-cyan to-azure sm:left-[1.1875rem]"
          />

          {experience.map((m, i) => {
            const on = i < reached;
            const current = i === 0;
            return (
              <motion.li
                key={m.period}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: duration.narrative, delay: 0.05, ease: ease.expo }}
                className="relative border-t border-line py-10 first:border-t-0 last:pb-0 lg:py-12"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-10 top-10 grid size-[1.375rem] place-items-center rounded-full border bg-void transition-colors duration-700 sm:-left-14 sm:ml-2 lg:top-12",
                    on ? (current ? "border-lime" : "border-cyan") : "border-line-strong",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full transition-colors duration-700", on ? (current ? "bg-lime" : "bg-cyan") : "bg-white/20")} />
                  {current && <span className="absolute inset-0 rounded-full border border-lime ping-ring" />}
                </span>

                <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-3">
                    <p className={cn("label tabular-nums transition-colors duration-700", on && "text-ink", current && "!text-lime")}>{m.period}</p>
                    <p className="label mt-3 flex items-center gap-1.5 !text-[0.625rem]">
                      {m.kind === "education" ? <GraduationCap className="size-3.5" aria-hidden /> : <MapPin className="size-3.5" aria-hidden />}
                      {m.location}
                    </p>
                  </div>

                  <div className="lg:col-span-5">
                    <h3 className={cn("font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium leading-[1.1] tracking-tight transition-colors duration-700", on ? "text-ink" : "text-mist")}>
                      {m.title}
                    </h3>
                    <p className="mt-2 text-cyan">{m.organisation}</p>
                    <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-mist">{m.summary}</p>
                  </div>

                  {m.highlights.length > 0 && (
                    <ul className="space-y-2.5 lg:col-span-4 lg:pt-1">
                      {m.highlights.map((h) => (
                        <li key={h} className="flex gap-3 font-mono text-[0.75rem] uppercase leading-relaxed tracking-[0.06em] text-ink/90">
                          <span className={cn("mt-[0.6em] h-px w-3 shrink-0 transition-colors", on ? (current ? "bg-lime" : "bg-cyan") : "bg-line-strong")} aria-hidden />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
