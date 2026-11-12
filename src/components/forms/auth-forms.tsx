"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LogIn, UserPlus } from "lucide-react";
import { loginAction, registerAction } from "@/actions/auth";
import type { FormState } from "@/lib/validation";
import { Link } from "@/i18n/navigation";
import { Checkbox, Field, FormAlert, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, action] = useActionState<FormState, FormData>(loginAction, {});
  const f = state.fields ?? {};
  const v = (state.data ?? {}) as Record<string, string>;

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {next && <input type="hidden" name="next" value={next} />}
      <FormAlert code={state.error} />
      <Field label={t("email")} name="email" error={f.email}>
        <Input name="email" type="email" autoComplete="email" dir="ltr" defaultValue={v.email} required error={f.email} />
      </Field>
      <Field label={t("password")} name="password" error={f.password}>
        <Input name="password" type="password" autoComplete="current-password" dir="ltr" required error={f.password} />
      </Field>
      <SubmitButton size="lg" className="w-full">
        <LogIn className="flip-rtl size-4" aria-hidden /> {t("submitLogin")}
      </SubmitButton>
      <p className="text-center text-sm text-muted">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-bold text-brand-600 hover:underline">
          {t("registerTitle")}
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, action] = useActionState<FormState, FormData>(registerAction, {});
  const f = state.fields ?? {};
  const v = (state.data ?? {}) as Record<string, string>;

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <FormAlert code={state.error} />
      <Field label={t("name")} name="name" error={f.name}>
        <Input name="name" autoComplete="name" defaultValue={v.name} required error={f.name} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("email")} name="email" error={f.email}>
          <Input name="email" type="email" autoComplete="email" dir="ltr" defaultValue={v.email} required error={f.email} />
        </Field>
        <Field label={t("phone")} name="phone" error={f.phone}>
          <Input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" defaultValue={v.phone} required error={f.phone} />
        </Field>
      </div>
      <Field label={t("password")} name="password" error={f.password} hint={t("passwordHint")}>
        <Input name="password" type="password" autoComplete="new-password" dir="ltr" required minLength={8} error={f.password} />
      </Field>
      <Field label={t("confirm")} name="confirm" error={f.confirm}>
        <Input name="confirm" type="password" autoComplete="new-password" dir="ltr" required error={f.confirm} />
      </Field>
      <Checkbox
        name="consent"
        error={f.consent}
        label={
          <>
            {t("consent")}{" "}
            <Link href="/privacy" target="_blank" className="font-semibold text-brand-600 underline">
              ↗
            </Link>
          </>
        }
      />
      <SubmitButton size="lg" className="w-full">
        <UserPlus className="size-4" aria-hidden /> {t("submitRegister")}
      </SubmitButton>
      <p className="text-center text-sm text-muted">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-bold text-brand-600 hover:underline">
          {t("loginTitle")}
        </Link>
      </p>
    </form>
  );
}
