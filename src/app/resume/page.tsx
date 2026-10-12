import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { experience, profile } from "@/data/profile";
import { capabilities } from "@/data/capabilities";
import { projects } from "@/data/projects";
import { PrintButton } from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume — ${profile.name}, ${profile.role}.`,
};

/** A printable résumé generated from the same typed data as the site. */
export default function ResumePage() {
  return (
    <main id="main" className="pb-20 pt-28 sm:pt-32 print:p-0">
      <div className="no-print shell mb-10 flex max-w-4xl items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-2 text-sm text-mist hover:text-ink">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> Back to site
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto max-w-4xl px-[var(--gutter)] print:max-w-none print:px-0 [&_*]:print:!text-[#0b0f18]">
        <div className="panel rounded-3xl p-8 sm:p-12 print:rounded-none print:border-0 print:bg-none print:p-0 print:shadow-none">
          <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between print:border-black/20">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
              <p className="mt-2 text-lg text-cyan">{profile.role}</p>
            </div>
            <ul className="space-y-1 text-sm text-mist sm:text-right">
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-ink">{profile.email}</a>
              </li>
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="hover:text-ink">{s.href.replace(/^https?:\/\/(www\.)?/, "")}</a>
                </li>
              ))}
              {profile.location && <li>{profile.location}</li>}
            </ul>
          </header>

          <section className="py-8">
            <h2 className="label mb-3">Profile</h2>
            <p className="leading-relaxed text-ink">{profile.intro}</p>
          </section>

          <section className="border-t border-line py-8 print:border-black/20">
            <h2 className="label mb-6">Experience</h2>
            <ol className="space-y-7">
              {experience.map((m) => (
                <li key={m.period} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-mist">{m.period}</p>
                  <div>
                    <h3 className="font-display text-lg font-medium tracking-tight">
                      {m.title}
                      {m.organisation && <span className="text-mist"> · {m.organisation}</span>}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-mist">{m.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="border-t border-line py-8 print:border-black/20">
            <h2 className="label mb-6">Capabilities</h2>
            <dl className="grid gap-5 sm:grid-cols-2">
              {capabilities.map((c) => (
                <div key={c.id}>
                  <dt className="font-display font-medium tracking-tight">{c.title}</dt>
                  <dd className="mt-1 text-sm text-mist">{c.skills.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border-t border-line pt-8 print:border-black/20">
            <h2 className="label mb-6">Selected projects</h2>
            <ul className="space-y-5">
              {projects.map((p) => (
                <li key={p.slug}>
                  <h3 className="font-display font-medium tracking-tight">
                    {p.title} <span className="font-mono text-xs font-normal text-mist">— {p.stack.join(", ")}</span>
                  </h3>
                  <p className="mt-1 text-sm text-mist">{p.tagline}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}
