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
 * Paper canvas: last stop in the page's ink/paper/ink/paper alternation
 * before Footer (…Reviews paper, Instagram ink, Faq paper, Footer ink),
 * which is also why Footer stays ink unmodified — the two need to differ
 * and already do.
 *
 * The Plus toggle icon reads text-on-paper rather than accent: accent
 * measures only 1.23:1 against this section's gold background, well past
 * the point the "decorative icon gets a contrast pass" exception (still
 * used by Method's step numbers, which stay on ink) can reasonably cover —
 * that's not low contrast, it's close enough to invisible. Same reasoning,
 * same fix, as Reviews' icons and Programs' when its own canvas was gold.
 */
export function Faq() {
  const t = useTranslations("faq");

  return (
    <section
      id="faq"
      data-canvas="paper"
      aria-labelledby="faq-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="max-w-[52ch]">
          <p className="eyebrow text-on-paper-3">{t("eyebrow")}</p>
          <h2
            id="faq-heading"
            className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
          >
            <SplitText>{t("headline")}</SplitText>
          </h2>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 border-t border-border-paper">
            {ITEMS.map((key) => (
              <details
                key={key}
                name="faq"
                className="group border-b border-border-paper"
              >
                <summary className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-on-paper">
                  <h3 className="font-expanded text-body-lg font-bold text-balance">
                    {t(`items.${key}.q`)}
                  </h3>
                  <Plus
                    aria-hidden="true"
                    className="size-5 shrink-0 text-on-paper transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-open:rotate-45"
                  />
                </summary>
                <p className="max-w-[62ch] pb-6 text-body text-on-paper-2">
                  {t(`items.${key}.a`)}
                </p>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-10 text-body-sm text-on-paper-3">
            {t("contactLine")}{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-semibold text-on-paper underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
