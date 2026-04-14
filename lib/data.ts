import { supabase } from "./supabase";
import type { Product } from "@/data/products";
import type { GalleryImage } from "@/data/gallery";

export type Category = {
  id: string;
  label: string;
  icon: string;
  description: string;
  image: string;
  sort_order?: number;
};

export type Admin = {
  id: string;
  email: string;
  password: string;
  name: string;
};

// --- Products ---

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at");

  if (error || !data) return [];

  return data.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    categoryLabel: p.category_label,
    description: p.description,
    shortDescription: p.short_description,
    pricePerHour: p.price_per_hour,
    pricePerDay: p.price_per_day,
    image: p.image,
    gallery: p.gallery || [],
    features: p.features || [],
    available: p.available,
  }));
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: product.slug,
      name: product.name,
      category: product.category,
      category_label: product.categoryLabel,
      description: product.description,
      short_description: product.shortDescription,
      price_per_hour: product.pricePerHour,
      price_per_day: product.pricePerDay,
      image: product.image,
      gallery: product.gallery,
      features: product.features,
      available: product.available,
    })
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    categoryLabel: data.category_label,
    description: data.description,
    shortDescription: data.short_description,
    pricePerHour: data.price_per_hour,
    pricePerDay: data.price_per_day,
    image: data.image,
    gallery: data.gallery || [],
    features: data.features || [],
    available: data.available,
  };
}

export async function updateProduct(product: Product): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: product.name,
      slug: product.slug,
      category: product.category,
      category_label: product.categoryLabel,
      description: product.description,
      short_description: product.shortDescription,
      price_per_hour: product.pricePerHour,
      price_per_day: product.pricePerDay,
      image: product.image,
      gallery: product.gallery,
      features: product.features,
      available: product.available,
      updated_at: new Date().toISOString(),
    })
    .eq("id", product.id)
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    categoryLabel: data.category_label,
    description: data.description,
    shortDescription: data.short_description,
    pricePerHour: data.price_per_hour,
    pricePerDay: data.price_per_day,
    image: data.image,
    gallery: data.gallery || [],
    features: data.features || [],
    available: data.available,
  };
}

// --- Categories ---

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error || !data) return [];
  return data;
}

export async function createCategory(category: Category): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      id: category.id,
      label: category.label,
      icon: category.icon,
      description: category.description,
      image: category.image,
      sort_order: category.sort_order || 0,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

export async function updateCategory(category: Category): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .update({
      label: category.label,
      icon: category.icon,
      description: category.description,
      image: category.image,
    })
    .eq("id", category.id)
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

// --- Gallery ---

export async function getGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");

  if (error || !data) return [];
  return data;
}

export async function saveGallery(images: GalleryImage[]): Promise<void> {
  // Delete all and re-insert with correct order
  await supabase.from("gallery_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (images.length > 0) {
    await supabase.from("gallery_images").insert(
      images.map((img, i) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        sort_order: i,
      }))
    );
  }
}

// --- Reservations ---

export type Reservation = {
  id: string;
  productId: string;
  productName: string;
  durationType: "hour" | "day";
  quantity: number;
  startDate: string;
  startTime: string;
  hours: number | null;
  endDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  note: string;
  totalPrice: number;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

function mapReservation(r: Record<string, unknown>): Reservation {
  return {
    id: r.id as string,
    productId: r.product_id as string,
    productName: r.product_name as string,
    durationType: r.duration_type as "hour" | "day",
    quantity: r.quantity as number,
    startDate: r.start_date as string,
    startTime: r.start_time as string,
    hours: r.hours as number | null,
    endDate: r.end_date as string,
    customerName: r.customer_name as string,
    customerEmail: r.customer_email as string,
    customerPhone: r.customer_phone as string,
    note: (r.note as string) || "",
    totalPrice: r.total_price as number,
    status: r.status as "confirmed" | "cancelled" | "completed",
    createdAt: r.created_at as string,
  };
}

export async function createReservation(data: Omit<Reservation, "id" | "status" | "createdAt">): Promise<Reservation | null> {
  const { data: row, error } = await supabase
    .from("reservations")
    .insert({
      product_id: data.productId,
      product_name: data.productName,
      duration_type: data.durationType,
      quantity: data.quantity,
      start_date: data.startDate,
      start_time: data.startTime,
      hours: data.hours,
      end_date: data.endDate,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      note: data.note,
      total_price: data.totalPrice,
    })
    .select()
    .single();

  if (error || !row) return null;
  return mapReservation(row);
}

export async function getReservationsForProduct(
  productId: string,
  fromDate: string,
  toDate: string
): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("product_id", productId)
    .neq("status", "cancelled")
    .lte("start_date", toDate)
    .gte("end_date", fromDate)
    .order("start_date");

  if (error || !data) return [];
  return data.map(mapReservation);
}

export async function getAllReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapReservation);
}

export async function updateReservationStatus(
  id: string,
  status: "confirmed" | "cancelled" | "completed"
): Promise<Reservation | null> {
  const { data, error } = await supabase
    .from("reservations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return null;
  return mapReservation(data);
}

// --- Testimonials ---

export type Testimonial = {
  id: string;
  name: string;
  activity: string;
  text: string;
  rating: number;
  sort_order?: number;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  if (error || !data) return [];
  return data;
}

export async function createTestimonial(t: Omit<Testimonial, "id">): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      name: t.name,
      activity: t.activity,
      text: t.text,
      rating: t.rating,
      sort_order: t.sort_order || 0,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

export async function updateTestimonial(t: Testimonial): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from("testimonials")
    .update({
      name: t.name,
      activity: t.activity,
      text: t.text,
      rating: t.rating,
    })
    .eq("id", t.id)
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  return !error;
}

// --- Settings ---

export async function getSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("settings")
    .select("*");

  if (error || !data) return {};

  const settings: Record<string, string> = {};
  for (const row of data) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function updateSettings(settings: Record<string, string>): Promise<boolean> {
  const entries = Object.entries(settings);
  for (const [key, value] of entries) {
    const { error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) return false;
  }
  return true;
}

// --- Admins ---

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data;
}
