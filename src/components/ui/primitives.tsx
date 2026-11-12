import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-brand-100/80 bg-white shadow-soft", className)} {...props} />;
}

const BADGE_TONES = {
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  navy: "bg-navy-700/5 text-navy-700 ring-navy-700/15",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  gray: "bg-slate-50 text-slate-600 ring-slate-200",
} as const;
export type BadgeTone = keyof typeof BADGE_TONES;

export function Badge({ tone = "brand", className, ...props }: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", BADGE_TONES[tone], className)}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-2 text-sm font-bold tracking-wide text-brand-500 uppercase">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold tracking-tight text-brand-800 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-lg leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
}

/** Decorative flowing lines, echoing the clinic's social-media artwork. */
export function Waves({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 400 200" fill="none" className={cn("pointer-events-none", className)}>
      <path d="M0 150C80 90 160 200 260 130S380 60 400 80" stroke="currentColor" strokeWidth="2" opacity=".5" />
      <path d="M0 170C90 110 170 215 270 150S385 85 400 100" stroke="currentColor" strokeWidth="1.5" opacity=".35" />
      <path d="M0 190C100 130 180 230 280 170S390 110 400 120" stroke="currentColor" strokeWidth="1" opacity=".25" />
    </svg>
  );
}

/** Coloured band at the top of inner pages. */
export function PageHeader({ title, subtitle, children }: { title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100/60">
      <Waves className="absolute -end-10 -bottom-6 w-[520px] text-brand-400" />
      <Container className="relative py-12 sm:py-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-800 uppercase sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{subtitle}</p>}
        {children}
      </Container>
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-10 text-center text-muted">{children}</p>;
}
