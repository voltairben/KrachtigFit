import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { MaskedHeading } from "@/components/effects/masked-heading";
import { Link } from "@/i18n/routing";
import { siteConfig, TODO } from "@/site.config";

/**
 * Type used to be the only visual here — no photography existed, and the
 * bold-graphic direction was chosen precisely so the page didn't depend on
 * it. That changed once real footage of the gym (Dumbbell_rack.mp4,
 * Putkamp 4) became available: the headline now renders as MaskedHeading
 * (components/effects/masked-heading.tsx), which clips that footage into
 * the letterforms instead of a flat colour. The rest of the hero — eyebrow,
 * subhead, CTAs — is still type-only.
 *
 * `trigger="immediate"` rather than the component's own "view" default:
 * this section is always above the fold, and the rest of the hero
 * deliberately never waits on an IntersectionObserver for that reason (see
 * the note on Reveal below) — no upside to doing it differently just for
 * the headline, and it removes a failure mode where the hero's biggest
 * element renders blank until a callback fires.
 *
 * `max-w-[18ch]` is gone from the heading on purpose, not an oversight:
 * MaskedHeading sizes its own font from the element's rendered width
 * (`clientWidth * textScale`), so a `ch`-based max-width would make that
 * width depend on the font-size the component is about to calculate FROM
 * that same width — a circular layout that visibly jumps on first paint.
 * Letting it size against the Container's fixed width avoids that; line
 * wrapping is handled by the component's own fit-to-width behaviour instead.
 *
 * `pb-[0.25em]` on the heading is load-bearing, not decorative spacing:
 * MaskedHeading's video layer is sized to exactly match the heading's own
 * box (height driven by `lineHeight={0.92}`, tight on purpose to match this
 * site's display type). Descenders — the tails on g/j/y — extend below that
 * box on the last line, and the video has no pixels to reveal past its own
 * edge there, so without this they render visibly flat-cut instead of
 * tapering into the glyph the way the video does everywhere else. The `em`
 * unit matters: font-size here is computed from container width at runtime
 * (see the `max-w-[18ch]` note above), so a fixed px padding would be either
 * too little or too much depending on viewport — `em` tracks whatever
 * font-size the heading actually lands on.
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

        {/*
          Sentence case, not uppercase, in the translated copy itself — the
          prototype set text-transform: uppercase on every heading level, so
          its h1 was a 79-character all-caps sentence, measurably slower to
          read and worse again for dyslexic and low-vision readers.
        */}
        <MaskedHeading
          tag="h1"
          id="hero-heading"
          className="mt-6 pb-[0.25em] font-expanded"
          text={t("headline")}
          mediaType="video"
          src="/videos/dumbbell-rack.mp4"
          poster="/videos/dumbbell-rack-poster.jpg"
          fillScale={1.3}
          parallax={34}
          reveal="wipe"
          trigger="immediate"
          weight={800}
          lineHeight={0.92}
          align="left"
          textScale={0.085}
        />

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
