"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import {
  duration,
  easeOutExpo,
  revealOffset,
  viewportOnce,
} from "./tokens";

/**
 * Scroll reveal.
 *
 * Two failure modes are handled explicitly, because both were live in the
 * prototype's approach and both hide content outright:
 *
 *  1. prefers-reduced-motion — the element still animates, but opacity only.
 *     It never simply stops animating, because a reveal that does not run is
 *     an element stuck at opacity 0.
 *
 *  2. JavaScript disabled — `initial` is serialised into the SSR HTML as
 *     opacity: 0, so without JS the content would never appear. The
 *     `data-reveal` attribute is the hook for the <noscript> override in
 *     src/app/[locale]/layout.tsx, which forces these back to visible.
 */

type RevealProps = {
  children: ReactNode;
  /** Seconds. Prefer RevealGroup over hand-tuned delays for lists. */
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : revealOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
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
