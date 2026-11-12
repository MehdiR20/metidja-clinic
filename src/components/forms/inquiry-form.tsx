"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Send } from "lucide-react";
import { createInquiryAction } from "@/actions/inquiry";
import type { FormState } from "@/lib/validation";
import { Checkbox, Field, FormAlert, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function InquiryForm({ type = "GENERAL", defaultSubject }: { type?: "GENERAL" | "TELEHEALTH"; defaultSubject?: string }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, action] = useActionState<FormState, FormData>(createInquiryAction, {});
  const f = state.fields ?? {};

  if (state.ok) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-6 text-emerald-800">
        <CheckCircle2 className="size-6 shrink-0" aria-hidden />
        <p>{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot (hidden from humans) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <FormAlert code={state.error} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} name="name" error={f.name}>
          <Input name="name" autoComplete="name" required error={f.name} />
        </Field>
        <Field label={t("phone")} name="phone" error={f.phone}>
          <Input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required error={f.phone} />
        </Field>
      </div>
      <Field label={t("email")} name="email" error={f.email}>
        <Input name="email" type="email" autoComplete="email" dir="ltr" error={f.email} />
      </Field>
      <Field label={t("subject")} name="subject" error={f.subject}>
        <Input name="subject" defaultValue={defaultSubject} required error={f.subject} />
      </Field>
      <Field label={t("message")} name="message" error={f.message}>
        <Textarea name="message" rows={5} required error={f.message} />
      </Field>
      <Checkbox name="consent" label={t("consent")} error={f.consent} />
      <SubmitButton size="lg" pendingLabel={t("sending")}>
        <Send className="flip-rtl size-4" aria-hidden />
        {t("send")}
      </SubmitButton>
    </form>
  );
}
