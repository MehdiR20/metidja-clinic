import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eye, EyeOff, Pencil, Plus, Video } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDZD, tr } from "@/lib/format";
import { toggleDoctorAction } from "@/actions/admin";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { DoctorAvatar } from "@/components/ui/icons";
import { AdminTitle, DataTable, Td } from "@/components/admin/ui";

export default async function AdminDoctors({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const doctors = await prisma.doctor.findMany({
    include: { department: true, _count: { select: { appointments: true } } },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  return (
    <>
      <AdminTitle
        actions={
          <ButtonLink href="/admin/doctors/new">
            <Plus className="size-4" aria-hidden /> {t("newDoctor")}
          </ButtonLink>
        }
      >
        {t("doctors")}
      </AdminTitle>
      <DataTable head={[t("name"), t("department"), t("fee"), t("appointments"), t("status"), ""]}>
        {doctors.map((d) => (
          <tr key={d.id} className={d.isActive ? "" : "opacity-60"}>
            <Td>
              <div className="flex items-center gap-3">
                <DoctorAvatar name={d.name} className="size-10 rounded-xl text-sm" />
                <span>
                  <span className="block font-semibold text-ink">{d.name}</span>
                  <span className="block text-xs text-muted">{tr(d.title, locale)}</span>
                </span>
              </div>
            </Td>
            <Td className="text-muted">
              {tr(d.department.name, locale)}
              {d.acceptsTelehealth && (
                <Badge tone="navy" className="mt-1 flex w-fit">
                  <Video className="size-3" aria-hidden /> Tele
                </Badge>
              )}
            </Td>
            <Td className="whitespace-nowrap"><span dir="ltr">{formatDZD(d.consultationFee, locale)}</span></Td>
            <Td>{d._count.appointments}</Td>
            <Td>{d.isActive ? <Badge tone="green">{t("active")}</Badge> : <Badge tone="gray">{t("inactive")}</Badge>}</Td>
            <Td>
              <div className="flex justify-end gap-1">
                <ButtonLink href={`/admin/doctors/${d.id}`} variant="ghost" size="sm" aria-label={t("edit")}>
                  <Pencil className="size-4" aria-hidden />
                </ButtonLink>
                <form action={toggleDoctorAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <button
                    type="submit"
                    className="grid size-9 place-items-center rounded-full text-muted hover:bg-brand-50"
                    aria-label={d.isActive ? t("deactivate") : t("active")}
                    title={d.isActive ? t("deactivate") : t("active")}
                  >
                    {d.isActive ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
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
