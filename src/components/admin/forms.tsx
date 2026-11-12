"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Save } from "lucide-react";
import { saveDoctorAction, saveServiceAction } from "@/actions/admin";
import type { FormState } from "@/lib/validation";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { Field, FormAlert, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

type L = { fr: string; ar: string; en: string };
type Dept = { id: string; name: string };

const LANGS = ["fr", "ar", "en"] as const;
const LABEL_SUFFIX = { fr: "Fr", ar: "Ar", en: "En" } as const;

/** Three inputs (FR / AR / EN) for a localized JSON column. */
function LocalizedInputs({
  name,
  labelKey,
  value,
  errors,
  multiline,
}: {
  name: string;
  labelKey: "name" | "title" | "bio" | "qual";
  value?: Partial<L>;
  errors: Record<string, string>;
  multiline?: boolean;
}) {
  const t = useTranslations("admin");
  return (
    <div className={multiline ? "grid gap-4" : "grid gap-4 md:grid-cols-3"}>
      {LANGS.map((lang) => {
        const field = `${name}.${lang}`;
        const props = { name: field, defaultValue: value?.[lang] ?? "", error: errors[field], dir: lang === "ar" ? "rtl" : "ltr", lang };
        return (
          <Field key={lang} label={t(`${labelKey}${LABEL_SUFFIX[lang]}`)} name={field} error={errors[field]}>
            {multiline ? <Textarea rows={3} {...props} /> : <Input {...props} />}
          </Field>
        );
      })}
    </div>
  );
}

function FormFooter({ backHref }: { backHref: string }) {
  const t = useTranslations("admin");
  return (
    <div className="flex items-center justify-end gap-3 border-t border-brand-50 pt-6">
      <Link href={backHref} className={buttonClass({ variant: "ghost" })}>
        {t("back")}
      </Link>
      <SubmitButton>
        <Save className="size-4" aria-hidden /> {t("save")}
      </SubmitButton>
    </div>
  );
}

export type ServiceFormValue = { id?: string; departmentId: string; name: L; priceDzd: number; durationMin: number; isActive: boolean };

export function ServiceForm({ value, departments }: { value?: ServiceFormValue; departments: Dept[] }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [state, action] = useActionState<FormState, FormData>(saveServiceAction, {});
  const f = state.fields ?? {};

  return (
    <Card className="p-6 sm:p-8">
      <form action={action} className="space-y-6" noValidate>
        <input type="hidden" name="locale" value={locale} />
        {value?.id && <input type="hidden" name="id" value={value.id} />}
        <FormAlert code={state.error} />
        <Field label={t("department")} name="departmentId" error={f.departmentId}>
          <Select name="departmentId" defaultValue={value?.departmentId ?? ""} error={f.departmentId}>
            <option value="" disabled>—</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </Field>
        <LocalizedInputs name="name" labelKey="name" value={value?.name} errors={f} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("price")} name="priceDzd" error={f.priceDzd}>
            <Input name="priceDzd" type="number" min={0} step={50} inputMode="numeric" dir="ltr" defaultValue={value?.priceDzd ?? ""} error={f.priceDzd} />
          </Field>
          <Field label={t("duration")} name="durationMin" error={f.durationMin}>
            <Input name="durationMin" type="number" min={5} step={5} inputMode="numeric" dir="ltr" defaultValue={value?.durationMin ?? 30} error={f.durationMin} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="isActive" defaultChecked={value?.isActive ?? true} className="size-4 accent-brand-500" />
          {t("isActive")}
        </label>
        <FormFooter backHref="/admin/services" />
      </form>
    </Card>
  );
}

export type DoctorFormValue = {
  id?: string;
  name: string;
  slug: string;
  departmentId: string;
  title: L;
  bio: L;
  qualifications: L; // newline-joined
  languages: string[];
  hours: string;
  consultationFee: number;
  slotMinutes: number;
  acceptsTelehealth: boolean;
  isActive: boolean;
};

export function DoctorForm({ value, departments }: { value?: DoctorFormValue; departments: Dept[] }) {
  const t = useTranslations("admin");
  const tl = useTranslations("doctors.languageNames");
  const locale = useLocale();
  const [state, action] = useActionState<FormState, FormData>(saveDoctorAction, {});
  const f = state.fields ?? {};

  return (
    <Card className="p-6 sm:p-8">
      <form action={action} className="space-y-6" noValidate>
        <input type="hidden" name="locale" value={locale} />
        {value?.id && <input type="hidden" name="id" value={value.id} />}
        <FormAlert code={state.error} />

        <div className="grid gap-4 md:grid-cols-3">
          <Field label={t("name")} name="name" error={f.name}>
            <Input name="name" defaultValue={value?.name} placeholder="Dr. …" error={f.name} />
          </Field>
          <Field label={t("slug")} name="slug" error={f.slug}>
            <Input name="slug" defaultValue={value?.slug} dir="ltr" placeholder="dr-nom" error={f.slug} />
          </Field>
          <Field label={t("department")} name="departmentId" error={f.departmentId}>
            <Select name="departmentId" defaultValue={value?.departmentId ?? ""} error={f.departmentId}>
              <option value="" disabled>—</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </Field>
        </div>

        <LocalizedInputs name="title" labelKey="title" value={value?.title} errors={f} />
        <LocalizedInputs name="bio" labelKey="bio" value={value?.bio} errors={f} multiline />
        <LocalizedInputs name="qualifications" labelKey="qual" value={value?.qualifications} errors={f} multiline />

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t("languages")}</legend>
          <div className="flex flex-wrap gap-4">
            {(["fr", "ar", "en", "kab"] as const).map((l) => (
              <label key={l} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="languages" value={l} defaultChecked={value?.languages.includes(l) ?? l !== "en"} className="size-4 accent-brand-500" />
                {tl(l)}
              </label>
            ))}
          </div>
          {f.languages && <p className="mt-1 text-sm text-red-600">{f.languages}</p>}
        </fieldset>

        <Field label={t("hours")} name="hours" error={f.hours} hint={t("hoursHelp")}>
          <Textarea name="hours" rows={5} dir="ltr" className="font-mono text-sm" defaultValue={value?.hours ?? "0 08:00-12:00\n1 08:00-12:00"} error={f.hours} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("fee")} name="consultationFee" error={f.consultationFee}>
            <Input name="consultationFee" type="number" min={0} step={100} dir="ltr" defaultValue={value?.consultationFee ?? 2000} error={f.consultationFee} />
          </Field>
          <Field label={t("slotMinutes")} name="slotMinutes" error={f.slotMinutes}>
            <Input name="slotMinutes" type="number" min={10} max={120} step={5} dir="ltr" defaultValue={value?.slotMinutes ?? 30} error={f.slotMinutes} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="acceptsTelehealth" defaultChecked={value?.acceptsTelehealth ?? false} className="size-4 accent-brand-500" />
            {t("acceptsTelehealth")}
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="isActive" defaultChecked={value?.isActive ?? true} className="size-4 accent-brand-500" />
            {t("isActive")}
          </label>
        </div>

        <FormFooter backHref="/admin/doctors" />
      </form>
    </Card>
  );
}
