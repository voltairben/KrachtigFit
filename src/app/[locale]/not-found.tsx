import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section
      data-canvas="ink"
      className="flex min-h-[70svh] items-center py-32"
    >
      <Container>
        <p className="eyebrow text-accent">404</p>
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
