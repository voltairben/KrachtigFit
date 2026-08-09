import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { MaskedHeading } from "@/components/effects/masked-heading";
import { Link } from "@/i18n/routing";

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
 * The `style={{ paddingBottom: "0.25em" }}` below is load-bearing, not
 * decorative spacing — and it MUST be a `style` prop, not a `pb-*`
 * className. MaskedHeading's video layer is sized to exactly match the
 * heading's own box (height driven by `lineHeight={0.92}`, tight on
 * purpose to match this site's display type). Descenders — the tails on
 * g/j/y — extend below that box on the last line, and the video has no
 * pixels to reveal past its own edge there, so without extra room they
 * render visibly flat-cut instead of tapering into the glyph the way the
 * video does everywhere else.
 *
 * `marginTop: "0.5em"` is inline for the same reason, not `mt-*`: every
 * other section uses a fixed `mt-6` (24px) between its eyebrow and heading,
 * which reads fine against `text-display-lg` (32–56px). This heading isn't
 * on that scale — MaskedHeading sets its own font-size from the element's
 * rendered width (`clientWidth * textScale`, see `sync()` in
 * masked-heading.tsx), clamped 20–200px, and on real viewports lands well
 * above display-lg's ceiling. A flat 24px next to that reads as barely any
 * gap at all, which is what "too close to the headline" was — the eyebrow
 * and heading were never given mismatched spacing on purpose, the fixed
 * value just stopped scaling once one side of it got this large. `em`
 * ties the gap back to whatever size the heading actually renders at, at
 * roughly the same eyebrow-to-heading ratio the rest of the site reads at.
 *
 * A Tailwind utility class (`pb-[0.25em]`) was tried first and silently
 * did nothing: Tailwind v4 wraps every utility in `@layer utilities`
 * (confirmed in the compiled output — `.pb-\[0\.25em\]` sits inside
 * `@layer utilities{...}`), while masked-heading.css's own
 * `.masked-heading{padding:0}` is plain, unlayered CSS. Per the CSS
 * Cascade Layers spec, unlayered rules always beat layered ones regardless
 * of specificity or source order — that comparison is resolved before
 * source order is even considered, so the utility class could never have
 * won this fight no matter which file loaded first. Confirmed empirically
 * too: getComputedStyle(h1).paddingBottom read "0px" with the className
 * version, despite the class being present in h1.classList. An inline
 * style sidesteps cascade layers entirely rather than fighting them.
 *
 * The `em` unit matters as much as the mechanism: font-size here is
 * computed from container width at runtime (see the `max-w-[18ch]` note
 * above), so a fixed px padding would be either too little or too much
 * depending on viewport — `em` tracks whatever font-size the heading
 * actually lands on.
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
 *
 * The text column's width is untouched by any of this — no wrapper div or
 * max-w constraint added around MaskedHeading. It measures and positions
 * its glyphs from its own box post-mount, and narrowing that box after
 * mount already caused a visible collision between lines once, addressed
 * in the max-w-[18ch] note above; this stays clear of that entirely by
 * living in an absolutely-positioned sibling instead of sharing the
 * heading's own box.
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
        */}
        <MaskedHeading
          tag="h1"
          id="hero-heading"
          className="font-expanded"
          style={{ marginTop: "0.5em", paddingBottom: "0.25em" }}
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
    </section>
  );
}
