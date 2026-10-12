import type { Project, ProjectVisual as VisualKind } from "@/data/projects";
import { cn } from "@/lib/motion";
import { Packet } from "./Packet";

const C = { cyan: "#59E5E8", azure: "#6488FF", lime: "#CBFF76", ink: "#F5F7FA", dim: "#7A8699", line: "rgba(255,255,255,0.12)", bg: "#0B0F18" };

const captions: Record<VisualKind, string> = {
  agents: "Agent topology",
  retrieval: "Retrieval pipeline",
  analytics: "Interface composition",
  studio: "Generation workspace",
};

const glows: Record<Project["accent"], string> = {
  cyan: "bg-[radial-gradient(ellipse_at_50%_40%,rgba(89,229,232,0.18),transparent_65%)]",
  azure: "bg-[radial-gradient(ellipse_at_50%_40%,rgba(100,136,255,0.22),transparent_65%)]",
  lime: "bg-[radial-gradient(ellipse_at_50%_40%,rgba(203,255,118,0.13),transparent_65%)]",
};

/** Framed, frontend-rendered system illustration for a project. */
export function ProjectVisual({ project, className, uid = "pv" }: { project: Project; className?: string; uid?: string }) {
  return (
    <figure className={cn("panel relative isolate overflow-hidden rounded-3xl", className)}>
      <div aria-hidden className={cn("absolute inset-0 -z-10", glows[project.accent])} />
      <div aria-hidden className="absolute inset-0 -z-10 grid-field opacity-60 fade-edges" />
      <div className="absolute inset-x-5 top-4 flex justify-between sm:inset-x-6 sm:top-5">
        <span className="label !text-[0.625rem]">Fig. {project.index}</span>
        <span className="label !text-[0.625rem] text-dim">Illustrative</span>
      </div>
      <div className="absolute inset-0 grid place-items-center p-8 pt-12 sm:p-12">
        <Art kind={project.visual} uid={`${uid}-${project.slug}`} />
      </div>
      <figcaption className="absolute inset-x-5 bottom-4 flex items-center justify-between sm:inset-x-6 sm:bottom-5">
        <span className="label !text-[0.625rem] text-ink">{captions[project.visual]}</span>
        <span className="label !text-[0.625rem]">{project.stack.slice(0, 2).join(" · ")}</span>
      </figcaption>
    </figure>
  );
}

function Art({ kind, uid }: { kind: VisualKind; uid: string }) {
  const common = { viewBox: "0 0 400 400", className: "h-full max-h-[34rem] w-full", "aria-hidden": true } as const;
  switch (kind) {
    case "agents":
      return <AgentsArt {...common} />;
    case "retrieval":
      return <RetrievalArt {...common} />;
    case "analytics":
      return <AnalyticsArt uid={uid} {...common} />;
    case "studio":
      return <StudioArt uid={uid} {...common} />;
  }
}

type SvgProps = React.SVGProps<SVGSVGElement> & { uid?: string };

function Label({ x, y, children, anchor = "middle", fill = C.dim, size = 8 }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; fill?: string; size?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} letterSpacing="1.2" fill={fill} className="font-mono">
      {children}
    </text>
  );
}

