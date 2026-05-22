import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, socials, service } = body;

    const supabase = createClient();

    const { error: dbError } = await supabase.from('applications').insert({
      name,
      email,
      socials,
      service,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('Error saving to database:', dbError);
    }

    const serviceLabels: Record<string, string> = {
      full: 'Full Management (50%)',
      social: 'Social Media Only (30%)',
      platform: 'Solo Plataforma (20%)',
      course: 'Mini Curso ($100.000 ARS)',
    };

    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Drops <onboarding@resend.dev>',
          to: ['DropsDrops2005@gmail.com'],
          subject: `Nueva postulación de creador: ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #7C3AED;">Nueva Postulación - Drops</h1>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Nombre artístico:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${email}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Redes sociales:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; white-space: pre-line;">${socials}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Servicio:</td><td style="padding: 8px;">${serviceLabels[service] || service}</td></tr>
              </table>
              <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">Enviado desde drops-ly.vercel.app</p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
  }
}
