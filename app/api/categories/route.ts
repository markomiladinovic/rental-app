import { getCategories, updateCategory } from "@/lib/data";

export async function GET() {
  const categories = await getCategories();
  return Response.json(categories);
}

export async function PUT(request: Request) {
  const category = await request.json();
  const updated = await updateCategory(category);

  if (!updated) {
    return Response.json({ error: "Kategorija nije pronađena" }, { status: 404 });
  }

  return Response.json(updated);
}
