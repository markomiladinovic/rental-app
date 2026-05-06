import { addWaitlistEntry, getProducts } from "@/lib/data";
import { isValidEmail } from "@/lib/validation";

export async function POST(request: Request) {
  const { productId, email } = await request.json();

  if (!productId || typeof productId !== "string") {
    return Response.json({ error: "Nedostaje productId" }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return Response.json({ error: "Email nije validan" }, { status: 400 });
  }

  const products = await getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return Response.json({ error: "Proizvod nije pronađen" }, { status: 404 });
  }

  const ok = await addWaitlistEntry(product.id, product.slug, product.name, email);
  if (!ok) {
    return Response.json({ error: "Greška pri prijavi" }, { status: 500 });
  }

  return Response.json({ success: true });
}
