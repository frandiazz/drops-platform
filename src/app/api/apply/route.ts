import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rate-limit';

function sanitize(val: string | undefined, maxLen = 500): string {
  if (!val) return '';
  return val
    .replace(/<[^>]*>/g, '')
    .replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c))
    .trim()
    .slice(0, maxLen);
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Rate limit: 5 applications per IP per hour
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`apply:${ip}`, 5, 3600000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intentá más tarde.' }, { status: 429 });
    }

    const body = await request.json();
    const name = sanitize(body.name, 100);
    const email = sanitize(body.email, 200);
    const age = body.age ? parseInt(body.age) : null;
    const country = sanitize(body.country, 100);
    const instagram = sanitize(body.instagram, 100);
    const tiktok = sanitize(body.tiktok, 100);
    const twitter = sanitize(body.twitter, 100);
    const other_social = sanitize(body.other_social, 500);
    const experience = sanitize(body.experience, 2000);
    const photo_urls = Array.isArray(body.photo_urls) ? body.photo_urls.filter((u: unknown) => typeof u === 'string') : [];

    if (!name || !email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Nombre y email válido requeridos' }, { status: 400 });
    }

    if (!body.terms_accepted) {
      return NextResponse.json({ error: 'Debés aceptar los términos y condiciones' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const socials = [instagram, tiktok, twitter, other_social].filter(Boolean).join(', ') || 'No especificado';

    const { error } = await supabase.from('applications').insert({
      name, email, age, country, socials,
      service: 'management',
      instagram, tiktok, twitter, other_social,
      photo_urls,
      experience,
      status: 'pending',
      terms_accepted: true,
    });

    if (error) return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Apply error:', err);
    return NextResponse.json({ error: 'Error al enviar postulación' }, { status: 500 });
  }
}
