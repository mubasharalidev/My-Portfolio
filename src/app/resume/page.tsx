import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { experience, profile, skillGroups } from "@/data/profile";
import { projects } from "@/data/projects";
import { PrintButton } from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume — ${profile.name}, ${profile.role}.`,
};

const roles = experience.filter((m) => m.kind === "role");
const education = experience.filter((m) => m.kind === "education");

/** A printable résumé generated from the same typed data as the site. */
export default function ResumePage() {
  return (
    <main id="main" className="pb-20 pt-28 sm:pt-32 print:p-0">
      <div className="no-print shell mb-10 flex max-w-4xl flex-wrap items-center justify-between gap-4">
        <Link href="/" className="group inline-flex items-center gap-2 text-sm text-mist hover:text-ink">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> Back to site
        </Link>
        <div className="flex flex-wrap gap-2">
          <a
            href={profile.resumePdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line px-5 text-sm text-ink transition-colors hover:border-line-strong hover:bg-white/[0.04]"
          >
            <Download className="size-4" aria-hidden /> Download PDF
          </a>
          <PrintButton />
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-[var(--gutter)] print:max-w-none print:px-0 [&_*]:print:!text-[#0b0f18]">
        <div className="panel rounded-3xl p-7 sm:p-12 print:rounded-none print:border-0 print:bg-none print:p-0 print:shadow-none">
          <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between print:border-black/20">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
              <p className="mt-2 text-lg text-cyan">{profile.role}</p>
            </div>
            <ul className="space-y-1 text-sm text-mist sm:text-right">
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-ink">{profile.email}</a>
              </li>
              <li>
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hover:text-ink">{profile.phone}</a>
              </li>
              <li>{profile.location} (Open to Remote)</li>
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="break-all hover:text-ink">{s.href.replace(/^https?:\/\/(www\.)?/, "")}</a>
                </li>
              ))}
            </ul>
          </header>

          <section className="py-8">
            <h2 className="label mb-3">Summary</h2>
            <p className="leading-relaxed text-ink">{profile.summary}</p>
          </section>

          <section className="border-t border-line py-8 print:border-black/20">
            <h2 className="label mb-6">Professional experience</h2>
            <ol className="space-y-9">
              {roles.map((m) => (
                <li key={m.period}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-display text-lg font-medium tracking-tight">{m.title}</h3>
                    <p className="font-mono text-xs uppercase tracking-wider text-mist">{m.period}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-cyan">
                    {m.organisation} <span className="text-mist">· {m.location}</span>
                  </p>
                  <ul className="mt-3 space-y-2">
                    {m.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-sm leading-relaxed text-mist">
                        <span className="mt-[0.65em] h-px w-3 shrink-0 bg-cyan" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section className="border-t border-line py-8 print:border-black/20">
            <h2 className="label mb-6">Projects</h2>
            <ul className="space-y-7">
              {projects.map((p) => (
                <li key={p.slug}>
                  <h3 className="font-display font-medium tracking-tight">
                    <Link href={`/work/${p.slug}`} className="hover:text-cyan">{p.title}</Link>
                    {p.context && <span className="font-normal text-mist"> · {p.context}</span>}
                  </h3>
                  <p className="mt-1 font-mono text-[0.6875rem] leading-relaxed text-mist">{p.stack.join(", ")}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{p.tagline}</p>
                  {p.results.length > 0 && (
                    <p className="mt-1.5 text-sm text-ink">{p.results.join(" · ")}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-line py-8 print:border-black/20">
            <h2 className="label mb-6">Skills</h2>
            <dl className="grid gap-5 sm:grid-cols-2">
              {skillGroups.map((g) => (
                <div key={g.title}>
                  <dt className="font-display font-medium tracking-tight">{g.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-mist">{g.items}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border-t border-line pt-8 print:border-black/20">
            <h2 className="label mb-4">Education</h2>
            {education.map((e) => (
              <div key={e.title} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-display font-medium tracking-tight">Bachelor of Science (BS), Computer Science</h3>
                  <p className="text-sm text-mist">
                    {e.organisation} · {e.location}
                  </p>
                </div>
                <p className="font-mono text-xs uppercase tracking-wider text-mist">{e.period}</p>
              </div>
            ))}
          </section>
        </div>
      </article>
    </main>
  );
}
