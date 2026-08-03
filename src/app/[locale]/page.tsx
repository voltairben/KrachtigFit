import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

import { Hero } from "@/components/sections/hero";
import { Method } from "@/components/sections/method";
import { Programs } from "@/components/sections/programs";
import { Pricing } from "@/components/sections/pricing";
import { Reviews } from "@/components/sections/reviews";
import { Faq } from "@/components/sections/faq";

/**
 * Section order inverts the prototype, which asked for an email address in
 * section two — before it had established anything at all. Proof comes before
 * the ask, and the primary CTA points at a real qualification flow rather than
 * at a PDF download mislabelled "Book Free Assessment".
 *
 * Canvases alternate ink → paper → ink → paper, which is the high-contrast
 * device carrying the art direction.
 *
 * Still to wire: Pricing (blocked on VAT rates per product line) and the
 * closing CTA.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Method />
      <Programs />
      <Pricing />
      <Reviews />
      <Faq />
    </>
  );
}
