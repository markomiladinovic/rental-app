import { Resend } from "resend";
import type { Reservation } from "@/lib/data";

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

export async function sendMagicLinkEmail(email: string, link: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: "Pristup tvojim rezervacijama — BoMa Adventures",
    html: `
      <h2>Pristup tvojim rezervacijama</h2>
      <p>Klikni na dugme ispod da vidiš svoje rezervacije i upravljaš njima.</p>
      <p style="margin:24px 0;">
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;font-weight:600;text-decoration:none;border-radius:12px;">
          Pogledaj moje rezervacije
        </a>
      </p>
      <p style="color:#64748b;font-size:13px;">Link važi 1 sat. Ako ga nisi ti tražio, ignoriši ovaj email.</p>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">BoMa Adventures</p>
    `,
  });
}

export async function sendCancellationEmail(reservation: Reservation) {
  if (!reservation.customerEmail) return;

  const duration = reservation.durationType === "day"
    ? `${reservation.startDate} — ${reservation.endDate}`
    : `${reservation.startDate}, ${reservation.startTime} (${reservation.hours}h)`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [reservation.customerEmail],
    subject: `Rezervacija otkazana — ${reservation.productName}`,
    html: `
      <h2>Tvoja rezervacija je otkazana</h2>
      <p>Pozdrav ${reservation.customerName},</p>
      <p>Obaveštavamo te da je rezervacija za <strong>${reservation.productName}</strong> otkazana.</p>
      <table style="border-collapse:collapse;width:100%;max-width:500px;margin-top:16px;">
        <tr><td style="padding:8px 0;color:#64748b;">Termin:</td><td style="padding:8px 0;font-weight:600;">${duration}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Količina:</td><td style="padding:8px 0;font-weight:600;">${reservation.quantity}</td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#fef2f2;border-radius:12px;border:1px solid #fecaca;">
        <p style="margin:0;color:#1e293b;">Ako imaš pitanja o razlogu otkazivanja ili želiš da napraviš novu rezervaciju, slobodno nas kontaktiraj.</p>
      </div>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">BoMa Adventures</p>
    `,
  });
}

export async function sendCompletionEmail(reservation: Reservation) {
  if (!reservation.customerEmail) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [reservation.customerEmail],
    subject: `Hvala na poverenju — ${reservation.productName}`,
    html: `
      <h2>Hvala ti!</h2>
      <p>Pozdrav ${reservation.customerName},</p>
      <p>Hvala ti što si koristio našu opremu (<strong>${reservation.productName}</strong>). Nadamo se da si uživao!</p>
      <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
        <p style="margin:0 0 8px 0;color:#1e293b;font-weight:600;">💬 Podeli iskustvo</p>
        <p style="margin:0;color:#1e293b;">Tvoj utisak nam puno znači. Ako možeš da odvojiš minut, ostavi kratak komentar na našem sajtu.</p>
      </div>
      <p style="margin-top:24px;color:#1e293b;">Vidimo se opet!</p>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">BoMa Adventures</p>
    `,
  });
}

export async function sendTestimonialPendingEmail(data: {
  name: string;
  activity: string;
  rating: number;
  text: string;
}) {
  if (ADMIN_EMAILS.length === 0) return;

  const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAILS,
    subject: `Novi utisak čeka odobrenje — ${data.name}`,
    html: `
      <h2>Novi utisak korisnika</h2>
      <p>Korisnik je ostavio utisak koji čeka tvoje odobrenje.</p>
      <table style="border-collapse:collapse;width:100%;max-width:500px;margin-top:16px;">
        <tr><td style="padding:8px 0;color:#64748b;">Ime:</td><td style="padding:8px 0;font-weight:600;">${data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Aktivnost:</td><td style="padding:8px 0;font-weight:600;">${data.activity}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Ocena:</td><td style="padding:8px 0;color:#d97706;font-size:16px;">${stars}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:12px;">
        <p style="margin:0;color:#1e293b;font-style:italic;">&ldquo;${data.text.replace(/\n/g, "<br>")}&rdquo;</p>
      </div>
      <p style="margin-top:24px;color:#1e293b;">
        Odobri ili odbij utisak u <a href="https://boma-adventures.com/admin/testimonials" style="color:#2563eb;">admin panelu</a>.
      </p>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">BoMa Adventures</p>
    `,
  });
}

