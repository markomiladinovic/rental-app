import { consumeAccessToken, getReservationsByEmail, updateReservationStatus } from "@/lib/data";
import { sendCancellationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const { token, reservationId } = await request.json();

  if (!token || !reservationId) {
    return Response.json({ error: "Nedostaju parametri" }, { status: 400 });
  }

  const result = await consumeAccessToken(token);
  if (!result) {
    return Response.json({ error: "Token nije validan ili je istekao" }, { status: 401 });
  }

  // Verify reservation belongs to this email
  const reservations = await getReservationsByEmail(result.email);
  const target = reservations.find((r) => r.id === reservationId);
  if (!target) {
    return Response.json({ error: "Rezervacija nije pronađena" }, { status: 404 });
  }

  if (target.status !== "confirmed") {
    return Response.json({ error: "Samo aktivne rezervacije se mogu otkazati" }, { status: 400 });
  }

  // Disallow cancelling reservations that already started today or earlier
  const today = new Date().toISOString().split("T")[0];
  if (target.startDate <= today) {
    return Response.json({ error: "Ova rezervacija ne može više biti otkazana online — javi nam se telefonom." }, { status: 400 });
  }

  const updated = await updateReservationStatus(reservationId, "cancelled");
  if (!updated) {
    return Response.json({ error: "Greška pri otkazivanju" }, { status: 500 });
  }

  sendCancellationEmail(updated).catch(() => {});

  return Response.json({ success: true });
}
