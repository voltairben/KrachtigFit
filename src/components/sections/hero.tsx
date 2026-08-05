import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { Link } from "@/i18n/routing";
import { siteConfig, TODO } from "@/site.config";

/**
 * Type is the primary visual. No photography exists yet, and the bold-graphic
 * direction was chosen precisely so the page does not depend on it — an
 * oversized headline and a hard rule system carry the composition instead.
 *
 * `min-h-[100svh]` rather than `100vh`: the prototype used `100vh`, which on
 * mobile Safari is measured against the viewport WITHOUT the address bar, so
 * the hero always overflowed by the bar's height on first paint.
 */
export function Hero() {
  const t = useTranslations("hero");
  const tp = useTranslations("proof");

  const clients = siteConfig.proof.clientsCoached;
  const hasClientProof = clients.value !== TODO;

  return (
    <section
      data-canvas="ink"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-between pt-32 pb-10 sm:pt-36"
    >
      <Container className="flex flex-1 flex-col justify-center">
        {/*
          Everything in the hero animates on mount, not on scroll. It is above
          the fold by definition, so making the most important text on the site
          wait for an IntersectionObserver callback adds a dependency with no
          upside — and a failure mode where the hero renders blank.
        */}
        <Reveal immediate>
          <p className="eyebrow text-accent-fg">{t("eyebrow")}</p>
        </Reveal>

        <h1
          id="hero-heading"
          className="font-expanded mt-6 max-w-[18ch] text-display-2xl font-extrabold text-balance"
        >
          {/*
            Sentence case, not uppercase. The prototype set text-transform:
            uppercase on every heading level, so its h1 was a 79-character
            all-caps sentence — measurably slower to read, and worse again
            for dyslexic and low-vision readers.
          */}
          <SplitText immediate delay={0.1}>
            {t("headline")}
          </SplitText>
        </h1>

        <Reveal immediate delay={0.35}>
          <p className="mt-8 max-w-[52ch] text-body-lg text-on-ink-2">
            {t("subhead")}
          </p>
        </Reveal>

        <Reveal immediate delay={0.45}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button asChild size="lg">
              <Link href="/kennismaking">
                {t("ctaPrimary")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#method">{t("ctaSecondary")}</a>
            </Button>
          </div>
          <p className="mt-4 text-caption text-on-ink-3">{t("note")}</p>
        </Reveal>
      </Container>

      {/*
        Proof adjacent to the headline, visible without scrolling — the pattern
        every high-converting reference in this category uses. Renders only if
        a substantiated figure exists in site.config.ts; there is no code path
        that prints an unevidenced number.
      */}
      {hasClientProof && (
        <Container>
          <Reveal immediate delay={0.6}>
            <div className="mt-16 flex items-baseline gap-4 border-t border-border-ink pt-6">
              <span className="font-expanded tabular text-display-md font-extrabold text-accent-fg">
                {clients.value}
              </span>
              <span className="text-body-sm text-on-ink-2">
                {tp("clientsLabel")}
              </span>
            </div>
          </Reveal>
        </Container>
      )}
    </section>
  );
}
