"use client";

import { useTranslations } from "next-intl";
import { ArrowDown, ExternalLink, Star } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { siteConfig } from "@/site.config";

/**
 * Real Google reviews via a Juicer feed, gated behind a click.
 *
 * Empirically checked before wiring this up (a throwaway probe route, since
 * this is a third party whose runtime behaviour can't be assumed): the embed
 * script sets no cookies, but it does ping juicer.io/api/page_views and loads
 * review images from juicer.io's CDN — a real network call that reveals the
 * visitor's IP to a third party on every load. That is the same category of
 * exposure that made this project self-host fonts in the first place, and it
 * is exactly what the site's own cookiebeleid already commits to gating:
 * "consent will be requested before such scripts load." So this follows the
 * same pattern as the Instagram section — nothing requests juicer.io until
 * the visitor clicks the button.
 *
 * IMPORTANT, also found by probing rather than assuming: Juicer's script does
 * not render in place. Confirmed with two throwaway test routes — one with
 * just the script (as given), one that also pre-supplied a `.juicer-feed`
 * target div at the intended spot. In both cases Juicer ignored the script
 * tag's position and any pre-existing container, and instead appended its own
 * feed element directly to the end of `document.body` (position ~115 of ~116
 * body children in the live test, visually landing after the footer). No
 * amount of placement in this component's own tree changes that.
 *
 * Rather than fight that with a CSS repositioning hack against a third
 * party's internal DOM structure — fragile, and liable to break silently on
 * their next redesign — this works WITH the actual behaviour: the trigger
 * stays here in the Experience section as asked, and a MutationObserver
 * watches for the feed to actually populate wherever Juicer puts it, then
 * smooth-scrolls it into view. Honest about where the content lives, rather
 * than pretending it's inline when it structurally can't be.
 *
 * The feed lands right at the physical end of the document — confirmed live,
 * and confirmed the hard way: neither `block: "start"` nor `block: "end"`
 * could fully reveal it, because both landed on the exact same clamped
 * scrollY. That only happens when there is not enough scrollable distance
 * left below the feed for ANY alignment to work — the browser scrolls as far
 * as the page physically allows and stops, showing whatever ends up at that
 * ceiling regardless of which alignment was requested. So before scrolling,
 * a spacer is appended after the feed sized to guarantee one viewport height
 * of room below it — cheap, harmless (a few hundred pixels of empty space
 * at the very end of the page, only once this section has been used), and
 * it is what actually makes "scroll it fully into view" possible at all.
 *
 * The direct Google Business Profile link (if ever set) stays as a no-script
 * escape hatch alongside the gated embed, same reasoning as the "Volg op
 * Instagram" link next to that section's gated embed.
 */
export function Reviews() {
  const t = useTranslations("reviews");
  const gbp = siteConfig.googleBusinessProfileUrl;
  const [loaded, setLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!loaded) return;

    // Juicer populates its body-appended element asynchronously after its
    // own script executes, so there's no single "ready" event to hook into —
    // watch for the element to actually gain content, rather than guessing a
    // fixed delay.
    const observer = new MutationObserver(() => {
      const feed = document.querySelector(".juicer-feed");
      if (!feed || feed.getBoundingClientRect().height === 0) return;

      const feedBottomAbsolute =
        feed.getBoundingClientRect().bottom + window.scrollY;
      const spaceBelowFeed = document.body.scrollHeight - feedBottomAbsolute;
      const missing = window.innerHeight - spaceBelowFeed;

      if (missing > 0) {
        const spacer = document.createElement("div");
        spacer.setAttribute("aria-hidden", "true");
        spacer.style.height = `${Math.ceil(missing)}px`;
        document.body.appendChild(spacer);
      }

      feed.scrollIntoView({ behavior: "smooth", block: "start" });
      setRevealed(true);
      observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Don't watch forever if the script fails to load or Juicer changes how
    // it mounts.
    const timeout = setTimeout(() => observer.disconnect(), 15000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [loaded]);

  return (
    <section
      id="reviews"
      data-canvas="ink"
      aria-labelledby="reviews-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[52ch]">
            <p className="eyebrow text-accent">{t("eyebrow")}</p>
            <h2
              id="reviews-heading"
              className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
            >
              <SplitText>{t("headline")}</SplitText>
            </h2>
          </div>

          {gbp && (
            <Reveal delay={0.2}>
              <a
                href={gbp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 border border-border-ink px-6 py-4 text-body-sm transition-colors hover:border-accent/50"
              >
                <span className="text-on-ink-2">{t("verifiedLabel")}</span>
                <span className="font-semibold">{t("viewOnGoogle")}</span>
                <ExternalLink
                  className="size-4 text-accent"
                  aria-hidden="true"
                />
              </a>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.25}>
          <div className="mt-12">
            {loaded ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 border border-border-ink bg-surface-1 p-10 text-center">
                <Script
                  src="https://www.juicer.io/embed/chijib_duco1wecry-7-t-1zexm/embed-code.js"
                  strategy="lazyOnload"
                />
                {revealed ? (
                  <>
                    <ArrowDown
                      className="size-8 text-accent"
                      aria-hidden="true"
                      strokeWidth={1.5}
                    />
                    <p className="max-w-[40ch] text-body-sm text-on-ink-2">
                      {t("revealedNote")}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="size-8 animate-spin rounded-full border-2 border-on-ink-3 border-t-accent" />
                    <p className="max-w-[40ch] text-caption text-on-ink-3">
                      {t("loadingNote")}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 border border-border-ink bg-surface-1 p-10 text-center">
                <Star
                  className="size-8 text-on-ink-3"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <Button onClick={() => setLoaded(true)} variant="secondary">
                  {t("loadCta")}
                </Button>
                <p className="max-w-[40ch] text-caption text-on-ink-3">
                  {t("loadNote")}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
