import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return Response.json({ error: "Sva polja su obavezna" }, { status: 400 });
  }

  try {
    await sendContactEmail({ name, email, message });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Greška pri slanju poruke" }, { status: 500 });
  }
}
