import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, socials, service } = body;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { error: dbError } = await supabase.from('applications').insert({
          name, email, socials, service,
        });
        if (dbError) console.error('DB error:', dbError);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Drops <onboarding@resend.dev>',
          to: ['DropsDrops2005@gmail.com'],
          subject: `Nueva postulación: ${name}`,
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
