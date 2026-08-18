/**
 * Single source of truth for every legally-loaded value on the site.
 *
 * Two rules are enforced here rather than left to discipline:
 *
 *  1. Art. 3:15d BW requires identity, address, KvK and BTW-ID to be permanently
 *     accessible on the site. Missing values are TODO sentinels, and
 *     `assertLaunchReady()` fails the production build if any survive.
 *
 *  2. Art. 6:193j BW puts the burden of proving a factual claim on the trader,
 *     not the regulator. So a `Claim` cannot be constructed without `evidence`
 *     — there is no way to add "92% success rate" to this file without also
 *     writing down what substantiates it.
 */

/** Sentinel for a value that must be supplied before launch. */
export const TODO = "__TODO__" as const;
type Todo = typeof TODO;

/**
 * Fields still holding EXAMPLE data.
 *
 * Real values arrive one at a time, so this is a list rather than a single
 * flag — it can say "KvK is real, prices are not". Each entry is treated
 * exactly like an unresolved TODO and fails the production build, because a
 * plausible-looking fake identifier is more dangerous than an obviously
 * missing one.
 *
 * Delete an entry in the same commit that replaces its value.
 */
export const EXAMPLE_FIELDS = [] as const;

/**
 * A published factual claim. `evidence` is required by the type, and is never
 * rendered — it exists so the substantiation is version-controlled next to the
 * claim and travels with it.
 */
type Claim = {
  /** The number as displayed, e.g. "400+". */
  value: string;
  /** What substantiates it: cohort, metric, window, source. */
  evidence: string;
};

export const siteConfig = {
  name: "KrachtigFit",
  /**
   * REAL — registered legal/trade name as filed with the KvK, confirmed by
   * Sander, 2026-08-05.
   *
   * Widened to `string` rather than left as a literal so the `=== TODO`
   * guards downstream stay live code. With `as const` a filled-in literal
   * makes those comparisons statically false, and TypeScript rightly flags
   * them as dead — but they must keep working when a value is missing.
   */
  legalName: "KrachtigFit" as string,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://krachtigfit.nl",

  trainer: {
    name: "Sander Fermont",
    jobTitle: { nl: "Personal trainer", en: "Personal trainer" },
    /** Certifications — CIOS / Fit!vak / EREPS registration numbers if held. */
    credentials: [] as string[],
    /**
     * Not a launch blocker — this is ordinary content, not a legal value, so
     * it doesn't belong in EXAMPLE_FIELDS. Null renders an honest "coming
     * soon" placeholder in the About section (same pattern as
     * googleBusinessProfileUrl below) rather than a dead play button — the
     * prototype's "Watch My Story" badge did nothing when clicked, which is
     * worse than not offering a video at all.
     *
     * REAL — recorded with Sander 2026-08-07, edited from three source clips
     * (interlaced 1080i AVCHD, deinterlaced and normalized on export).
     */
    introVideoUrl: "/videos/sander-intro.mp4" as string | null,
  },

  /**
   * Art. 3:15d BW — must render in the footer of every page, not only /contact.
   * "Permanent toegankelijk" is not satisfied by a contact page alone.
   */
  legal: {
    /** REAL — verified Chamber of Commerce registration number. */
    kvk: "84937343" as string,
    /** REAL — verified BTW-ID, confirmed by Sander, 2026-08-06. */
    btwId: "NL004036732B59" as string,
    /** REAL — registered establishment address. */
    address: {
      street: "Putkamp 4" as string,
      postalCode: "6049 AK" as string,
      city: "Herten",
      country: "NL",
    },
    /**
     * REAL — false. Putkamp 4 is the gym Sander delivers personal training
     * from, i.e. a genuine premises clients visit, not an admin address.
     *
     * Consequence for Google Business Profile: register as a normal
     * location-based listing with the address VISIBLE, not as a service-area
     * business with a hidden address. A visible verified address at a real
     * premises is worth considerably more in the local pack, and proximity is
     * the single heaviest ranking factor there.
     *
     * It also makes the SportsActivityLocation schema type accurate rather
     * than merely defensible.
     */
    isServiceAreaBusiness: false as boolean | Todo,
  },

  contact: {
    email: "sander@krachtigfit.nl",
    /**
     * `phone` is what the tel: link dials, so it stays strict E.164 — country
     * code then the number with the national trunk prefix removed. Keeping the
     * 0 in a tel: href can fail to connect on some handsets and carriers.
     *
     * `phoneDisplay` is only ever rendered as text, so it can follow whatever
     * convention is preferred without affecting dialling.
     */
    phone: "+31641973164",
    phoneDisplay: "+31 0641973164",
    whatsapp: "31641973164",
  },

  social: {
    instagram: "https://instagram.com/krachtigfit",
    // Only list channels that exist. The prototype shipped href="#" for
    // YouTube and TikTok; a dead link costs more trust than an absent one.
  },

  /**
   * Every published number, with its substantiation.
   *
   * The prototype claimed "92% success rate", "400+ clients", "6 years",
   * plus per-testimonial figures ("85% Energy up", "+40% Confidence").
   * None were substantiated. A percentage needs a defined cohort, a defined
   * success metric and a defined window, or it must be replaced by a
   * verifiable count — counts carry no evidential burden.
   */
  proof: {
    /** REAL — confirmed by Sander as the current client count. */
    clientsCoached: {
      value: "500+",
      evidence: "Confirmed by Sander Fermont, 2026-08-06.",
    } as Claim | { value: Todo; evidence: Todo },
    /** REAL — confirmed by Sander, 2026-08-05. */
    yearsExperience: {
      value: "6",
      evidence: "Confirmed by Sander Fermont, 2026-08-05.",
    } as Claim | { value: Todo; evidence: Todo },
    /**
     * Leave null unless a documented cohort exists. Compliant shape:
     *   value: "88%",
     *   evidence: "62 clients completed a 12-week programme in 2025; 88% met
     *              the goal agreed at intake. Source: coaching log, 2025-01-01
     *              to 2025-12-31."
     * If this stays null the UI renders a verifiable count instead.
     */
    successRate: null as Claim | null,
  },

  /**
   * No pricing anywhere on the site, by Sander's decision — not "not yet",
   * not "pending real numbers": he doesn't want a rate quoted or implied on
   * the page at all. The rate is discussed on the free intro call instead.
   *
   * That also retires the BTW-rate question this used to carry (9% vs 21%
   * "gelegenheid geven tot sportbeoefening" turning on who supplies the
   * training accommodation) — it only mattered because a VAT-inclusive
   * number would have been displayed. Nothing here is priced, so nothing
   * here needs a rate.
   *
   * `featured` still drives the "most chosen" card emphasis through
   * elevation and border, never through transform: scale(). The prototype
   * scaled its featured card by 1.03, which resampled the text and rendered
   * its 1px border at 1.03px.
   */
  programTiers: [
    { id: "online", featured: false },
    { id: "hybrid", featured: true },
    { id: "personal", featured: false },
  ] as const,

  /**
   * Distance contract for a service: 14 days statutory withdrawal, running from
   * conclusion of the agreement. The right only lapses where the consumer
   * expressly requested immediate performance AND the service has been fully
   * performed — which a 12-week programme never is. Surfaced next to the price
   * as risk reversal, and handled explicitly in the signup flow.
   */
  withdrawalPeriodDays: 14,

  /**
   * Reviews must be verifiable. Either pull from Google with a visible
   * "geverifieerde Google-reviews" label linking to source, or publish own
   * testimonials with full name, date and a stated collection method.
   * Hand-written testimonials are prohibited. Empty until real ones exist.
   */
  googleBusinessProfileUrl: null as string | null,

  /**
   * ISO date on which the privacy policy, terms and cookie policy were
   * reviewed by someone qualified. The drafts in lib/legal-content.ts describe
   * the processing this site actually performs, but they are a starting point
   * for review — not legal advice, and not a substitute for it.
   *
   * Set to a date only once that review has happened. Until then the
   * production build fails, exactly as it does for a missing KvK number.
   *
   * REAL — confirmed by Sander Fermont, 2026-08-18.
   */
  legalReviewedAt: "2026-08-18",
} as const;

