"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/motion";
import type { TopologyMode } from "@/lib/topology";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const NeuralScene = dynamic(() => import("./NeuralScene"), { ssr: false });

/**
 * Hosts the WebGL topology. Renders an SVG rendition first (also the
 * no-WebGL / no-JS fallback), pauses the render loop when off-screen and
 * uses a lighter graph on small screens.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const [env, setEnv] = useState<{ webgl: boolean; mode: TopologyMode } | null>(null);

  useEffect(() => {
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    // Defer the scene until the browser is idle so text paints first.
    const start = () => setEnv({ webgl, mode: window.innerWidth < 768 ? "compact" : "full" });
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 900 });
    else window.setTimeout(start, 200);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden>
      <div
        className={cn(
          "pointer-events-none absolute transition-opacity duration-[1.6s] ease-[var(--ease-expo)]",
          "left-1/2 top-[3%] w-[115vw] max-w-[640px] -translate-x-1/2 opacity-40",
          "lg:left-auto lg:right-[-2%] lg:top-1/2 lg:w-[56vw] lg:max-w-[920px] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-100",
          ready && "!opacity-0",
        )}
      >
        <StaticTopology />
      </div>
      {env?.webgl && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-[1.6s] ease-[var(--ease-expo)]",
            ready ? "opacity-55 lg:opacity-100" : "opacity-0",
          )}
        >
          <NeuralScene active={inView} reduced={!!reduce} mode={env.mode} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}

/* ── SVG rendition ─────────────────────────────────────────── */
const R = 150;
const dots = Array.from({ length: 90 }, (_, i) => {
  const y = 1 - (i / 89) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = Math.PI * (3 - Math.sqrt(5)) * i;
  const x = Math.cos(th) * r;
  const z = Math.sin(th) * r;
  return {
    x: +(200 + x * R).toFixed(1),
    y: +(200 + y * R * 0.98).toFixed(1),
    o: +(0.25 + (z + 1) * 0.37).toFixed(2),
  };
});
const links = dots.flatMap((d, i) => {
  const out: [number, number][] = [];
  for (let j = i + 1; j < Math.min(i + 14, dots.length); j++) {
    const e = dots[j];
    if (Math.hypot(d.x - e.x, d.y - e.y) < 46) out.push([i, j]);
  }
  return out.slice(0, 2);
});

function StaticTopology() {
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full">
      <defs>
        <radialGradient id="st-glow">
          <stop offset="0" stopColor="#59E5E8" stopOpacity="0.16" />
          <stop offset="1" stopColor="#59E5E8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#st-glow)" />
      {[
        { rx: 196, ry: 58, rot: -18, o: 0.3 },
        { rx: 205, ry: 84, rot: 24, o: 0.18 },
        { rx: 178, ry: 40, rot: 70, o: 0.12 },
      ].map((e, i) => (
        <ellipse
          key={i}
          cx="200"
          cy="200"
          rx={e.rx}
          ry={e.ry}
          transform={`rotate(${e.rot} 200 200)`}
          fill="none"
          stroke="#59E5E8"
          strokeOpacity={e.o}
          strokeWidth="0.6"
        />
      ))}
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={dots[a].x}
          y1={dots[a].y}
          x2={dots[b].x}
          y2={dots[b].y}
          stroke="#6488FF"
          strokeOpacity={Math.min(dots[a].o, dots[b].o) * 0.45}
          strokeWidth="0.5"
        />
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={i % 13 === 0 ? 2.2 : 1.2} fill="#59E5E8" fillOpacity={d.o} />
      ))}
    </svg>
  );
}
