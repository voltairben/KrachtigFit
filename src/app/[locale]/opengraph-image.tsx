import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export const alt = "KrachtigFit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The prototype had no OpenGraph tags at all, so every link shared to WhatsApp
 * or Instagram — the two channels this business actually uses — previewed
 * blank. Generated per locale so a Dutch link previews Dutch.
 */
export default async function Image({
  params,
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "hero",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0C",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#FF4D2E",
            fontWeight: 700,
          }}
        >
          {t("eyebrow")}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: "#F4F2ED",
            fontWeight: 800,
            maxWidth: 900,
          }}
        >
          {t("headline")}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 64, height: 6, background: "#FF4D2E" }} />
          <div style={{ display: "flex", fontSize: 30, color: "#A3A3A8" }}>
            KrachtigFit — Herten
          </div>
        </div>
      </div>
    ),
    size,
  );
}
