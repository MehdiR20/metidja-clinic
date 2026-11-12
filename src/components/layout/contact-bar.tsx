import { useTranslations } from "next-intl";
import { CalendarPlus, MessageCircle, Phone, Siren } from "lucide-react";
import { CLINIC, telHref, whatsappHref } from "@/lib/clinic";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/primitives";

/** Top emergency strip (all screens). */
export function ContactBar() {
  const t = useTranslations("contactBar");
  return (
    <div className="bg-navy-800 text-white">
      <Container className="flex h-10 items-center justify-between gap-4 text-sm">
        <p className="flex min-w-0 items-center gap-2 font-semibold">
          <Siren className="size-4 shrink-0 text-red-400" aria-hidden />
          <span className="truncate">{t("emergency")}</span>
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <a href={telHref()} className="flex items-center gap-1.5 font-semibold hover:text-brand-200" dir="ltr">
            <Phone className="size-4" aria-hidden />
            <span className="hidden sm:inline">{CLINIC.phones.main}</span>
            <span className="sm:hidden">{t("call")}</span>
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 font-semibold hover:text-brand-200 sm:flex"
          >
            <MessageCircle className="size-4" aria-hidden />
            {t("whatsapp")}
          </a>
        </div>
      </Container>
    </div>
  );
}

/** Sticky thumb-reach action bar on phones. */
export function MobileActionBar() {
  const t = useTranslations();
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-semibold";
  return (
    <nav
      aria-label={t("contactBar.emergency")}
      className="no-print fixed inset-x-0 bottom-0 z-40 flex border-t border-brand-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <a href={telHref()} className={`${item} text-red-600`}>
        <Phone className="size-5" aria-hidden />
        {t("contactBar.call")}
      </a>
      <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={`${item} text-[#128C7E]`}>
        <MessageCircle className="size-5" aria-hidden />
        {t("contactBar.whatsapp")}
      </a>
      <Link href="/booking" className={`${item} bg-brand-500 text-white`}>
        <CalendarPlus className="size-5" aria-hidden />
        {t("nav.book")}
      </Link>
    </nav>
  );
}
