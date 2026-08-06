import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates, buildBusinessJsonLd } from "@/lib/seo";
import { siteConfig, isPlaceholderBuild } from "@/site.config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LightPillar } from "@/components/effects/light-pillar";
import "@/styles/globals.css";

/**
 * One variable superfamily, two axes. Archivo's width axis lets Expanded carry
 * the display type and Normal carry body copy from a single payload — which
 * is what makes the prototype's bug structurally impossible here. It requested
 * Oswald 500/600/700 while seven selectors resolved to weight 400, so the
 * browser silently substituted or synthesised.
 *
 * On self-hosting: next/font/google downloads the font at BUILD time and
 * serves it from this origin. There is no runtime request to
 * fonts.googleapis.com and no visitor IP reaches Google — which is the actual
 * substance of the LG München ruling. The prototype's <link> tag hit Google's
 * CDN on every page view.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
  // Cuts layout shift during the swap by matching fallback metrics.
  adjustFontFallback: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      type: "website",
      locale: locale === "nl" ? "nl_NL" : "en_GB",
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      url: siteConfig.url,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    // A build made with ALLOW_PLACEHOLDER_BUILD=1 still contains placeholder
    // legal identity, so it must never reach an index — regardless of where
    // it gets deployed or who points a domain at it.
    robots: isPlaceholderBuild
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required for static rendering of a [locale] segment.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "a11y" });
  const jsonLd = buildBusinessJsonLd(locale);

  return (
    <html
      lang={locale}
      className={archivo.variable}
      // The bootstrap script below sets data-theme on this element before
      // hydration runs, which will never match the server-rendered markup
      // (the server has no way to know the visitor's stored preference).
      // That's expected, not a bug — suppress the one warning React would
      // otherwise raise about it.
      suppressHydrationWarning
    >
      <head>
        {/*
          Reveal animations set `initial` opacity 0, which is serialised into
          the SSR HTML. Without JavaScript that content would never become
          visible. This forces every reveal back to its resting state, so the
          page reads completely with JS disabled — something the prototype
          failed outright: five of its six FAQ panels were collapsed by CSS
          with no non-JS way to open them.
        */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `[data-reveal]{opacity:1!important;transform:none!important}`,
            }}
          />
        </noscript>
        {/*
          Sets data-theme on <html> before first paint, so a returning
          visitor with "light" saved never sees a flash of the dark default.
          Synchronous and blocking on purpose — deferred or async would let
          the browser paint the wrong theme first. Reads localStorage
          directly rather than through next-intl/React state because this
          runs before either exists; ThemeToggle reads the attribute this
          script already applied instead of duplicating the decision.
          No CSP is set on this app (see next.config.ts headers()), so an
          inline script needs no nonce here.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('kf-theme');" +
              "if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}" +
              "document.documentElement.setAttribute('data-theme',t);" +
              "}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-canvas-ink text-on-ink antialiased">
        {/*
          Sitewide ambient layer, not a per-section decoration: fixed to the
          viewport so it's present behind every page as you scroll, rather
          than sized to page height or scoped to one section. One
          LightPillar instance, not several — a three-column version (one
          instance per column, side by side) was tried to reach the page's
          left and right edges, and rejected: each instance is its own
          bounded WebGL canvas with a hard edge, so three of them tiled
          next to each other always shows as three separate panels with
          visible seams, never as one continuous piece, no matter how the
          colours or edges are tuned. It also tripled the WebGL cost for
          that non-fix. One instance, made wide, and animated to travel the
          full width over time instead, is what actually reads as one
          fluid piece — see the animate-[pillar-drift_…] class below.

          Three real bugs/lessons from getting here, worth keeping so they
          aren't repeated:

          1. mixBlendMode does not reliably composite with a WebGL <canvas>
             child — tested in both software- and hardware-accelerated
             rendering. It silently fell back to opaque "normal", and
             because the shader always writes alpha 1.0 (every pixel fully
             opaque, "black" included — see light-pillar.tsx), that hid the
             entire page behind it. Caught by screenshotting the Hero, not
             by reasoning about the CSS spec. Plain CSS opacity on the
             wrapper is what actually makes it translucent; mixBlendMode is
             left at the harmless default "normal" rather than removed, in
             case a future browser closes this gap.
          2. useReducedMotion() can resolve synchronously on the client
             while the server can't read it at all — branching the
             component's returned JSX directly on it caused a real
             hydration mismatch. Fixed in light-pillar.tsx with a
             post-mount `mounted` gate, not fixed here, but worth knowing
             this layer's reduced-motion path was hydration-tested.
          3. A brighter, wider, faster, and (once drift shipped) actually
             moving effect can sweep a bright patch over text that was
             never near it before — caught on the Faq heading ("meestal"
             read as barely-there) by watching a full drift cycle, not
             from one screenshot. A static contrast check at a single
             frame doesn't stand in for the whole animation; the numbers
             below carry more headroom than whatever looked fine in one
             frame.

          topColor #f4f2ed (not a gold tone) is the exact value of
          --color-on-ink, reused rather than a fresh white picked by eye —
          needed specifically because the pillar's original gold top colour
          was nearly identical to this site's paper-canvas gold, giving
          almost no colour distinction on those sections. bottomColor stays
          the brand's own bronze (--color-accent-press), so it reads as
          "warm light fading to gold," not a plain white-to-gold gradient.

          pillarWidth is wide (5.5) so the glow has real breadth at any
          single instant, not just over the course of the drift.
          rotationSpeed and noiseIntensity keep the shader's own internal
          warp clearly visible within a few seconds rather than over tens
          of seconds. quality="low" and opacity/glowAmount stay
          conservative for the same reason as always: this never unmounts,
          running continuously behind every page rather than being
          scroll-triggered and finite like Reveal/SplitText, or scoped to
          one element like Method's progress line. pointer-events-none +
          aria-hidden + interactive=false: purely decorative, must never
          intercept a click, be announced, or react to the cursor.

          animate-[pillar-drift_…]: defined once as @keyframes
          pillar-drift in globals.css, a slow translateX so the instance's
          core actually crosses from left third to right third and back
          over the cycle — genuine horizontal movement across the page,
          which rotationSpeed alone can't produce, that parameter only
          animates the shader's internal warp in place. No JS
          reduced-motion check needed here: the blanket @media
          (prefers-reduced-motion: reduce) rule in globals.css already
          neutralises any CSS animation-duration sitewide, this one
          included.

          w-[200vw] left-[-50vw] on the animated div, not w-full: the first
          version sized this element to exactly the viewport and then
          translated it, which works for the CONTENT but not for the
          element's own edge — at the extremes of the drift, that edge
          swings into the visible viewport and shows up as a hard vertical
          line where the canvas's rendered pixels simply stop. Overshooting
          the element to twice the viewport width and centring it at rest
          (left: -50vw) means even at the full ±32vw of travel the drift
          keyframe uses, both edges stay off-screen the entire time — see
          the arithmetic in pillar-drift's own comment in globals.css.
          overflow-hidden on the fixed wrapper is a second line of defence
          against the same problem, not the fix itself. This doubles the
          pixel count the shader renders (200vw × viewport height instead
          of 100vw × height) — quality="low" already renders at half pixel
          ratio, which is doing more work now than it was before.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-10 overflow-hidden opacity-[0.28]"
        >
          <div className="relative left-[-50vw] h-full w-[200vw] animate-[pillar-drift_40s_ease-in-out_infinite]">
            <LightPillar
              topColor="#f4f2ed"
              bottomColor="#96784e"
              intensity={0.85}
              rotationSpeed={0.45}
              glowAmount={0.0075}
              pillarWidth={5.5}
              pillarHeight={0.5}
              noiseIntensity={0.4}
              pillarRotation={0}
              interactive={false}
              mixBlendMode="normal"
              quality="low"
            />
          </div>
        </div>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-3 focus:text-ink focus:font-semibold focus:uppercase focus:tracking-[0.08em] focus:rounded-sm"
        >
          {t("skipToContent")}
        </a>

        <NextIntlClientProvider>
          <SiteHeader locale={locale} />
          <main id="main">{children}</main>
          <SiteFooter />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "var(--color-surface-2)",
                color: "var(--color-on-ink)",
                border: "1px solid var(--color-border-ink)",
                borderRadius: "var(--radius-sm)",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
