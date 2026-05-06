import { NextRequest } from "next/server";
import { getActiveWaitlist, getProducts, getReservationsForProduct, markWaitlistNotified } from "@/lib/data";
import { sendWaitlistAvailableEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rental-app-kappa-flame.vercel.app";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return token === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Neautorizovano" }, { status: 401 });
  }

  const waitlist = await getActiveWaitlist();
  if (waitlist.length === 0) {
    return Response.json({ ok: true, sent: 0 });
  }

  const products = await getProducts();
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Look at next 14 days; if any day has stock available, notify
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + 14);
  const horizonStr = horizon.toISOString().split("T")[0];

  // Group waitlist by product to avoid duplicate availability fetches
  const byProduct = new Map<string, typeof waitlist>();
  for (const entry of waitlist) {
    if (!byProduct.has(entry.productId)) byProduct.set(entry.productId, []);
    byProduct.get(entry.productId)!.push(entry);
  }

  const notifiedIds: string[] = [];
  let sent = 0;

  for (const [productId, entries] of byProduct.entries()) {
    const product = productMap.get(productId);
    if (!product || !product.available) continue;

    const stock = product.stock ?? 1;
    const reservations = await getReservationsForProduct(productId, todayStr, horizonStr);

    // For each day in next 14 days, sum reserved quantity
    let hasAvailability = false;
    for (let d = new Date(today); d <= horizon; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().split("T")[0];
      let reserved = 0;
      for (const r of reservations) {
        if (ds >= r.startDate && ds <= r.endDate) reserved += r.quantity;
      }
      if (reserved < stock) {
        hasAvailability = true;
        break;
      }
    }

    if (!hasAvailability) continue;

    // Notify each waitlisted email for this product
    for (const entry of entries) {
      try {
        const link = `${SITE_URL}/rentals/${entry.productSlug}`;
        await sendWaitlistAvailableEmail(entry.email, entry.productName, link);
        notifiedIds.push(entry.id);
        sent++;
      } catch {
        // continue with others
      }
    }
  }

  await markWaitlistNotified(notifiedIds);

  return Response.json({ ok: true, sent, total: waitlist.length });
}
