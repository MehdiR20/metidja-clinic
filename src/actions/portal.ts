"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function cancelMyAppointmentAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  // Ownership is enforced in the WHERE clause — a patient can only cancel their own future appointments
  await prisma.appointment.updateMany({
    where: { id, userId: user.id, startsAt: { gt: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/[locale]/portal", "page");
}
