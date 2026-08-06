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
 * Ink canvas: third stop in the page's ink/paper/ink/paper alternation
 * (…Programs ink, Reviews paper, Instagram ink, Faq paper…). This section
 * has flipped canvas twice now, for two different reasons — first from ink
 * to paper to avoid sitting back-to-back with a same-canvas Reviews, then
 * back to ink once the page's whole cascade was fixed properly instead of
 * one section at a time. Whichever canvas it lands on, the eyebrow and the
 * "follow" link read the colour that canvas makes safe: text-accent-fg here
 * (6.38:1 on ink), text-on-paper-* when it was paper (accent only cleared
 * 2.54:1 there, and considerably less against the current gold).
 */
export function InstagramSection() {
  const t = useTranslations("instagram");
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      id="instagram"
      data-canvas="ink"
      aria-labelledby="instagram-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[52ch]">
            <p className="eyebrow text-accent-fg">{t("eyebrow")}</p>
            <h2
              id="instagram-heading"
              className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
            >
              <SplitText>{t("headline")}</SplitText>
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 text-body-lg text-on-ink-2">
                {t("intro")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.25}>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 text-body-sm font-semibold text-accent-fg underline underline-offset-4"
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
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 border border-border-ink bg-surface-1 p-10 text-center">
                <InstagramIcon
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
