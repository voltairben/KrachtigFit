import { useTranslations } from "next-intl";
import { Instagram } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/routing";
import { siteConfig, TODO } from "@/site.config";

/**
 * Art. 3:15d BW requires identity, established address, email, KvK number and
 * BTW-ID to be "gemakkelijk, rechtstreeks en permanent toegankelijk". A contact
 * page alone does not satisfy "permanent" — it has to be on every page, which
 * is why this lives in the layout rather than on /contact.
 *
 * 7 of the 9 competitors surveyed are missing one or both identifiers.
 *
 * Values come from site.config.ts, where the production build refuses to
 * compile while any of them is still a placeholder.
 */
export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const { legal, contact, name, legalName } = siteConfig;

  const showAddress =
    legal.address.street !== TODO && legal.address.postalCode !== TODO;

  return (
    <footer data-canvas="ink" className="border-t border-border-ink">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-expanded text-display-md font-extrabold tracking-tight">
              Krachtig<span className="text-accent-fg">Fit</span>
            </p>
            <p className="mt-4 max-w-[38ch] text-body-sm text-on-ink-2">
              {t("tagline")}
            </p>
          </div>

          <nav aria-labelledby="footer-nav-heading">
            <h2
              id="footer-nav-heading"
              className="eyebrow text-on-ink-3"
            >
              {t("navHeading")}
            </h2>
            <ul className="mt-4 space-y-3 text-body-sm">
              <li>
                <Link href="/kennismaking" className="hover:text-accent-fg">
                  {tNav("cta")}
                </Link>
              </li>
              <li>
                <Link
                  href={{ pathname: "/", hash: "method" }}
                  className="hover:text-accent-fg"
                >
                  {tNav("method")}
                </Link>
              </li>
              <li>
                <Link
                  href={{ pathname: "/", hash: "programs" }}
                  className="hover:text-accent-fg"
                >
                  {tNav("programs")}
                </Link>
              </li>
              <li>
                <Link
                  href={{ pathname: "/", hash: "faq" }}
                  className="hover:text-accent-fg"
                >
                  {tNav("faq")}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal-heading">
            <h2
              id="footer-legal-heading"
              className="eyebrow text-on-ink-3"
            >
              {t("legalHeading")}
            </h2>
            <ul className="mt-4 space-y-3 text-body-sm">
              <li>
                <Link href="/privacybeleid" className="hover:text-accent-fg">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/algemene-voorwaarden"
                  className="hover:text-accent-fg"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/cookiebeleid" className="hover:text-accent-fg">
                  {t("cookies")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-on-ink-3">{t("contactHeading")}</h2>
            <ul className="mt-4 space-y-3 text-body-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-accent-fg"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                {/* Strict E.164 in the href so it dials; display string is
                    presentation only. See siteConfig.contact. */}
                <a href={`tel:${contact.phone}`} className="hover:text-accent-fg">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent-fg"
                >
                  <Instagram className="size-4" aria-hidden="true" />
                  {t("instagram")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory business identity. */}
        <div className="mt-14 border-t border-border-ink pt-8">
          <address className="text-caption not-italic text-on-ink-3">
            <span className="block">
              {legalName === TODO ? name : legalName}
              {showAddress && (
                <>
                  {" · "}
                  {legal.address.street}
                  {", "}
                  {legal.address.postalCode} {legal.address.city}
                </>
              )}
              {!showAddress && ` · ${legal.address.city}`}
            </span>
            <span className="mt-1 block">
              {t("kvk")} {legal.kvk} · {t("btw")} {legal.btwId}
            </span>
          </address>

          {/*
            flex-wrap + justify-between rather than two independently
            positioned elements: on narrow viewports the credit line wraps
            below the copyright line instead of the two ever overlapping,
            and on wide viewports "Designed by VoltairStudio" lands bottom
            right as asked, without a fixed/absolute position that would
            need its own overlap accounting against everything above it.
          */}
          <p className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-caption text-on-ink-3">
            <span>
              © {new Date().getFullYear()} {name}. {t("rights")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {/*
                VoltairStudio's own flame mark for the credit line, in
                --color-accent (the fixed brand gold, not the theme-reactive
                accent-fg text used elsewhere in this footer — this studio's
                own mark stays one constant gold regardless of light/dark
                theme, same as the KF mark in the header does for its own
                brand).

                Inline SVG traced from the studio's own source (Logos/icon.png,
                a flat two-tone icon supplied after an earlier glossy,
                photorealistic version of the same mark proved impossible to
                get right at footer-credit size — see git history on this
                file for that dead end). potrace on a clean colorkey cutout
                of the flat source traced faithfully in one pass, no manual
                simplification needed this time: this path is the actual
                logo, not an approximation of it. Verified legible with the
                spiral detail intact down to 20px, the credit line's real
                render size.
              */}
              <svg
                viewBox="0 0 1024 1024"
                aria-hidden="true"
                className="h-5 w-auto fill-accent"
              >
                <path
                  fillRule="evenodd"
                  d="M 514.598 91.992 C 458.741 118.017, 426.404 152.708, 423.307 189.926 C 421.678 209.505, 431.436 233.392, 449.413 253.828 C 462.535 268.746, 479.507 282.849, 514 307.498 C 570.954 348.199, 596.183 370.313, 616.105 397 C 648.872 440.894, 656.300 489.969, 636.503 531.762 C 620.647 565.234, 594.155 586.656, 558.698 594.678 C 547.232 597.272, 522.916 597.015, 511.560 594.179 C 493.629 589.702, 476.673 579.612, 466.639 567.447 C 445.211 541.469, 445.373 505.435, 467 487.441 C 482.594 474.466, 508.530 475.286, 521.573 489.166 C 532.470 500.761, 534.610 513.859, 527.921 528.004 C 526.287 531.458, 525.117 534.451, 525.321 534.654 C 525.899 535.232, 542.817 530.145, 546.344 528.333 C 570.852 515.740, 584.156 492.906, 584.118 463.500 C 584.072 427.784, 562.432 394.402, 522.055 367.760 C 470.622 333.825, 404.150 329.324, 348.241 355.992 C 284.587 386.355, 243.053 457.319, 243.008 535.789 C 242.990 566.833, 250.205 602.426, 262.878 633.818 L 265.025 639.137 259.640 634.488 C 249.946 626.119, 232.177 604.867, 222.443 590 C 196.798 550.831, 181 501.812, 181 461.408 C 181 456.784, 180.625 453, 180.167 453 C 177.941 453, 172.347 487.112, 170.853 509.795 C 162.921 630.198, 236.930 747.059, 391.292 857.867 C 427.031 883.522, 485.578 920.664, 515.052 936.380 L 520.604 939.340 540.052 928.055 C 714.990 826.543, 820.353 721.753, 855.823 614 C 860.136 600.898, 865.395 578.850, 867.630 564.500 C 870.431 546.514, 870.246 503.775, 867.285 484.953 C 865.194 471.659, 861.107 452.557, 860.487 453.182 C 860.314 453.357, 859.666 460.385, 859.046 468.801 C 854.380 532.147, 828.431 587.840, 782.540 633 L 774.919 640.500 777.602 633.500 C 791.057 598.406, 797.309 566.456, 797.270 533 C 797.206 477.524, 779.280 423.645, 746.339 379.915 C 723.675 349.828, 697.790 327.066, 647.399 292.911 C 572.405 242.079, 544.155 216.163, 527.422 182.844 C 513.448 155.020, 513.250 123.141, 526.868 93.664 C 529.070 88.899, 530.562 85.011, 530.185 85.024 C 529.808 85.037, 522.794 88.173, 514.598 91.992 M 649.364 357.065 C 685.796 401.780, 699.946 441.459, 699.990 499.026 C 700.032 554.797, 676.651 605.646, 636.148 637.865 C 594.139 671.282, 537.108 682.406, 489.340 666.499 C 430.161 646.792, 390.881 587.081, 396.877 525.942 C 400.796 485.989, 419.670 456.239, 451.123 440.439 C 465.062 433.437, 473.756 431.532, 491.500 431.589 C 506.277 431.638, 513.163 432.857, 525.405 437.596 C 528.991 438.984, 524.099 432.318, 516.097 424.914 C 489.559 400.358, 444.609 397.814, 407.524 418.770 C 376.651 436.216, 355.171 466.758, 346.849 505.043 C 343.505 520.431, 343.496 552.386, 346.832 568.954 C 354.119 605.143, 370.313 635.817, 396.375 662.793 C 454.052 722.495, 539.613 737.995, 619.943 703.294 C 727.082 657.013, 772.825 537.034, 721.937 435.778 C 707.460 406.973, 680.697 376.809, 652.820 357.878 L 646.566 353.631 649.364 357.065"
                />
              </svg>
              {t("designedBy", { studio: "VoltairStudio" })}
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
