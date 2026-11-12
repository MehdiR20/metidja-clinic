import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/slots";

const query = z.object({
  doctorId: z.string().min(1).max(40),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(req: NextRequest) {
  const parsed = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  try {
    const slots = await getAvailableSlots(parsed.data.doctorId, parsed.data.date);
    return NextResponse.json({ slots }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
