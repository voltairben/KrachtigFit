"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import {
  contactSchema,
  CONSENT_VERSION,
  type ContactInput,
} from "@/lib/schemas/contact";
import { siteConfig } from "@/site.config";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: "validation" | "rate_limit" | "captcha" | "send" };

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                              */

/**
 * Sliding window, in memory.
 *
 * LIMITATION: state lives per serverless instance, so under horizontal scaling
 * the effective limit is (LIMIT × instances). It raises the cost of a naive
 * flood, which together with the honeypot and Turnstile is proportionate for a
 * contact form. Move to Upstash/Vercel KV if this ever needs to be a real
 * guarantee.
 */
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > LIMIT;
}

/* -------------------------------------------------------------------------- */
/* Turnstile                                                                  */

/**
 * Cloudflare Turnstile rather than reCAPTCHA: no cookies, no cross-site
 * profiling, so it needs no consent banner in front of the form.
 *
 * If no secret is configured the check is skipped, which keeps local
 * development workable. In production the absence of a secret is a
 * misconfiguration, so it fails closed there.
 */
async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */

function line(label: string, value: string) {
  return `${label.padEnd(18)}: ${value}`;
}

export async function submitContact(
  raw: unknown,
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "validation" };

  const data: ContactInput = parsed.data;

  // Honeypot: a human never sees this field, so anything in it is a bot.
  // Reported as success so the bot has no signal to adapt against.
  if (data.website) return { ok: true };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) return { ok: false, error: "rate_limit" };
  if (!(await verifyTurnstile(data.turnstileToken))) {
    return { ok: false, error: "captcha" };
  }

  const submittedAt = new Date().toISOString();

  /**
   * The email doubles as the consent record: timestamp, IP, consent version
   * and the consent decision travel with the enquiry, so what was agreed to
   * and when can be evidenced later.
   *
   * This is the minimum viable record. Once there is a database, persist the
   * same fields there — an inbox is not a durable audit log.
   */
  const body = [
    line("Doel", data.goal),
    line("Obstakel", data.obstacle),
    line("Voorkeur", data.situation),
    line("Tijd per week", data.availability),
    "",
    line("Naam", data.name),
    line("E-mail", data.email),
    line("Telefoon", data.phone),
    "",
    "Bericht:",
    data.message || "—",
    "",
    "─".repeat(52),
    "TOESTEMMINGSREGISTRATIE",
    line("Tijdstip", submittedAt),
    line("IP", ip),
    line("Versie", CONSENT_VERSION),
    line("Contact", data.contactConsent ? "JA" : "NEE"),
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? siteConfig.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL missing");
      return { ok: false, error: "send" };
    }
    // Dev without credentials: log so the flow stays testable end to end.
    console.info("[contact] no mail credentials, would have sent:\n" + body);
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Kennismaking — ${data.name} (${data.situation})`,
      text: body,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return { ok: false, error: "send" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] send failed", err);
    return { ok: false, error: "send" };
  }
}
