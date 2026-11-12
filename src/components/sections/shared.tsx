import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, BadgeCheck, Clock, MapPin, Navigation, Phone, Quote, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CLINIC, INSURANCE_PARTNERS, telHref } from "@/lib/clinic";
import { formatDate } from "@/lib/format";
import type { Article } from "@/content/blog";
import type { Locale } from "@/i18n/routing";
import { ButtonAnchor } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";

export function InsuranceGrid() {
  const t = useTranslations("insurance");
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INSURANCE_PARTNERS.map((p) => (
          <li key={p.key} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-soft">
            <BadgeCheck className="mb-3 size-6 text-brand-500" aria-hidden />
            <p className="font-display text-lg font-extrabold text-navy-700">{t(`labels.${p.key}`)}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{t(p.key)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">{t("note")}</p>
    </div>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("blog");
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={article.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold text-brand-600">
          {formatDate(article.date, locale, { dateStyle: "long" })} · {t("readingTime", { count: article.readingMin })}
        </p>
        <h3 className="mt-2 text-lg leading-snug font-bold text-ink">
          <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {article.title[locale]}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{article.excerpt[locale]}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600">
          {t("readMore")} <ArrowRight className="flip-rtl size-4" aria-hidden />
        </span>
      </div>
    </Card>
  );
}

export function LocationBlock() {
  const t = useTranslations();
  return (
    <div className="grid overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-soft lg:grid-cols-5">
      <div className="space-y-6 p-8 lg:col-span-2">
        <InfoRow icon={<MapPin />} label={t("contact.address")}>
          {CLINIC.name}
          <br />
          {CLINIC.address.display}
        </InfoRow>
        <InfoRow icon={<Phone />} label={t("contact.phones")}>
          <span dir="ltr" className="block">
            <a href={telHref()} className="font-semibold text-brand-700 hover:underline">{CLINIC.phones.main}</a>
            <span className="block">{CLINIC.phones.landline}</span>
          </span>
        </InfoRow>
        <InfoRow icon={<Clock />} label={t("contact.hours")}>
          {t("contact.hoursValue")}
        </InfoRow>
        <ButtonAnchor href={CLINIC.maps.directions} target="_blank" rel="noopener noreferrer" variant="navy">
          <Navigation className="size-4" aria-hidden />
          {t("home.directions")}
        </ButtonAnchor>
      </div>
      <div className="min-h-80 bg-brand-50 lg:col-span-3">
        <iframe
          title={t("home.locationTitle")}
          src={CLINIC.maps.embed}
          className="size-full min-h-80 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 [&>svg]:size-5">{icon}</span>
      <div>
        <p className="text-sm font-bold text-ink">{label}</p>
        <div className="mt-0.5 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}

/**
 * Patient reviews. TODO: paste the verbatim Google review text into the `testimonials.*` messages
 * (with the reviewers' consent) — the current copy is a placeholder summary.
 */
const TESTIMONIALS = [
  { key: "sonia", name: "Sonia Ihaddadene", tag: "Gynécologie · Dr Fares" },
  { key: "lahcene", name: "Lahcene Bouchendouka", tag: "Chirurgie" },
] as const;

export function Testimonials() {
  const t = useTranslations("testimonials");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {TESTIMONIALS.map((item) => (
        <figure key={item.key} className="relative rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
          <Quote className="absolute end-6 top-6 size-10 text-brand-100" aria-hidden />
          <div className="flex gap-0.5 text-amber-400" aria-label="5/5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-current" aria-hidden />
            ))}
          </div>
          <blockquote className="mt-4 leading-relaxed text-ink/85">{t(item.key)}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-brand-500 font-bold text-white">{item.name[0]}</span>
            <span>
              <span className="block font-bold text-ink">{item.name}</span>
              <span className="block text-xs text-muted">
                {item.tag} · {t("source")}
              </span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
