import { useTranslations } from "next-intl";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/**
 * No monetary amounts render here — see siteConfig.pricing / EXAMPLE_FIELDS
 * for why: the three price points are still prototype placeholders, not
 * Sander's real numbers. Every other launch blocker in that file states a
 * fact that's merely missing; a wrong price is worse than a missing one, so
 * this section ships as plan name + features + terms until real figures land.
 *
 * `siteConfig.pricing` (the data array) and `PricingTier` keep their own
 * names — they genuinely hold price data, just data this component doesn't
 * render yet. `priceInclVat` and `.vat` stay defined there and are simply
 * not read here — restoring the price line is then a one-line change in
 * this file, not a data-modelling change.
 *
 * Named Programs rather than Pricing for the same reason: without a number
 * on the page, "Programs" is what the section actually is — plan names,
 * what's included, and the legal terms around signing up. All its copy now
 * lives under the "programs" i18n namespace, merged with the per-tier
 * title/tags that already lived there from the (separately deleted) old
 * Programs section — one namespace, no more splitting one section's content
 * across "pricing" and "programs" keys.
 *
 * data-canvas="paper" is kept for its default text colour (on-paper /
 * on-paper-2 read correctly against the background below without needing
 * their own variants), but the background itself is overridden to
 * --color-gold via bg-gold rather than inheriting paper's champagne — see
 * that token's comment in globals.css for why this section and Method no
 * longer share a canvas colour. Icons that were text-accent on the old
 * paper background switch to text-on-paper here: this section's own
 * background is now close enough to the accent gold itself that an
 * accent-coloured checkmark would wash out against it (measured ~2:1,
 * barely readable as a shape) — dark ink reads cleanly on gold instead.
 */
export function Programs() {
  const t = useTranslations("programs");

  return (
    <section
      id="programs"
      data-canvas="paper"
      aria-labelledby="programs-heading"
      className="bg-gold py-24 lg:py-32"
    >
      <Container>
        <div className="max-w-[52ch]">
          <p className="eyebrow text-on-gold-3">{t("eyebrow")}</p>
          <h2
            id="programs-heading"
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
            const tags = t.raw(`${tier.id}.tags`) as string[];

            return (
              <RevealItem key={tier.id} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col border p-8",
                    // Emphasis comes from surface and border weight. The
                    // prototype scaled the featured card 1.03x, which
                    // resampled its text and its 1px border alike.
                    //
                    // border-on-paper here, not border-accent: on the paper
                    // canvas border-accent worked because accent stood out
                    // against pale champagne. Against this section's own
                    // gold background the two are close enough in hue
                    // (measured ~1.8:1) that an accent border on a gold card
                    // nearly disappears — dark ink reads as a clean frame
                    // instead (~11.5:1).
                    tier.featured
                      ? "border-2 border-on-paper bg-gold-2"
                      : "border-border-paper bg-gold",
                  )}
                >
                  {tier.featured && (
                    <p className="eyebrow absolute -top-3 left-8 bg-accent px-3 py-1 text-ink">
                      {t("mostChosen")}
                    </p>
                  )}

                  <h3 className="font-expanded text-display-md font-extrabold">
                    {t(`${tier.id}.title`)}
                  </h3>

                  <ul className="mt-6 flex-1 space-y-3">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="flex items-start gap-3 text-body-sm text-on-paper-2"
                      >
                        {/* Icon plus text — never colour alone, which is how
                            the prototype signalled inclusion. text-on-paper,
                            not text-accent: see the docblock above. */}
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-on-paper"
                          aria-hidden="true"
                        />
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-8 flex items-center gap-2 border-t border-border-paper pt-6 text-caption text-on-gold-3">
                    <ShieldCheck
                      className="size-4 shrink-0 text-on-paper"
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
            <p className="text-caption text-on-gold-3">
              {t("withdrawalNote", { days: siteConfig.withdrawalPeriodDays })}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
