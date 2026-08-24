import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { CircularGallery } from "@/components/effects/circular-gallery";
import { siteConfig } from "@/site.config";

/**
 * Real transformation photos Sander already posted on KrachtigFit's own
 * Instagram (public/images/client-results, supplied directly by Sander) —
 * not stock photography and not this file's own invention, so this sits
 * on the right side of the same line the empty-state comment below draws:
 * genuine client results, sourced from the business itself, same as the
 * Google reviews link a few lines down.
 */
const CLIENT_RESULTS = [
  "/images/client-results/client-result-1.jpg",
  "/images/client-results/client-result-2.jpg",
  "/images/client-results/client-result-3.jpg",
  "/images/client-results/client-result-4.jpg",
  "/images/client-results/client-result-5.jpg",
  "/images/client-results/client-result-6.jpg",
] as const;

/**
 * Ships empty on purpose.
 *
 * The prototype carried three invented testimonials — "Lisa, 34", "Mark, 42",
 * "Emma, 29" — with invented metrics beside them ("85% Energy up", "+40%
 * Confidence", "100% Consistency"). Under the Omnibus amendments to the UCPD
 * it is per-se unfair to publish fabricated reviews, or to present reviews as
 * genuine without taking reasonable steps to verify them. ACM's ceiling is
 * €900k per violation.
 *
 * So the component exists and is styled, and renders an honest empty state
 * until either a Google Business Profile URL is set (verified reviews, linked
 * to source) or real consented testimonials are added. There is no code path
 * that renders a testimonial this file invented.
 *
 * Eyebrow renamed from "Ervaringen"/"Experiences" to "Klanten Resultaten"/
 * "Client Results" once the photo gallery above landed — the section now
 * shows actual before/after results, not just a link out to reviews, so the
 * label needed to cover both. Caught a stale reference to the old name
 * while renaming it: the cookie policy's Instagram-feed paragraph quoted
 * 'Ervaringen' as where that feed's load button lives, which was already
 * wrong before this rename — that button has only ever been in the
 * Instagram section (components/sections/instagram.tsx), a separate
 * section lower on the page. Fixed to say 'Instagram' there, not
 * 'Klanten Resultaten' — the correct pointer regardless of this rename.
 *

 * data-canvas="paper": second stop in the page's ink/paper/ink/paper
 * alternation (…Method paper, Programs ink, Reviews paper, Instagram ink…).
 * The ExternalLink icon and the empty-state rule use text-on-paper /
 * border-on-paper rather than accent — accent measures only 1.23:1 against
 * this section's gold background, effectively invisible rather than merely
 * low-contrast, so it's skipped here the same way Method and Faq skip it.
 */
export function Reviews() {
  const t = useTranslations("reviews");
  const gbp = siteConfig.googleBusinessProfileUrl;

  return (
    <section
      id="reviews"
      data-canvas="paper"
      aria-labelledby="reviews-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="max-w-[52ch]">
          <p className="eyebrow text-on-paper-3">{t("eyebrow")}</p>
          <h2
            id="reviews-heading"
            className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
          >
            <SplitText>{t("headline")}</SplitText>
          </h2>
        </div>

        <Reveal delay={0.1}>
          <CircularGallery
            className="mt-12"
            items={CLIENT_RESULTS.map((src) => ({ src, alt: t("gallery.imageAlt") }))}
            label={t("gallery.label")}
            prevLabel={t("gallery.prev")}
            nextLabel={t("gallery.next")}
          />
        </Reveal>

        <Reveal delay={0.2}>
          {gbp ? (
            <a
              href={gbp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 border border-border-paper px-6 py-4 text-body-sm transition-colors hover:border-on-paper/50"
            >
              <span className="text-on-paper-2">{t("verifiedLabel")}</span>
              <span className="font-semibold">{t("viewOnGoogle")}</span>
              <ExternalLink className="size-4 text-on-paper" aria-hidden="true" />
            </a>
          ) : (
            <p className="mt-10 max-w-[56ch] border-l-2 border-on-paper pl-6 text-body-lg text-on-paper-2">
              {t("empty")}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
