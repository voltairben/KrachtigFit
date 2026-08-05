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
 * So the component exists and is styled, and renders an honest empty state
 * until either a Google Business Profile URL is set (verified reviews, linked
 * to source) or real consented testimonials are added. There is no code path
 * that renders a testimonial this file invented.
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
          <p className="eyebrow text-accent-fg">{t("eyebrow")}</p>
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
