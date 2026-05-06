import { getReservationsForProduct, getProducts } from "@/lib/data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const productId = searchParams.get("productId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!productId || !from || !to) {
    return Response.json({ error: "Nedostaju parametri" }, { status: 400 });
  }

  const products = await getProducts();
  const product = products.find((p) => p.id === productId);
  const stock = product?.stock ?? 1;

  const reservations = await getReservationsForProduct(productId, from, to);

  // For each date, sum up reserved quantities and mark as booked only when >= stock
  const reservedByDate: Record<string, number> = {};
  for (const r of reservations) {
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      reservedByDate[dateStr] = (reservedByDate[dateStr] || 0) + r.quantity;
    }
  }

  const bookedDates: string[] = [];
  for (const [dateStr, qty] of Object.entries(reservedByDate)) {
    if (qty >= stock) bookedDates.push(dateStr);
  }

  return Response.json({ bookedDates, reservations, stock, reservedByDate });
}
