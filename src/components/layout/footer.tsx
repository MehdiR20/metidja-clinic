import { useTranslations } from "next-intl";
import { Clock, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CLINIC } from "@/lib/clinic";
import { Container, Waves } from "@/components/ui/primitives";
import { Logo } from "./logo";
import { NAV_ITEMS } from "./header";

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="relative overflow-hidden bg-brand-950 pb-20 text-brand-100 md:pb-0">
      <Waves className="absolute -end-20 top-0 w-[600px] text-brand-500" />
      <Container className="relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <Logo inverted />
          <p className="max-w-sm leading-relaxed text-brand-100/80">{t("footer.about")}</p>
        </div>

        <div>
          <h2 className="mb-4 font-bold text-white">{t("footer.links")}</h2>
          <ul className="space-y-2 text-sm">
            {NAV_ITEMS.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-white">
                  {t(`nav.${i.key}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/portal" className="hover:text-white">
                {t("nav.portal")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-bold text-white">{t("footer.contact")}</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />
              {CLINIC.address.display}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />
              <span dir="ltr" className="space-y-1">
                <a href={`tel:+21328846225`} className="block hover:text-white">{CLINIC.phones.landline}</a>
                {CLINIC.phones.mobiles.map((p) => (
                  <a key={p} href={`tel:+213${p.replace(/\s/g, "").slice(1)}`} className="block hover:text-white">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />
              {t("contact.hoursValue")}
            </li>
          </ul>
        </div>
      </Container>
      <div className="relative border-t border-white/10">
        <Container className="py-5 text-xs text-brand-100/60">
          © {new Date().getFullYear()} {CLINIC.name}. {t("footer.rights")}
        </Container>
      </div>
    </footer>
  );
}
