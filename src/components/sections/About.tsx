import { Download, FileText, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const principles = [
  {
    title: "Systems over demos",
    body: "A prototype proves an idea; a system survives users. I design for the second from the first commit.",
  },
  {
    title: "Measure, don’t assume",
    body: "AI behaviour is probabilistic, so quality has to be evaluated — not eyeballed in a single happy-path test.",
  },
  {
    title: "Craft at every layer",
    body: "The retrieval pipeline and the loading state deserve the same care. Users feel the whole product.",
  },
];

export function About() {
  const facts = [
    { k: "Currently", v: "Senior Full Stack & AI Engineer at 10Pearls" },
    { k: "Based in", v: `${profile.location} · open to remote` },
    { k: "Leadership", v: "Led engineering teams of up to 6" },
    { k: "Education", v: "BS Computer Science, UMT Lahore" },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-x-clip py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute -right-[8vw] top-10 select-none font-display text-[38vw] font-bold leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.04)] lg:text-[28vw]">
        {profile.initials}
      </div>

      <div className="shell relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <Reveal className="mb-6 flex items-center gap-4">
              <span className="label text-cyan">07</span>
              <span className="h-px w-10 bg-line-strong" />
              <span className="label">About</span>
            </Reveal>
            <MaskLines
              id="about-title"
              lines={["The engineer", <span key="b">behind the <span className="text-signal">engine.</span></span>]}
              className="display text-[clamp(2.6rem,6vw,5.5rem)]"
            />

            <Reveal delay={0.1} className="mt-14">
              <figure className="relative border-l border-lime/60 pl-6">
                <blockquote className="font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] italic leading-[1.12] text-ink">
                  “{profile.quote}”
                </blockquote>
                <figcaption className="label mt-6">— {profile.name}</figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-24">
            <Reveal>
              <p className="text-[clamp(1.2rem,1.9vw,1.5rem)] font-light leading-[1.5] tracking-tight text-ink">
                I work across the whole stack because AI products rarely fail inside the model — they fail at the seams
                between retrieval, orchestration, infrastructure and interface.
              </p>
              <p className="mt-6 leading-relaxed text-mist">
                Over 5+ years I’ve shipped AI products and scalable SaaS and fintech platforms for clients in the UK, the
                Netherlands and Pakistan — as the sole backend engineer for a Dutch product company, as a team lead for UK
                multi-tenant SaaS serving 50,000+ users, and now architecting enterprise fintech backends. That range is the
                point: I can take an idea from architecture diagram to deployed, observable product.
              </p>
            </Reveal>

            <ol className="mt-14 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
              {principles.map((p, i) => (
                <li key={p.title} className="bg-void">
                  <Reveal delay={i * 0.08} className="grid gap-2 p-6 sm:grid-cols-[3rem_1fr] sm:gap-4">
                    <span className="font-serif text-lg italic text-dim">{["i", "ii", "iii"][i]}.</span>
                    <div>
                      <h3 className="font-display text-lg font-medium tracking-tight">{p.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-mist">{p.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={0.1}>
              <dl className="mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {facts.map((f) => (
                  <div key={f.k} className="border-t border-line pt-4">
                    <dt className="label !text-[0.625rem]">{f.k}</dt>
                    <dd className="mt-1.5 text-ink">{f.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-12 flex flex-wrap gap-3">
                <Button href={profile.resumeUrl} icon={<FileText className="size-4" />}>
                  View resume
                </Button>
                <Button href={profile.resumePdf} variant="ghost" icon={<Download className="size-4" />}>
                  Download CV
                </Button>
                <Button href={`mailto:${profile.email}`} variant="ghost" icon={<Mail className="size-4" />}>
                  Email me
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
