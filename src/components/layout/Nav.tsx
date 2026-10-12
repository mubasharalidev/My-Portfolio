"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { navItems, profile } from "@/data/profile";
import { LogoMark } from "@/components/ui/Logo";
import { cn, duration, ease } from "@/lib/motion";

const sectionIds = [...navItems.map((n) => n.id), "contact"];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Active-section tracking — a thin band across the viewport's middle.
  useEffect(() => {
    if (!isHome) return;
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  const currentActive = isHome ? active : null;

  return (
    <>
      <header className="no-print fixed inset-x-0 top-0 z-50">
        <div className="shell pt-3 sm:pt-4">
          <nav
            aria-label="Primary"
            className={cn(
              "relative flex h-14 items-center justify-between gap-4 rounded-full pl-4 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-700 ease-[var(--ease-expo)] sm:pl-5",
              scrolled
                ? "border border-line bg-abyss/70 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                : "border border-transparent",
            )}
          >
            <Link href="/" className="group flex items-center gap-3" aria-label={`${profile.name} — home`}>
              <LogoMark className="h-7 w-8 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110" />
              <span className="font-display text-[0.95rem] font-medium tracking-tight">{profile.name}</span>
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isActive = currentActive === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={`/#${item.id}`}
                      className={cn(
                        "relative block rounded-full px-4 py-2 text-[0.8125rem] transition-colors duration-300",
                        isActive ? "text-ink" : "text-mist hover:text-ink",
                      )}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full border border-line-strong bg-white/[0.05]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              {profile.availability.open && (
                <span className="label hidden items-center gap-2 pr-2 !text-[0.625rem] xl:flex">
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-lime/60" />
                    <span className="relative size-2 rounded-full bg-lime" />
                  </span>
                  Available
                </span>
              )}
              <Link
                href="/#contact"
                className="group hidden h-10 items-center gap-2 rounded-full bg-ink pl-4 pr-3 text-[0.8125rem] font-medium text-void transition-colors duration-500 hover:bg-lime sm:flex"
              >
                Let&apos;s talk
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-45" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.03] lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                <span className="flex w-4 flex-col gap-[5px]" aria-hidden>
                  <span className="h-px w-full bg-ink" />
                  <span className="h-px w-2/3 bg-ink" />
                </span>
              </button>
            </div>

            <motion.span
              aria-hidden
              style={{ scaleX: progress }}
              className={cn(
                "absolute inset-x-6 -bottom-px h-px origin-left bg-gradient-to-r from-cyan via-azure to-lime transition-opacity duration-500",
                scrolled ? "opacity-70" : "opacity-0",
              )}
            />
          </nav>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} active={currentActive} />
    </>
  );
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string | null }) {
  const panelRef = useRef<HTMLDivElement>(null);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("button")?.focus(), 50);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onKey]);

  const items = [...navItems, { id: "contact", label: "Contact" } as const];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-void/[0.97] backdrop-blur-2xl lg:hidden"
          initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
          transition={{ duration: 0.8, ease: ease.inOut }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-field fade-edges opacity-60" />
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-cyan/10 blur-3xl" />

          <div className="shell relative flex h-[4.5rem] items-center justify-between pt-3">
            <span className="label">Menu</span>
            <button
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.04]"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="shell relative flex flex-1 flex-col justify-center py-10">
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: duration.narrative, delay: 0.15 + i * 0.05, ease: ease.expo }}
                  >
                    <Link
                      href={`/#${item.id}`}
                      onClick={onClose}
                      className="group flex items-baseline gap-4 py-2"
                    >
                      <span className="label w-6 text-cyan">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={cn(
                          "display text-[clamp(2.4rem,11vw,4.5rem)] transition-colors",
                          active === item.id ? "text-signal" : "text-ink group-hover:text-cyan",
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="shell relative grid gap-4 border-t border-line py-8 sm:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            exit={{ opacity: 0 }}
          >
            <a href={`mailto:${profile.email}`} className="text-sm text-mist hover:text-ink">
              {profile.email}
            </a>
            <div className="flex gap-5 sm:justify-end">
              {profile.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-sm text-mist hover:text-ink">
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
