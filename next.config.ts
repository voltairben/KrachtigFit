import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { assertLaunchReady } from "./src/site.config";

// Runs at build time, before anything can reach a visitor. Production only —
// `next dev` stays usable while placeholders are still being filled in.
if (process.env.NODE_ENV === "production") {
  assertLaunchReady();
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // No remotePatterns: all imagery is self-hosted. The prototype hotlinked
  // Unsplash and captioned it as a real named person.

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      // No /fonts/:path* cache rule: Archivo is loaded via next/font/google,
      // which self-hosts it through Next's own build pipeline (served from
      // its optimized asset path, not a public/fonts/ directory this app
      // never had) and already sets its own long-lived immutable cache
      // headers on those files. A rule here matched nothing and cached
      // nothing — removed rather than pointed at the real path, since
      // next/font's own headers already do this correctly.
    ];
  },
};

export default withNextIntl(nextConfig);
