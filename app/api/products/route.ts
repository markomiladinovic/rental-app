import { getProducts, updateProduct, createProduct } from "@/lib/data";

export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await createProduct(body);

  if (!product) {
    return Response.json({ error: "Greška pri kreiranju proizvoda" }, { status: 500 });
  }

  return Response.json(product, { status: 201 });
}

export async function PUT(request: Request) {
  const product = await request.json();
  const updated = await updateProduct(product);

  if (!updated) {
    return Response.json({ error: "Proizvod nije pronađen" }, { status: 404 });
  }

  return Response.json(updated);
}
