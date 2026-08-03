import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * Dutch is the default and sits at the bare root — this is a local business in
 * Herten, so `/` must be the Dutch page. English is prefixed at `/en`.
 *
 * `localePrefix: "as-needed"` produces exactly that: `/` and `/en`, with no
 * `/nl` duplicate competing for the same content.
 *
 * Pathnames are localised too. A Dutch visitor gets `/kennismaking`, an
 * English visitor `/get-started` — same route, different URL, each indexable
 * in its own language.
 */
export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  localePrefix: "as-needed",

  /**
   * Do NOT auto-switch on the browser's Accept-Language header.
   *
   * With detection on, a visitor whose browser is set to English gets
   * redirected from `/` to `/en` — so the Dutch homepage of a Dutch local
   * business is never what loads, including for crawlers, which typically
   * request with en-US. The English page would end up treated as primary.
   *
   * Off, the URL alone decides the language: `/` is always Dutch, `/en` is
   * always English, and the header toggle is the way to switch.
   */
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/kennismaking": {
      nl: "/kennismaking",
      en: "/get-started",
    },
    "/gratis-startpakket": {
      nl: "/gratis-startpakket",
      en: "/free-starter-kit",
    },
    "/privacybeleid": {
      nl: "/privacybeleid",
      en: "/privacy-policy",
    },
    "/algemene-voorwaarden": {
      nl: "/algemene-voorwaarden",
      en: "/terms",
    },
    "/cookiebeleid": {
      nl: "/cookiebeleid",
      en: "/cookie-policy",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

/**
 * Locale-aware navigation. Always import Link from here, never from "next/link"
 * — these keep the active locale and resolve the localised pathname.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
