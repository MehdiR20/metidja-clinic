import { useLocale, useTranslations } from "next-intl";
import { Languages, Video } from "lucide-react";
import type { Department, Doctor } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import { formatDZD, tr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/primitives";
import { DoctorAvatar } from "@/components/ui/icons";

export function DoctorCard({ doctor }: { doctor: Doctor & { department: Department } }) {
  const locale = useLocale();
  const t = useTranslations("doctors");
  return (
    <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-lift">
      <div className="flex items-start gap-4">
        <DoctorAvatar name={doctor.name} photoUrl={doctor.photoUrl} />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-ink">
            <Link href={`/doctors/${doctor.slug}`} className="hover:text-brand-700">
              {doctor.name}
            </Link>
          </h3>
          <p className="text-sm font-semibold text-brand-600">{tr(doctor.title, locale)}</p>
          <p className="mt-0.5 text-xs text-muted">{tr(doctor.department.name, locale)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge tone="gray">
          <Languages className="size-3.5" aria-hidden />
          {doctor.languages.map((l) => t(`languageNames.${l}`)).join(" · ")}
        </Badge>
        {doctor.acceptsTelehealth && (
          <Badge tone="navy">
            <Video className="size-3.5" aria-hidden />
            {t("telehealth")}
          </Badge>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <p className="text-sm text-muted">
          {t("fee")} <span className="block font-display text-lg font-extrabold text-navy-700" dir="ltr">{formatDZD(doctor.consultationFee, locale)}</span>
        </p>
        <div className="flex gap-2">
          <ButtonLink href={`/doctors/${doctor.slug}`} variant="ghost" size="sm">
            {t("viewProfile")}
          </ButtonLink>
          <ButtonLink href={{ pathname: "/booking", query: { doctor: doctor.id } }} size="sm">
            {t("book")}
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
