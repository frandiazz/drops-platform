import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyerEmail, contentTitle, contentUrl, creatorName } = body;

    await resend.emails.send({
      from: 'Drops <onboarding@resend.dev>',
      to: [buyerEmail],
      subject: `Tu contenido de ${creatorName} está listo`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #05070B; color: #fff; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; font-size: 24px;">Drops</h1>
          </div>
          <h2 style="color: #06B6D4; margin-bottom: 16px;">¡Tu contenido está listo!</h2>
          <p style="color: #94A3B8; margin-bottom: 24px;">Gracias por tu compra. Acá tenés tu contenido:</p>
          
          <div style="background: #0F172A; border: 1px solid rgba(124,58,237,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="font-weight: bold; margin-bottom: 8px;">${contentTitle}</p>
            <p style="color: #94A3B8; font-size: 14px; margin-bottom: 16px;">Creado por ${creatorName}</p>
            <a href="${contentUrl}" style="display: inline-block; background: #7C3AED; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Acceder al contenido
            </a>
          </div>
          
          <p style="color: #94A3B8; font-size: 12px; margin-bottom: 8px;">Este enlace es temporal y encriptado. No lo compartas con terceros.</p>
          <p style="color: #94A3B8; font-size: 12px;">Si tenés algún problema, contactanos a DropsDrops2005@gmail.com</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1e293b; text-align: center;">
            <p style="color: #94A3B8; font-size: 12px;">Powered by Drops</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending content email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
