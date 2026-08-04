import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { siteConfig } from "@/site.config";

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
 * A Juicer-based Google Reviews embed was tried and removed here. It showed
 * real reviews, but Juicer's script always mounts its feed to the end of
 * `document.body` regardless of where the script tag or any pre-supplied
 * container sits — confirmed by direct testing, not assumed — so it could
 * never render inline in this section, only reachable via an auto-scroll to
 * the bottom of the page. Common Ninja was checked as a replacement: unlike
 * Juicer it does respect a given container's position, but the specific
 * Instagram widget already live on this site (see the Instagram section)
 * loads its SDK successfully yet renders no content — the mount point is
 * claimed but stays empty, which points at a data-connection or
 * publish-status issue on the Common Ninja dashboard side, not a placement
 * problem. Needs checking there before a Common Ninja reviews widget is
 * wired up here the same way.
 *
 * So the component exists and is styled, and renders an honest empty state
 * until either a Google Business Profile URL is set (verified reviews, linked
 * to source) or a review widget is found that both shows content and
 * actually renders where it's placed. There is no code path that renders a
 * testimonial this file invented.
 */
export function Reviews() {
  const t = useTranslations("reviews");
  const gbp = siteConfig.googleBusinessProfileUrl;

  return (
    <section
      id="reviews"
      data-canvas="ink"
      aria-labelledby="reviews-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="max-w-[52ch]">
          <p className="eyebrow text-accent">{t("eyebrow")}</p>
          <h2
            id="reviews-heading"
            className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
          >
            <SplitText>{t("headline")}</SplitText>
          </h2>
        </div>

        <Reveal delay={0.15}>
          {gbp ? (
            <a
              href={gbp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex items-center gap-2 border border-border-ink px-6 py-4 text-body-sm transition-colors hover:border-accent/50"
            >
              <span className="text-on-ink-2">{t("verifiedLabel")}</span>
              <span className="font-semibold">{t("viewOnGoogle")}</span>
              <ExternalLink className="size-4 text-accent" aria-hidden="true" />
            </a>
          ) : (
            <p className="mt-12 max-w-[56ch] border-l-2 border-accent pl-6 text-body-lg text-on-ink-2">
              {t("empty")}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
