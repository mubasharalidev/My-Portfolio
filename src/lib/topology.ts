/**
 * Deterministic network topology for the hero visual — two concentric
 * Fibonacci shells plus a sparse core, wired by nearest-neighbour edges.
 * Pure data (no three.js) so labels can quote real counts.
 */

export const TOPOLOGY = {
  full: { outer: 380, inner: 120, core: 28, pulses: 72 },
  compact: { outer: 210, inner: 70, core: 16, pulses: 40 },
} as const;

export type TopologyMode = keyof typeof TOPOLOGY;

export function nodeCount(mode: TopologyMode) {
  const t = TOPOLOGY[mode];
  return t.outer + t.inner + t.core;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fibonacciShell(n: number, radius: number, jitter: number, rand: () => number, out: number[]) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const rr = radius * (1 + (rand() - 0.5) * jitter);
    out.push(Math.cos(theta) * r * rr, y * rr, Math.sin(theta) * r * rr);
  }
}

export type Topology = {
  positions: Float32Array;
  seeds: Float32Array;
  scales: Float32Array;
  edges: Uint32Array;
  pulses: { start: Float32Array; end: Float32Array; speed: Float32Array; offset: Float32Array };
};

export function buildTopology(mode: TopologyMode): Topology {
  const cfg = TOPOLOGY[mode];
  const rand = mulberry32(7);
  const pts: number[] = [];
  fibonacciShell(cfg.outer, 2.25, 0.08, rand, pts);
  fibonacciShell(cfg.inner, 1.3, 0.12, rand, pts);
  for (let i = 0; i < cfg.core; i++) {
    const u = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const r = 0.25 + rand() * 0.45;
    const s = Math.sqrt(1 - u * u);
    pts.push(Math.cos(a) * s * r, u * r, Math.sin(a) * s * r);
  }

  const n = pts.length / 3;
  const positions = new Float32Array(pts);
  const seeds = new Float32Array(n);
  const scales = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    seeds[i] = rand();
    // A few "hub" nodes read as larger, brighter anchors.
    scales[i] = rand() > 0.94 ? 2.2 + rand() : 0.7 + rand() * 0.7;
  }

  const dist2 = (a: number, b: number) => {
    const dx = positions[a * 3] - positions[b * 3];
    const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
    const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
    return dx * dx + dy * dy + dz * dz;
  };

  const seen = new Set<string>();
  const edgeList: number[] = [];
  const addEdge = (a: number, b: number) => {
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    edgeList.push(a, b);
  };

  const shellOf = (i: number) => (i < cfg.outer ? 0 : i < cfg.outer + cfg.inner ? 1 : 2);
  const maxD2 = [0.62 * 0.62, 0.7 * 0.7, 0.75 * 0.75];

  for (let i = 0; i < n; i++) {
    const shell = shellOf(i);
    const near: [number, number][] = [];
    for (let j = 0; j < n; j++) {
      if (i === j || shellOf(j) !== shell) continue;
      const d = dist2(i, j);
      if (d < maxD2[shell]) near.push([d, j]);
    }
    near.sort((a, b) => a[0] - b[0]);
    const k = shell === 0 ? 2 : 3;
    for (let m = 0; m < Math.min(k, near.length); m++) addEdge(i, near[m][1]);
  }

  // Sparse radial links between shells give the structure depth.
  for (let i = 0; i < n; i++) {
    const shell = shellOf(i);
    if (shell === 2 || rand() > 0.14) continue;
    let best = -1;
    let bestD = Infinity;
    for (let j = 0; j < n; j++) {
      if (shellOf(j) !== shell + 1) continue;
      const d = dist2(i, j);
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    }
    if (best >= 0) addEdge(i, best);
  }

  const edges = new Uint32Array(edgeList);
  const edgeCount = edges.length / 2;
  const p = cfg.pulses;
  const start = new Float32Array(p * 3);
  const end = new Float32Array(p * 3);
  const speed = new Float32Array(p);
  const offset = new Float32Array(p);
  for (let i = 0; i < p; i++) {
    const e = Math.floor(rand() * edgeCount);
    const flip = rand() > 0.5;
    const a = edges[e * 2 + (flip ? 1 : 0)];
    const b = edges[e * 2 + (flip ? 0 : 1)];
    start.set(positions.subarray(a * 3, a * 3 + 3), i * 3);
    end.set(positions.subarray(b * 3, b * 3 + 3), i * 3);
    speed[i] = 0.18 + rand() * 0.35;
    offset[i] = rand();
  }

  return { positions, seeds, scales, edges, pulses: { start, end, speed, offset } };
}
