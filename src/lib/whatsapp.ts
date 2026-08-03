import { siteConfig } from "@/site.config";

/**
 * Click-to-chat link with a prefilled message.
 *
 * wa.me is a redirector, not an embed — no script runs on our page and no
 * cookie is set, so it needs no consent gate. That matters: a consent banner
 * sitting between a visitor and the primary contact route is a measurable
 * conversion cost.
 */
export function whatsappUrl(prefill?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return prefill ? `${base}?text=${encodeURIComponent(prefill)}` : base;
}
