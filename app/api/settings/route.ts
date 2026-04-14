import { getSettings, updateSettings } from "@/lib/data";

export async function GET() {
  const settings = await getSettings();
  return Response.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const success = await updateSettings(body);

  if (!success) {
    return Response.json({ error: "Greška pri čuvanju" }, { status: 500 });
  }

  return Response.json({ success: true });
}
