import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
