import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/data";

export async function GET() {
  const testimonials = await getTestimonials();
  return Response.json(testimonials);
}

export async function POST(request: Request) {
  const body = await request.json();
  const testimonial = await createTestimonial(body);

  if (!testimonial) {
    return Response.json({ error: "Greška pri kreiranju" }, { status: 500 });
  }

  return Response.json(testimonial, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updated = await updateTestimonial(body);

  if (!updated) {
    return Response.json({ error: "Utisak nije pronađen" }, { status: 404 });
  }

  return Response.json(updated);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const success = await deleteTestimonial(id);

  if (!success) {
    return Response.json({ error: "Greška pri brisanju" }, { status: 500 });
  }

  return Response.json({ success: true });
}
