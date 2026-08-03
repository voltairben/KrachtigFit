import type { Metadata } from "next";
import { siteConfig, TODO } from "@/site.config";
import { getPathname, routing, type AppPathname, type Locale } from "@/i18n/routing";

const origin = siteConfig.url.replace(/\/$/, "");

function absolute(locale: Locale, pathname: AppPathname): string {
  return `${origin}${getPathname({ locale, href: pathname })}`;
}

/**
 * Canonical + hreflang for a page.
 *
 * Three rules, because roughly three quarters of hreflang implementations are
 * broken and one bad tag invalidates the entire cluster:
 *
 *  1. Every page self-canonicalises. An English page canonicalising to its
 *     Dutch counterpart silently removes the English page from the index —
 *     this is the single most common way the whole setup dies.
 *  2. Return tags are reciprocal. Both locales list both locales, generated
 *     from one loop so they cannot drift apart.
 *  3. One implementation method only. These go in the HTML head, so the
 *     sitemap deliberately does NOT also emit alternates.
 */
export function buildAlternates(
  locale: Locale,
  pathname: AppPathname,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const l of routing.locales) {
    languages[l === "nl" ? "nl-NL" : l] = absolute(l, pathname);
  }
  // Dutch is the default and serves as the fallback for unmatched locales.
  languages["x-default"] = absolute(routing.defaultLocale, pathname);

  return {
    canonical: absolute(locale, pathname),
    languages,
  };
}

/**
 * LocalBusiness + Person structured data.
 *
 * Deliberately omits `aggregateRating`. Reviews a business collects itself —
 * including reviews surfaced through a third-party widget on its own domain —
 * are ineligible for star rich results under Google's review-snippet policy.
 * Stars come from the Google Business Profile. Marking them up here achieves
 * nothing and risks a manual action.
 *
 * Also omits FAQPage: Google removed FAQ rich results entirely in May 2026.
 * The FAQ section stays because it handles objections and AI crawlers parse
 * it, but there is no schema to attach.
 */
export function buildBusinessJsonLd(locale: Locale) {
  const { legal, trainer, contact, name, legalName } = siteConfig;

  const hasAddress =
    legal.address.street !== TODO && legal.address.postalCode !== TODO;

  const business = {
    "@type": "SportsActivityLocation",
    "@id": `${origin}/#business`,
    name,
    ...(legalName !== TODO && { legalName }),
    url: absolute(locale, "/"),
    email: contact.email,
    telephone: contact.phone,
    // NAP must match the Google Business Profile exactly. A mismatch makes
    // Google distrust and suppress the markup.
    ...(hasAddress && {
      address: {
        "@type": "PostalAddress",
        streetAddress: legal.address.street,
        postalCode: legal.address.postalCode,
        addressLocality: legal.address.city,
        addressCountry: legal.address.country,
      },
    }),
    areaServed: [
      "Roermond",
      "Herten",
      "Swalmen",
      "Echt",
      "Weert",
      "Sittard-Geleen",
    ].map((n) => ({ "@type": "City", name: n })),
    ...(legal.kvk !== TODO && {
      identifier: [
        { "@type": "PropertyValue", name: "KvK", value: legal.kvk },
        ...(legal.btwId !== TODO
          ? [{ "@type": "PropertyValue", name: "BTW-ID", value: legal.btwId }]
          : []),
      ],
    }),
    ...(siteConfig.social.instagram && {
      sameAs: [siteConfig.social.instagram],
    }),
  };

  const person = {
    "@type": "Person",
    "@id": `${origin}/#trainer`,
    name: trainer.name,
    jobTitle: trainer.jobTitle[locale],
    worksFor: { "@id": `${origin}/#business` },
    knowsAbout: [
      "Krachttraining",
      "Voedingsbegeleiding",
      "Personal training",
      "Gedragsverandering",
    ],
    ...(trainer.credentials.length > 0 && {
      hasCredential: trainer.credentials,
    }),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [business, person],
  };
}
