import { sendContactEmail } from "@/lib/email";
import { validateContact } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const result = validateContact(body);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  try {
    await sendContactEmail(result.data);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Greška pri slanju poruke" }, { status: 500 });
  }
}
