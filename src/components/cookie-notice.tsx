"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const DISMISSED_KEY = "kf-cookie-notice-dismissed";

/**
 * A notice, not a consent gate. The site's own cookiebeleid already commits
 * to "no analytics, advertising or social media scripts run on this site by
 * default" — nothing here needs a visitor's permission to load, so there is
 * no accept/reject choice to offer, only an FYI with a link to the real
 * policy. See instagram.tsx for the one place a third-party script exists
 * on this site at all, and why it's deliberately click-gated rather than
 * covered by this notice.
 *
 * Renders nothing until mounted and only if not previously dismissed —
 * same shape as ThemeToggle's post-mount localStorage read in
 * site-header.tsx, and for the same reason: the server has no way to know
 * a returning visitor already dismissed this, so guessing either way on
 * the server risks a hydration mismatch. A brief absence on first paint is
 * fine for a low-priority notice bar; it isn't for the theme colour that
 * component guards.
 */
export function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISSED_KEY) !== "1") setVisible(true);
    } catch {
      // Private-browsing / storage-disabled: show it every visit rather
      // than never — same trade-off ThemeToggle makes on write failures.
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Won't persist, but the visitor still gets it out of the way now.
    }
  }

  if (!visible) return null;

  return (
    <div
      data-canvas="ink"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-ink bg-surface-2 text-on-ink"
    >
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <p className="text-body-sm text-on-ink-2">
          {t("text")}{" "}
          <Link
            href="/cookiebeleid"
            className="font-semibold text-on-ink underline underline-offset-4"
          >
            {t("policyLink")}
          </Link>
        </p>
        <Button onClick={dismiss} variant="secondary" size="sm">
          {t("dismiss")}
        </Button>
      </Container>
    </div>
  );
}