export type ProgramTier = (typeof siteConfig.programTiers)[number];

/* -------------------------------------------------------------------------- */

/** Walks the config and returns dotted paths of every unresolved TODO. */
function findUnresolved(node: unknown, path: string[] = []): string[] {
  if (node === TODO) return [path.join(".")];
  if (node === null || typeof node !== "object") return [];
  return Object.entries(node).flatMap(([key, value]) =>
    findUnresolved(value, [...path, key]),
  );
}

/** Unresolved TODOs plus any remaining example fields, as one list. */
function launchBlockers(): string[] {
  return [
    ...findUnresolved(siteConfig).map((p) => `siteConfig.${p}  (missing)`),
    ...EXAMPLE_FIELDS.map((p) => `siteConfig.${p}  (example data)`),
  ];
}

/** True when this build still contains placeholder or example values. */
export function hasPlaceholders(): boolean {
  return launchBlockers().length > 0;
}

/**
 * Set ALLOW_PLACEHOLDER_BUILD=1 to build a staging/preview deploy before the
 * legal values are final. Any build made this way is forced to noindex — see
 * `robots` in src/app/[locale]/layout.tsx — so an incomplete site physically
 * cannot be indexed, whatever it is deployed to.
 */
export const isPlaceholderBuild =
  process.env.ALLOW_PLACEHOLDER_BUILD === "1" && hasPlaceholders();

/**
 * Fails the production build while any legally required value is still a
 * placeholder. Called from next.config.ts so it runs at build time, before
 * anything can reach a visitor.
 */
export function assertLaunchReady(): void {
  const unresolved = launchBlockers();
  if (unresolved.length === 0) return;

  const detail = [
    "",
    ...unresolved.map((p) => `  - ${p}`),
    "",
    "Art. 3:15d BW requires identity, address, KvK and BTW-ID to be",
    "permanently accessible. Consumer prices must display incl. BTW (ACM),",
    "so the VAT rate must be confirmed per product line before launch.",
    "",
  ];

  if (process.env.ALLOW_PLACEHOLDER_BUILD === "1") {
    // Permitted, but never silently: the values are listed every time, and
    // the resulting build is noindex.
    console.warn(
      [
        "",
        "⚠  PLACEHOLDER BUILD — not fit to publish.",
        ...detail,
        "  This build is forced to noindex. Do not point a public domain at it.",
        "",
      ].join("\n"),
    );
    return;
  }

  throw new Error(
    [
      "",
      "Build blocked: legally required values are still placeholders.",
      ...detail,
      "Fill these in src/site.config.ts. For a local preview use `npm run dev`.",
      "For a staging deploy set ALLOW_PLACEHOLDER_BUILD=1 — that build will be",
      "forced to noindex.",
      "",
    ].join("\n"),
  );
}
