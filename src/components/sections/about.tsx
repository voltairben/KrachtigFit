import { useTranslations } from "next-intl";
import { Video } from "lucide-react";

import { Container } from "@/components/ui/container";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { siteConfig, TODO } from "@/site.config";

/**
 * The personal introduction, placed directly after the hero so it is still
 * the first thing a visitor scrolls into — Sander introducing himself before
 * anything else about the method or the programs.
 *
 * Shares the hero's ink canvas rather than alternating, so the two read as
 * one opening block: value proposition, then the person behind it.
 *
 * The video slot is empty on purpose. The prototype had a "Watch My Story"
 * play badge that did nothing when clicked — a dead affordance, which is
 * worse than no affordance at all. This renders a real <video> once
 * `siteConfig.trainer.introVideoUrl` is set, and an honest, clearly inert
 * "coming soon" placeholder until then: no play icon, no pointer cursor,
 * nothing implying it can be clicked.
 */
export function About() {
  const t = useTranslations("about");
  const tp = useTranslations("proof");
  const videoUrl = siteConfig.trainer.introVideoUrl;

  const clients = siteConfig.proof.clientsCoached;
  const years = siteConfig.proof.yearsExperience;
  const hasClientProof = clients.value !== TODO;
  const hasYearsProof = years.value !== TODO;

  return (
    <section
      id="about"
      data-canvas="ink"
      aria-labelledby="about-heading"
      className="border-t border-border-ink py-24 lg:py-32"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow text-accent-fg">{t("eyebrow")}</p>
            <h2
              id="about-heading"
              className="font-expanded mt-6 text-display-lg font-extrabold text-balance"
            >
              <SplitText>{t("headline")}</SplitText>
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-[46ch] text-body-lg text-on-ink-2">
                {t("intro")}
              </p>
            </Reveal>

            {/*
              Moved here from Hero (was directly under the headline) so the
              numbers back up Sander's own introduction instead of sitting
              adjacent to the value-prop headline. Renders only the stats
              that have a substantiated figure in site.config.ts — same
              rule as before, just relocated.
            */}
            {(hasClientProof || hasYearsProof) && (
              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-4 border-t border-border-ink pt-6">
                  {hasClientProof && (
                    <div className="flex items-baseline gap-2">
                      <span className="font-expanded tabular text-display-md font-extrabold text-accent-fg">
                        {clients.value}
                      </span>
                      <span className="text-body-sm text-on-ink-2">
                        {tp("clientsLabel")}
                      </span>
                    </div>
                  )}
                  {hasYearsProof && (
                    <div className="flex items-baseline gap-2">
                      <span className="font-expanded tabular text-display-md font-extrabold text-accent-fg">
                        {years.value}
                      </span>
                      <span className="text-body-sm text-on-ink-2">
                        {tp("yearsLabel")}
                      </span>
                    </div>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.3} className="lg:col-span-7">
            {videoUrl ? (
              <BorderRotate className="aspect-video w-full">
                <video
                  src={videoUrl}
                  poster="/videos/sander-intro-poster.jpg"
                  controls
                  className="h-full w-full object-cover"
                />
              </BorderRotate>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-border-ink bg-surface-1">
                <Video
                  className="size-8 text-on-ink-3"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <p className="text-body-sm text-on-ink-3">
                  {t("videoComingSoon")}
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
