import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { updateInquiryAction } from "@/actions/admin";
import { EmptyState } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/ui/icons";
import { SubmitButton } from "@/components/ui/submit-button";
import { AdminTitle, DataTable, Td, compactSelect } from "@/components/admin/ui";

const STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED"] as const;

export default async function AdminInquiries({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const inquiries = await prisma.inquiry.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 200 });

  return (
    <>
      <AdminTitle>{t("admin.inquiries")}</AdminTitle>
      <DataTable
        head={[t("admin.contact"), t("admin.subject"), t("admin.received"), t("admin.status")]}
        empty={inquiries.length === 0 && <div className="p-6"><EmptyState>{t("admin.empty")}</EmptyState></div>}
      >
        {inquiries.map((q) => (
          <tr key={q.id}>
            <Td>
              <span className="font-semibold text-ink">{q.name}</span>
              <a href={`tel:${q.phone}`} className="block text-xs text-brand-700" dir="ltr">{q.phone}</a>
              {q.email && <a href={`mailto:${q.email}`} className="block text-xs text-muted" dir="ltr">{q.email}</a>}
            </Td>
            <Td className="max-w-md">
              <span className="flex items-center gap-2 font-semibold text-ink">
                {q.subject} <StatusBadge status={q.type} />
              </span>
              <p className="mt-1 text-sm whitespace-pre-line text-muted">{q.message}</p>
            </Td>
            <Td>{formatDateTime(q.createdAt, locale)}</Td>
            <Td>
              <form action={updateInquiryAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={q.id} />
                <select name="status" defaultValue={q.status} className={compactSelect} aria-label={t("admin.status")}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{t(`status.${s}`)}</option>
                  ))}
                </select>
                <SubmitButton size="sm" variant="secondary">{t("admin.save")}</SubmitButton>
              </form>
            </Td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
