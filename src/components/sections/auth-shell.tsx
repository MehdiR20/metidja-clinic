import Image from "next/image";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/primitives";

/** Two-column card used by the login & register pages. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <Container className="py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-lift lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image src="/images/maternity-room-2.jpg" alt="" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-900/20 to-transparent" />
          <p className="absolute inset-x-8 bottom-8 flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="size-5 text-brand-300" aria-hidden /> Loi 18-07 · HTTPS · bcrypt
          </p>
        </div>
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold text-navy-700">{title}</h1>
          <p className="mt-2 mb-8 text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </Container>
  );
}
