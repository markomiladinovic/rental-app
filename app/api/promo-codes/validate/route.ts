import { findPromoCode, validatePromoCode } from "@/lib/data";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return Response.json({ valid: false, error: "Unesi kod" }, { status: 400 });
  }

  const promo = await findPromoCode(code);
  if (!promo) {
    return Response.json({ valid: false, error: "Kod nije pronađen" }, { status: 404 });
  }

  const check = validatePromoCode(promo);
  if (!check.ok) {
    return Response.json({ valid: false, error: check.reason }, { status: 400 });
  }

  return Response.json({
    valid: true,
    code: promo.code,
    discountPercent: promo.discountPercent,
  });
}
