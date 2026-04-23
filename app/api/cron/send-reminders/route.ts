import { NextRequest } from "next/server";
import { getPendingReminderReservations, markRemindersSent, type Reservation } from "@/lib/data";
import { sendReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

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

  // Calculate tomorrow's date (server time)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDate = tomorrow.toISOString().split("T")[0];

  const reservations = await getPendingReminderReservations(targetDate);

  if (reservations.length === 0) {
    return Response.json({ ok: true, sent: 0, date: targetDate });
  }

  // Group by booking_group_id (fallback: individual id for single reservations)
  const groups = new Map<string, Reservation[]>();
  for (const r of reservations) {
    const key = r.bookingGroupId || r.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  let sentCount = 0;
  const sentIds: string[] = [];

  for (const group of groups.values()) {
    try {
      await sendReminderEmail(group);
      sentCount++;
      for (const r of group) sentIds.push(r.id);
    } catch {
      // continue with other groups even if one fails
    }
  }

  await markRemindersSent(sentIds);

  return Response.json({ ok: true, sent: sentCount, reservations: sentIds.length, date: targetDate });
}
