import { z } from "zod";

/**
 * Qualification wizard schema. Shared by the client (progressive validation
 * per step) and the server action (authoritative re-validation).
 *
 * The client copy is a convenience. Everything is validated again server-side
 * because a form post can be made by anything, from anywhere.
 */

export const GOALS = ["fat", "strength", "pain", "habits"] as const;
export const OBSTACLES = ["time", "knowledge", "consistency", "injury"] as const;
export const SITUATIONS = ["online", "hybrid", "personal", "unsure"] as const;
export const AVAILABILITY = ["low", "mid", "high"] as const;

/**
 * Bump when the consent wording changes. Stored with every submission so an
 * old consent record can be tied back to the exact text that was agreed to —
 * the burden of demonstrating consent sits with the controller.
 */
export const CONSENT_VERSION = "2026-08-03";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const contactSchema = z.object({
  goal: z.enum(GOALS),
  obstacle: z.enum(OBSTACLES),
  situation: z.enum(SITUATIONS),
  availability: z.enum(AVAILABILITY),

  name: z.string().trim().min(2, "required").max(100),
  email: z.string().trim().email("email").max(200),
  phone: optionalText(40),
  message: optionalText(2000),

  /**
   * Must be true — an unticked box fails validation rather than defaulting.
   * Separate from marketing: bundling a service enquiry with newsletter
   * signup is not freely given consent.
   *
   * Modelled as boolean + refine rather than z.literal(true) so the inferred
   * type stays `boolean` and the form can legitimately default it to false.
   */
  contactConsent: z.boolean().refine((v) => v === true, { message: "consent" }),

  /** Independent and genuinely optional. Never required to get a reply. */
  marketingConsent: z.boolean().default(false),

  /**
   * Honeypot. Hidden from humans, and named plausibly enough that naive bots
   * fill it. Any non-empty value means the submission is discarded.
   */
  website: z.string().max(0).optional(),

  turnstileToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Fields collected per wizard step, used to validate before advancing. */
export const STEP_FIELDS = [
  ["goal"],
  ["obstacle"],
  ["situation"],
  ["availability"],
  ["name", "email", "phone", "message", "contactConsent"],
] as const satisfies ReadonlyArray<ReadonlyArray<keyof ContactInput>>;

export const TOTAL_STEPS = STEP_FIELDS.length;
