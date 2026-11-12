import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { LogoMark } from "@/components/layout/logo";

export default function NotFound() {
  const t = useTranslations("errors");
  return (
    <Container className="grid min-h-dvh place-items-center py-20 text-center">
      <div>
        <LogoMark className="mx-auto size-16" />
        <p className="mt-6 font-display text-6xl font-extrabold text-brand-500">404</p>
        <h1 className="mt-2 text-2xl font-bold text-navy-700">{t("notFoundTitle")}</h1>
        <p className="mt-2 text-muted">{t("notFoundText")}</p>
        <ButtonLink href="/" className="mt-8">{t("backHome")}</ButtonLink>
      </div>
    </Container>
  );
}
