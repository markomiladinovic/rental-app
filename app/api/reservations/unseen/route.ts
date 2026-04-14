import { getUnseenReservationCount, markReservationsSeen } from "@/lib/data";

export async function GET() {
  const count = await getUnseenReservationCount();
  return Response.json({ count });
}

export async function POST() {
  await markReservationsSeen();
  return Response.json({ success: true });
}
