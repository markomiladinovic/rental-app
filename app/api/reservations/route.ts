import { getAllReservations, createReservation, createReservationGroup } from "@/lib/data";
import { sendReservationEmail, sendGroupReservationEmail } from "@/lib/email";

export async function GET() {
  const reservations = await getAllReservations();
  return Response.json(reservations);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Batch (cart) reservation
  if (Array.isArray(body.items) && body.items.length > 0) {
    const reservations = await createReservationGroup(body.items);
    if (!reservations) {
      return Response.json({ error: "Greška pri kreiranju rezervacije" }, { status: 500 });
    }

    sendGroupReservationEmail(reservations).catch(() => {});

    return Response.json(reservations, { status: 201 });
  }

  // Single reservation (backward compatible)
  const reservation = await createReservation(body);

  if (!reservation) {
    return Response.json({ error: "Greška pri kreiranju rezervacije" }, { status: 500 });
  }

  sendReservationEmail({
    productName: reservation.productName,
    customerName: reservation.customerName,
    customerEmail: reservation.customerEmail,
    customerPhone: reservation.customerPhone,
    startDate: reservation.startDate,
    startTime: reservation.startTime,
    endDate: reservation.endDate,
    durationType: reservation.durationType,
    hours: reservation.hours,
    quantity: reservation.quantity,
    totalPrice: reservation.totalPrice,
    note: reservation.note,
  }).catch(() => {});

  return Response.json(reservation, { status: 201 });
}
