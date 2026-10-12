/**
 * Motion language. One easing family, three tiers of duration:
 *   cinematic — hero entrance, major section reveals
 *   narrative — scroll-driven content, panel transitions
 *   micro     — hovers, toggles, small state changes
 */
export const ease = {
  expo: [0.16, 1, 0.3, 1],
  quint: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  cinematic: 1.2,
  narrative: 0.8,
  micro: 0.35,
} as const;

export const spring = {
  magnetic: { stiffness: 180, damping: 16, mass: 0.4 },
  soft: { stiffness: 120, damping: 22, mass: 0.6 },
} as const;

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
