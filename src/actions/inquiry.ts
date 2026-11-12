"use server";

import { prisma } from "@/lib/prisma";
import { echo, fieldErrors, inquirySchema, type FormState } from "@/lib/validation";

export async function createInquiryAction(_: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: bots fill hidden fields, humans don't
  if (formData.get("website")) return { ok: true };

  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fields: fieldErrors(parsed.error), data: echo(formData) };

  const { consent: _consent, ...data } = parsed.data;
  try {
    await prisma.inquiry.create({ data });
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { error: "generic" };
  }
}
