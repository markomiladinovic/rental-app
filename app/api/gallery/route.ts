import { getGallery, saveGallery } from "@/lib/data";

export async function GET() {
  const images = await getGallery();
  return Response.json(images);
}

export async function PUT(request: Request) {
  const images = await request.json();
  await saveGallery(images);
  return Response.json(images);
}
