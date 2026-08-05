"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Script from "next/script";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { duration, easeOutExpo } from "@/components/motion/tokens";
import { submitContact } from "@/lib/actions/contact";
import {
  AVAILABILITY,
  GOALS,
  OBSTACLES,
  SITUATIONS,
  STEP_FIELDS,
  TOTAL_STEPS,
  contactSchema,
  type ContactInput,
} from "@/lib/schemas/contact";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Question steps, in order. Step 5 collects contact details. */
const QUESTIONS = [
  { name: "goal", options: GOALS },
  { name: "obstacle", options: OBSTACLES },
  { name: "situation", options: SITUATIONS },
  { name: "availability", options: AVAILABILITY },
] as const;

/**
 * Multi-step qualification.
 *
 * Split into steps rather than one long form because multi-step consistently
 * converts several times better on enquiry forms, and because each answer
 * gives Sander context before the call rather than after it.
 *
 * It also replaces the prototype's entire conversion path, which was six CTAs
 * reading "Book Free Assessment" all pointing at an email capture for a PDF,
 * behind `onsubmit="alert(...); return false;"`.
 */
export function Wizard() {
  const t = useTranslations("wizard");
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [token, setToken] = useState<string>();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { marketingConsent: false, contactConsent: false, website: "" },
  });

  const isLast = step === TOTAL_STEPS - 1;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  async function next() {
    const fields = STEP_FIELDS[step];
    if (!fields) return;
    const valid = await trigger(fields as never, { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  async function onSubmit(values: ContactInput) {
    const res = await submitContact({ ...values, turnstileToken: token });
    if (res.ok) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error(t("error.generic"));
    }
  }

  const stepTransition = {
    duration: shouldReduceMotion ? duration.fast : duration.slow,
    ease: easeOutExpo,
  };

  if (done) {
    return (
      <Container className="py-32">
        <div className="max-w-[46ch]">
          <div className="grid size-14 place-items-center rounded-full bg-accent">
            <Check className="size-7 text-ink" aria-hidden="true" />
          </div>
          <h1 className="font-expanded mt-8 text-display-lg font-extrabold">
            {t("success.title")}
          </h1>
          <p className="mt-6 text-body-lg text-on-ink-2">{t("success.body")}</p>
          <Button asChild variant="secondary" size="lg" className="mt-10">
            <a
              href={whatsappUrl(t("whatsappPrefill"))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {t("whatsappCta")}
            </a>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-32">
      {SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}

      <div className="max-w-[52ch]">
        <p className="eyebrow text-accent-fg">{t("eyebrow")}</p>
        <h1 className="font-expanded mt-6 text-display-lg font-extrabold text-balance">
          {t("headline")}
        </h1>
        <p className="mt-6 text-body-lg text-on-ink-2">{t("intro")}</p>
      </div>

      {/* Progress. aria-live so the step change is announced, not just seen. */}
      <div className="mt-14 max-w-2xl">
        <div className="flex items-center justify-between text-caption text-on-ink-3">
          <span aria-live="polite">
            {t("stepOf", { current: step + 1, total: TOTAL_STEPS })}
          </span>
        </div>
        <div
          className="mt-3 h-px w-full bg-border-ink"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
        >
          <motion.div
            className="h-full origin-left bg-accent"
            initial={false}
            animate={{ scaleX: progress / 100 }}
            transition={stepTransition}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-12 max-w-2xl"
        noValidate
      >
        {/* Honeypot. Positioned off-screen rather than display:none, which
            naive bots detect, and removed from both tab order and AT. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            transition={stepTransition}
          >
            {step < QUESTIONS.length ? (
              <ChoiceStep
                question={QUESTIONS[step]!}
                register={register}
                error={
                  errors[QUESTIONS[step]!.name as keyof ContactInput]
                    ? t("error.required")
                    : undefined
                }
              />
            ) : (
              <DetailsStep
                register={register}
                errors={errors}
                watch={watch}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {SITE_KEY && isLast && (
          <div
            className="cf-turnstile mt-8"
            data-sitekey={SITE_KEY}
            data-callback="onTurnstileSuccess"
            ref={(el) => {
              if (!el) return;
              // Cloudflare invokes a global by name; bridge it into state.
              (window as unknown as Record<string, unknown>)[
                "onTurnstileSuccess"
              ] = (tk: string) => setToken(tk);
            }}
          />
        )}

        <div className="mt-12 flex items-center gap-4">
          {step > 0 && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t("back")}
            </Button>
          )}

          {isLast ? (
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={next}>
              {t("next")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </form>

      <div className="mt-16 border-t border-border-ink pt-8">
        <p className="text-body-sm text-on-ink-2">{t("whatsapp")}</p>
        <a
          href={whatsappUrl(t("whatsappPrefill"))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-body-sm font-semibold text-accent-fg"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {t("whatsappCta")}
        </a>
      </div>
    </Container>
  );
}

/* -------------------------------------------------------------------------- */

type RegisterFn = ReturnType<typeof useForm<ContactInput>>["register"];

/**
 * Native radios inside a fieldset/legend. Screen readers announce the question
 * as the group label and each option's position within it — behaviour that a
 * div-with-click-handler cannot reproduce, and which keyboard users get for
 * free (arrow keys move within the group).
 */
function ChoiceStep({
  question,
  register,
  error,
}: {
  question: (typeof QUESTIONS)[number];
  register: RegisterFn;
  error?: string;
}) {
  const t = useTranslations(`wizard.${question.name}`);

  return (
    <fieldset>
      <legend className="font-expanded text-display-md font-extrabold text-balance">
        {t("label")}
      </legend>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {question.options.map((opt) => (
          <label
            key={opt}
            className={cn(
              "group relative flex cursor-pointer items-center gap-3 border border-border-ink bg-surface-1 p-5",
              "transition-colors duration-[var(--duration-fast)]",
              "hover:border-accent/50",
              "has-[:checked]:border-accent has-[:checked]:bg-accent/10",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-fg",
            )}
          >
            <input
              type="radio"
              value={opt}
              className="sr-only"
              {...register(question.name)}
            />
            <span
              aria-hidden="true"
              className="grid size-5 shrink-0 place-items-center rounded-full border border-on-ink-3 group-has-[:checked]:border-accent group-has-[:checked]:bg-accent"
            >
              <Check className="size-3 text-ink opacity-0 group-has-[:checked]:opacity-100" />
            </span>
            <span className="text-body-sm">{t(`options.${opt}`)}</span>
          </label>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-body-sm text-accent-fg">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */

function DetailsStep({
  register,
  errors,
  watch,
}: {
  register: RegisterFn;
  errors: ReturnType<typeof useForm<ContactInput>>["formState"]["errors"];
  watch: ReturnType<typeof useForm<ContactInput>>["watch"];
}) {
  const t = useTranslations("wizard");
  void watch;

  const field =
    "w-full border border-border-ink bg-surface-1 px-4 py-3 text-body-sm text-on-ink placeholder:text-on-ink-3 focus-visible:border-accent";

  return (
    <fieldset>
      <legend className="font-expanded text-display-md font-extrabold text-balance">
        {t("details.label")}
      </legend>

      <div className="mt-8 grid gap-5">
        <div>
          <label htmlFor="name" className="text-body-sm text-on-ink-2">
            {t("details.name")}
          </label>
          <input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={cn(field, "mt-2")}
            {...register("name")}
          />
          {errors.name && (
            <p role="alert" className="mt-2 text-caption text-accent-fg">
              {t("error.required")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-body-sm text-on-ink-2">
            {t("details.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={cn(field, "mt-2")}
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="mt-2 text-caption text-accent-fg">
              {t("error.email")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="text-body-sm text-on-ink-2">
            {t("details.phone")}{" "}
            <span className="text-on-ink-3">({t("details.phoneOptional")})</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={cn(field, "mt-2")}
            {...register("phone")}
          />
        </div>

        <div>
          <label htmlFor="message" className="text-body-sm text-on-ink-2">
            {t("details.message")}{" "}
            <span className="text-on-ink-3">
              ({t("details.messageOptional")})
            </span>
          </label>
          <textarea
            id="message"
            rows={4}
            className={cn(field, "mt-2 resize-y")}
            {...register("message")}
          />
        </div>
      </div>

      {/*
        Two independent, unticked consents. Delivering a service enquiry while
        silently subscribing someone to marketing is not freely given consent,
        so the second box is genuinely optional and says so.
      */}
      <div className="mt-8 grid gap-4 border-t border-border-ink pt-8">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            aria-invalid={!!errors.contactConsent}
            className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
            {...register("contactConsent")}
          />
          <span className="text-body-sm text-on-ink-2">
            {t("consent.contact")}
          </span>
        </label>
        {errors.contactConsent && (
          <p role="alert" className="text-caption text-accent-fg">
            {t("error.consent")}
          </p>
        )}

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
            {...register("marketingConsent")}
          />
          <span className="text-body-sm text-on-ink-2">
            {t("consent.marketing")}
          </span>
        </label>

        <p className="text-caption text-on-ink-3">
          {t("consent.privacy")}{" "}
          <Link
            href="/privacybeleid"
            className="underline underline-offset-4 hover:text-on-ink"
          >
            {t("consent.privacyLinkText")}
          </Link>
        </p>
      </div>
    </fieldset>
  );
}
