import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean);
const FROM_EMAIL = "BoMa Adventures <onboarding@resend.dev>";

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (ADMIN_EMAILS.length === 0) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAILS,
    subject: `Nova poruka od ${data.name}`,
    html: `
      <h2>Nova poruka sa sajta</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px 0;color:#64748b;">Ime:</td><td style="padding:8px 0;font-weight:600;">${data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email:</td><td style="padding:8px 0;font-weight:600;">${data.email}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:12px;">
        <p style="margin:0;color:#1e293b;">${data.message.replace(/\n/g, "<br>")}</p>
      </div>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">Poruka poslata sa BoMa Adventures sajta</p>
    `,
  });
}

export async function sendReservationEmail(data: {
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  startTime: string;
  endDate: string;
  durationType: string;
  hours: number | null;
  quantity: number;
  totalPrice: number;
  note: string;
}) {
  if (ADMIN_EMAILS.length === 0) return;

  const duration = data.durationType === "day"
    ? `${data.startDate} — ${data.endDate}`
    : `${data.startDate}, ${data.startTime} (${data.hours}h)`;

  // Email to admins
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAILS,
    subject: `Nova rezervacija: ${data.productName} — ${data.customerName}`,
    html: `
      <h2>Nova rezervacija</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px 0;color:#64748b;">Proizvod:</td><td style="padding:8px 0;font-weight:600;">${data.productName}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Termin:</td><td style="padding:8px 0;font-weight:600;">${duration}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Količina:</td><td style="padding:8px 0;font-weight:600;">${data.quantity}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Ukupno:</td><td style="padding:8px 0;font-weight:600;color:#2563eb;">${data.totalPrice.toLocaleString()} din</td></tr>
      </table>
      <h3 style="margin-top:24px;">Podaci korisnika</h3>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px 0;color:#64748b;">Ime:</td><td style="padding:8px 0;font-weight:600;">${data.customerName}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email:</td><td style="padding:8px 0;font-weight:600;">${data.customerEmail}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Telefon:</td><td style="padding:8px 0;font-weight:600;">${data.customerPhone}</td></tr>
        ${data.note ? `<tr><td style="padding:8px 0;color:#64748b;">Napomena:</td><td style="padding:8px 0;">${data.note}</td></tr>` : ""}
      </table>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">Rezervacija kreirana sa BoMa Adventures sajta</p>
    `,
  });

  // Confirmation email to customer
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [data.customerEmail],
    subject: `Potvrda rezervacije — ${data.productName}`,
    html: `
      <h2>Hvala na rezervaciji!</h2>
      <p>Pozdrav ${data.customerName},</p>
      <p>Tvoja rezervacija za <strong>${data.productName}</strong> je primljena.</p>
      <table style="border-collapse:collapse;width:100%;max-width:500px;margin-top:16px;">
        <tr><td style="padding:8px 0;color:#64748b;">Termin:</td><td style="padding:8px 0;font-weight:600;">${duration}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Količina:</td><td style="padding:8px 0;font-weight:600;">${data.quantity}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Ukupno:</td><td style="padding:8px 0;font-weight:600;color:#2563eb;">${data.totalPrice.toLocaleString()} din</td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;">
        <p style="margin:0;color:#1e293b;">Plaćanje je na licu mesta pri preuzimanju opreme. Vidimo se!</p>
      </div>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">BoMa Adventures</p>
    `,
  });
}
