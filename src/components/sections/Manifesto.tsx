"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { duration, ease } from "@/lib/motion";

const statement: { text: string; accent?: boolean }[][] = [
  [{ text: "I" }, { text: "don’t" }, { text: "just" }],
  [{ text: "write" }, { text: "code." }],
  [{ text: "I" }, { text: "architect" }],
  [{ text: "intelligence.", accent: true }],
];

const layers = [
  {
    index: "I",
    title: "Intelligence",
    body: "Agents, retrieval and evaluation — models that are grounded in real data, constrained by design and measured rather than assumed.",
  },
  {
    index: "II",
    title: "Infrastructure",
    body: "APIs, data pipelines and cloud platforms that keep AI workloads fast, observable and predictable under real traffic.",
  },
  {
    index: "III",
    title: "Interface",
    body: "Products people trust: streaming, responsive, and honest about what the system knows and what it doesn’t.",
  },
];

function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span
      style={{ opacity, filter: blur }}
      className={accent ? "font-serif font-normal normal-case italic tracking-[-0.02em] text-signal" : undefined}
    >
      {children}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const total = statement.flat().length;
  const lineStart = statement.map((_, li) => statement.slice(0, li).flat().length);

  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="relative py-28 sm:py-40">
      <div className="shell">
        <Reveal className="mb-12 flex items-center gap-4 sm:mb-16">
          <span className="label text-cyan">01</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="label">Manifesto</span>
        </Reveal>

        <div ref={ref}>
          <h2
            id="manifesto-title"
            className="display text-[clamp(2.6rem,9.2vw,9rem)] !leading-[0.9]"
            aria-label="I don’t just write code. I architect intelligence."
          >
            {statement.map((line, li) => (
              <span key={li} className={`flex flex-wrap gap-x-[0.24em] ${li % 2 ? "sm:pl-[12%]" : ""}`} aria-hidden>
                {line.map((word, wi) => {
                  const start = ((lineStart[li] + wi) / total) * 0.85;
                  const end = start + 0.85 / total + 0.05;
                  return (
                    <Word key={word.text + li} progress={scrollYProgress} range={[start, end]} accent={word.accent}>
                      {word.text}
                    </Word>
                  );
                })}
              </span>
            ))}
          </h2>
        </div>

        <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-12">
          <Reveal className="label lg:col-span-3">The thesis</Reveal>
          <Reveal delay={0.1} className="lg:col-span-8 lg:col-start-5">
            <p className="text-[clamp(1.25rem,2.2vw,1.9rem)] font-light leading-[1.4] tracking-tight text-mist">
              Models are the easy part. What makes an AI product work is everything around them —{" "}
              <span className="text-ink">retrieval that finds the right context</span>, orchestration that knows when to
              call a tool, <span className="text-ink">APIs that hold up under load</span>, and an interface that makes it
              all feel effortless. That whole system is the work I do.
            </p>
          </Reveal>
        </div>

        <ol className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:mt-28 md:grid-cols-3">
          {layers.map((l, i) => (
            <motion.li
              key={l.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: duration.narrative, delay: i * 0.1, ease: ease.expo }}
              className="group relative bg-void p-7 transition-colors duration-700 hover:bg-deep sm:p-9"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan to-lime transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100"
              />
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{l.title}</h3>
                <span className="font-serif text-xl italic text-dim">{l.index}</span>
              </div>
              <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-mist">{l.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
