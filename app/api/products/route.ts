import { getProducts, saveProducts } from "@/lib/data";

export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

export async function PUT(request: Request) {
  const product = await request.json();
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === product.id);

  if (index === -1) {
    return Response.json({ error: "Proizvod nije pronađen" }, { status: 404 });
  }

  products[index] = { ...products[index], ...product };
  await saveProducts(products);

  return Response.json(products[index]);
}
