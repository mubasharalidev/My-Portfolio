import type { ReactNode } from "react";
import { MaskLines, Reveal } from "./Reveal";
import { cn } from "@/lib/motion";

type Props = {
  id?: string;
  index: string;
  label: string;
  lines: ReactNode[];
  intro?: ReactNode;
  className?: string;
  align?: "split" | "stack";
};

/** Numbered section header: mono index rail + masked display headline. */
export function SectionHeading({ id, index, label, lines, intro, className, align = "split" }: Props) {
  return (
    <header
      className={cn(
        "grid gap-8",
        align === "split" && "lg:grid-cols-12 lg:items-end",
        className,
      )}
    >
      <div className={cn(align === "split" && "lg:col-span-8")}>
        <Reveal className="mb-6 flex items-center gap-4">
          <span className="label text-cyan">{index}</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="label">{label}</span>
        </Reveal>
        <MaskLines id={id} lines={lines} className="display text-[clamp(2.6rem,7vw,6.5rem)]" />
      </div>
      {intro && (
        <Reveal delay={0.15} className={cn("max-w-md text-base leading-relaxed text-mist", align === "split" && "lg:col-span-4 lg:justify-self-end")}>
          {intro}
        </Reveal>
      )}
    </header>
  );
}
