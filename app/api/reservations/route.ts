import { getAllReservations, createReservation } from "@/lib/data";

export async function GET() {
  const reservations = await getAllReservations();
  return Response.json(reservations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const reservation = await createReservation(body);

  if (!reservation) {
    return Response.json({ error: "Greška pri kreiranju rezervacije" }, { status: 500 });
  }

  return Response.json(reservation, { status: 201 });
}
