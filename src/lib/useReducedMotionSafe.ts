"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const noop = () => () => {};

/**
 * `useReducedMotion` that is false on the server and during hydration, so
 * markup that depends on it can't mismatch; it settles right after hydrating.
 */
export function useReducedMotionSafe() {
  const reduce = useReducedMotion();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return hydrated && !!reduce;
}
