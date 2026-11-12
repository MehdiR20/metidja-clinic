"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { echo, fieldErrors, loginSchema, registerSchema, type FormState } from "@/lib/validation";
import { routing } from "@/i18n/routing";

const safeLocale = (v: FormDataEntryValue | null) =>
  routing.locales.includes(v as never) ? (v as string) : routing.defaultLocale;

/** Only allow same-site relative redirects (prevents open-redirects via ?next=). */
const safeNext = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.includes("\\") ? s : null;
};

// Same response time whether or not the e-mail exists (mitigates user enumeration)
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword("not-a-real-password"));

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const locale = safeLocale(formData.get("locale"));
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fields: fieldErrors(parsed.error), data: echo(formData) };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !valid) return { error: "invalidCredentials", data: echo(formData) };

  await createSession({ sub: user.id, role: user.role, name: user.name });
  const fallback = user.role === "PATIENT" ? `/${locale}/portal` : `/${locale}/admin`;
  redirect(safeNext(formData.get("next")) ?? fallback);
}

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  const locale = safeLocale(formData.get("locale"));
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fields: fieldErrors(parsed.error), data: echo(formData) };

  const { name, email, phone, password } = parsed.data;
  try {
    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash: await hashPassword(password), role: "PATIENT", consentAt: new Date() },
    });
    await createSession({ sub: user.id, role: user.role, name: user.name });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { fields: { email: "emailTaken" } };
    }
    console.error(e);
    return { error: "generic" };
  }
  redirect(`/${locale}/portal`);
}

export async function logoutAction(formData: FormData) {
  await destroySession();
  redirect(`/${safeLocale(formData.get("locale"))}`);
}
