"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import {
  duration,
  easeOutExpo,
  revealOffset,
  viewportOnce,
} from "./tokens";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Scroll reveal.
 *
 * Three failure modes are handled explicitly, because all three were either
 * live in the prototype's approach or found live in this one, and all three
 * hide content outright or break the page for the affected visitor:
 *
 *  1. prefers-reduced-motion — the element still animates, but opacity only.
 *     It never simply stops animating, because a reveal that does not run is
 *     an element stuck at opacity 0.
 *
 *  2. JavaScript disabled — `initial` is serialised into the SSR HTML as
 *     opacity: 0, so without JS the content would never appear. The
 *     `data-reveal` attribute is the hook for the <noscript> override in
 *     src/app/[locale]/layout.tsx, which forces these back to visible.
 *
 *  3. Hydration mismatch — useReducedMotion() (imported from
 *     ./use-reduced-motion, not "motion/react" directly) can resolve
 *     synchronously on the client while the server can't read it at all,
 *     which made `initial`'s y-offset disagree between server and first
 *     client render on every page. See that file's comment for the fix.
 */

type RevealProps = {
  children: ReactNode;
  /** Seconds. Prefer RevealGroup over hand-tuned delays for lists. */
  delay?: number;
  className?: string;
  /** Animate on mount rather than on scroll. Use above the fold. */
  immediate?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : revealOffset }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: viewportOnce })}
      transition={{
        duration: shouldReduceMotion ? duration.base : duration.slow,
        ease: easeOutExpo,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */

const groupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/**
 * Staggers its RevealItem children. Use for card grids, feature lists and
 * stat rows rather than giving each child a hand-computed delay.
 */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : revealOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? duration.base : duration.slow,
        ease: easeOutExpo,
      },
    },
  };

  return (
    <motion.div data-reveal className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
