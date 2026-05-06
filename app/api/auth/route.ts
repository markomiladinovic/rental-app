import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminByEmail } from "@/lib/data";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function generateToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "fallback-secret";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2);
  return Buffer.from(`${secret}-${timestamp}-${random}`).toString("base64");
}

async function verifyPassword(input: string, stored: string): Promise<boolean> {
  // Bcrypt hashes start with $2a$, $2b$ or $2y$
  if (stored.startsWith("$2")) {
    return bcrypt.compare(input, stored);
  }
  // Legacy plaintext fallback (will be removed once all admins are migrated)
  return input === stored;
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const admin = await getAdminByEmail(email);

  if (!admin || !(await verifyPassword(password, admin.password))) {
    return Response.json({ error: "Pogrešan email ili lozinka" }, { status: 401 });
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
