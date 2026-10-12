"use client";

import { useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "@/data/profile";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { LogoMark } from "@/components/ui/Logo";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  const links = [
    ...profile.socials.map((s) => ({ label: s.label, detail: s.handle, href: s.href })),
    { label: "Resume", detail: "View & download", href: profile.resumeUrl },
  ];

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-title"
      onPointerMove={onMove}
      className="relative isolate overflow-hidden pt-28 sm:pt-40 [--mx:70%] [--my:30%]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--mx)_var(--my),rgba(89,229,232,0.09),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_120%,rgba(100,136,255,0.18),transparent_60%)]" />
        <div className="absolute inset-0 grid-field opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_40%,transparent)]" />
      </div>

      <div className="shell">
        <Reveal className="mb-10 flex items-center gap-4">
          <span className="label text-cyan">08</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="label">Get in touch</span>
        </Reveal>

        <MaskLines
          id="contact-title"
          className="display text-[clamp(3rem,13.2vw,14rem)] !leading-[0.84]"
          stagger={0.12}
          lines={[
            "Let’s build",
            <span key="b" className="group relative inline-block cursor-default">
              <span className="text-outline">what’s next.</span>
              <span
                aria-hidden
                className="text-signal absolute inset-0 [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-1000 ease-[var(--ease-expo)] group-hover:[clip-path:inset(0_0%_0_0)]"
              >
                what’s next.
              </span>
            </span>,
          ]}
        />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="max-w-md text-lg leading-relaxed text-mist">
                Have a project in mind, a collaboration idea, or just want to say hi? I’d love to hear from you.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic strength={0.2}>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group inline-flex items-center gap-4 rounded-full bg-ink py-3 pl-6 pr-3 text-void shadow-[0_20px_60px_-15px_rgba(89,229,232,0.5)] transition-colors duration-500 hover:bg-lime sm:py-4 sm:pl-8"
                  >
                    <span className="font-display text-[clamp(0.95rem,2.4vw,1.35rem)] font-medium tracking-tight [overflow-wrap:anywhere]">
                      {profile.email}
                    </span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-void text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 sm:size-12">
                      <ArrowUpRight className="size-5" aria-hidden />
                    </span>
                  </a>
                </Magnetic>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 text-sm text-mist transition-colors hover:border-line-strong hover:text-ink"
                  aria-live="polite"
                >
                  {copied ? <Check className="size-4 text-lime" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                  {copied ? "Copied" : "Copy email"}
                </button>
              </div>
            </Reveal>
            {profile.availability.open && (
              <Reveal delay={0.15} className="mt-10 flex items-center gap-3">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-lime/60" />
                  <span className="relative size-2 rounded-full bg-lime" />
                </span>
                <span className="text-sm text-ink">{profile.availability.label}</span>
                <span className="text-sm text-dim">— {profile.availability.detail}</span>
              </Reveal>
            )}
          </div>

          <ul className="border-t border-line lg:col-span-5 lg:col-start-8">
            {links.map((l, i) => {
              const external = l.href.startsWith("http");
              return (
                <li key={l.label}>
                  <Reveal delay={i * 0.06}>
                    <a
                      href={l.href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group flex items-center justify-between gap-4 border-b border-line py-6"
                    >
                      <span>
                        <span className="block font-display text-2xl font-medium tracking-tight transition-[color,transform] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2 group-hover:text-cyan sm:text-3xl">
                          {l.label}
                        </span>
                        <span className="label mt-1 block !text-[0.625rem] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
                          {l.detail}
                        </span>
                      </span>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:border-cyan group-hover:text-cyan">
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                    </a>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="mt-28 flex flex-col gap-6 border-t border-line py-8 sm:mt-36 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-6 w-7" />
            <span className="text-sm text-mist">© {profile.name}. All rights reserved.</span>
          </div>
          <p className="label hidden !text-[0.625rem] md:block">Building a more intelligent tomorrow</p>
          <a href="#top" className="group inline-flex items-center gap-2 text-sm text-mist hover:text-ink">
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-line transition-colors group-hover:border-cyan">
              <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </a>
        </footer>
      </div>
    </section>
  );
}
