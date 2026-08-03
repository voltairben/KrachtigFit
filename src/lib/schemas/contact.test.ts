import { test } from "node:test";
import assert from "node:assert/strict";
import { contactSchema, STEP_FIELDS, TOTAL_STEPS } from "./contact.ts";

const valid = {
  goal: "strength",
  obstacle: "time",
  situation: "hybrid",
  availability: "mid",
  name: "Sander Test",
  email: "test@example.com",
  phone: "",
  message: "",
  contactConsent: true,
  marketingConsent: false,
  website: "",
};

test("accepts a complete valid submission", () => {
  assert.equal(contactSchema.safeParse(valid).success, true);
});

test("REJECTS an unticked contact consent", () => {
  // The core compliance behaviour: consent must be affirmative. An unticked
  // box must fail validation rather than defaulting to true.
  const r = contactSchema.safeParse({ ...valid, contactConsent: false });
  assert.equal(r.success, false);
});

test("marketing consent is independent and optional", () => {
  // Contactable without opting into marketing — bundling the two is not
  // freely given consent.
  assert.equal(
    contactSchema.safeParse({ ...valid, marketingConsent: false }).success,
    true,
  );
  assert.equal(
    contactSchema.safeParse({ ...valid, marketingConsent: true }).success,
    true,
  );
});

test("marketing consent defaults to false, never true", () => {
  const { marketingConsent, ...withoutMarketing } = valid;
  void marketingConsent;
  const r = contactSchema.safeParse(withoutMarketing);
  assert.equal(r.success, true);
  if (r.success) assert.equal(r.data.marketingConsent, false);
});

test("rejects malformed email", () => {
  assert.equal(
    contactSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    false,
  );
});

test("rejects an out-of-range enum value", () => {
  assert.equal(
    contactSchema.safeParse({ ...valid, goal: "something-else" }).success,
    false,
  );
});

test("honeypot: any content fails validation", () => {
  const r = contactSchema.safeParse({ ...valid, website: "http://spam.example" });
  assert.equal(r.success, false);
});

test("trims whitespace-padded input", () => {
  const r = contactSchema.safeParse({
    ...valid,
    name: "  Sander Test  ",
    email: "  test@example.com  ",
  });
  assert.equal(r.success, true);
  if (r.success) {
    assert.equal(r.data.name, "Sander Test");
    assert.equal(r.data.email, "test@example.com");
  }
});

test("rejects a name below the minimum length", () => {
  assert.equal(contactSchema.safeParse({ ...valid, name: "S" }).success, false);
});

test("step field map covers every required field exactly once", () => {
  const flat = STEP_FIELDS.flat();
  assert.equal(new Set(flat).size, flat.length, "no field appears twice");
  assert.equal(STEP_FIELDS.length, TOTAL_STEPS);
  for (const f of ["goal", "obstacle", "situation", "availability", "contactConsent"]) {
    assert.ok(flat.includes(f as never), `${f} is validated by some step`);
  }
});
