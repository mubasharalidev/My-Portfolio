"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  children: ReactNode;
};

/** Directional fade-up when scrolled into view. Reduced motion is handled by the
 *  root MotionConfig (transforms snap, opacity still fades). */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: duration.narrative, delay, ease: ease.expo }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type MaskLinesProps = {
  id?: string;
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount (hero) rather than on scroll. */
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
};

/** Line-by-line masked reveal for display typography. */
export function MaskLines({
  id,
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  immediate = false,
  as = "h2",
}: MaskLinesProps) {
  const Tag = motion[as];
  const trigger = immediate
    ? { initial: "hidden", animate: "shown" }
    : { initial: "hidden", whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag id={id} className={className} {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="block pb-[0.06em] -mb-[0.06em] [overflow-x:visible] [overflow-y:clip]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            variants={{
              hidden: { y: "105%", rotate: 2 },
              shown: { y: "0%", rotate: 0 },
            }}
            transition={{ duration: duration.cinematic, delay: delay + i * stagger, ease: ease.expo }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
