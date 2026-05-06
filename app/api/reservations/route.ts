import { getAllReservations, createReservation, createReservationGroup, getProducts, getReservationsForProduct } from "@/lib/data";
import { sendReservationEmail, sendGroupReservationEmail } from "@/lib/email";
import { validateReservationItem } from "@/lib/validation";

export async function GET() {
  const reservations = await getAllReservations();
  return Response.json(reservations);
}

type IncomingItem = {
  productId: string;
  productName: string;
  startDate: string;
  endDate: string;
  quantity: number;
};

// Returns null if all OK, or { productName, dates: string[] } describing the conflict
async function checkStockOrConflict(
  items: IncomingItem[]
): Promise<{ productName: string; dates: string[] } | null> {
  const products = await getProducts();

  // Aggregate requested quantity per (productId × date)
  const requestedByProductDate: Record<string, Record<string, number>> = {};
  for (const it of items) {
    const start = new Date(it.startDate);
    const end = new Date(it.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().split("T")[0];
      if (!requestedByProductDate[it.productId]) requestedByProductDate[it.productId] = {};
      requestedByProductDate[it.productId][ds] =
        (requestedByProductDate[it.productId][ds] || 0) + it.quantity;
    }
  }

  for (const [productId, dateMap] of Object.entries(requestedByProductDate)) {
    const product = products.find((p) => p.id === productId);
    if (!product) continue;
    const stock = product.stock ?? 1;

    const dates = Object.keys(dateMap);
    const minDate = dates.reduce((min, d) => (d < min ? d : min), dates[0]);
    const maxDate = dates.reduce((max, d) => (d > max ? d : max), dates[0]);

    const existing = await getReservationsForProduct(productId, minDate, maxDate);
    const reservedByDate: Record<string, number> = {};
    for (const r of existing) {
      const s = new Date(r.startDate);
      const e = new Date(r.endDate);
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const ds = d.toISOString().split("T")[0];
        reservedByDate[ds] = (reservedByDate[ds] || 0) + r.quantity;
      }
    }

    const conflictDates: string[] = [];
    for (const [ds, requested] of Object.entries(dateMap)) {
      const alreadyReserved = reservedByDate[ds] || 0;
      if (alreadyReserved + requested > stock) conflictDates.push(ds);
    }

    if (conflictDates.length > 0) {
      return { productName: product.name, dates: conflictDates.sort() };
    }
  }

  return null;
}

export async function POST(request: Request) {
  const body = await request.json();

  // Batch (cart) reservation
  if (Array.isArray(body.items) && body.items.length > 0) {
    for (const item of body.items) {
      const err = validateReservationItem(item);
      if (err) return Response.json({ error: err }, { status: 400 });
    }

    const conflict = await checkStockOrConflict(body.items);
    if (conflict) {
      return Response.json(
        {
          error: `${conflict.productName} nije dostupan u traženoj količini za: ${conflict.dates.join(", ")}`,
        },
        { status: 409 }
      );
    }

    const reservations = await createReservationGroup(body.items);
    if (!reservations) {
      return Response.json({ error: "Greška pri kreiranju rezervacije" }, { status: 500 });
    }

    sendGroupReservationEmail(reservations).catch(() => {});

    return Response.json(reservations, { status: 201 });
  }

  // Single reservation (backward compatible)
  const validationErr = validateReservationItem(body);
  if (validationErr) {
    return Response.json({ error: validationErr }, { status: 400 });
  }

  const conflict = await checkStockOrConflict([body]);
  if (conflict) {
    return Response.json(
      {
        error: `${conflict.productName} nije dostupan u traženoj količini za: ${conflict.dates.join(", ")}`,
      },
      { status: 409 }
    );
  }

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