/* 01 — Planner → specialised agents → tools → synthesis */
function AgentsArt(props: SvgProps) {
  const agents = [
    { x: 85, label: "RESEARCH" },
    { x: 200, label: "ANALYSIS" },
    { x: 315, label: "ACTION" },
  ];
  const toPaths = agents.map((a) => `M200 128 C200 165 ${a.x} 160 ${a.x} 192`);
  const fromPaths = agents.map((a) => `M${a.x} 258 C${a.x} 300 200 290 200 322`);
  return (
    <svg {...props}>
      <rect x="160" y="34" width="80" height="24" rx="12" fill="none" stroke={C.line} />
      <Label x={200} y={49} fill={C.ink}>GOAL</Label>
      <path d="M200 58 V92" stroke={C.cyan} strokeOpacity=".6" className="flow-dash" />

      <rect x="138" y="92" width="124" height="36" rx="10" fill={C.bg} stroke={C.cyan} strokeOpacity=".7" />
      <Label x={200} y={113} fill={C.cyan} size={9}>PLANNER</Label>

      {toPaths.map((d, i) => (
        <g key={`to-${i}`}>
          <path d={d} fill="none" stroke={C.line} />
          <path d={d} fill="none" stroke={C.cyan} strokeOpacity=".55" className="flow-dash" />
          <Packet path={d} dur={2.6} delay={i * 0.5} r={2.6} />
        </g>
      ))}

      {agents.map((a, i) => (
        <g key={a.label}>
          <circle cx={a.x} cy={225} r={33} fill={C.bg} stroke={i === 1 ? C.lime : C.azure} strokeOpacity={i === 1 ? 0.9 : 0.6} />
          <circle cx={a.x} cy={225} r={24} fill="none" stroke={C.line} strokeDasharray="2 4" />
          <circle cx={a.x} cy={225} r={4} fill={i === 1 ? C.lime : C.azure} className="pulse-dot" style={{ animationDelay: `${i * 0.6}s` }} />
          <Label x={a.x} y={274} size={7.5}>{a.label}</Label>
          {[-1, 0, 1].map((t) => (
            <g key={t}>
              <line x1={a.x} y1={225} x2={a.x + t * 26} y2={225 - 40 + Math.abs(t) * 10} stroke={C.line} />
              <rect x={a.x + t * 26 - 4} y={225 - 44 + Math.abs(t) * 10} width="8" height="8" rx="2" fill={C.bg} stroke={C.dim} strokeOpacity=".7" />
            </g>
          ))}
        </g>
      ))}
      <Label x={200} y={166} size={6.5}>TOOLS</Label>

      {fromPaths.map((d, i) => (
        <g key={`from-${i}`}>
          <path d={d} fill="none" stroke={C.line} />
          <Packet path={d} dur={2.6} delay={1.3 + i * 0.4} r={2.2} fill={C.cyan} />
        </g>
      ))}

      <rect x="132" y="322" width="136" height="38" rx="10" fill={C.bg} stroke={C.lime} strokeOpacity=".8" />
      <Label x={200} y={344} fill={C.lime} size={9}>SYNTHESIS</Label>
      <path d="M70 380 H330" stroke={C.line} strokeDasharray="1 5" />
      <Label x={200} y={394} size={6.5}>SHARED STATE · TRACED</Label>
    </svg>
  );
}

