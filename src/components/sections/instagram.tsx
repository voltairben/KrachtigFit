"use client";

import { Instagram as InstagramIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Script from "next/script";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { siteConfig } from "@/site.config";

/**
 * Common Ninja Instagram feed, gated behind an explicit click.
 *
 * The SDK is a third-party script (cdn.commoninja.com) that this site cannot
 * audit the runtime behaviour of — whether it sets cookies, or talks to
 * Instagram's own tracking, isn't something to assume either way. The site's
 * own cookiebeleid already commits to a specific standard for exactly this
 * situation: "no analytics, advertising or social media scripts run on this
 * site" and, if that ever changes, "consent will be requested before such
 * scripts load." Loading it unconditionally on page view would make that
 * page false the moment this section shipped.
 *
 * So nothing loads until the button below is pressed — no request to
 * commonninja.com happens on page load. This is the same shape as two other
 * patterns already in this codebase: Reviews stays empty until real,
 * consented data exists; the About video stays a placeholder until a real
 * URL is set. Here, the "real thing" exists already, it's just deferred to
 * an explicit action instead of automatic load.
 *
 * Paper canvas, not ink. This section originally shared the ink canvas with
 * Reviews above it (divided by a border, same technique as the Hero/About
 * pairing) — but that put two full-bleed black sections back to back with
 * only a hairline border between them, which reads as one large slab rather
 * than the alternating rhythm the rest of the page uses. Paper here restores
 * the alternation (…Reviews ink → Instagram paper → Faq…), which is why Faq
 * flips to ink in this same change: inserting one new section between two
 * previously-adjacent, correctly-alternating sections always breaks the
 * chain on one side unless everything downstream shifts by one.
 *
 * Gold measures only 2.05:1 against paper — well short of 4.5:1 — so unlike
 * the ink version, the eyebrow and the "follow" link use on-paper tones
 * instead of the accent colour, matching how every other paper-canvas
 * section in this codebase already handles eyebrows and text links. Small
 * decorative icons (Check, ShieldCheck, Plus elsewhere) keep using accent on
 * paper as an established exception for non-text UI bits, but a label or a
 * link meant to be read is not that.
 */
export function InstagramSection() {
  const t = useTranslations("instagram");
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      id="instagram"
      data-canvas="paper"
      aria-labelledby="instagram-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[52ch]">
            <p className="eyebrow text-on-paper-3">{t("eyebrow")}</p>
            <h2
              id="instagram-heading"
              className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
            >
              <SplitText>{t("headline")}</SplitText>
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 text-body-lg text-on-paper-2">
                {t("intro")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.25}>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 text-body-sm font-semibold text-on-paper underline underline-offset-4"
            >
              <InstagramIcon className="size-4" aria-hidden="true" />
              {t("follow")}
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <div className="mt-12">
            {loaded ? (
              <>
                <Script
                  src="https://cdn.commoninja.com/sdk/latest/commonninja.js"
                  strategy="lazyOnload"
                />
                <div className="commonninja_component pid-33c34ac7-190e-49ed-9161-1c347e8227bd" />
              </>
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 border border-border-paper bg-paper-2 p-10 text-center">
                <InstagramIcon
                  className="size-8 text-on-paper-3"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <Button onClick={() => setLoaded(true)} variant="secondary">
                  {t("loadCta")}
                </Button>
                <p className="max-w-[40ch] text-caption text-on-paper-3">
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
