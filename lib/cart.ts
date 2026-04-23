export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  pricePerHour: number;
  pricePerDay: number;
  durationType: "hour" | "day";
  quantity: number;
};

const KEY = "rental_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-changed"));
}

export function addToCart(item: CartItem) {
  const items = getCart();
  const existingIndex = items.findIndex(
    (x) => x.productId === item.productId && x.durationType === item.durationType
  );
  if (existingIndex >= 0) {
    items[existingIndex].quantity += item.quantity;
  } else {
    items.push(item);
  }
  saveCart(items);
}

export function removeFromCart(productId: string, durationType: "hour" | "day") {
  const items = getCart().filter(
    (x) => !(x.productId === productId && x.durationType === durationType)
  );
  saveCart(items);
}

export function updateCartQuantity(productId: string, durationType: "hour" | "day", quantity: number) {
  if (quantity < 1) return removeFromCart(productId, durationType);
  const items = getCart();
  const idx = items.findIndex((x) => x.productId === productId && x.durationType === durationType);
  if (idx >= 0) {
    items[idx].quantity = quantity;
    saveCart(items);
  }
}

export function clearCart() {
  saveCart([]);
}

export function cartCount(): number {
  return getCart().reduce((sum, it) => sum + it.quantity, 0);
}
