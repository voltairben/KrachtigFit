import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";

const PROGRAMS = ["online", "hybrid", "personal"] as const;

/**
 * Card hover uses only `transform` and `border-color`. The prototype
 * transitioned `box-shadow`, which cannot be composited and repaints the
 * card every frame of the animation — and it did so on a near-black
 * background where the shadow was invisible anyway.
 *
 * `data-hover-lift` is picked up by the (hover: none) guard in globals.css so
 * the lift never latches after a tap on touch devices.
 */
export function Programs() {
  const t = useTranslations("programs");

  return (
    <section
      id="programs"
      data-canvas="ink"
      aria-labelledby="programs-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="max-w-[52ch]">
          <p className="eyebrow text-accent">{t("eyebrow")}</p>
          <h2
            id="programs-heading"
            className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
          >
            <SplitText>{t("headline")}</SplitText>
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 text-body-lg text-on-ink-2">{t("intro")}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((key) => {
            const tags = t.raw(`${key}.tags`) as string[];
            return (
              <RevealItem key={key}>
                <article
                  data-hover-lift
                  className="group flex h-full flex-col border border-border-ink bg-surface-1 p-8 transition-[transform,border-color] duration-[var(--duration-base)] ease-[var(--ease-out-quart)] hover:-translate-y-1 hover:border-accent/50"
                >
                  <h3 className="font-expanded text-display-md font-extrabold">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-4 flex-1 text-body-sm text-on-ink-2">
                    {t(`${key}.body`)}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-border-ink px-2.5 py-1 text-caption text-on-ink-3"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#pricing"
                    className="mt-8 inline-flex items-center gap-2 text-body-sm font-semibold uppercase tracking-[0.08em] text-accent"
                  >
                    {t("cta")}
                    <ArrowRight
                      className="size-4 transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
