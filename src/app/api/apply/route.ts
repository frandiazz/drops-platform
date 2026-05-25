import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, age, country, instagram, tiktok, twitter, other_social, photo_urls, experience } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const socialsParts = [instagram, tiktok, twitter, other_social].filter(Boolean);
    const socials = socialsParts.length > 0 ? socialsParts.join(', ') : `${instagram || ''} ${tiktok || ''}`.trim() || 'No especificado';

    const { error } = await supabase.from('applications').insert({
      name,
      email,
      age: age || null,
      country,
      socials,
      service: 'management',
      instagram,
      tiktok,
      twitter,
      other_social,
      photo_urls: photo_urls || [],
      experience,
      status: 'pending',
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Apply error:', err);
    return NextResponse.json({ error: 'Error al enviar postulación' }, { status: 500 });
  }
}
