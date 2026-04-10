import { updateReservationStatus } from "@/lib/data";
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

  return Response.json(updated);
}
