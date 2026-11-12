import { cn } from "@/lib/utils";

/**
 * Simplified "CM" monogram in the clinic's turquoise.
 * Replace with the official vector logo (e.g. /public/brand/logo.svg) when available.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("size-10", className)}>
      <defs>
        <linearGradient id="cm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34bccc" />
          <stop offset="1" stopColor="#138396" />
        </linearGradient>
      </defs>
      <path d="M44 14.5A22 22 0 1 0 44 49.5" fill="none" stroke="url(#cm-g)" strokeWidth="7" strokeLinecap="round" />
      <path d="M22 44V24l10 12 10-12v20" fill="none" stroke="#1e2f70" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="leading-none">
        <span className={cn("block font-display text-[0.7rem] font-semibold tracking-[0.2em] uppercase", inverted ? "text-brand-200" : "text-brand-500")}>
          Clinique
        </span>
        <span className={cn("block font-display text-lg font-extrabold tracking-tight", inverted ? "text-white" : "text-navy-700")}>
          Metidja <span className={inverted ? "text-brand-300" : "text-brand-500"}>Al Djazair</span>
        </span>
      </span>
    </span>
  );
}
