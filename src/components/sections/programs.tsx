import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/**
 * No monetary amounts render here — by Sander's decision, not a placeholder
 * waiting on real numbers. See siteConfig.programTiers: there is no price or
 * VAT rate anywhere in that data at all anymore, so there's nothing here to
 * accidentally wire up later. This section ships as plan name + features +
 * terms, full stop.
 *
 * Named Programs rather than Pricing for the same reason: without a number
 * on the page, "Programs" is what the section actually is — plan names,
 * what's included, and the legal terms around signing up. All its copy now
 * lives under the "programs" i18n namespace, merged with the per-tier
 * title/tags that already lived there from the (separately deleted) old
 * Programs section — one namespace, no more splitting one section's content
 * across "pricing" and "programs" keys.
 *
 * data-canvas="ink", not paper: the page strictly alternates ink/paper
 * section by section (Hero+About ink, Method paper, Programs ink, Reviews
 * paper, Instagram ink, Faq paper, Footer ink) rather than any section
 * getting a background of its own — a brief detour tried a dedicated gold
 * canvas for this section specifically, reverted for fragmenting one
 * two-colour system into several close-but-different golds. Card surfaces
 * and icon colours below are the same ones every other ink-canvas section
 * (Hero, About, Wizard) already uses — accent is safe as both an icon
 * colour and a border here, unlike on paper (see globals.css).
 */
export function Programs() {
  const t = useTranslations("programs");

  return (
    <section
      id="programs"
      data-canvas="ink"
      aria-labelledby="programs-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        <div className="max-w-[52ch]">
          <p className="eyebrow text-accent-fg">{t("eyebrow")}</p>
          <h2
            id="programs-heading"
            className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
          >
            <SplitText>{t("headline")}</SplitText>
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 text-body-lg text-on-ink-2">{t("intro")}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {siteConfig.programTiers.map((tier) => {
            const tags = t.raw(`${tier.id}.tags`) as string[];

            return (
              <RevealItem key={tier.id} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col border p-8",
                    // Emphasis comes from surface and border weight. The
                    // prototype scaled the featured card 1.03x, which
                    // resampled its text and its 1px border alike.
                    tier.featured
                      ? "border-2 border-accent bg-surface-2"
                      : "border-border-ink bg-surface-1",
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
                        className="flex items-start gap-3 text-body-sm text-on-ink-2"
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

                  <Button
                    asChild
                    size="lg"
                    full
                    variant={tier.featured ? "primary" : "secondary"}
                    className="mt-8"
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
          <p className="mt-12 max-w-[64ch] text-body text-on-ink-2">
            {t("notSure")}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