/* 02 — Documents → chunks → vector space → grounded answer */
function RetrievalArt(props: SvgProps) {
  const pts = Array.from({ length: 46 }, (_, i) => {
    const a = i * 2.39996;
    const r = 18 + ((i * 37) % 70);
    return { x: +(268 + Math.cos(a) * r).toFixed(2), y: +(214 + Math.sin(a) * r * 0.86).toFixed(2) };
  });
  const q = { x: 286, y: 196 };
  const nearest = [...pts].sort((a, b) => Math.hypot(a.x - q.x, a.y - q.y) - Math.hypot(b.x - q.x, b.y - q.y)).slice(0, 4);
  return (
    <svg {...props}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${34 + i * 9} ${42 + i * 9})`}>
          <rect width="66" height="84" rx="6" fill={C.bg} stroke={i === 2 ? C.azure : C.line} strokeOpacity={i === 2 ? 0.8 : 1} />
          {i === 2 && [16, 26, 36, 46, 56].map((y) => <line key={y} x1="10" x2={y === 56 ? 36 : 56} y1={y} y2={y} stroke={C.dim} strokeOpacity=".5" />)}
        </g>
      ))}
      <Label x={86} y={160} anchor="middle">DOCUMENTS</Label>

      <path d="M120 96 H160" stroke={C.azure} strokeOpacity=".6" className="flow-dash" />
      <Packet path="M120 96 H160" dur={1.6} r={2.2} fill={C.azure} />
      <g transform="translate(166 66)">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={(i % 4) * 16} y={Math.floor(i / 4) * 16} width="12" height="12" rx="2" fill={i === 6 ? C.azure : C.bg} fillOpacity={i === 6 ? 0.5 : 1} stroke={C.line} />
        ))}
      </g>
      <Label x={196} y={130}>CHUNKS</Label>
      <path d="M230 96 C250 96 262 112 262 130" stroke={C.azure} strokeOpacity=".6" fill="none" className="flow-dash" />

      <ellipse cx="268" cy="214" rx="100" ry="86" fill="none" stroke={C.line} />
      <ellipse cx="268" cy="214" rx="64" ry="55" fill="none" stroke={C.line} strokeDasharray="2 5" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill={C.azure} fillOpacity=".55" />
      ))}
      {nearest.map((p, i) => (
        <g key={i}>
          <line x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke={C.lime} strokeOpacity=".7" strokeWidth="1" className="flow-dash" />
          <circle cx={p.x} cy={p.y} r="3.4" fill={C.cyan} />
        </g>
      ))}
      <circle cx={q.x} cy={q.y} r="5" fill={C.lime} />
      <circle cx={q.x} cy={q.y} r="5" fill="none" stroke={C.lime} className="ping-ring" />
      <Label x={268} y={318}>VECTOR SPACE · TOP-K</Label>

      <path d="M196 262 C150 262 118 280 118 300" stroke={C.cyan} strokeOpacity=".6" fill="none" className="flow-dash" />
      <Packet path="M196 262 C150 262 118 280 118 300" dur={2} r={2.4} fill={C.cyan} />
      <rect x="28" y="300" width="186" height="72" rx="10" fill={C.bg} stroke={C.cyan} strokeOpacity=".6" />
      {[318, 332, 346].map((y, i) => <line key={y} x1="44" x2={i === 2 ? 130 : 196} y1={y} y2={y} stroke={C.ink} strokeOpacity=".35" />)}
      {["1", "2"].map((n, i) => (
        <g key={n} transform={`translate(${140 + i * 24} 340)`}>
          <rect width="18" height="13" rx="3" fill="none" stroke={C.lime} strokeOpacity=".8" />
          <Label x={9} y={9.5} fill={C.lime} size={7}>{n}</Label>
        </g>
      ))}
      <Label x={44} y={390} anchor="start">GROUNDED ANSWER · CITED</Label>
    </svg>
  );
}

/* 03 — Dashboard composition: KPIs, live series, AI insight */
function AnalyticsArt({ uid, ...props }: SvgProps) {
  const series = "M58 268 C82 262 96 236 120 240 S158 210 182 222 S222 176 248 186 S290 150 312 160 S338 132 350 128";
  return (
    <svg {...props}>
      <rect x="20" y="40" width="360" height="320" rx="14" fill={C.bg} stroke={C.line} />
      <rect x="20" y="40" width="360" height="30" rx="14" fill="rgba(255,255,255,0.025)" />
      {[38, 50, 62].map((x) => <circle key={x} cx={x} cy="55" r="3" fill={C.dim} fillOpacity=".5" />)}
      <rect x="150" y="49" width="100" height="12" rx="6" fill="rgba(255,255,255,0.04)" />

      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${40 + i * 84} 86)`}>
          <rect width="72" height="50" rx="8" fill="rgba(255,255,255,0.02)" stroke={i === 1 ? C.lime : C.line} strokeOpacity={i === 1 ? 0.7 : 1} />
          <rect x="10" y="12" width="26" height="5" rx="2.5" fill={C.dim} fillOpacity=".5" />
          <rect x="10" y="24" width="38" height="9" rx="3" fill={C.ink} fillOpacity=".75" />
          {[0, 1, 2, 3, 4].map((b) => (
            <rect key={b} x={44 + b * 5} y={44 - [8, 12, 7, 14, 18][(b + i) % 5]} width="3" height={[8, 12, 7, 14, 18][(b + i) % 5]} rx="1" fill={i === 1 ? C.lime : C.azure} fillOpacity=".7" />
          ))}
        </g>
      ))}

      <rect x="40" y="150" width="236" height="140" rx="10" fill="rgba(255,255,255,0.015)" stroke={C.line} />
      {[180, 210, 240, 270].map((y) => <line key={y} x1="52" x2="264" y1={y} y2={y} stroke={C.line} strokeDasharray="2 4" />)}
      <defs>
        <linearGradient id={`${uid}-an-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.cyan} stopOpacity=".35" />
          <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-an-clip`}><rect x="40" y="150" width="236" height="140" rx="10" /></clipPath>
      </defs>
      <g clipPath={`url(#${uid}-an-clip)`}>
        <path d={`${series} V290 H58 Z`} fill={`url(#${uid}-an-area)`} />
        <path d={series} fill="none" stroke={C.cyan} strokeWidth="2" />
      </g>
      <circle cx="248" cy="186" r="4" fill={C.lime} />
      <circle cx="248" cy="186" r="4" fill="none" stroke={C.lime} className="ping-ring" />

      <path d="M252 182 C270 170 280 168 292 168" stroke={C.lime} strokeOpacity=".7" fill="none" strokeDasharray="2 3" />
      <g transform="translate(292 150)">
        <rect width="72" height="88" rx="10" fill={C.bg} stroke={C.lime} strokeOpacity=".7" />
        <path d="M14 16 l2.5 5.5 5.5 2.5 -5.5 2.5 -2.5 5.5 -2.5 -5.5 -5.5 -2.5 5.5 -2.5z" fill={C.lime} transform="translate(0 -4)" />
        <Label x={28} y={24} anchor="start" fill={C.lime} size={6.5}>INSIGHT</Label>
        {[42, 52, 62, 72].map((y, i) => <line key={y} x1="12" x2={i === 3 ? 40 : 60} y1={y} y2={y} stroke={C.ink} strokeOpacity=".3" />)}
      </g>

      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const h = [30, 44, 26, 52, 38, 60, 34, 48, 56, 40, 64, 46][i];
        return <rect key={i} x={48 + i * 19} y={344 - h} width="11" height={h} rx="2" fill={i === 10 ? C.lime : C.azure} fillOpacity={i === 10 ? 0.85 : 0.35} />;
      })}
      <rect x="292" y="252" width="72" height="92" rx="10" fill="rgba(255,255,255,0.015)" stroke={C.line} />
      <circle cx="328" cy="298" r="26" fill="none" stroke={C.line} strokeWidth="8" />
      <circle cx="328" cy="298" r="26" fill="none" stroke={C.cyan} strokeWidth="8" strokeDasharray="110 200" transform="rotate(-90 328 298)" />
      <Label x={200} y={384}>LIVE · STREAMED UPDATES</Label>
    </svg>
  );
}

