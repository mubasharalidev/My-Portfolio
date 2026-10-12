"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Minus, Plus, Shuffle } from "lucide-react";
import { cn } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

type Act = "tanh" | "relu" | "sigmoid";
const acts: Record<Act, (x: number) => number> = {
  tanh: Math.tanh,
  relu: (x) => Math.max(0, x),
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Xavier-style uniform init so activations stay in a readable range. */
function initWeights(sizes: number[], seed: number) {
  const rand = mulberry32(seed);
  return sizes.slice(1).map((n, l) => {
    const fanIn = sizes[l];
    const lim = Math.sqrt(6 / (fanIn + n));
    return {
      w: Array.from({ length: n }, () => Array.from({ length: fanIn }, () => (rand() * 2 - 1) * lim * 1.6)),
      b: Array.from({ length: n }, () => (rand() * 2 - 1) * 0.2),
    };
  });
}

function forward(input: number[], layers: ReturnType<typeof initWeights>, act: Act) {
  const out = [input];
  layers.forEach((L, li) => {
    const prev = out[out.length - 1];
    const last = li === layers.length - 1;
    out.push(L.w.map((row, j) => {
      const z = row.reduce((s, w, k) => s + w * prev[k], L.b[j]);
      return last ? Math.tanh(z) : acts[act](z);
    }));
  });
  return out;
}

const INPUT_LABELS = ["x₁", "x₂", "x₃"];

export default function NeuralPlayground() {
  const reduce = useReducedMotionSafe();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inputs, setInputs] = useState([0.8, -0.3, 0.5]);
  const [hidden, setHidden] = useState(2);
  const [width, setWidth] = useState(5);
  const [act, setAct] = useState<Act>("tanh");
  const [seed, setSeed] = useState(11);

  const sizes = useMemo(() => [3, ...Array(hidden).fill(width), 2], [hidden, width]);
  const layers = useMemo(() => initWeights(sizes, seed), [sizes, seed]);
  const activations = useMemo(() => forward(inputs, layers, act), [inputs, layers, act]);
  const output = activations[activations.length - 1];

  // Render loop: draws the network and travelling signals. Paused off-screen.
  const state = useRef({ activations, layers, sizes });
  const drawNow = useRef<(() => void) | null>(null);
  useEffect(() => {
    state.current = { activations, layers, sizes };
    // Under reduced motion there is no loop, so redraw on change.
    if (reduce) drawNow.current?.();
  }, [activations, layers, sizes, reduce]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      const { activations: A, layers: Ls, sizes: S } = state.current;
      ctx.clearRect(0, 0, w, h);
      const padX = Math.min(70, w * 0.1);
      const padY = 34;
      const xs = S.map((_, i) => padX + (i / (S.length - 1)) * (w - padX * 2));
      const ys = S.map((n) => Array.from({ length: n }, (_, j) => padY + ((j + 0.5) / n) * (h - padY * 2)));
      const nodeR = Math.max(7, Math.min(13, h / 32));

      // Edges + pulses
      Ls.forEach((L, l) => {
        L.w.forEach((row, j) => {
          row.forEach((wt, k) => {
            const signal = wt * A[l][k];
            const x1 = xs[l], y1 = ys[l][k], x2 = xs[l + 1], y2 = ys[l + 1][j];
            const strength = Math.min(1, Math.abs(signal));
            const pos = wt >= 0;
            ctx.strokeStyle = pos ? `rgba(89,229,232,${0.06 + strength * 0.55})` : `rgba(100,136,255,${0.06 + strength * 0.55})`;
            ctx.lineWidth = 0.5 + Math.min(2.5, Math.abs(wt) * 1.4);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            if (!reduce && strength > 0.08) {
              const f = ((t / 1000) * (0.35 + strength * 0.6) + (k * 0.37 + j * 0.61 + l * 0.17)) % 1;
              ctx.fillStyle = signal >= 0 ? "rgba(203,255,118,0.95)" : "rgba(160,180,255,0.95)";
              ctx.beginPath();
              ctx.arc(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 1.2 + strength * 1.6, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        });
      });

      // Nodes
      S.forEach((n, l) => {
        for (let j = 0; j < n; j++) {
          const a = A[l][j];
          const mag = Math.min(1, Math.abs(a));
          const x = xs[l], y = ys[l][j];
          const g = ctx.createRadialGradient(x, y, 0, x, y, nodeR * 2.6);
          g.addColorStop(0, a >= 0 ? `rgba(203,255,118,${mag * 0.35})` : `rgba(100,136,255,${mag * 0.35})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, nodeR * 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0B0F18";
          ctx.strokeStyle = a >= 0 ? `rgba(203,255,118,${0.35 + mag * 0.65})` : `rgba(100,136,255,${0.35 + mag * 0.65})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, nodeR, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = a >= 0 ? "#CBFF76" : "#6488FF";
          ctx.beginPath();
          ctx.arc(x, y, Math.max(1.5, nodeR * 0.62 * mag), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.font = "10px ui-monospace, monospace";
      ctx.fillStyle = "rgba(156,168,184,0.8)";
      ctx.textAlign = "center";
      S.forEach((_, l) => {
        const label = l === 0 ? "INPUT" : l === S.length - 1 ? "OUTPUT" : `HIDDEN ${l}`;
        ctx.fillText(label, xs[l], h - 10);
      });
    };

    const loop = (t: number) => {
      draw(t);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };

    drawNow.current = () => draw(performance.now());
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(wrap);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      drawNow.current = null;
    };
  }, [reduce]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="min-w-0 space-y-7 lg:col-span-4">
        <fieldset>
          <legend className="label mb-3">Inputs</legend>
          <div className="space-y-4">
            {inputs.map((v, i) => (
              <label key={i} className="grid grid-cols-[2rem_1fr_3rem] items-center gap-3 text-sm">
                <span className="font-mono text-mist">{INPUT_LABELS[i]}</span>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={v}
                  onChange={(e) => setInputs((prev) => prev.map((p, j) => (j === i ? +e.target.value : p)))}
                  className="w-full accent-[#CBFF76]"
                  aria-label={`Input ${i + 1}`}
                />
                <span className="text-right font-mono text-xs tabular-nums text-ink">{v.toFixed(2)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <Stepper label="Hidden layers" value={hidden} min={1} max={3} onChange={setHidden} />
          <Stepper label="Neurons / layer" value={width} min={2} max={6} onChange={setWidth} />
        </div>

        <fieldset>
          <legend className="label mb-3">Activation</legend>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(acts) as Act[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAct(a)}
                aria-pressed={act === a}
                className={cn(
                  "rounded-lg border py-2 font-mono text-xs transition-colors",
                  act === a ? "border-lime/50 bg-lime/[0.06] text-lime" : "border-line text-mist hover:text-ink",
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line px-5 text-sm text-ink transition-colors hover:border-line-strong hover:bg-white/[0.04]"
        >
          <Shuffle className="size-4" aria-hidden /> Randomise weights
        </button>
      </div>

      <div className="min-w-0 lg:col-span-8">
        <div ref={wrapRef} className="relative h-[20rem] overflow-hidden rounded-2xl border border-line bg-abyss sm:h-[26rem]">
          <div aria-hidden className="absolute inset-0 grid-field opacity-50" />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 size-full"
            role="img"
            aria-label={`Network with ${sizes.join("-")} neurons. Outputs ${output.map((o) => o.toFixed(2)).join(" and ")}.`}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {output.map((o, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <p className="label flex justify-between !text-[0.625rem]">
                <span>Output {i + 1}</span>
                <span className={cn("tabular-nums", o >= 0 ? "!text-lime" : "!text-azure")}>{o.toFixed(3)}</span>
              </p>
              <div className="relative mt-3 h-1.5 rounded-full bg-white/10">
                <span className="absolute left-1/2 top-[-3px] h-[calc(100%+6px)] w-px bg-line-strong" />
                <span
                  className={cn("absolute top-0 h-full rounded-full transition-all duration-300", o >= 0 ? "left-1/2 bg-lime" : "right-1/2 bg-azure")}
                  style={{ width: `${Math.abs(o) * 50}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-dim">
          A real forward pass computed in your browser on every change. Edge colour is weight sign, thickness is weight
          magnitude, and travelling signals scale with each weighted contribution. Untrained, randomly initialised weights.
        </p>
      </div>
    </div>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div>
      <p className="label mb-2 !text-[0.625rem]">{label}</p>
      <div className="flex items-center justify-between rounded-lg border border-line p-1">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="grid size-9 place-items-center rounded-md text-mist hover:bg-white/5 hover:text-ink disabled:opacity-30" aria-label={`Decrease ${label}`}>
          <Minus className="size-4" />
        </button>
        <span className="font-mono text-sm tabular-nums" aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="grid size-9 place-items-center rounded-md text-mist hover:bg-white/5 hover:text-ink disabled:opacity-30" aria-label={`Increase ${label}`}>
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
