import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function generateToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "fallback-secret";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2);
  // Simple token: base64(secret-timestamp-random)
  return Buffer.from(`${secret}-${timestamp}-${random}`).toString("base64");
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return Response.json({ error: "Admin lozinka nije konfigurisana" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return Response.json({ error: "Pogrešna lozinka" }, { status: 401 });
  }

  const token = generateToken();
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return Response.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return Response.json({ success: true });
}
