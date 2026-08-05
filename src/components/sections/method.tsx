"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";

const PILLARS = ["training", "nutrition", "checkin"] as const;

/**
 * Sticky heading with the three pillars scrolling past it.
 *
 * Only `transform` and `opacity` are animated, and the scroll subscription
 * drives motion values directly rather than React state — so no scroll frame
 * triggers a re-render. This section is the main INP risk on the page and the
 * budget is 200ms at p75.
 *
 * data-canvas="paper" is kept for its default text colour (on-paper /
 * on-paper-2 / on-paper-3 all read correctly against the background below,
 * with more margin than they had against champagne), but the background
 * itself is overridden to --color-linen via bg-linen: Method sits directly
 * above Programs, which moved to a genuinely gold canvas, and the two can no
 * longer share paper's champagne without blending into one block. Linen is
 * the deliberately neutral half of that pair — see the token's comment in
 * globals.css.
 */
export function Method() {
  const t = useTranslations("method");
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Progress rule alongside the sticky heading. Scale rather than width, so
  // it composites instead of triggering layout on every frame.
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="method"
      data-canvas="paper"
      aria-labelledby="method-heading"
      className="bg-linen py-24 lg:py-32"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          {/* Sticky column */}
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <p className="eyebrow text-on-paper-3">{t("eyebrow")}</p>
            <h2
              id="method-heading"
              className="font-expanded mt-6 max-w-[14ch] text-display-lg font-extrabold text-balance"
            >
              <SplitText>{t("headline")}</SplitText>
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[46ch] text-body-lg text-on-paper-2">
                {t("intro")}
              </p>
            </Reveal>

            {!shouldReduceMotion && (
              <div
                aria-hidden="true"
                className="mt-12 hidden h-24 w-px bg-on-paper/15 lg:block"
              >
                <motion.div
                  className="h-full w-full origin-top bg-accent"
                  style={{ scaleY }}
                />
              </div>
            )}
          </div>

          {/* Scrolling column */}
          <ol className="flex flex-col gap-px border-y border-border-paper bg-on-paper/10">
            {PILLARS.map((key, i) => (
              // Reveal sits INSIDE the <li>, not around it. Wrapping the item
              // put a <div> directly inside the <ol>, which breaks list
              // semantics — a screen reader stops reporting "list, 3 items".
              <li key={key} className="bg-linen py-10 lg:py-14">
                <Reveal delay={i * 0.08}>
                  <div className="flex items-start gap-6">
                    <span
                      aria-hidden="true"
                      className="font-expanded tabular text-display-md font-extrabold text-accent"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-expanded text-display-md font-extrabold text-balance">
                        {t(`pillars.${key}.title`)}
                      </h3>
                      <p className="mt-4 max-w-[46ch] text-body text-on-paper-2">
                        {t(`pillars.${key}.body`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
