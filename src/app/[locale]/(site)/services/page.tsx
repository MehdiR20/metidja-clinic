import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDepartmentsWithServices } from "@/lib/queries";
import { formatDZD, tr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Card, Container, EmptyState, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { DepartmentIcon } from "@/components/ui/icons";
import { InsuranceGrid } from "@/components/sections/shared";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "services" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const departments = await getDepartmentsWithServices();

  return (
    <>
      <PageHeader title={t("services.title")} subtitle={t("services.subtitle")} />
      <Container className="grid gap-10 py-12 lg:grid-cols-[16rem_1fr]">
        {/* Jump list */}
        <nav className="hidden lg:block" aria-label={t("services.title")}>
          <ul className="sticky top-24 space-y-1 text-sm">
            {departments.map((d) => (
              <li key={d.id}>
                <a href={`#${d.slug}`} className="block rounded-lg px-3 py-2 font-medium text-ink/75 hover:bg-brand-50 hover:text-brand-700">
                  {tr(d.name, locale)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          {departments.length === 0 && <EmptyState>{t("services.empty")}</EmptyState>}
          {departments.map((d) => (
            <Card key={d.id} id={d.slug} className="scroll-mt-28 overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 border-b border-brand-50 bg-brand-50/50 p-6">
                <DepartmentIcon icon={d.icon} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-brand-800">{tr(d.name, locale)}</h2>
                  <p className="text-sm text-muted">{tr(d.description, locale)}</p>
                </div>
                {d.slug !== "laboratoire" && (
                  <ButtonLink href={{ pathname: "/booking", query: { department: d.id } }} size="sm">
                    {t("services.book")}
                  </ButtonLink>
                )}
              </div>
              {d.services.length ? (
                <table className="w-full text-sm">
                  <thead className="sr-only">
                    <tr>
                      <th>{t("services.service")}</th>
                      <th>{t("services.duration")}</th>
                      <th>{t("services.price")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50">
                    {d.services.map((s) => (
                      <tr key={s.id}>
                        <td className="px-6 py-4 font-medium text-ink">{tr(s.name, locale)}</td>
                        <td className="hidden px-6 py-4 text-muted sm:table-cell">
                          {s.durationMin > 0 ? t("common.minutes", { count: s.durationMin }) : "—"}
                        </td>
                        <td className="px-6 py-4 text-end font-display font-extrabold whitespace-nowrap text-navy-700" dir="ltr">
                          {formatDZD(s.priceDzd, locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-sm text-muted">{t("services.empty")}</p>
              )}
            </Card>
          ))}

          <section className="pt-6">
            <SectionHeading title={t("services.insuranceTitle")} />
            <div className="mt-6">
              <InsuranceGrid />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
