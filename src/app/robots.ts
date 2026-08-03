import type { MetadataRoute } from "next";
import { siteConfig, isPlaceholderBuild } from "@/site.config";

const origin = siteConfig.url.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  // Belt and braces alongside the noindex meta tag: a build that still holds
  // placeholder legal identity should not be crawled at all.
  if (isPlaceholderBuild) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
