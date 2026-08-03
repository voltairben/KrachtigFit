import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { LegalPage } from "@/components/legal-page";
import { termsDoc } from "@/lib/legal-content";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = termsDoc(locale);
  return {
    title: doc.title,
    description: doc.intro,
    alternates: buildAlternates(locale, "/algemene-voorwaarden"),
    robots: { index: true, follow: false },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc={termsDoc(locale)} />;
}
