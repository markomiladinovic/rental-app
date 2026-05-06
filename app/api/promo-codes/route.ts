import { getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from "@/lib/data";

export async function GET() {
  const codes = await getPromoCodes();
  return Response.json(codes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const created = await createPromoCode(body);

  if (!created) {
    return Response.json({ error: "Greška pri kreiranju (možda je kod već zauzet)" }, { status: 500 });
  }

  return Response.json(created, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updated = await updatePromoCode(body);

  if (!updated) {
    return Response.json({ error: "Kod nije pronađen" }, { status: 404 });
  }

  return Response.json(updated);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const success = await deletePromoCode(id);

  if (!success) {
    return Response.json({ error: "Greška pri brisanju" }, { status: 500 });
  }

  return Response.json({ success: true });
}
