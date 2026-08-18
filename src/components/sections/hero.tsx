import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { Link } from "@/i18n/routing";

/**
 * Type is the primary visual, same word-reveal treatment (SplitText) every
 * other section heading on the site uses. This headline briefly shipped as
 * MaskedHeading instead — real gym footage clipped into the letterforms —
 * and was reverted: it read as too busy, and broke down worst of all on
 * mobile, where the smaller glyph boxes left too little of the footage
 * visible per letter to register as anything but noise. The component
 * (components/effects/masked-heading.tsx) was removed along with it, since
 * nothing else in the codebase used it.
 *
 * In its place: a quiet ambient shine (the `hero-shine` class below) drifts
 * across the headline every ~9s once SplitText's own entrance has settled.
 * See the "Hero headline shine" section in globals.css for the mechanism
 * and why it's a second, aria-hidden text element rather than styling the
 * h1 itself.
 *
 * `min-h-[100svh]` rather than `100vh`: the prototype used `100vh`, which on
 * mobile Safari is measured against the viewport WITHOUT the address bar, so
 * the hero always overflowed by the bar's height on first paint.
 *
 * The background photo (public/images/sander-hero.jpg, `hidden lg:block`)
 * sits behind the text as a faded texture, not a photograph competing with
 * it. Two earlier attempts at this were rejected before landing here:
 *
 * - object-cover in a landscape-shaped box: the source is a 1536×2048
 *   portrait, and object-cover maps the box's exact dimensions onto the
 *   image with no crop margin left to control once that box isn't also
 *   portrait-shaped — that's what pushed Sander out of frame before.
 *   object-contain instead: the box's shape can vary across breakpoints
 *   and this still never crops him, whatever size it ends up.
 * - a flat colour overlay div, which just looked like a dark rectangle
 *   laid over a photo. Fading is a mask-image gradient on the photo's own
 *   alpha instead (both edges, not just one — see the wrapper below), so
 *   it actually dissolves into the ink canvas rather than sitting under a
 *   tinted pane.
 *
 * The crop itself (public/images/sander-hero.jpg, re-cut from the repo's
 * SanderKF3.png source) also isn't the original tight one: that first
 * pass had Sander's own elbow almost touching the left crop edge, which
 * left a left/right fade nothing to dissolve through before hitting him.
 * This crop keeps wide clear margin on both sides instead. It also had to
 * re-solve the same problem the tight crop solved — a mirror in the
 * background reflecting two bystanders on the gym floor — without
 * reintroducing them: the crop's left edge (150px into the source) sits
 * safely past where they appear (they end around x≈122) but before the
 * mirror's own right edge, so it keeps Sander's own reflection and the
 * equipment without the two other people.
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      data-canvas="ink"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-between pt-32 pb-10 sm:pt-36"
    >
      {/*
        Decorative only — aria-hidden and empty alt, pointer-events-none so
        it can never intercept a click, z-0 (paired with the Container's own
        z-10 below) so it sits behind the text regardless of DOM order,
        since an absolutely-positioned element stacks above a plain static
        one by default no matter which comes first in markup.

        Two divs, not one, handle sizing — this took three attempts to get
        right, and each wrong one is worth recording since the failure
        wasn't obvious from reading the CSS, only from measuring it live:

        1. `inset-y-0` stretching the box to exactly the section's height
           (the original version): width scaled with viewport width but
           height was forced to the section's height regardless — two
           dimensions independently driven by two unrelated viewport
           metrics, so the box's shape (and how much of the photo showed
           vs. letterboxed) swung with whatever a monitor's aspect ratio
           happened to be. This was the actual "doesn't resize right on
           different monitors" bug.
        2. `aspect-[1100/1428]` plus `max-w-[min(46vw,680px)]` and
           `max-h-full` on one element, expecting it to behave like
           object-fit: contain for a plain div — it doesn't. With BOTH
           axes constrained only by max-* (nothing definite), the box has
           no content-based intrinsic size to derive from and collapses
           to 0×0. Confirmed live: the photo disappeared entirely.
        3. This version: an outer div gets a DEFINITE width
           (`w-[min(46vw,680px)]`, not max-width) and the section's full
           height (`inset-y-0`), with `overflow-hidden`. An inner div
           (`w-full aspect-[1100/1428]`, vertically centered) derives its
           height from that definite 100%-of-parent width — aspect-ratio
           only ever fills in a dimension left `auto`, and here width is
           the one definite input it has to work with. On ordinary
           viewports the derived height fits inside the outer div and
           nothing clips. On unusually short ones, the inner div overflows
           its parent — verified this centre-crops cleanly (top and
           bottom shaved off symmetrically) rather than distorting the
           ratio, since the outer div's overflow-hidden only clips what's
           already correctly sized, it never resizes anything.
           Re-verified the full component afterward across five
           resolutions, 1024×768 to 2560×1440: rendered ratio matches
           1100/1428 exactly at every one.

        Two nested masks, one axis each, rather than one combined
        gradient: stacking two `mask-image` layers on a single element
        and intersecting them needs `mask-composite`, whose keyword
        values differ between the standard property and -webkit- (Safari
        uses Porter-Duff terms like destination-in, not intersect) —
        fragile to get matching cross-browser. Nesting sidesteps that
        entirely: the outer div's left/right fade already constrains what
        exists to composite, so the inner div's top/bottom fade applies
        on top of that and the two combine into one soft vignette with
        nothing more than plain, unprefixed-logic gradients on each.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[min(46vw,680px)] overflow-hidden lg:block"
      >
        <div
          className="absolute top-1/2 left-0 w-full aspect-[1100/1428] -translate-y-1/2"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)",
          }}
        >
          <div
            className="relative h-full w-full"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
            }}
          >
            <Image
              src="/images/sander-hero.jpg"
              alt=""
              fill
              priority
              className="object-contain opacity-40"
              sizes="(min-width: 1024px) 46vw, 0px"
            />
          </div>
        </div>
      </div>

      <Container className="relative z-10 flex flex-1 flex-col justify-center">
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

          The wrapper carries mt-6/max-w-[18ch] rather than the h1 itself so
          the shine <p> below (position: absolute; inset: 0) wraps against
          the exact same width and lands on the exact same line breaks — see
          the "Hero headline shine" note in globals.css for why it exists as
          a second element instead of styling the h1's own SplitText spans.

          The wrapper also repeats font-expanded/text-display-2xl/
          font-extrabold, not just max-w-[18ch] — not redundant. `ch` is
          defined against the element's OWN computed font-size, and
          text-display-2xl's is a clamp() with a vw term, so max-w-[18ch] on
          a wrapper that hadn't inherited that font-size first was resolving
          against inherited body text (~1rem) instead — an 18-character cap
          around 9px tall glyphs, collapsing the box to a sliver both
          children then overflowed out of, each on its own unbreakable-word
          line, which is what "reverted, looks broken" would have shipped as
          without catching it here first.
        */}
        <div className="relative mt-6 max-w-[18ch] font-expanded text-display-2xl font-extrabold text-balance">
          <h1
            id="hero-heading"
            className="font-expanded text-display-2xl font-extrabold text-balance"
          >
            <SplitText immediate delay={0.1}>
              {t("headline")}
            </SplitText>
          </h1>
          <p
            aria-hidden="true"
            className="hero-shine font-expanded pointer-events-none absolute inset-0 text-display-2xl font-extrabold text-balance select-none"
          >
            {t("headline")}
          </p>
        </div>

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
    </section>
  );
}
