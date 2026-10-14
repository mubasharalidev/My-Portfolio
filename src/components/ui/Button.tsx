import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/motion";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: ReactNode;
  className?: string;
  external?: boolean;
};

const base =
  "group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full pl-6 pr-2 text-sm font-medium tracking-tight transition-[color,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-expo)]";

const variants = {
  primary:
    "bg-ink text-void hover:bg-lime shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_40px_-10px_rgba(89,229,232,0.45)] hover:shadow-[0_0_0_1px_rgba(203,255,118,0.6),0_10px_50px_-8px_rgba(203,255,118,0.55)]",
  ghost: "hairline text-ink hover:border-line-strong hover:bg-white/[0.04]",
};

/** Pill CTA with a sliding arrow glyph. Renders Link, or <a> for external targets. */
export function Button({ href, children, variant = "primary", icon, className, external }: ButtonProps) {
  // Files (e.g. the CV PDF) and external URLs bypass client-side routing.
  const isFile = /\.pdf$/i.test(href);
  const isExternal = external ?? (isFile || /^(https?:|mailto:|tel:)/.test(href));
  const content = (
    <>
      <span className="relative">{children}</span>
      <span
        className={cn(
          "relative grid size-8 place-items-center overflow-hidden rounded-full",
          variant === "primary" ? "bg-void text-ink" : "bg-white/[0.06] text-ink",
        )}
        aria-hidden
      >
        <span className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-6 group-hover:-translate-y-6">
          {icon ?? <ArrowUpRight className="size-4" />}
        </span>
        <span className="absolute -translate-x-6 translate-y-6 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0 group-hover:translate-y-0">
          {icon ?? <ArrowUpRight className="size-4" />}
        </span>
      </span>
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (isExternal) {
    const newTab = isFile || href.startsWith("http");
    return (
      <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
