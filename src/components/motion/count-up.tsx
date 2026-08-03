"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { duration, easeOutExpo } from "./tokens";

/**
 * Counts a number up when it scrolls into view.
 *
 * Renders the FINAL value during SSR, not zero. That matters twice over:
 * without JavaScript the real number is still on the page, and a crawler
 * reading the markup sees "400", not "0". The animation is a progressive
 * enhancement layered on top, never the source of the value.
 *
 * Under reduced motion it does not animate at all — a rapidly changing
 * number is exactly the kind of motion the preference exists to suppress.
 */

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** BCP 47 tag for digit grouping — "nl" renders 1.400, "en" renders 1,400. */
  locale?: string;
  className?: string;
};

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  locale = "nl",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const shouldReduceMotion = useReducedMotion();

  // Seeded with the real value so SSR output is correct.
  const [display, setDisplay] = useState(value);
  const hasRun = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion || hasRun.current) return;
    if (!isInView) {
      // Not yet reached. Park at zero so there is something to count from,
      // but only once JS has confirmed it will animate.
      setDisplay(0);
      return;
    }

    hasRun.current = true;
    const controls = animate(0, value, {
      duration: duration.slower * 2,
      ease: easeOutExpo,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, value, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {new Intl.NumberFormat(locale).format(display)}
      {suffix}
    </span>
  );
}
