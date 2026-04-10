import { getGallery } from "@/lib/data";
import Gallery from "./Gallery";

export default async function GallerySection() {
  const images = await getGallery();
  if (images.length === 0) return null;
  return <Gallery images={images} />;
}
