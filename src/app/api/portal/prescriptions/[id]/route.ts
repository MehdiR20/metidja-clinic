import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isStaffRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CLINIC } from "@/lib/clinic";
import { formatDate, tr } from "@/lib/format";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Printable prescription summary (the browser's "Save as PDF" produces the download).
 * Access: the owning patient, or clinic staff.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const rx = await prisma.prescription.findUnique({
    where: { id },
    include: { doctor: { include: { department: true } }, user: { select: { id: true, name: true } } },
  });
  // 404 (not 403) so ids belonging to other patients are not disclosed
  if (!rx || (rx.userId !== user.id && !isStaffRole(user.role))) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const locale = ["fr", "ar", "en"].includes(req.nextUrl.searchParams.get("locale") ?? "") ? req.nextUrl.searchParams.get("locale")! : "fr";
  const items = rx.items as { drug: string; dosage: string; duration: string }[];

  const html = `<!doctype html>
<html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ordonnance — ${esc(rx.user.name)}</title>
<style>
  body{font-family:system-ui,sans-serif;color:#0f2a33;max-width:720px;margin:40px auto;padding:0 24px}
  header{display:flex;justify-content:space-between;border-bottom:3px solid #17a2b2;padding-bottom:16px}
  h1{color:#1e2f70;margin:0;font-size:22px} .muted{color:#557079;font-size:14px}
  ol{padding-inline-start:20px} li{margin:14px 0} .drug{font-weight:700}
  footer{margin-top:48px;border-top:1px solid #cff4f7;padding-top:12px;font-size:12px;color:#557079}
  @media print{button{display:none}}
</style>
</head>
<body>
<header>
  <div><h1>${esc(CLINIC.name)}</h1><div class="muted">${esc(CLINIC.address.display)} · ${esc(CLINIC.phones.main)}</div></div>
  <div class="muted" style="text-align:end">${esc(formatDate(rx.issuedAt, locale, { dateStyle: "long" }))}</div>
</header>
<p><strong>${esc(rx.doctor.name)}</strong> — ${esc(tr(rx.doctor.department.name, locale))}</p>
<p>Patient : <strong>${esc(rx.user.name)}</strong></p>
<ol>${items.map((i) => `<li><span class="drug">${esc(i.drug)}</span><br>${esc(i.dosage)} — ${esc(i.duration)}</li>`).join("")}</ol>
${rx.notes ? `<p class="muted">${esc(rx.notes)}</p>` : ""}
<button onclick="window.print()">Imprimer / PDF</button>
<footer>Document généré depuis l'espace patient — réf. ${esc(rx.id)}</footer>
</body></html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'",
    },
  });
}
