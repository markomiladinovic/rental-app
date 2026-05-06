import { createAccessToken } from "@/lib/data";
import { sendMagicLinkEmail } from "@/lib/email";
import { isValidEmail } from "@/lib/validation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rental-app-kappa-flame.vercel.app";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !isValidEmail(email)) {
    return Response.json({ error: "Email nije validan" }, { status: 400 });
  }

  const token = await createAccessToken(email, 60);
  if (!token) {
    return Response.json({ error: "Greška pri kreiranju pristupa" }, { status: 500 });
  }

  const link = `${SITE_URL}/moje-rezervacije?token=${token}`;
  try {
    await sendMagicLinkEmail(email, link);
  } catch {
    return Response.json({ error: "Greška pri slanju email-a" }, { status: 500 });
  }

  return Response.json({ success: true });
}
