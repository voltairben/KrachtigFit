import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Method } from "@/components/sections/method";
import { Programs } from "@/components/sections/programs";
import { Reviews } from "@/components/sections/reviews";
import { InstagramSection } from "@/components/sections/instagram";
import { Faq } from "@/components/sections/faq";

/**
 * Section order inverts the prototype, which asked for an email address in
 * section two — before it had established anything at all. Proof comes before
 * the ask, and the primary CTA points at a real qualification flow rather than
 * at a PDF download mislabelled "Book Free Assessment".
 *
 * About sits directly after Hero, sharing its ink canvas, so the personal
 * introduction is still the first thing a visitor scrolls into — before
 * canvases start alternating for the rest of the page, which is the
 * high-contrast device carrying the art direction.
 *
 * Method and Programs (renamed from Pricing) sit adjacent here and were both
 * "paper" at one point — the same "two same-canvas sections in a row" defect
 * the Instagram/Reviews fix (commit a01a800) addressed elsewhere on this
 * page. Resolved without touching Reviews/Instagram/Faq: rather than the
 * binary ink/paper swap those two sections use, Method and Programs each got
 * their own distinct background token (--color-linen, --color-gold — see
 * globals.css) layered on top of the same paper canvas, so this file's
 * section order and every other section's colour stayed untouched.
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
      <Reviews />
      <InstagramSection />
      <Faq />
    </>
  );
}
