import { getTranslations, setRequestLocale } from "next-intl/server";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDZD, tr } from "@/lib/format";
import { deleteServiceAction } from "@/actions/admin";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { AdminTitle, DataTable, Td } from "@/components/admin/ui";

export default async function AdminServices({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const services = await prisma.service.findMany({
    include: { department: true },
    orderBy: [{ department: { order: "asc" } }, { order: "asc" }],
  });

  return (
    <>
      <AdminTitle
        actions={
          <ButtonLink href="/admin/services/new">
            <Plus className="size-4" aria-hidden /> {t("newService")}
          </ButtonLink>
        }
      >
        {t("services")}
      </AdminTitle>
      <DataTable head={[t("name"), t("department"), t("duration"), t("price"), t("status"), ""]}>
        {services.map((s) => (
          <tr key={s.id}>
            <Td className="font-semibold text-ink">{tr(s.name, locale)}</Td>
            <Td className="text-muted">{tr(s.department.name, locale)}</Td>
            <Td>{s.durationMin}</Td>
            <Td className="font-display font-extrabold whitespace-nowrap text-navy-700">
              <span dir="ltr">{formatDZD(s.priceDzd, locale)}</span>
            </Td>
            <Td>{s.isActive ? <Badge tone="green">{t("active")}</Badge> : <Badge tone="gray">{t("inactive")}</Badge>}</Td>
            <Td>
              <div className="flex justify-end gap-1">
                <ButtonLink href={`/admin/services/${s.id}`} variant="ghost" size="sm" aria-label={t("edit")}>
                  <Pencil className="size-4" aria-hidden />
                </ButtonLink>
                <form action={deleteServiceAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="grid size-9 place-items-center rounded-full text-red-600 hover:bg-red-50" aria-label={t("delete")}>
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </form>
              </div>
            </Td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
