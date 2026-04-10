import { getCategories, saveCategories } from "@/lib/data";

export async function GET() {
  const categories = await getCategories();
  return Response.json(categories);
}

export async function PUT(request: Request) {
  const category = await request.json();
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === category.id);

  if (index === -1) {
    return Response.json({ error: "Kategorija nije pronađena" }, { status: 404 });
  }

  categories[index] = { ...categories[index], ...category };
  await saveCategories(categories);

  return Response.json(categories[index]);
}
