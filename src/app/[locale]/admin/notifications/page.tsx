import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { AdminTitle, DataTable, Td } from "@/components/admin/ui";

export default async function AdminNotifications({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const logs = await prisma.notificationLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <>
      <AdminTitle>{t("notifications")}</AdminTitle>
      <p className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Info className="size-4 shrink-0" aria-hidden /> {t("mockNotice")}
      </p>
      <DataTable
        head={[t("channel"), t("to"), t("message"), t("date")]}
        empty={logs.length === 0 && <div className="p-6"><EmptyState>{t("empty")}</EmptyState></div>}
      >
        {logs.map((l) => (
          <tr key={l.id}>
            <Td><Badge tone={l.channel === "WHATSAPP" ? "green" : "brand"}>{l.channel}</Badge></Td>
            <Td><span dir="ltr">{l.to}</span></Td>
            <Td className="max-w-lg text-muted">{l.body}</Td>
            <Td className="whitespace-nowrap">{formatDateTime(l.createdAt, locale)}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
