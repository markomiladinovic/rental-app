// Lightweight validators + sanitizers (no external dependency)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Permissive phone: digits, spaces, +, -, (, ), 6-20 chars
const PHONE_RE = /^[+]?[\d\s\-()]{6,20}$/;

export function isValidEmail(value: string): boolean {
  return typeof value === "string" && EMAIL_RE.test(value.trim()) && value.length <= 254;
}

export function isValidPhone(value: string): boolean {
  return typeof value === "string" && PHONE_RE.test(value.trim());
}

// Strip HTML tags and trim, then enforce length range
export function sanitizeText(value: unknown, maxLen: number, minLen = 0): string | null {
  if (typeof value !== "string") return null;
  // Remove anything that looks like HTML/JS
  const cleaned = value.replace(/<[^>]*>/g, "").trim();
  if (cleaned.length < minLen) return null;
  if (cleaned.length > maxLen) return null;
  return cleaned;
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function validateContact(body: Record<string, unknown>): ValidationResult<{
  name: string;
  email: string;
  message: string;
}> {
  const name = sanitizeText(body.name, 100, 2);
  if (!name) return { ok: false, error: "Ime mora imati 2-100 karaktera" };

  if (typeof body.email !== "string" || !isValidEmail(body.email)) {
    return { ok: false, error: "Email nije validan" };
  }

  const message = sanitizeText(body.message, 5000, 5);
  if (!message) return { ok: false, error: "Poruka mora imati 5-5000 karaktera" };

  return { ok: true, data: { name, email: body.email.trim(), message } };
}

export function validateTestimonial(body: Record<string, unknown>): ValidationResult<{
  name: string;
  activity: string;
  text: string;
  rating: number;
  status?: string;
}> {
  const name = sanitizeText(body.name, 60, 2);
  if (!name) return { ok: false, error: "Ime mora imati 2-60 karaktera" };

  const activity = sanitizeText(body.activity, 60, 2);
  if (!activity) return { ok: false, error: "Aktivnost mora imati 2-60 karaktera" };

  const text = sanitizeText(body.text, 2000, 5);
  if (!text) return { ok: false, error: "Tekst utiska mora imati 5-2000 karaktera" };

  const rating = typeof body.rating === "number" ? body.rating : Number(body.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Ocena mora biti između 1 i 5" };
  }

  const status = typeof body.status === "string" ? body.status : undefined;
  return { ok: true, data: { name, activity, text, rating, status } };
}

export function validateReservationItem(item: Record<string, unknown>): string | null {
  const customerName = sanitizeText(item.customerName, 100, 2);
  if (!customerName) return "Ime nije validno";

  if (typeof item.customerEmail !== "string" || !isValidEmail(item.customerEmail)) {
    return "Email nije validan";
  }

  if (typeof item.customerPhone !== "string" || !isValidPhone(item.customerPhone)) {
    return "Broj telefona nije validan";
  }

  // Note is optional
  if (item.note !== undefined && item.note !== null && item.note !== "") {
    if (sanitizeText(item.note, 1000) === null) return "Napomena nije validna";
  }

  if (typeof item.startDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(item.startDate)) {
    return "Datum nije validan";
  }

  if (typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 50) {
    return "Količina nije validna";
  }

  return null;
}
