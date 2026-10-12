"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, FileText } from "lucide-react";
import { profile } from "@/data/profile";
import { nodeCount } from "@/lib/topology";
import { duration, ease } from "@/lib/motion";
import { MaskLines } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.narrative, delay, ease: ease.expo },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-field fade-edges opacity-50" />
        <div className="absolute right-[-10%] top-[10%] size-[60vw] max-w-[1000px] rounded-full bg-[radial-gradient(circle,rgba(100,136,255,0.16),transparent_62%)]" />
        <div className="absolute left-[-15%] top-[-20%] size-[50vw] rounded-full bg-[radial-gradient(circle,rgba(89,229,232,0.08),transparent_60%)]" />
      </div>

      <HeroVisual />

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-void" />

      <motion.div
        style={{ y, opacity: fade }}
        className="shell relative z-10 flex min-h-[100svh] flex-col pb-8 pt-28 sm:pt-32 lg:pt-28"
      >
        {/* Status rail */}
        <motion.div {...enter(0.2)} className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="label flex items-center gap-2.5 text-ink">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-lime" />
              <span className="relative size-1.5 rounded-full bg-lime" />
            </span>
            System status · active
          </span>
          <span className="label hidden sm:inline">Designing intelligent software</span>
        </motion.div>

        <div className="mt-auto grid gap-10 pt-[36vh] sm:pt-[30vh] lg:grid-cols-12 lg:pt-8">
          <div className="lg:col-span-8 xl:col-span-7">
            <motion.p {...enter(0.35)} className="label mb-5 text-cyan">
              {profile.role}
            </motion.p>

            <MaskLines
              as="h1"
              immediate
              delay={0.45}
              stagger={0.11}
              className="display text-[clamp(2.5rem,12.5vw,9rem)] lg:text-[clamp(5rem,8.6vw,8.75rem)]"
              lines={[
                "Engineering",
                <span key="b" className="text-signal">Intelligent</span>,
                <span key="c" className="flex items-end gap-[0.18em]">
                  Systems
                  <span className="mb-[0.16em] hidden whitespace-nowrap font-serif text-[0.22em] font-normal normal-case italic tracking-normal text-mist sm:inline">
                    — end to end.
                  </span>
                </span>,
              ]}
            />

            <motion.p
              {...enter(1.0)}
              className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-mist sm:text-lg"
            >
              <span className="text-ink">I&apos;m {profile.name}.</span> {profile.intro}
            </motion.p>

            <motion.div {...enter(1.15)} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button href="#work" icon={<ArrowRight className="size-4" />}>
                  Explore my work
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href={profile.resumeUrl} variant="ghost" icon={<FileText className="size-4" />}>
                  View resume
                </Button>
              </Magnetic>
            </motion.div>
          </div>

          {/* Technical index — atmospheric labels describing the visual */}
          <motion.aside
            initial="hidden"
            animate="shown"
            transition={{ staggerChildren: 0.07, delayChildren: 1.3 }}
            className="hidden self-center justify-self-end lg:col-span-4 lg:block xl:col-span-5"
            aria-label="Focus areas"
          >
            <ul className="space-y-3 text-right">
              {profile.focus.map((f, i) => (
                <motion.li
                  key={f}
                  variants={{ hidden: { opacity: 0, x: 16 }, shown: { opacity: 1, x: 0 } }}
                  transition={{ duration: duration.narrative, ease: ease.expo }}
                  className="label flex items-center justify-end gap-3"
                >
                  {f}
                  <span className="text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-8 bg-line-strong" />
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </div>

        {/* Signal bar */}
        <motion.div
          {...enter(1.35)}
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 sm:grid-cols-4 lg:mt-10 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
        >
          {profile.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{s.value}</div>
              <div className="label mt-1 !text-[0.625rem]">{s.label}</div>
            </div>
          ))}
          <a
            href="#manifesto"
            className="group col-span-2 hidden items-center gap-3 self-end justify-self-end sm:col-span-4 lg:col-span-1 lg:flex"
            aria-label="Scroll to explore"
          >
            <span className="label text-right !text-[0.625rem]">
              Topology · {nodeCount("full")} nodes
              <br />
              <span className="text-ink">Scroll to explore</span>
            </span>
            <span className="relative grid size-11 place-items-center overflow-hidden rounded-full border border-line">
              <ArrowDown className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-8" />
              <ArrowDown className="absolute size-4 -translate-y-8 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
