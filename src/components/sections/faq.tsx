import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { siteConfig } from "@/site.config";

const ITEMS = [
  "gym",
  "firstWeek",
  "beginner",
  "time",
  "travel",
  "notSure",
  "cancel",
] as const;

/**
 * Objection handling. Deliberately carries NO FAQPage structured data —
 * Google removed FAQ rich results entirely in May 2026, so the markup earns
 * nothing. The section stays because it answers the questions that otherwise
 * arrive by email, and because AI crawlers still parse it.
 *
 * Native <details>: no client JavaScript, and correct disclosure semantics
 * for free.
 *
 * Ink canvas, not paper. Instagram (previous section) moved from ink to
 * paper to stop two full-bleed black sections sitting back to back with only
 * a hairline border between them — Faq flips the opposite way so the
 * alternation continues correctly afterward: …Reviews ink → Instagram paper
 * → Faq ink → Footer. The Plus toggle icon keeps text-accent unchanged; on
 * ink that is 8.57:1, comfortably better than the 2.05:1 it measured on
 * paper.
 */
export function Faq() {
  const t = useTranslations("faq");

  return (
    <section
      id="faq"
      data-canvas="ink"
      aria-labelledby="faq-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="max-w-[52ch]">
          <p className="eyebrow text-on-ink-3">{t("eyebrow")}</p>
          <h2
            id="faq-heading"
            className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
          >
            <SplitText>{t("headline")}</SplitText>
          </h2>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 border-t border-border-ink">
            {ITEMS.map((key) => (
              <details
                key={key}
                name="faq"
                className="group border-b border-border-ink"
              >
                <summary className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  <h3 className="font-expanded text-body-lg font-bold text-balance">
                    {t(`items.${key}.q`)}
                  </h3>
                  <Plus
                    aria-hidden="true"
                    className="size-5 shrink-0 text-accent transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-open:rotate-45"
                  />
                </summary>
                <p className="max-w-[62ch] pb-6 text-body text-on-ink-2">
                  {t(`items.${key}.a`, {
                    days: siteConfig.withdrawalPeriodDays,
                  })}
                </p>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-10 text-body-sm text-on-ink-3">
            {t("contactLine")}{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-semibold text-on-ink underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
