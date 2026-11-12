import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminTitle({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-extrabold text-navy-700">{children}</h1>
      {actions}
    </div>
  );
}

/** Responsive table wrapper: scrolls horizontally on small screens instead of breaking layout. */
export function DataTable({ head, children, empty }: { head: ReactNode[]; children: ReactNode; empty?: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-soft">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-brand-50/60 text-xs text-muted uppercase">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 text-start font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-50">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-top", className)}>{children}</td>;
}

export const compactSelect =
  "rounded-lg border border-brand-100 bg-white px-2 py-1.5 text-sm focus:border-brand-400 focus:outline-none";
