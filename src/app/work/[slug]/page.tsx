import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: p.title, description: p.tagline } : {};
}

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
      <Reveal className="lg:col-span-4">
        <p className="label text-cyan">{index}</p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2>
      </Reveal>
      <Reveal delay={0.08} className="lg:col-span-8">
        {children}
      </Reveal>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = projects.findIndex((p) => p.slug === slug);
  const next = projects[(i + 1) % projects.length];

  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <main id="main" className="relative pb-10 pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80vh] bg-[radial-gradient(ellipse_at_70%_0%,rgba(100,136,255,0.16),transparent_60%)]" />
      <div className="shell">
        <Reveal>
          <Link href="/#work" className="group inline-flex items-center gap-2 text-sm text-mist hover:text-ink">
            <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden />
            All work
          </Link>
        </Reveal>

        <header className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal className="flex items-center gap-4">
              <span className="label text-ink">Case study {project.index}</span>
              <span className="h-px w-8 bg-line-strong" />
              <span className="label">{project.category}</span>
              {project.context && <span className="label hidden text-cyan sm:inline">· {project.context}</span>}
            </Reveal>
            <MaskLines as="h1" immediate delay={0.1} lines={[project.title]} className="display mt-6 text-[clamp(2.8rem,8vw,7.5rem)]" />
            <Reveal delay={0.25}>
              <p className="mt-6 max-w-2xl font-serif text-[clamp(1.4rem,2.6vw,2rem)] italic leading-snug text-mist">
                {project.tagline}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.3} className="lg:col-span-4">
            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-1">
              <div className="border-t border-line pt-3">
                <dt className="label !text-[0.625rem]">Role</dt>
                <dd className="mt-1.5 text-sm text-ink">{project.role}</dd>
              </div>
              <div className="border-t border-line pt-3">
                <dt className="label !text-[0.625rem]">Stack</dt>
                <dd className="mt-1.5 font-mono text-xs leading-relaxed text-ink">{project.stack.join(" · ")}</dd>
              </div>
            </dl>
            {(project.liveUrl || project.repoUrl) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl && <Button href={project.liveUrl}>Visit live</Button>}
                {project.repoUrl && (
                  <Button href={project.repoUrl} variant="ghost" icon={<Code2 className="size-4" />}>
                    Source
                  </Button>
                )}
              </div>
            )}
          </Reveal>
        </header>

        <Reveal delay={0.35} className="mt-16 lg:mt-20">
          <ProjectVisual project={project} uid="detail" className="aspect-[4/3.4] w-full sm:aspect-[16/9]" />
        </Reveal>

        <div className="mt-20">
          <Block index={num()} title="Overview">
            <p className="text-[clamp(1.15rem,1.8vw,1.45rem)] font-light leading-[1.55] tracking-tight text-ink">{project.summary}</p>
          </Block>

          <Block index={num()} title="The problem">
            <p className="text-lg leading-relaxed text-mist">{project.problem}</p>
          </Block>

          <Block index={num()} title="Engineering challenges">
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
              {project.challenges.map((c) => (
                <li key={c.title} className="bg-void p-6">
                  <h3 className="font-display text-lg font-medium tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{c.body}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block index={num()} title="Solution architecture">
            <p className="mb-8 text-lg leading-relaxed text-mist">{project.solution}</p>
            <ol className="relative space-y-3 pl-8">
              <span aria-hidden className="absolute bottom-4 left-[0.6875rem] top-4 w-px bg-gradient-to-b from-cyan via-azure to-lime" />
              {project.architecture.map((s, idx) => (
                <li key={s.stage} className="relative rounded-xl border border-line bg-white/[0.015] p-4">
                  <span aria-hidden className="absolute -left-8 top-1/2 grid size-[1.375rem] -translate-y-1/2 place-items-center rounded-full border border-cyan/60 bg-void font-mono text-[0.5625rem] text-cyan">
                    {idx + 1}
                  </span>
                  <p className="font-display font-medium tracking-tight">{s.stage}</p>
                  <p className="mt-0.5 text-sm text-mist">{s.detail}</p>
                </li>
              ))}
            </ol>
          </Block>

          <Block index={num()} title="Technical stack">
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="rounded-full border border-line bg-white/[0.03] px-4 py-2 font-mono text-xs text-ink">
                  {s}
                </li>
              ))}
            </ul>
          </Block>

          <Block index={num()} title="Implementation highlights">
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-ink">
                  <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-lime" />
                  {h}
                </li>
              ))}
            </ul>
          </Block>

          {project.results.length > 0 && (
            <Block index={num()} title="Outcomes">
              <ul className="space-y-3">
                {project.results.map((r) => (
                  <li key={r} className="flex gap-3 text-lg text-ink">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-cyan" />
                    {r}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block index={num()} title="Key decisions">
            <div className="space-y-8">
              {project.decisions.map((d) => (
                <div key={d.title}>
                  <h3 className="font-serif text-2xl italic text-ink">{d.title}</h3>
                  <p className="mt-2 leading-relaxed text-mist">{d.body}</p>
                </div>
              ))}
            </div>
          </Block>
        </div>

        <Link
          href={`/work/${next.slug}`}
          className="group relative mt-10 block overflow-hidden rounded-3xl border border-line p-8 transition-colors duration-700 hover:border-cyan/40 sm:p-12"
        >
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_50%,rgba(89,229,232,0.1),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <p className="label">Next case study · {next.index}</p>
          <div className="mt-4 flex items-end justify-between gap-6">
            <span className="display text-[clamp(2.2rem,6vw,5.5rem)] transition-colors duration-500 group-hover:text-cyan">{next.title}</span>
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:border-cyan group-hover:text-cyan">
              <ArrowUpRight className="size-5" aria-hidden />
            </span>
          </div>
          <p className="mt-4 max-w-xl text-mist">{next.tagline}</p>
        </Link>

        <footer className="mt-16 flex flex-col gap-4 border-t border-line py-8 text-sm text-mist sm:flex-row sm:justify-between">
          <span>© {profile.name}</span>
          <a href={`mailto:${profile.email}`} className="link-line w-fit hover:text-ink">
            {profile.email}
          </a>
        </footer>
      </div>
    </main>
  );
}
