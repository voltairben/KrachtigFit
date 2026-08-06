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
 * canvases strictly alternate ink/paper/ink/paper for the rest of the page,
 * which is the high-contrast device carrying the art direction: Method
 * paper, Programs ink, Reviews paper, Instagram ink, Faq paper, Footer ink.
 *
 * That alternation broke twice in this file's history and got fixed two
 * different ways. First: Instagram/Reviews landed on the same canvas after
 * an edit, fixed by flipping every section from Instagram onward by one
 * step (commit a01a800). Second: deleting the old Programs section left
 * Method and the renamed Pricing→Programs both on paper, "fixed" by giving
 * each its own bespoke background colour instead of touching the
 * alternation — which worked, but turned one two-colour system into four
 * close-but-different tones for no real reason. That detour is reverted:
 * every section here just declares data-canvas="ink" or "paper" again, no
 * per-section background override, and the assignments above are what
 * actually keeps neighbours distinct.
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
