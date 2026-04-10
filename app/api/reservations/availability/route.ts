import { getReservationsForProduct } from "@/lib/data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const productId = searchParams.get("productId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!productId || !from || !to) {
    return Response.json({ error: "Nedostaju parametri" }, { status: 400 });
  }

  const reservations = await getReservationsForProduct(productId, from, to);

  // Build a set of all booked dates
  const bookedDates: string[] = [];
  for (const r of reservations) {
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      if (!bookedDates.includes(dateStr)) {
        bookedDates.push(dateStr);
      }
    }
  }

  return Response.json({ bookedDates, reservations });
}
