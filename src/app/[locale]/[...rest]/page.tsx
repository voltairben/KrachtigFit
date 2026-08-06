import { notFound } from "next/navigation";

/**
 * Catches any path under a locale that doesn't match a real route —
 * `/foo`, `/kennismaking/extra`, a stale link from an old sitemap, a typo.
 *
 * Without this, such a path never resolves to anything inside the
 * `[locale]` segment at all (there's no page for it, and no catch-all means
 * nothing here claims it), so Next.js falls back to its own built-in
 * default 404 — completely bypassing this app's branded, translated
 * ../not-found.tsx, which only ever runs for a `notFound()` call thrown
 * from *within* an already-rendering segment. Calling that here, for every
 * otherwise-unmatched path, is what actually makes it run.
 *
 * `[...rest]` (not `[[...rest]]`): must match at least one segment, so it
 * never competes with `[locale]/page.tsx` for the bare "/" route.
 */
export default function CatchAll() {
  notFound();
}
