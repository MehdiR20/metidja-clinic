"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, { short: string; full: string }> = {
  fr: { short: "FR", full: "Français" },
  ar: { short: "ع", full: "العربية" },
  en: { short: "EN", full: "English" },
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) =>
    startTransition(() => {
      // @ts-expect-error -- params of the current dynamic route are passed through unchanged
      router.replace({ pathname, params }, { locale: next });
    });

  return (
    <div role="group" aria-label={t("language")} className={cn("flex items-center gap-1", isPending && "opacity-60", className)}>
      <Globe className="size-4 text-brand-500" aria-hidden />
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          title={LABELS[l].full}
          aria-pressed={l === locale}
          onClick={() => switchTo(l)}
          className={cn(
            "min-w-9 rounded-full px-2 py-1 text-sm font-bold transition-colors",
            l === locale ? "bg-brand-500 text-white" : "text-brand-800 hover:bg-brand-50",
          )}
        >
          {LABELS[l].short}
        </button>
      ))}
    </div>
  );
}
