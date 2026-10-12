"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/** A signal dot travelling along an SVG path; omitted under reduced motion. */
export function Packet({
  path,
  dur = 2.4,
  delay = 0,
  r = 3,
  fill = "#CBFF76",
}: {
  path: string;
  dur?: number;
  delay?: number;
  r?: number;
  fill?: string;
}) {
  const reduce = useReducedMotionSafe();
  if (reduce) return null;
  return (
    <circle r={r} fill={fill} opacity="0">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}
