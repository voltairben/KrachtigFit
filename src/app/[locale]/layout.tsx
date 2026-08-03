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
    <html lang={locale} className={archivo.variable}>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-ink text-on-ink antialiased">
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
