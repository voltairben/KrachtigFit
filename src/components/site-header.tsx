"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Link, usePathname, routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "about", key: "about" },
  { id: "method", key: "method" },
  { id: "programs", key: "programs" },
  { id: "pricing", key: "pricing" },
  { id: "faq", key: "faq" },
] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    // Passive: this listener must never be able to block scrolling, which is
    // a direct INP risk on the scroll-heavy sections below.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-canvas="ink"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        "duration-[var(--duration-base)] ease-[var(--ease-out-quart)]",
        scrolled
          ? "border-b border-border-ink bg-ink/85 backdrop-blur-lg"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        {/*
          KF mark + wordmark, side by side. The mark is a crop straight from
          the client's real logo artwork (public/kf-mark.png) rather than a
          redrawn icon, with its own flat ink-coloured backing that matches
          --color-ink exactly — so it sits on the header with no visible seam
          whether the header is transparent (top of page) or blurred (scrolled).
          Explicit width/height keep this CLS-free and eligible for priority
          loading, since it renders in the very first viewport on every page.
        */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/kf-mark.png"
            alt=""
            width={600}
            height={348}
            priority
            className="h-8 w-auto sm:h-9"
          />
          <span className="font-expanded text-body-lg font-extrabold tracking-tight">
            Krachtig<span className="text-accent">Fit</span>
          </span>
        </Link>

        <nav
          aria-label={t("method")}
          className="hidden items-center gap-8 lg:flex"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-body-sm text-on-ink-2 transition-colors hover:text-on-ink"
            >
              {t(s.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher current={locale} pathname={pathname} />

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/kennismaking">{t("cta")}</Link>
          </Button>

          {/*
            Radix Dialog rather than a hand-rolled toggle. It provides the
            focus trap, Escape-to-close, click-outside and inert background
            that the prototype's menu had none of — its menu also stayed open
            after tapping a link, covering the section it had just scrolled to.
          */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={tA11y("openMenu")}
                className="grid size-11 place-items-center rounded-sm border border-border-ink lg:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm" />
              <Dialog.Content
                data-canvas="ink"
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border-ink bg-ink p-6"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="eyebrow text-on-ink-3">
                    {t("method")}
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label={tA11y("closeMenu")}
                    className="grid size-11 place-items-center rounded-sm border border-border-ink"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </Dialog.Close>
                </div>

                <nav className="mt-10 flex flex-col gap-1">
                  {SECTIONS.map((s) => (
                    // Closing on activation is the whole point — an anchor
                    // that scrolls behind an open panel is useless.
                    <Dialog.Close asChild key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="border-b border-border-ink py-4 font-expanded text-display-md font-extrabold"
                      >
                        {t(s.key)}
                      </a>
                    </Dialog.Close>
                  ))}
                </nav>

                <Dialog.Close asChild>
                  <Button asChild size="lg" full className="mt-auto">
                    <Link href="/kennismaking">{t("cta")}</Link>
                  </Button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </Container>
    </header>
  );
}

/**
 * Links to the same page in the other locale, rather than toggling text
 * in place. The prototype swapped textContent client-side, which meant
 * only one language could ever be indexed — and it destroyed any markup
 * inside a translated node.
 */
function LocaleSwitcher({
  current,
  pathname,
}: {
  current: Locale;
  pathname: string;
}) {
  const tA11y = useTranslations("a11y");

  return (
    <div
      className="flex items-center rounded-sm border border-border-ink"
      role="group"
      aria-label={tA11y("switchLanguage")}
    >
      {routing.locales.map((l) => {
        const isActive = l === current;
        return (
          <Link
            key={l}
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            href={pathname as any}
            locale={l}
            hrefLang={l}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "px-2.5 py-1.5 text-caption font-semibold uppercase tracking-[0.08em] transition-colors",
              isActive
                ? "bg-accent text-ink"
                : "text-on-ink-3 hover:text-on-ink",
            )}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
