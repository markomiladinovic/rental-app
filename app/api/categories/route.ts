import { getCategories, updateCategory, createCategory } from "@/lib/data";

export async function GET() {
  const categories = await getCategories();
  return Response.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const category = await createCategory(body);

  if (!category) {
    return Response.json({ error: "Greška pri kreiranju kategorije" }, { status: 500 });
  }

  return Response.json(category, { status: 201 });
}

export async function PUT(request: Request) {
  const category = await request.json();
  const updated = await updateCategory(category);

  if (!updated) {
    return Response.json({ error: "Kategorija nije pronađena" }, { status: 404 });
  }

  return Response.json(updated);
}
