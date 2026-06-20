import type { Variants, Transition } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared motion language. Centralizing easings + variants keeps animation
// timing consistent and "premium" across every section, and makes it trivial
// to retune globally. Durations are intentionally SNAPPY (0.3–0.6s) so motion
// never delays interaction or hurts perceived speed.
// ---------------------------------------------------------------------------

/** Ease-out expo-ish — the workhorse for entrances (decelerates into place). */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Smooth in/out for looping / reversible motion. */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const transition = (duration = 0.5, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_OUT,
});

/** Fade + rise. Default child for staggered lists/grids. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transition(0.5) },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition(0.5) },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transition(0.45) },
};

/** Per-word headline reveal (used by the Hero). */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: { opacity: 1, y: 0, transition: transition(0.55) },
};

/**
 * Orchestration container. Use with `staggerChildren` to cascade child
 * `fadeInUp`/`scaleIn` items. `delayChildren` lets a section settle first.
 */
export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Standard viewport config for scroll-triggered reveals. */
export const viewportOnce = { once: true, margin: "-80px" } as const;
