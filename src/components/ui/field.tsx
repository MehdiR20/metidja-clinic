"use client";

import type { ComponentProps, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-base text-ink placeholder:text-muted/60 transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 focus:outline-none aria-[invalid=true]:border-red-400";

type FieldProps = { label: ReactNode; name: string; error?: string; hint?: ReactNode; className?: string; children: ReactNode };

/** Label + control + hint/error, with ids wired for screen readers. */
export function Field({ label, name, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={name} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? <FieldError name={name} code={error} /> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function FieldError({ name, code }: { name: string; code?: string }) {
  const t = useTranslations("errors");
  if (!code) return null;
  return (
    <p id={`${name}-error`} role="alert" className="text-sm text-red-600">
      {t.has(code) ? t(code) : code}
    </p>
  );
}

const aria = (name: string, error?: string) =>
  error ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

export function Input({ name, error, className, ...props }: ComponentProps<"input"> & { name: string; error?: string }) {
  return <input id={name} name={name} className={cn(control, className)} {...aria(name, error)} {...props} />;
}

export function Textarea({ name, error, className, ...props }: ComponentProps<"textarea"> & { name: string; error?: string }) {
  return <textarea id={name} name={name} rows={4} className={cn(control, "resize-y", className)} {...aria(name, error)} {...props} />;
}

export function Select({ name, error, className, ...props }: ComponentProps<"select"> & { name: string; error?: string }) {
  return <select id={name} name={name} className={cn(control, "appearance-auto", className)} {...aria(name, error)} {...props} />;
}

export function Checkbox({ name, label, error, ...props }: ComponentProps<"input"> & { name: string; label: ReactNode; error?: string }) {
  return (
    <div className="space-y-1">
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink/80">
        <input
          type="checkbox"
          name={name}
          className="mt-1 size-4 shrink-0 accent-brand-500"
          {...aria(name, error)}
          {...props}
        />
        <span>{label}</span>
      </label>
      <FieldError name={name} code={error} />
    </div>
  );
}

export function FormAlert({ code, tone = "error" }: { code?: string; tone?: "error" | "success" }) {
  const t = useTranslations("errors");
  if (!code) return null;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800",
      )}
    >
      {tone === "error" && t.has(code) ? t(code) : code}
    </div>
  );
}
