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
