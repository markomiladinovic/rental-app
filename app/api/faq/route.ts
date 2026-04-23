import { getFaq, createFaq, updateFaq, deleteFaq } from "@/lib/data";

export async function GET() {
  const items = await getFaq();
  return Response.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await createFaq(body);

  if (!item) {
    return Response.json({ error: "Greška pri kreiranju" }, { status: 500 });
  }

  return Response.json(item, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updated = await updateFaq(body);

  if (!updated) {
    return Response.json({ error: "Pitanje nije pronađeno" }, { status: 404 });
  }

  return Response.json(updated);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const success = await deleteFaq(id);

  if (!success) {
    return Response.json({ error: "Greška pri brisanju" }, { status: 500 });
  }

  return Response.json({ success: true });
}
