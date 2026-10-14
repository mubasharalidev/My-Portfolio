import type { Project, ProjectVisual as VisualKind } from "@/data/projects";
import { cn } from "@/lib/motion";
import { Packet } from "./Packet";

const C = { cyan: "#59E5E8", azure: "#6488FF", lime: "#CBFF76", ink: "#F5F7FA", dim: "#7A8699", line: "rgba(255,255,255,0.12)", bg: "#0B0F18" };

const captions: Record<VisualKind, string> = {
  agents: "Agent topology",
  retrieval: "Retrieval pipeline",
  analytics: "Interface composition",
  pipeline: "Agent pipeline",
  ledger: "Transaction platform",
  migration: "Strangler migration",
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
    case "pipeline":
      return <PipelineArt {...common} />;
    case "ledger":
      return <LedgerArt {...common} />;
    case "migration":
      return <MigrationArt {...common} />;
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
    { x: 85, label: "RETRIEVE" },
    { x: 200, label: "REASON" },
    { x: 315, label: "ACT" },
  ];
  const toPaths = agents.map((a) => `M200 128 C200 165 ${a.x} 160 ${a.x} 192`);
  const fromPaths = agents.map((a) => `M${a.x} 258 C${a.x} 300 200 290 200 322`);
  return (
    <svg {...props}>
      <rect x="160" y="34" width="80" height="24" rx="12" fill="none" stroke={C.line} />
      <Label x={200} y={49} fill={C.ink}>TICKET</Label>
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
      <Label x={200} y={344} fill={C.lime} size={9}>RESOLUTION</Label>
      <path d="M70 380 H330" stroke={C.line} strokeDasharray="1 5" />
      <Label x={200} y={394} size={6.5}>GROUNDED BY RAG · PINECONE</Label>
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
      <Label x={86} y={160} anchor="middle">HELP CENTER · TICKETS</Label>

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
      <Label x={44} y={390} anchor="start">STREAMED ANSWER · WEBSOCKETS</Label>
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

/* 04 — Five-stage document pipeline with model routing and cited output */
function PipelineArt(props: SvgProps) {
  const stages = ["INGEST", "CLASSIFY", "EXTRACT", "CROSS-REF", "SUMMARISE"];
  const y0 = 34;
  const gap = 60;
  return (
    <svg {...props}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${26 + i * 8} ${40 + i * 8})`}>
          <rect width="52" height="66" rx="5" fill={C.bg} stroke={i === 2 ? C.lime : C.line} strokeOpacity={i === 2 ? 0.8 : 1} />
          {i === 2 && (
            <text x="26" y="38" textAnchor="middle" fontSize="9" fill={C.lime} className="font-mono">
              PDF
            </text>
          )}
        </g>
      ))}
      <Label x={68} y={140}>50–300 PDFs</Label>
      <path d="M94 84 C120 84 124 51 150 51" fill="none" stroke={C.lime} strokeOpacity=".6" className="flow-dash" />

      <path d={`M220 ${y0 + 34} V${y0 + gap * 4}`} stroke={C.line} />
      <Packet path={`M220 ${y0 + 17} V${y0 + gap * 4 + 17}`} dur={3.2} r={3} />
      <Packet path={`M220 ${y0 + 17} V${y0 + gap * 4 + 17}`} dur={3.2} delay={1.6} r={3} fill={C.cyan} />

      {stages.map((s, i) => {
        const y = y0 + i * gap;
        const hot = i === 2 || i === 4;
        return (
          <g key={s}>
            <rect x="150" y={y} width="140" height="34" rx="9" fill={C.bg} stroke={hot ? C.lime : C.azure} strokeOpacity={hot ? 0.8 : 0.55} />
            <circle cx="168" cy={y + 17} r="8" fill="none" stroke={C.dim} strokeOpacity=".7" />
            <text x="168" y={y + 20} textAnchor="middle" fontSize="8" fill={C.ink} className="font-mono">
              {i + 1}
            </text>
            <Label x={232} y={y + 20} fill={hot ? C.lime : C.ink} size={8.5}>
              {s}
            </Label>
          </g>
        );
      })}

      {[
        { y: y0 + gap * 2, label: "GPT-4o" },
        { y: y0 + gap * 4, label: "CLAUDE" },
      ].map((m) => (
        <g key={m.label}>
          <line x1="290" x2="306" y1={m.y + 17} y2={m.y + 17} stroke={C.lime} strokeOpacity=".6" strokeDasharray="2 3" />
          <rect x="306" y={m.y + 5} width="70" height="24" rx="12" fill="none" stroke={C.lime} strokeOpacity=".7" />
          <Label x={341} y={m.y + 20} fill={C.lime} size={7.5}>
            {m.label}
          </Label>
        </g>
      ))}

      <path d={`M220 ${y0 + gap * 4 + 34} V330`} stroke={C.cyan} strokeOpacity=".6" className="flow-dash" />
      <rect x="110" y="330" width="220" height="40" rx="10" fill={C.bg} stroke={C.cyan} strokeOpacity=".6" />
      <line x1="126" x2="226" y1="346" y2="346" stroke={C.ink} strokeOpacity=".35" />
      <line x1="126" x2="196" y1="356" y2="356" stroke={C.ink} strokeOpacity=".35" />
      {["p.12", "p.47"].map((c, i) => (
        <g key={c} transform={`translate(${246 + i * 38} 342)`}>
          <rect width="32" height="16" rx="4" fill="none" stroke={C.lime} strokeOpacity=".8" />
          <Label x={16} y={11} fill={C.lime} size={7}>
            {c}
          </Label>
        </g>
      ))}
      <Label x={220} y={390}>CITED FINDINGS</Label>
    </svg>
  );
}

/* 05 — Transaction stream → services → partitioned store + replica → batch */
function LedgerArt(props: SvgProps) {
  const rows = [56, 74, 92, 110, 128, 146];
  const services = [50, 100, 150];
  return (
    <svg {...props}>
      {rows.map((y, i) => (
        <g key={y}>
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={20 + k * 17 + (i % 2) * 6} y={y} width="11" height="6" rx="2" fill={k === 3 ? C.cyan : C.azure} fillOpacity={0.25 + k * 0.18} />
          ))}
        </g>
      ))}
      <Label x={58} y={174}>3M+ TX / DAY</Label>
      {services.map((y, i) => (
        <path key={i} d={`M96 ${rows[i * 2] + 3} C112 ${rows[i * 2] + 3} 112 ${y + 17} 130 ${y + 17}`} fill="none" stroke={C.cyan} strokeOpacity=".5" className="flow-dash" />
      ))}

      {services.map((y, i) => (
        <g key={y}>
          <rect x="130" y={y} width="84" height="34" rx="9" fill={C.bg} stroke={C.cyan} strokeOpacity=".6" />
          <Label x={172} y={y + 15} fill={C.ink} size={7.5}>
            FASTAPI
          </Label>
          <Label x={172} y={y + 26} size={6}>
            {`SERVICE 0${i + 1}`}
          </Label>
          <path d={`M214 ${y + 17} C236 ${y + 17} 236 110 258 110`} fill="none" stroke={C.line} />
          <Packet path={`M214 ${y + 17} C236 ${y + 17} 236 110 258 110`} dur={1.8} delay={i * 0.6} r={2.4} />
        </g>
      ))}
      <Label x={172} y={206} fill={C.lime} size={7}>
        {"P95 < 200MS"}
      </Label>

      <path d="M260 58 v104 a46 12 0 0 0 92 0 v-104" fill={C.bg} stroke={C.azure} strokeOpacity=".7" />
      <ellipse cx="306" cy="58" rx="46" ry="12" fill={C.bg} stroke={C.azure} strokeOpacity=".7" />
      {[84, 110, 136].map((y) => (
        <path key={y} d={`M260 ${y} a46 12 0 0 0 92 0`} fill="none" stroke={C.azure} strokeOpacity=".35" strokeDasharray="3 3" />
      ))}
      {["P1", "P2", "P3", "P4"].map((p, i) => (
        <Label key={p} x={306} y={78 + i * 26} size={6.5}>
          {p}
        </Label>
      ))}
      <Label x={306} y={194}>POSTGRESQL · PARTITIONED</Label>

      <line x1="340" y1="172" x2="352" y2="214" stroke={C.cyan} strokeOpacity=".6" strokeDasharray="2 3" />
      <path d="M326 222 v34 a26 7 0 0 0 52 0 v-34" fill={C.bg} stroke={C.cyan} strokeOpacity=".6" />
      <ellipse cx="352" cy="222" rx="26" ry="7" fill={C.bg} stroke={C.cyan} strokeOpacity=".6" />
      <Label x={352} y={280} size={6.5}>
        READ REPLICA
      </Label>

      <path d="M280 176 C280 250 200 250 200 296" fill="none" stroke={C.lime} strokeOpacity=".6" className="flow-dash" />
      <rect x="40" y="296" width="320" height="52" rx="12" fill={C.bg} stroke={C.lime} strokeOpacity=".7" />
      <Label x={62} y={316} anchor="start" fill={C.lime} size={7.5}>
        DATABRICKS · SPARK SQL
      </Label>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={62 + i * 23.5} y="326" width="19" height="8" rx="2" fill={C.lime} fillOpacity={i < 5 ? 0.75 : 0.18} className={i === 4 ? "pulse-dot" : undefined} />
      ))}
      <Label x={200} y={376}>ASYNC BATCH PIPELINES</Label>
    </svg>
  );
}

/* 06 — Monolith strangled into eight services over a Kafka bus */
function MigrationArt(props: SvgProps) {
  const extracted = new Set([0, 2, 3, 5]);
  const tiles = Array.from({ length: 8 }, (_, i) => ({ x: 244 + (i % 2) * 72, y: 54 + Math.floor(i / 2) * 60, go: i % 2 === 0 }));
  return (
    <svg {...props}>
      <rect x="26" y="48" width="104" height="236" rx="10" fill={C.bg} stroke={C.line} />
      <rect x="20" y="42" width="116" height="248" rx="13" fill="none" stroke={C.lime} strokeOpacity=".45" strokeDasharray="4 5" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="38"
          y={60 + i * 27.5}
          width="80"
          height="20"
          rx="4"
          fill={extracted.has(i) ? "none" : C.dim}
          fillOpacity={extracted.has(i) ? 0 : 0.28}
          stroke={extracted.has(i) ? C.dim : "none"}
          strokeOpacity=".5"
          strokeDasharray="3 3"
        />
      ))}
      <Label x={78} y={308}>MONOLITH · 200K LOC</Label>
      <Label x={78} y={320} fill={C.lime} size={6.5}>
        STRANGLER FACADE
      </Label>

      {[70, 125, 180, 235].map((y, i) => (
        <g key={y}>
          <path d={`M130 ${y} H196`} stroke={C.line} />
          <Packet path={`M130 ${y} H196`} dur={1.6} delay={i * 0.4} r={2.4} fill={C.cyan} />
        </g>
      ))}

      <rect x="196" y="44" width="16" height="250" rx="8" fill={C.bg} stroke={C.azure} strokeOpacity=".7" />
      <path d="M204 56 V282" stroke={C.azure} strokeOpacity=".6" className="flow-dash" />
      <Packet path="M204 282 V56" dur={2.4} r={2.6} />
      <Label x={204} y={310} fill={C.azure}>
        KAFKA
      </Label>

      {tiles.map((t, i) => (
        <g key={i}>
          {t.go && <path d={`M212 ${t.y + 20} H${t.x}`} stroke={C.line} />}
          <rect x={t.x} y={t.y} width="62" height="40" rx="8" fill={t.go ? C.cyan : C.azure} fillOpacity=".12" stroke={t.go ? C.cyan : C.azure} strokeOpacity=".65" />
          <Label x={t.x + 31} y={t.y + 18} fill={C.ink} size={7}>
            {t.go ? "GO" : "NEST"}
          </Label>
          <Label x={t.x + 31} y={t.y + 30} size={6}>
            {`SVC 0${i + 1}`}
          </Label>
        </g>
      ))}
      <Label x={311} y={310}>8 SERVICES · EKS</Label>

      <g transform="translate(200 352)">
        <circle r="16" fill="none" stroke={C.lime} strokeOpacity=".7" strokeDasharray="70 31" className="pulse-dot" />
        <path d="M12 -12 l4 2 -1 -5" fill="none" stroke={C.lime} strokeWidth="1.4" />
      </g>
      <Label x={226} y={355} anchor="start" fill={C.lime} size={7}>
        TERRAFORM · ARGOCD (GITOPS)
      </Label>
    </svg>
  );
}
