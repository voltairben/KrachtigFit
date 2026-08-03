"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, easeOutExpo, viewportOnce } from "./tokens";

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
 */

type SplitTextProps = {
  children: string;
  className?: string;
  /** Seconds between each word. */
  stagger?: number;
  /** Seconds before the first word. */
  delay?: number;
  as?: "h1" | "h2" | "p" | "span" | "div";
};

export function SplitText({
  children,
  className,
  stagger = 0.045,
  delay = 0,
  as: Tag = "span",
}: SplitTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = children.split(" ");

  return (
    <Tag className={className}>
      <span className="sr-only">{children}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
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
            whileInView={{ opacity: 1, y: "0%" }}
            viewport={viewportOnce}
            transition={{
              duration: shouldReduceMotion ? duration.base : duration.slower,
              ease: easeOutExpo,
              delay: delay + (shouldReduceMotion ? 0 : i * stagger),
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
