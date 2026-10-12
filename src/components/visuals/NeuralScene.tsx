"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildTopology, type TopologyMode } from "@/lib/topology";

const CYAN = new THREE.Color("#59E5E8");
const AZURE = new THREE.Color("#6488FF");
const HOT = new THREE.Color("#D8FF9A");

/* Shared transform: intro assembly + scroll dispersion, identical for every
   layer so edges and pulses stay attached to their nodes. */
const TRANSFORM = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uIntro;
  uniform float uAspect;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  float introAt(float seed) {
    float t = clamp(uIntro * 1.8 - seed * 0.8, 0.0, 1.0);
    return 1.0 - pow(1.0 - t, 3.0);
  }
  float glowAt(vec4 clip) {
    vec2 ndc = clip.xy / clip.w;
    float d = length((ndc - uMouse) * vec2(uAspect, 1.0));
    return smoothstep(0.42, 0.0, d);
  }
`;

const pointsVert = /* glsl */ `
  ${TRANSFORM}
  uniform float uSize;
  attribute float aSeed;
  attribute float aScale;
  varying float vAlpha;
  varying float vGlow;
  varying float vSeed;
  void main() {
    float e = introAt(aSeed);
    vec3 p = position * mix(0.55, 1.0, e) * (1.0 + uScroll * 0.45);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vGlow = glowAt(clip);
    float depth = smoothstep(-10.5, -5.0, mv.z);
    float twinkle = 0.72 + 0.28 * sin(uTime * 1.4 + aSeed * 40.0);
    vAlpha = mix(0.14, 1.0, depth) * e * twinkle * (1.0 - uScroll * 0.85);
    vSeed = aSeed;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + vGlow * 1.7) * (6.0 / -mv.z);
    gl_Position = clip;
  }
`;

const pointsFrag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorHot;
  varying float vAlpha;
  varying float vGlow;
  varying float vSeed;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float disc = pow(smoothstep(0.5, 0.0, r), 2.0);
    vec3 col = mix(uColorA, uColorB, step(0.74, vSeed));
    col = mix(col, uColorHot, vGlow);
    float a = disc * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, a);
  }
`;

const linesVert = /* glsl */ `
  ${TRANSFORM}
  attribute float aSeed;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    float e = introAt(aSeed);
    vec3 p = position * mix(0.55, 1.0, e) * (1.0 + uScroll * 0.45);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vGlow = glowAt(clip);
    float depth = smoothstep(-10.5, -5.0, mv.z);
    vAlpha = (mix(0.035, 0.2, depth) + vGlow * 0.55) * e * (1.0 - uScroll * 0.9);
    gl_Position = clip;
  }
`;

const linesFrag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorHot;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    gl_FragColor = vec4(mix(uColorA, uColorHot, vGlow), vAlpha);
  }
