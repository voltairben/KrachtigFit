import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/routing";

/**
 * Server Component, not client: this used to import `useTranslations` from
 * "next-intl" (the client hook) with no "use client" directive — a Server
 * Component silently calling a client-only hook. That alone didn't explain
 * why the branded page never appeared (see the catch-all route two
 * directories up for the actual reason genuinely unmatched URLs never
 * reached this file at all), but it needed fixing regardless: even once
 * reachable, it would have failed to render. `getTranslations` (no explicit
 * locale) reads the current request's locale from context the way
 * [locale]/layout.tsx already established it — not-found.tsx boundaries
 * don't reliably receive a `params` prop the way an ordinary page.tsx does,
 * so this can't take the same `{ params }: { params: Promise<...> } `
 * signature every other page in this app uses.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section
      data-canvas="ink"
      className="flex min-h-[70svh] items-center py-32"
    >
      <Container>
        <p className="eyebrow text-accent-fg">404</p>
        <h1 className="font-expanded mt-6 max-w-[16ch] text-display-xl font-extrabold text-balance">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-[48ch] text-body-lg text-on-ink-2">
          {t("body")}
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/">{t("cta")}</Link>
        </Button>
      </Container>
    </section>
  );
}
