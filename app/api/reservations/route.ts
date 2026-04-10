import { getAllReservations, createReservation } from "@/lib/data";
import { sendReservationEmail } from "@/lib/email";

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

  // Send email notifications (don't block the response)
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
