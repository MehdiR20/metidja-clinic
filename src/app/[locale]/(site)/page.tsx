import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarCheck, FlaskConical, MapPinned, Phone, ShieldPlus, Siren, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDepartments } from "@/lib/queries";
import { telHref } from "@/lib/clinic";
import { tr } from "@/lib/format";
import { sortedArticles } from "@/content/blog";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading, Waves } from "@/components/ui/primitives";
import { DepartmentIcon } from "@/components/ui/icons";
import { ArticleCard, InsuranceGrid, LocationBlock, Testimonials } from "@/components/sections/shared";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const departments = await getDepartments();

  const stats = [
    { value: "14", label: t("hero.stats.specialties") },
    { value: "4", label: t("hero.stats.blocks") },
    { value: "24/7", label: t("hero.stats.open") },
  ];

  const why = [
    { key: "team", icon: Users },
    { key: "blocks", icon: ShieldPlus },
    { key: "lab", icon: FlaskConical },
    { key: "access", icon: MapPinned },
  ] as const;

  const gallery = [
    { src: "/images/building-night.jpg", key: "building", className: "row-span-2" },
    { src: "/images/maternity-room-2.jpg", key: "maternity", className: "" },
    { src: "/images/dialysis-unit.jpg", key: "dialysis", className: "row-span-2" },
    { src: "/images/consultation-wing.jpg", key: "waiting", className: "" },
  ] as const;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100/70">
        <Waves className="absolute -start-24 bottom-0 w-[620px] text-brand-400" />
        <Container className="relative grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-navy-700 uppercase sm:text-6xl">
              {t("hero.title")}
              <span className="block text-brand-500">{t("hero.titleAccent")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/booking" size="lg">
                <CalendarCheck className="size-5" aria-hidden />
                {t("hero.ctaBook")}
              </ButtonLink>
              <ButtonAnchor href={telHref()} size="lg" variant="outline">
                <Phone className="size-5" aria-hidden />
                {t("hero.ctaCall")}
              </ButtonAnchor>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="border-s-2 border-brand-300 ps-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-3xl font-extrabold text-brand-600" dir="ltr">{s.value}</dd>
                  <dd className="text-xs leading-snug font-medium text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift sm:aspect-square lg:aspect-[4/5]">
              <Image
                src="/images/building-day.jpg"
                alt="Clinique Metidja Al Djazair, Boufarik"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 start-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lift sm:start-[-1.5rem]">
              <span className="grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
                <Siren className="size-6" aria-hidden />
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-navy-700">{t("hero.open")}</p>
                <p className="text-sm text-muted">{t("contactBar.emergency")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SPECIALTIES */}
      <section className="py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title={t("home.specialtiesTitle")} subtitle={t("home.specialtiesSub")} />
            <Link href="/services" className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-800">
              {t("common.seeAll")} <ArrowRight className="flip-rtl size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/services#${d.slug}`}
                  className="group flex h-full gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                >
                  <DepartmentIcon icon={d.icon} />
                  <span>
                    <span className="block font-bold text-ink group-hover:text-brand-700">{tr(d.name, locale)}</span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted">{tr(d.description, locale)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* WHY US */}
      <section className="bg-surface py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-last grid grid-cols-2 gap-4 lg:order-first">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft">
              <Image src="/images/corridor.jpg" alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-3xl shadow-soft">
              <Image src="/images/maternity-room-1.jpg" alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          </div>
          <div>
            <SectionHeading title={t("home.whyTitle")} />
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {why.map(({ key, icon: Icon }) => (
                <li key={key}>
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-soft">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-bold text-ink">{t(`home.why.${key}.title`)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{t(`home.why.${key}.text`)}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* EMERGENCY BAND */}
      <section className="relative overflow-hidden bg-navy-700 text-white">
        <Waves className="absolute -end-10 -top-10 w-[500px] text-brand-300" />
        <Container className="relative flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-red-500/90">
              <Siren className="size-7" aria-hidden />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{t("home.emergencyTitle")}</h2>
              <p className="mt-1 text-brand-100">{t("home.emergencyText")}</p>
            </div>
          </div>
          <ButtonAnchor href={telHref()} size="lg" className="bg-white text-navy-700 hover:bg-brand-50">
            <Phone className="size-5" aria-hidden />
            <span dir="ltr">0560 07 09 98</span>
          </ButtonAnchor>
        </Container>
      </section>

      {/* FACILITIES */}
      <section className="py-20">
        <Container>
          <SectionHeading title={t("home.facilitiesTitle")} subtitle={t("home.facilitiesSub")} />
          <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:grid-cols-3">
            {gallery.map((g) => (
              <figure key={g.key} className={`group relative overflow-hidden rounded-3xl ${g.className}`}>
                <Image
                  src={g.src}
                  alt={t(`home.facilities.${g.key}`)}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/80 to-transparent p-4 text-sm font-semibold text-white">
                  {t(`home.facilities.${g.key}`)}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gradient-to-b from-brand-50 to-white py-20">
        <Container>
          <SectionHeading align="center" title={t("home.testimonialsTitle")} subtitle={t("home.testimonialsSub")} />
          <div className="mt-10">
            <Testimonials />
          </div>
        </Container>
      </section>

      {/* INSURANCE */}
      <section className="py-20">
        <Container>
          <SectionHeading title={t("home.insuranceTitle")} subtitle={t("home.insuranceSub")} />
          <div className="mt-10">
            <InsuranceGrid />
          </div>
        </Container>
      </section>

      {/* BLOG */}
      <section className="bg-surface py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title={t("home.blogTitle")} />
            <Link href="/blog" className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-800">
              {t("common.seeAll")} <ArrowRight className="flip-rtl size-4" aria-hidden />
            </Link>
          </div>
          <div className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedArticles().map((a) => (
              <div key={a.slug} className="relative">
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* LOCATION */}
      <section className="py-20">
        <Container>
          <SectionHeading title={t("home.locationTitle")} subtitle={t("home.locationSub")} />
          <div className="mt-10">
            <LocationBlock />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 to-brand-700 px-8 py-12 text-white shadow-lift sm:px-12">
            <Waves className="absolute -end-10 bottom-0 w-[480px] text-white" />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl font-extrabold sm:text-4xl">{t("home.ctaTitle")}</h2>
              <p className="mt-3 text-lg text-brand-50">{t("home.ctaText")}</p>
              <ButtonLink href="/booking" size="lg" className="mt-8 bg-white text-brand-700 hover:bg-brand-50">
                <CalendarCheck className="size-5" aria-hidden />
                {t("hero.ctaBook")}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
