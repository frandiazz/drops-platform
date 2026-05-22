import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const result: Record<string, unknown> = { received: text, length: text.length };

    try {
      const body = JSON.parse(text);
      result.parsed = true;
      const { name, email, socials, service } = body;

      try {
        const { Resend } = await import('resend');
        if (process.env.RESEND_API_KEY) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'Drops <onboarding@resend.dev>',
            to: ['DropsDrops2005@gmail.com'],
            subject: `Nueva postulación de creador: ${name}`,
            html: `<p>Nombre: ${name}</p><p>Email: ${email}</p><p>Redes: ${socials}</p><p>Servicio: ${service}</p>`,
          });
          result.emailSent = true;
        }
      } catch (emailError) {
        result.emailError = String(emailError);
      }
    } catch (parseError) {
      result.parseError = String(parseError);
    }

    return NextResponse.json({ success: true, debug: result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed', debug: String(error) }, { status: 500 });
  }
}
