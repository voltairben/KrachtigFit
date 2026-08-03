import type { MetadataRoute } from "next";
import { getPathname, routing, type AppPathname } from "@/i18n/routing";
import { siteConfig, isPlaceholderBuild } from "@/site.config";

const origin = siteConfig.url.replace(/\/$/, "");

const ROUTES: { path: AppPathname; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/kennismaking", priority: 0.9 },
  { path: "/privacybeleid", priority: 0.2 },
  { path: "/algemene-voorwaarden", priority: 0.2 },
  { path: "/cookiebeleid", priority: 0.2 },
];

/**
 * Deliberately emits NO `alternates` block.
 *
 * hreflang is declared in the HTML head (see buildAlternates in lib/seo.ts).
 * Declaring it in both places is a common way to end up with two sources of
 * truth that drift apart, and a single inconsistency invalidates the whole
 * language cluster. One method only.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // A placeholder build is noindex; publishing a sitemap for it would invite
  // exactly the crawling that noindex is there to prevent.
  if (isPlaceholderBuild) return [];

  const now = new Date();

  return routing.locales.flatMap((locale) =>
    ROUTES.map(({ path, priority }) => ({
      url: `${origin}${getPathname({ locale, href: path })}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      // The Dutch pages are the primary market; English is secondary.
      priority: locale === routing.defaultLocale ? priority : priority * 0.8,
    })),
  );
}
