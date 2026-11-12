import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { tr } from "@/lib/format";
import { AdminTitle } from "@/components/admin/ui";
import { ServiceForm, type ServiceFormValue } from "@/components/admin/forms";

export default async function EditService({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const [departments, service] = await Promise.all([
    prisma.department.findMany({ orderBy: { order: "asc" } }),
    id === "new" ? null : prisma.service.findUnique({ where: { id } }),
  ]);
  if (id !== "new" && !service) notFound();

  const value: ServiceFormValue | undefined = service
    ? {
        id: service.id,
        departmentId: service.departmentId,
        name: service.name as ServiceFormValue["name"],
        priceDzd: service.priceDzd,
        durationMin: service.durationMin,
        isActive: service.isActive,
      }
    : undefined;

  return (
    <>
      <AdminTitle>{service ? t("editService") : t("newService")}</AdminTitle>
      <ServiceForm value={value} departments={departments.map((d) => ({ id: d.id, name: tr(d.name, locale) }))} />
    </>
  );
}
