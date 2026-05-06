import { consumeAccessToken, getReservationsByEmail } from "@/lib/data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return Response.json({ error: "Nedostaje token" }, { status: 400 });
  }

  const result = await consumeAccessToken(token);
  if (!result) {
    return Response.json({ error: "Token nije validan ili je istekao" }, { status: 401 });
  }

  const reservations = await getReservationsByEmail(result.email);
  return Response.json({ email: result.email, reservations });
}
