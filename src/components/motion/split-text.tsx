"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { duration, easeOutExpo, viewportOnce } from "./tokens";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Word-by-word mask reveal for display headlines. The signature move of the
 * bold-graphic direction — the prototype had no entrance animation anywhere.
 *
 * Masking per WORD rather than per line is deliberate. Line-level masking
 * needs measured line boxes, and breaks the moment the headline rewraps at a
 * different viewport — which for a responsive clamp()-sized display headline
 * is constantly. Per-word masks wrap naturally and look near-identical in
 * motion.
 *
 * Accessibility: the full string is rendered once in a visually-hidden span,
 * and the animated fragments are aria-hidden. A screen reader announces one
 * clean sentence rather than twelve disconnected words.
 *
 * The obvious approach — aria-label on the wrapper — is invalid: aria-label
 * is prohibited on a <span> with no role, because a generic element has no
 * accessible name to override. Lighthouse flagged all six headings.
 *
 * useReducedMotion is imported from ./use-reduced-motion, not "motion/react"
 * directly — the raw hook can resolve synchronously on the client while the
 * server can't read it at all, which made the y-offset below disagree
 * between server and first client render on every page. See that file.
 */

type SplitTextProps = {
  children: string;
  className?: string;
  /** Seconds between each word. */
  stagger?: number;
  /** Seconds before the first word. */
  delay?: number;
  as?: "h1" | "h2" | "p" | "span" | "div";
  /**
   * Animate on mount instead of on scroll-into-view.
   *
   * Use for anything above the fold. Scroll-triggered reveals depend on an
   * IntersectionObserver callback, which is one more thing that has to fire
   * correctly before the most important text on the page becomes visible —
   * an unnecessary dependency for content that is on screen at load.
   */
  immediate?: boolean;
};

export function SplitText({
  children,
  className,
  stagger = 0.045,
  delay = 0,
  as: Tag = "span",
  immediate = false,
}: SplitTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = children.split(" ");

  return (
    <Tag className={className}>
      <span className="sr-only">{children}</span>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
        <span
          aria-hidden="true"
          // The mask. Extra vertical padding with matching negative margin
          // stops overflow:hidden from clipping ascenders and descenders
          // without changing the layout box.
          style={{
            display: "inline-block",
            overflow: "hidden",
            paddingBottom: "0.14em",
            marginBottom: "-0.14em",
            paddingTop: "0.04em",
            marginTop: "-0.04em",
            verticalAlign: "top",
          }}
        >
          <motion.span
            data-reveal
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{
              opacity: 0,
              // Under reduced motion the word fades in place. It always
              // animates to visible — never simply skipped, which would
              // leave it at opacity 0.
              y: shouldReduceMotion ? "0%" : "110%",
            }}
            {...(immediate
              ? { animate: { opacity: 1, y: "0%" } }
              : {
                  whileInView: { opacity: 1, y: "0%" },
                  viewport: viewportOnce,
                })}
            transition={{
              duration: shouldReduceMotion ? duration.base : duration.slower,
              ease: easeOutExpo,
              delay: delay + (shouldReduceMotion ? 0 : i * stagger),
            }}
          >
            {word}
          </motion.span>
        </span>
        {/*
          A real space text node between words. The masks are inline-block, so
          without this the words butt together — "Sterkerworden". It also lets
          the headline wrap naturally at any viewport, which per-word masking
          is chosen for in the first place.
        */}
        {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
