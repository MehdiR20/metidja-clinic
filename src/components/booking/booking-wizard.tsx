"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Loader2, MessageCircle, Smartphone, Video } from "lucide-react";
import { createAppointmentAction } from "@/actions/booking";
import type { FormState } from "@/lib/validation";
import { formatDZD, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { DepartmentIcon, DoctorAvatar } from "@/components/ui/icons";
import { Checkbox, Field, FormAlert, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export type BookingDepartment = {
  id: string;
  icon: string;
  name: string;
  doctors: { id: string; name: string; title: string; fee: number; telehealth: boolean; days: number[] }[];
  services: { id: string; name: string; price: number }[];
};

type ApptType = "IN_PERSON" | "TELEHEALTH";
type Props = {
  departments: BookingDepartment[];
  initial: { departmentId?: string; doctorId?: string; type: ApptType };
  today: string;
  maxDays: number;
  loggedIn: boolean;
  prefill?: { name?: string; phone?: string | null; email?: string };
};

const STEP_KEYS = ["department", "doctor", "slot", "details"] as const;

const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const weekdayOf = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay();

export function BookingWizard({ departments, initial, today, maxDays, loggedIn, prefill }: Props) {
  const t = useTranslations("booking");
  const locale = useLocale();

  const [departmentId, setDepartmentId] = useState(initial.departmentId ?? "");
  const [doctorId, setDoctorId] = useState(initial.doctorId ?? "");
  const [type, setType] = useState<ApptType>(initial.type);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [step, setStep] = useState(initial.doctorId ? 2 : initial.departmentId ? 1 : 0);

  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsError, setSlotsError] = useState(false);

  const [state, formAction] = useActionState<FormState, FormData>(createAppointmentAction, {});

  const department = departments.find((d) => d.id === departmentId);
  const doctors = (department?.doctors ?? []).filter((d) => type === "IN_PERSON" || d.telehealth);
  const doctor = department?.doctors.find((d) => d.id === doctorId);

  // Next N days on which the chosen doctor consults
  const dates = useMemo(() => {
    if (!doctor) return [];
    const out: string[] = [];
    for (let i = 0; i <= maxDays && out.length < 14; i++) {
      const d = addDays(today, i);
      if (doctor.days.includes(weekdayOf(d))) out.push(d);
    }
    return out;
  }, [doctor, today, maxDays]);

  // Load free slots whenever doctor/date changes
  useEffect(() => {
    if (!doctorId || !date) return;
    const ctrl = new AbortController();
    setSlots(null);
    setSlotsError(false);
    fetch(`/api/slots?doctorId=${encodeURIComponent(doctorId)}&date=${date}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: { slots: string[] }) => setSlots(data.slots))
      .catch((e) => {
        if (e?.name !== "AbortError") setSlotsError(true);
      });
    return () => ctrl.abort();
  }, [doctorId, date]);

  // Pre-select the first available date for the doctor
  useEffect(() => {
    if (doctor && !dates.includes(date)) setDate(dates[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor, dates]);

  // If the server says the slot was taken, go back to slot selection
  useEffect(() => {
    if (state.error === "slotTaken" || state.error === "slotUnavailable") {
      setTime("");
      setStep(2);
      setSlots(null);
      fetch(`/api/slots?doctorId=${encodeURIComponent(doctorId)}&date=${date}`)
        .then((r) => r.json())
        .then((d: { slots: string[] }) => setSlots(d.slots))
        .catch(() => setSlotsError(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.ok && state.data) {
    const d = state.data as { reference: string; startsAt: string; doctor: string; channel: string; phone: string };
    return (
      <Card className="p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-16 text-emerald-500" aria-hidden />
        <h2 className="mt-4 text-3xl font-extrabold text-navy-700">{t("successTitle")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          {t("successText", { channel: d.channel === "WHATSAPP" ? t("whatsapp") : t("sms"), phone: d.phone })}
        </p>
        <dl className="mx-auto mt-8 grid max-w-md gap-3 rounded-2xl bg-brand-50 p-6 text-start">
          <Row label={t("reference")} value={<span className="font-mono text-lg font-bold tracking-wider" dir="ltr">{d.reference}</span>} />
          <Row label={t("steps.doctor")} value={d.doctor} />
          <Row label={t("steps.slot")} value={formatDateTime(d.startsAt, locale)} />
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t("bookAnother")}
          </Button>
          {loggedIn ? (
            <ButtonLink href="/portal">{t("loggedInAs")}</ButtonLink>
          ) : (
            <ButtonLink href="/register">{t("portalHint")}</ButtonLink>
          )}
        </div>
      </Card>
    );
  }

  const canNext = [!!departmentId, !!doctorId, !!date && !!time][step] ?? false;
  const f = state.fields ?? {};
  // Values echoed back by the server after a failed validation, so inputs keep what the user typed
  const v: Record<string, string | undefined> = { ...prefill, phone: prefill?.phone ?? undefined, ...(state.data as Record<string, string> | undefined) };

  return (
    <div>
      {/* Stepper */}
      <ol className="mb-8 grid grid-cols-4 gap-2">
        {STEP_KEYS.map((key, i) => (
          <li key={key}>
            <button
              type="button"
              disabled={i > step}
              onClick={() => setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className="group flex w-full flex-col items-start gap-2 text-start disabled:cursor-default"
            >
              <span className={cn("h-1.5 w-full rounded-full transition-colors", i <= step ? "bg-brand-500" : "bg-brand-100")} />
              <span className={cn("text-xs font-semibold sm:text-sm", i === step ? "text-brand-700" : "text-muted")}>
                <span className="hidden sm:inline">{i + 1}. </span>
                {t(`steps.${key}`)}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <Card className="p-5 sm:p-8">
        {step === 0 && (
          <fieldset>
            <legend className="text-xl font-bold text-brand-800">{t("chooseDepartment")}</legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {departments.map((d) => (
                <OptionCard
                  key={d.id}
                  selected={d.id === departmentId}
                  onClick={() => {
                    setDepartmentId(d.id);
                    setDoctorId("");
                    setTime("");
                    setStep(1);
                  }}
                >
                  <DepartmentIcon icon={d.icon} className="size-10" />
                  <span className="font-semibold text-ink">{d.name}</span>
                </OptionCard>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="text-xl font-bold text-brand-800">{t("chooseDoctor")}</legend>
            <div className="mt-4 inline-flex rounded-full bg-brand-50 p-1" role="radiogroup" aria-label={t("type")}>
              {(["IN_PERSON", "TELEHEALTH"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={type === v}
                  onClick={() => {
                    setType(v);
                    if (v === "TELEHEALTH" && doctor && !doctor.telehealth) setDoctorId("");
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition",
                    type === v ? "bg-white text-brand-700 shadow-soft" : "text-muted",
                  )}
                >
                  {v === "TELEHEALTH" && <Video className="size-4" aria-hidden />}
                  {v === "IN_PERSON" ? t("inPerson") : t("telehealth")}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              {doctors.length === 0 && <p className="text-muted">{t("noDoctors")}</p>}
              {doctors.map((d) => (
                <OptionCard
                  key={d.id}
                  selected={d.id === doctorId}
                  onClick={() => {
                    setDoctorId(d.id);
                    setTime("");
                    setStep(2);
                  }}
                >
                  <DoctorAvatar name={d.name} className="size-12 text-base" />
                  <span className="flex-1">
                    <span className="block font-semibold text-ink">{d.name}</span>
                    <span className="block text-sm text-muted">{d.title}</span>
                  </span>
                  <span className="font-display font-extrabold text-navy-700" dir="ltr">
                    {formatDZD(d.fee, locale)}
                  </span>
                </OptionCard>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && doctor && (
          <div>
            <h2 className="text-xl font-bold text-brand-800">{t("chooseDate")}</h2>
            <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2">
              {dates.map((d) => {
                const dt = new Date(`${d}T12:00:00Z`);
                const fmt = (o: Intl.DateTimeFormatOptions) =>
                  new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ-u-nu-latn" : locale, { timeZone: "UTC", ...o }).format(dt);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDate(d);
                      setTime("");
                    }}
                    aria-pressed={d === date}
                    className={cn(
                      "flex min-w-18 shrink-0 flex-col items-center rounded-2xl border px-3 py-3 transition",
                      d === date ? "border-brand-500 bg-brand-500 text-white shadow-soft" : "border-brand-100 bg-white hover:border-brand-300",
                    )}
                  >
                    <span className="text-xs font-semibold uppercase opacity-80">{fmt({ weekday: "short" })}</span>
                    <span className="font-display text-2xl font-extrabold">{fmt({ day: "numeric" })}</span>
                    <span className="text-xs opacity-80">{fmt({ month: "short" })}</span>
                  </button>
                );
              })}
            </div>

            <h2 className="mt-8 text-xl font-bold text-brand-800">{t("chooseTime")}</h2>
            <div className="mt-4" aria-live="polite">
              {slotsError ? (
                <FormAlert code="generic" />
              ) : slots === null ? (
                <p className="flex items-center gap-2 text-muted">
                  <Loader2 className="size-4 animate-spin" aria-hidden /> …
                </p>
              ) : slots.length === 0 ? (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{t("noSlots")}</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTime(s)}
                      aria-pressed={s === time}
                      dir="ltr"
                      className={cn(
                        "rounded-xl border py-2.5 text-sm font-bold transition",
                        s === time ? "border-brand-500 bg-brand-500 text-white" : "border-brand-100 bg-white text-brand-800 hover:border-brand-300",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && department && doctor && (
          <form action={formAction} className="space-y-5" noValidate>
            {state.error && <FormAlert code={state.error} />}
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="departmentId" value={departmentId} />
            <input type="hidden" name="doctorId" value={doctorId} />
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="time" value={time} />
            <input type="hidden" name="type" value={type} />

            <div className="rounded-2xl bg-brand-50 p-5">
              <p className="text-sm font-bold text-brand-800">{t("summary")}</p>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <Row label={t("steps.department")} value={department.name} />
                <Row label={t("steps.doctor")} value={doctor.name} />
                <Row label={t("steps.slot")} value={formatDateTime(`${date}T${time}:00+01:00`, locale)} />
                <Row label={t("type")} value={type === "TELEHEALTH" ? t("telehealth") : t("inPerson")} />
              </dl>
            </div>

            {department.services.length > 0 && (
              <Field label={t("service")} name="serviceId">
                <Select name="serviceId" defaultValue={v.serviceId ?? ""}>
                  <option value="">{t("serviceNone")}</option>
                  {department.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {formatDZD(s.price, locale)}
                    </option>
                  ))}
                </Select>
              </Field>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("name")} name="patientName" error={f.patientName}>
                <Input name="patientName" autoComplete="name" defaultValue={v.patientName ?? v.name} required error={f.patientName} />
              </Field>
              <Field label={t("phone")} name="patientPhone" error={f.patientPhone} hint={t("phoneHint")}>
                <Input
                  name="patientPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  defaultValue={v.patientPhone ?? v.phone ?? undefined}
                  required
                  error={f.patientPhone}
                />
              </Field>
            </div>
            <Field label={t("email")} name="patientEmail" error={f.patientEmail}>
              <Input name="patientEmail" type="email" autoComplete="email" dir="ltr" defaultValue={v.patientEmail ?? v.email} error={f.patientEmail} />
            </Field>
            <Field label={t("reason")} name="reason">
              <Textarea name="reason" rows={3} maxLength={500} defaultValue={v.reason} />
            </Field>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-ink">{t("channel")}</legend>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    ["SMS", t("sms"), Smartphone],
                    ["WHATSAPP", t("whatsapp"), MessageCircle],
                  ] as const
                ).map(([value, label, Icon]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-brand-100 px-4 py-2 text-sm font-semibold has-checked:border-brand-500 has-checked:bg-brand-50"
                  >
                    <input type="radio" name="channel" value={value} defaultChecked={value === "SMS"} className="accent-brand-500" />
                    <Icon className="size-4 text-brand-600" aria-hidden />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <Checkbox
              name="consent"
              error={f.consent}
              label={
                <>
                  {t("consent")}{" "}
                  <Link href="/privacy" className="font-semibold text-brand-600 underline" target="_blank">
                    ↗
                  </Link>
                </>
              }
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="flip-rtl size-4" aria-hidden /> {t("back")}
              </Button>
              <SubmitButton size="lg" pendingLabel={t("submitting")}>
                <CalendarCheck className="size-5" aria-hidden /> {t("confirm")}
              </SubmitButton>
            </div>
          </form>
        )}

        {step < 3 && (
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-brand-50 pt-6">
            <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ArrowLeft className="flip-rtl size-4" aria-hidden /> {t("back")}
            </Button>
            <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              {t("next")} <ArrowRight className="flip-rtl size-4" aria-hidden />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border p-4 text-start transition",
        selected ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200" : "border-brand-100 bg-white hover:border-brand-300 hover:bg-brand-50/40",
      )}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
