import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { products as defaultProducts, CATEGORIES as defaultCategories } from "@/data/products";
import type { Product } from "@/data/products";

export type Category = {
  id: string;
  label: string;
  icon: string;
  description: string;
  image: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultProducts;
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir();
  await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await readFile(CATEGORIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultCategories;
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await ensureDataDir();
  await writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
}