export async function sendReminderEmail(reservations: Reservation[]) {
  if (reservations.length === 0) return;

  const first = reservations[0];
  const totalSum = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const duration = first.durationType === "day"
    ? `${first.startDate} — ${first.endDate}`
    : `${first.startDate}, ${first.startTime} (${first.hours}h)`;

  const itemsHtml = reservations
    .map(
      (r) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${r.productName}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:center;">${r.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">${r.totalPrice.toLocaleString()} din</td>
        </tr>`
    )
    .join("");

  const productLabel = reservations.length === 1
    ? first.productName
    : `${reservations.length} proizvoda`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [first.customerEmail],
    subject: `Podsetnik: Sutra je tvoja rezervacija — ${productLabel}`,
    html: `
      <h2>Podsetnik za sutrašnju rezervaciju</h2>
      <p>Pozdrav ${first.customerName},</p>
      <p>Samo da te podsetimo — sutra je tvoja rezervacija za <strong>${productLabel}</strong>.</p>
      <table style="border-collapse:collapse;width:100%;max-width:500px;margin-top:16px;margin-bottom:16px;">
        <tr><td style="padding:8px 0;color:#64748b;">Termin:</td><td style="padding:8px 0;font-weight:600;">${duration}</td></tr>
      </table>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <thead>
          <tr style="border-bottom:2px solid #1e293b;">
            <th style="padding:8px 0;text-align:left;">Proizvod</th>
            <th style="padding:8px 0;text-align:center;">Kol.</th>
            <th style="padding:8px 0;text-align:right;">Ukupno</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 0;font-weight:700;">Ukupno:</td>
            <td style="padding:12px 0;font-weight:700;text-align:right;color:#2563eb;">${totalSum.toLocaleString()} din</td>
          </tr>
        </tfoot>
      </table>
      <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;">
        <p style="margin:0 0 8px 0;color:#1e293b;font-weight:600;">📍 Podsetnik:</p>
        <ul style="margin:0;padding-left:20px;color:#1e293b;">
          <li>Ponesi lični dokument radi identifikacije</li>
          <li>Plaćanje je na licu mesta (gotovina ili kartica)</li>
          <li>U slučaju otkazivanja, javi se blagovremeno</li>
        </ul>
      </div>
      <p style="margin-top:24px;color:#1e293b;">Vidimo se sutra!</p>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">BoMa Adventures</p>
    `,
  });
}

export async function sendGroupReservationEmail(reservations: Reservation[]) {
  if (ADMIN_EMAILS.length === 0 || reservations.length === 0) return;

  const first = reservations[0];
  const totalSum = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const duration = first.durationType === "day"
    ? `${first.startDate} — ${first.endDate}`
    : `${first.startDate}, ${first.startTime} (${first.hours}h)`;

  const itemsHtml = reservations
    .map(
      (r) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${r.productName}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:center;">${r.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">${r.totalPrice.toLocaleString()} din</td>
        </tr>`
    )
    .join("");

  // Email to admins
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAILS,
    subject: `Nova rezervacija (${reservations.length} proizvoda) — ${first.customerName}`,
    html: `
      <h2>Nova rezervacija — ${reservations.length} proizvoda</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;margin-bottom:16px;">
        <tr><td style="padding:8px 0;color:#64748b;">Termin:</td><td style="padding:8px 0;font-weight:600;">${duration}</td></tr>
      </table>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <thead>
          <tr style="border-bottom:2px solid #1e293b;">
            <th style="padding:8px 0;text-align:left;">Proizvod</th>
            <th style="padding:8px 0;text-align:center;">Kol.</th>
            <th style="padding:8px 0;text-align:right;">Ukupno</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 0;font-weight:700;">Ukupno:</td>
            <td style="padding:12px 0;font-weight:700;text-align:right;color:#2563eb;">${totalSum.toLocaleString()} din</td>
          </tr>
        </tfoot>
      </table>
      <h3 style="margin-top:24px;">Podaci korisnika</h3>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px 0;color:#64748b;">Ime:</td><td style="padding:8px 0;font-weight:600;">${first.customerName}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email:</td><td style="padding:8px 0;font-weight:600;">${first.customerEmail}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Telefon:</td><td style="padding:8px 0;font-weight:600;">${first.customerPhone}</td></tr>
        ${first.note ? `<tr><td style="padding:8px 0;color:#64748b;">Napomena:</td><td style="padding:8px 0;">${first.note}</td></tr>` : ""}
      </table>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">Rezervacija kreirana sa BoMa Adventures sajta</p>
    `,
  });

  // Confirmation to customer
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [first.customerEmail],
    subject: `Potvrda rezervacije (${reservations.length} proizvoda)`,
    html: `
      <h2>Hvala na rezervaciji!</h2>
      <p>Pozdrav ${first.customerName},</p>
      <p>Tvoja rezervacija za ${reservations.length} proizvoda je primljena.</p>
      <table style="border-collapse:collapse;width:100%;max-width:500px;margin-bottom:16px;margin-top:16px;">
        <tr><td style="padding:8px 0;color:#64748b;">Termin:</td><td style="padding:8px 0;font-weight:600;">${duration}</td></tr>
      </table>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <thead>
          <tr style="border-bottom:2px solid #1e293b;">
            <th style="padding:8px 0;text-align:left;">Proizvod</th>
            <th style="padding:8px 0;text-align:center;">Kol.</th>
            <th style="padding:8px 0;text-align:right;">Ukupno</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 0;font-weight:700;">Ukupno:</td>
            <td style="padding:12px 0;font-weight:700;text-align:right;color:#2563eb;">${totalSum.toLocaleString()} din</td>
          </tr>
        </tfoot>
      </table>
      <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;">
        <p style="margin:0;color:#1e293b;">Plaćanje je na licu mesta pri preuzimanju opreme. Vidimo se!</p>
      </div>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px;">BoMa Adventures</p>
    `,
  });
}
