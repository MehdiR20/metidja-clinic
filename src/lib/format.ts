import type { Locale } from "@/i18n/routing";

export type Localized = Partial<Record<Locale, string>>;
export type LocalizedList = Partial<Record<Locale, string[]>>;

/** Pick the right translation from a JSON column, falling back to French. */
export function tr(value: unknown, locale: string): string {
  if (!value || typeof value !== "object") return typeof value === "string" ? value : "";
  const v = value as Localized;
  return v[locale as Locale] ?? v.fr ?? Object.values(v)[0] ?? "";
}

export function trList(value: unknown, locale: string): string[] {
  if (!value || typeof value !== "object") return [];
  const v = value as LocalizedList;
  return v[locale as Locale] ?? v.fr ?? [];
}

/** Formats an amount as Algerian Dinars, e.g. `3,500 DZD` (Arabic: `3,500 د.ج`). */
export function formatDZD(amount: number, locale: string = "fr"): string {
  const n = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);
  return locale === "ar" ? `${n} د.ج` : `${n} DZD`;
}

export const CLINIC_TZ = "Africa/Algiers";
/** Algeria is UTC+1 all year (no DST). */
export const CLINIC_UTC_OFFSET = "+01:00";

const intlLocale = (locale: string) => (locale === "ar" ? "ar-DZ-u-nu-latn" : locale === "en" ? "en-GB" : "fr-DZ");

export function formatDate(date: Date | string, locale: string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: CLINIC_TZ,
    dateStyle: "full",
    ...opts,
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string, locale: string) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: CLINIC_TZ,
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h23",
  }).format(new Date(date));
}

export function formatTime(date: Date | string, locale: string) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: CLINIC_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

/** "YYYY-MM-DD" for a Date as seen in the clinic's timezone. */
export function clinicDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TZ }).format(date);
}

/** Normalises Algerian phone numbers to E.164 (+213…). Returns null if invalid. */
export function normalizeDzPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  const m = digits.match(/^(?:\+213|00213|0)([567]\d{8}|[2-4]\d{7})$/);
  return m ? `+213${m[1]}` : null;
}
