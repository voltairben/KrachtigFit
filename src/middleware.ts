import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  /**
   * Run on everything except API routes, Next internals, and any path with a
   * file extension (fonts, images, robots.txt, sitemap.xml, og images).
   */
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
