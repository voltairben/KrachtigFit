import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/**
 * Prices are published openly. No competitor in Roermond does — every local
 * player holds the number back until an intake call. Publishing it
 * differentiates and pre-qualifies, and premium operators elsewhere put price
 * on the page precisely because hiding it reads as evasive.
 *
 * Every figure is stated INCLUSIVE of BTW with the rate named, which consumer
 * pricing requires. The rate differs per product line, so it is rendered per
 * card rather than as one blanket footnote.
 */
export function Pricing() {
  const t = useTranslations("pricing");
  const tProg = useTranslations("programs");
  const locale = useLocale();

  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <section
      id="pricing"
      data-canvas="paper"
      aria-labelledby="pricing-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="max-w-[52ch]">
          <p className="eyebrow text-on-paper-3">{t("eyebrow")}</p>
          <h2
            id="pricing-heading"
            className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
          >
            <SplitText>{t("headline")}</SplitText>
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 text-body-lg text-on-paper-2">{t("intro")}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {siteConfig.pricing.map((tier) => {
            const tags = tProg.raw(`${tier.id}.tags`) as string[];

            return (
              <RevealItem key={tier.id} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col border p-8",
                    // Emphasis comes from surface and border weight. The
                    // prototype scaled the featured card 1.03x, which
                    // resampled its text and its 1px border alike.
                    tier.featured
                      ? "border-2 border-accent bg-paper-2"
                      : "border-border-paper bg-paper",
                  )}
                >
                  {tier.featured && (
                    <p className="eyebrow absolute -top-3 left-8 bg-accent px-3 py-1 text-ink">
                      {t("mostChosen")}
                    </p>
                  )}

                  <h3 className="font-expanded text-display-md font-extrabold">
                    {tProg(`${tier.id}.title`)}
                  </h3>

                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-expanded tabular text-display-lg font-extrabold">
                      {money.format(tier.priceInclVat)}
                    </span>
                    <span className="text-body-sm text-on-paper-3">
                      {t("perMonth")}
                    </span>
                  </p>

                  {/* Required: the rate is named, per line, not buried. */}
                  <p className="mt-1 text-caption text-on-paper-3">
                    {t("vatIncluded", { rate: tier.vat })}
                  </p>

                  <ul className="mt-8 flex-1 space-y-3">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="flex items-start gap-3 text-body-sm text-on-paper-2"
                      >
                        {/* Icon plus text — never colour alone, which is how
                            the prototype signalled inclusion. */}
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-8 flex items-center gap-2 border-t border-border-paper pt-6 text-caption text-on-paper-3">
                    <ShieldCheck
                      className="size-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {t("withdrawal", { days: siteConfig.withdrawalPeriodDays })}
                  </p>

                  <Button
                    asChild
                    size="lg"
                    full
                    variant={tier.featured ? "primary" : "secondary"}
                    className="mt-6"
                  >
                    <Link href="/kennismaking">
                      {t("cta")}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.2}>
          <div className="mt-12 max-w-[64ch] space-y-4">
            <p className="text-body text-on-paper-2">{t("notSure")}</p>
            <p className="text-caption text-on-paper-3">
              {t("withdrawalNote", { days: siteConfig.withdrawalPeriodDays })}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
