"use client";

import { useReducedMotion as useFramerReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Hydration-safe wrapper around Framer Motion's useReducedMotion().
 *
 * The raw hook can resolve synchronously on the client (matchMedia is
 * available immediately) while the server has no way to read it at all and
 * always renders the no-preference default. Using its return value directly
 * to choose what gets rendered — an initial transform offset, whether a
 * child exists at all, a whileTap prop that changes whether Framer Motion
 * adds tabindex — makes the very first client render disagree with the
 * server-rendered HTML: a real hydration mismatch, not a cosmetic one.
 *
 * This was caught and fixed once, locally, in light-pillar.tsx (the
 * `mounted` gate pattern), then found to be missing everywhere else in this
 * codebase that reads the hook directly in render: Reveal/RevealItem,
 * SplitText, Button (whileTap), Method's progress line, and Wizard's step
 * transitions. Extracted here so there's one hydration-safe primitive
 * instead of five ad-hoc copies of the same gate — light-pillar.tsx should
 * be migrated to this too rather than keeping its own local version.
 *
 * `mounted` forces the first client render to match the server (mounted is
 * always false there → this always returns false, same as the server's
 * "can't know, assume no preference" default) and only starts returning the
 * real value once a post-hydration effect confirms it's safe to.
 */
export function useReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useFramerReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && !!prefersReduced;
}
