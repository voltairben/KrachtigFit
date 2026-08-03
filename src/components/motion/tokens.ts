/**
 * Motion tokens. Mirrors the --ease-* and --duration-* custom properties in
 * src/styles/globals.css; if you change one, change both.
 *
 * The prototype used `0.25s ease` for every transition on the page — the
 * browser default curve, applied uniformly, which is what made the whole
 * thing feel generic regardless of the visual design.
 */

/** Decisive, fast out, long settle. The default for entrances. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/** Softer than expo. For hover and small state changes. */
export const easeOutQuart = [0.25, 1, 0.5, 1] as const;

/** Symmetrical. For things that move and come back — accordions, drawers. */
export const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  slower: 0.65,
} as const;

/** Press feedback. The prototype had a hover lift but no :active state at all. */
export const pressSpring = {
  type: "spring",
  stiffness: 400,
  damping: 25,
} as const;

/** Distance a revealing element travels. Dropped entirely under reduced motion. */
export const revealOffset = 24;

/** Shared viewport config: fire once, slightly before fully in view. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
