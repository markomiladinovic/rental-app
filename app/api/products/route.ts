import { getProducts, updateProduct } from "@/lib/data";

export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

export async function PUT(request: Request) {
  const product = await request.json();
  const updated = await updateProduct(product);

  if (!updated) {
    return Response.json({ error: "Proizvod nije pronađen" }, { status: 404 });
  }

  return Response.json(updated);
}
