import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Wizard } from "@/components/sections/wizard";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wizard" });

  return {
    title: t("headline"),
    description: t("intro"),
    alternates: buildAlternates(locale, "/kennismaking"),
  };
}

export default async function KennismakingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div data-canvas="ink">
      <Wizard />
    </div>
  );
}
