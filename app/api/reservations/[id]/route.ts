import { updateReservationStatus } from "@/lib/data";
import { sendCancellationEmail, sendCompletionEmail } from "@/lib/email";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!["confirmed", "cancelled", "completed"].includes(status)) {
    return Response.json({ error: "Nevažeći status" }, { status: 400 });
  }

  const updated = await updateReservationStatus(id, status);

  if (!updated) {
    return Response.json({ error: "Rezervacija nije pronađena" }, { status: 404 });
  }

  // Notify customer on status change (fire-and-forget)
  if (status === "cancelled") {
    sendCancellationEmail(updated).catch(() => {});
  } else if (status === "completed") {
    sendCompletionEmail(updated).catch(() => {});
  }

  return Response.json(updated);
}