/* 04 — Preview, prompt and multi-track editing with a generating clip */
function StudioArt({ uid, ...props }: SvgProps) {
  return (
    <svg {...props}>
      <defs>
        <linearGradient id={`${uid}-st-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.azure} stopOpacity=".55" />
          <stop offset="1" stopColor={C.cyan} stopOpacity=".08" />
        </linearGradient>
        <linearGradient id={`${uid}-st-gen`} x1="0" x2="1">
          <stop offset="0" stopColor={C.lime} stopOpacity=".1" />
          <stop offset=".5" stopColor={C.lime} stopOpacity=".6" />
          <stop offset="1" stopColor={C.lime} stopOpacity=".1" />
        </linearGradient>
        <clipPath id={`${uid}-st-frame`}><rect x="70" y="36" width="260" height="146" rx="10" /></clipPath>
      </defs>

      <g clipPath={`url(#${uid}-st-frame)`}>
        <rect x="70" y="36" width="260" height="146" fill={`url(#${uid}-st-sky)`} />
        <circle cx="268" cy="88" r="20" fill={C.lime} fillOpacity=".8" />
        <path d="M70 182 L130 120 L170 150 L222 98 L280 160 L330 128 V182 Z" fill={C.bg} fillOpacity=".85" />
        <path d="M70 182 L150 140 L210 170 L270 136 L330 170 V182 Z" fill={C.bg} />
      </g>
      <rect x="70" y="36" width="260" height="146" rx="10" fill="none" stroke={C.line} />
      {[[70, 36], [330, 36], [70, 182], [330, 182]].map(([x, y], i) => (
        <path key={i} d={`M${x + (x > 200 ? -10 : 10)} ${y} H${x} V${y + (y > 100 ? -10 : 10)}`} stroke={C.cyan} fill="none" strokeWidth="1.5" />
      ))}

      <rect x="70" y="196" width="260" height="26" rx="13" fill={C.bg} stroke={C.lime} strokeOpacity=".55" />
      <path d="M84 209 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill={C.lime} transform="translate(0 -6)" />
      <rect x="98" y="206" width="150" height="6" rx="3" fill={C.ink} fillOpacity=".3" />
      <Label x={316} y={212} anchor="end" fill={C.lime} size={7}>PROMPT</Label>

      {[
        { y: 244, clips: [[60, 90, C.azure], [158, 120, C.azure]] },
        { y: 276, clips: [[60, 54, C.cyan], [122, 70, "gen"], [200, 96, C.cyan]] },
        { y: 308, clips: [[60, 200, C.dim]] },
      ].map((track, ti) => (
        <g key={ti}>
          <rect x="30" y={track.y} width="20" height="22" rx="4" fill="none" stroke={C.line} />
          {track.clips.map(([x, w, col], ci) =>
            col === "gen" ? (
              <g key={ci}>
                <rect x={x as number} y={track.y} width={w as number} height="22" rx="5" fill={C.bg} stroke={C.lime} strokeDasharray="3 3" />
                <rect x={x as number} y={track.y} width={w as number} height="22" rx="5" fill={`url(#${uid}-st-gen)`} className="pulse-dot" />
              </g>
            ) : (
              <rect key={ci} x={x as number} y={track.y} width={w as number} height="22" rx="5" fill={col as string} fillOpacity=".22" stroke={col as string} strokeOpacity=".55" />
            ),
          )}
        </g>
      ))}
      {Array.from({ length: 30 }, (_, i) => (
        <line key={i} x1={60 + i * 10} x2={60 + i * 10} y1="338" y2={i % 5 ? 342 : 346} stroke={C.dim} strokeOpacity=".6" />
      ))}
      <line x1="236" x2="236" y1="236" y2="350" stroke={C.lime} strokeWidth="1.5" />
      <path d="M231 232 h10 l-5 6z" fill={C.lime} />
      <Label x={186} y={268} fill={C.lime} size={6}>GENERATING</Label>
      <Label x={200} y={376}>EDIT · REGENERATE · ASSEMBLE</Label>
    </svg>
  );
}
