import { z } from "zod";
import { normalizeDzPhone } from "./format";

// Error messages are translation keys (resolved client-side under the "errors" namespace)
export const phoneSchema = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const n = normalizeDzPhone(v);
    if (!n) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "phone" });
      return z.NEVER;
    }
    return n;
  });

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email("email")
  .max(160)
  .optional()
  .or(z.literal("").transform(() => undefined));

const consent = z.literal("on", { errorMap: () => ({ message: "consent" }) });

export const bookingSchema = z.object({
  departmentId: z.string().min(1, "required"),
  doctorId: z.string().min(1, "required"),
  serviceId: z.string().trim().optional().transform((v) => v || undefined),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "required"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "required"),
  type: z.enum(["IN_PERSON", "TELEHEALTH"]).default("IN_PERSON"),
  channel: z.enum(["SMS", "WHATSAPP"]).default("SMS"),
  patientName: z.string().trim().min(3, "name").max(120),
  patientPhone: phoneSchema,
  patientEmail: optionalEmail,
  reason: z.string().trim().max(500).optional(),
  consent,
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "name").max(120),
    email: z.string().trim().toLowerCase().email("email").max(160),
    phone: phoneSchema,
    password: z
      .string()
      .min(8, "password")
      .max(128)
      .regex(/[A-Za-z]/, "password")
      .regex(/\d/, "password"),
    confirm: z.string(),
    consent,
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "confirm" });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("email"),
  password: z.string().min(1, "required"),
});

export const inquirySchema = z.object({
  type: z.enum(["GENERAL", "TELEHEALTH"]).default("GENERAL"),
  name: z.string().trim().min(3, "name").max(120),
  phone: phoneSchema,
  email: optionalEmail,
  subject: z.string().trim().min(3, "required").max(160),
  message: z.string().trim().min(10, "message").max(2000),
  consent,
});

const localizedText = (min = 1) =>
  z.object({
    fr: z.string().trim().min(min, "required"),
    ar: z.string().trim().min(min, "required"),
    en: z.string().trim().min(min, "required"),
  });

export const serviceSchema = z.object({
  departmentId: z.string().min(1, "required"),
  name: localizedText(),
  priceDzd: z.coerce.number().int("price").min(0, "price").max(10_000_000, "price"),
  durationMin: z.coerce.number().int().min(5).max(600),
  isActive: z.coerce.boolean(),
});

const hoursLine = /^[0-6]\s+\d{2}:\d{2}-\d{2}:\d{2}$/;
export const doctorSchema = z.object({
  name: z.string().trim().min(3, "name").max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "slug")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  departmentId: z.string().min(1, "required"),
  title: localizedText(),
  bio: localizedText(),
  qualifications: localizedText(0),
  languages: z.array(z.enum(["fr", "ar", "en", "kab"])).min(1, "required"),
  hours: z
    .string()
    .trim()
    .refine((s) => s.split(/\r?\n/).filter(Boolean).every((l) => hoursLine.test(l.trim())), "hours"),
  consultationFee: z.coerce.number().int().min(0, "price"),
  slotMinutes: z.coerce.number().int().min(10).max(120),
  acceptsTelehealth: z.coerce.boolean(),
  isActive: z.coerce.boolean(),
});

/** Flatten Zod errors to { field: messageKey } for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export type FormState = {
  ok?: boolean;
  error?: string; // translation key under "errors"
  fields?: Record<string, string>;
  data?: Record<string, unknown>;
};

/** Echo submitted text fields back to the form (never passwords) so inputs survive a failed validation. */
export function echo(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string" && !/password|confirm|^\$ACTION/i.test(k)) out[k] = v;
  }
  return out;
}
