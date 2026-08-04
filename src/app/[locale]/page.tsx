import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
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
 * About sits directly after Hero, sharing its ink canvas, so the personal
 * introduction is still the first thing a visitor scrolls into — before
 * canvases start alternating ink → paper → ink → paper for the rest of the
 * page, which is the high-contrast device carrying the art direction.
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
      <About />
      <Method />
      <Programs />
      <Pricing />
      <Reviews />
      <Faq />
    </>
  );
}
