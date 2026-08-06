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

          <p className="mt-6 text-caption text-on-ink-3">
            © {new Date().getFullYear()} {name}. {t("rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