`;

const pulsesVert = /* glsl */ `
  ${TRANSFORM}
  uniform float uSize;
  attribute vec3 aStart;
  attribute vec3 aEnd;
  attribute float aSpeed;
  attribute float aOffset;
  varying float vAlpha;
  void main() {
    float f = fract(uTime * aSpeed + aOffset);
    vec3 p = mix(aStart, aEnd, f) * (1.0 + uScroll * 0.45);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float fade = sin(f * 3.14159);
    float depth = smoothstep(-10.5, -5.0, mv.z);
    vAlpha = fade * mix(0.25, 1.0, depth) * smoothstep(0.75, 1.0, uIntro) * (1.0 - uScroll);
    gl_PointSize = uSize * uPixelRatio * fade * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const pulsesFrag = /* glsl */ `
  uniform vec3 uColorHot;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, r), 1.6) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColorHot, a);
  }
`;

type SceneProps = { reduced: boolean; mode: TopologyMode; onReady?: () => void };

function Network({ reduced, mode, onReady }: SceneProps) {
  const { gl, size, viewport, invalidate } = useThree();
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 5, ty: 5 });
  const introStart = useRef<number | null>(null);
  const readyRef = useRef(onReady);
  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  const { objects, uniforms } = useMemo(() => {
    const topo = buildTopology(mode);
    const shared = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uAspect: { value: 1 },
      uPixelRatio: { value: 1 },
      uMouse: { value: new THREE.Vector2(5, 5) },
      uColorA: { value: CYAN },
      uColorB: { value: AZURE },
      uColorHot: { value: HOT },
    };
    const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(topo.positions, 3));
    nodeGeo.setAttribute("aSeed", new THREE.BufferAttribute(topo.seeds, 1));
    nodeGeo.setAttribute("aScale", new THREE.BufferAttribute(topo.scales, 1));
    const nodes = new THREE.Points(
      nodeGeo,
      new THREE.ShaderMaterial({
        ...additive,
        vertexShader: pointsVert,
        fragmentShader: pointsFrag,
        uniforms: { ...shared, uSize: { value: 15 } },
      }),
    );

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(topo.positions, 3));
    edgeGeo.setAttribute("aSeed", new THREE.BufferAttribute(topo.seeds, 1));
    edgeGeo.setIndex(new THREE.BufferAttribute(topo.edges, 1));
    const edges = new THREE.LineSegments(
      edgeGeo,
      new THREE.ShaderMaterial({
        ...additive,
        vertexShader: linesVert,
        fragmentShader: linesFrag,
        uniforms: { ...shared, uColorA: { value: AZURE } },
      }),
    );

    const p = topo.pulses;
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(p.speed.length * 3), 3));
    pulseGeo.setAttribute("aStart", new THREE.BufferAttribute(p.start, 3));
    pulseGeo.setAttribute("aEnd", new THREE.BufferAttribute(p.end, 3));
    pulseGeo.setAttribute("aSpeed", new THREE.BufferAttribute(p.speed, 1));
    pulseGeo.setAttribute("aOffset", new THREE.BufferAttribute(p.offset, 1));
    const pulses = new THREE.Points(
      pulseGeo,
      new THREE.ShaderMaterial({
        ...additive,
        vertexShader: pulsesVert,
        fragmentShader: pulsesFrag,
        uniforms: { ...shared, uSize: { value: 22 } },
      }),
    );
    pulses.frustumCulled = false;

    // Orbital rings — thin ellipses, each carrying a satellite.
    const ringDefs = [
      { r: 3.05, tilt: [1.2, 0.2, 0.3], color: CYAN, opacity: 0.22 },
      { r: 3.45, tilt: [1.45, -0.5, -0.2], color: AZURE, opacity: 0.16 },
      { r: 2.75, tilt: [0.35, 0.9, 0.1], color: CYAN, opacity: 0.1 },
    ];
    const ringObjs = ringDefs.map((d) => {
      const g = new THREE.Group();
      g.rotation.set(d.tilt[0], d.tilt[1], d.tilt[2]);
      const curve = new THREE.EllipseCurve(0, 0, d.r, d.r, 0, Math.PI * 2);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(160));
      const loop = new THREE.LineLoop(
        geo,
        new THREE.LineBasicMaterial({ color: d.color, ...additive, opacity: d.opacity }),
      );
      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 12),
        new THREE.MeshBasicMaterial({ color: HOT, ...additive }),
      );
      sat.position.set(d.r, 0, 0);
      const spinner = new THREE.Group();
      spinner.add(loop, sat);
      g.add(spinner);
      return g;
    });

    return { objects: { nodes, edges, pulses, ringObjs }, uniforms: shared };
  }, [mode, reduced]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      pointer.current.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
      if (reduced) invalidate();
    };
    const onScroll = () => reduced && invalidate();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    readyRef.current?.();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      [objects.nodes, objects.edges, objects.pulses].forEach((o) => {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });
    };
  }, [gl, objects, reduced, invalidate]);

  // Uniforms are mutated every frame; hold them in a ref rather than the memo value.
  const uniformsRef = useRef(uniforms);
  useEffect(() => {
    uniformsRef.current = uniforms;
  }, [uniforms]);

  const wide = size.width >= 1024;
  const groupPos: [number, number, number] = wide
    ? [viewport.width * 0.2, 0.05, 0]
    : [0, viewport.height * 0.17, 0];
  const groupScale = wide ? Math.min(1.05, viewport.height / 7.2) : Math.min(0.8, viewport.width / 6.4);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    if (introStart.current === null) introStart.current = t;
    const u = uniformsRef.current;

    u.uTime.value = t;
    u.uAspect.value = size.width / size.height;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uScroll.value = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.95)));
    if (!reduced) {
      u.uIntro.value = Math.min(1, (t - introStart.current) / 2.6);
    }

    const p = pointer.current;
    const k = reduced ? 1 : 1 - Math.pow(0.002, dt);
    p.x += (p.tx - p.x) * k;
    p.y += (p.ty - p.y) * k;
    u.uMouse.value.set(p.x, p.y);

    if (tilt.current) {
      const inRange = Math.abs(p.x) <= 1.2 && Math.abs(p.y) <= 1.2;
      const rx = inRange ? -p.y * 0.22 : 0;
      const ry = inRange ? p.x * 0.3 : 0;
      tilt.current.rotation.x += (rx + u.uScroll.value * 0.5 - tilt.current.rotation.x) * k * 0.6;
      tilt.current.rotation.y += (ry - tilt.current.rotation.y) * k * 0.6;
    }
    if (!reduced && spin.current) {
      spin.current.rotation.y += dt * 0.06;
      spin.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.012);
    }
    if (!reduced && rings.current) {
      rings.current.children.forEach((ring, i) => {
        const spinner = ring.children[0];
        spinner.rotation.z += dt * (0.12 + i * 0.05) * (i % 2 ? -1 : 1);
      });
    }
  });

  return (
    <group position={groupPos} scale={groupScale}>
      <group ref={tilt}>
        <group ref={spin} rotation={[0.25, 0, -0.12]}>
          <primitive object={objects.edges} />
          <primitive object={objects.nodes} />
          <primitive object={objects.pulses} />
        </group>
        <group ref={rings}>
          {objects.ringObjs.map((r, i) => (
            <primitive key={i} object={r} />
          ))}
        </group>
      </group>
    </group>
  );
}

export default function NeuralScene({ active, ...props }: SceneProps & { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={props.reduced ? "demand" : active ? "always" : "never"}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Network {...props} />
    </Canvas>
  );
}
