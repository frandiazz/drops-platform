import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`profile:${ip}`, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const creatorId = request.nextUrl.searchParams.get('creatorId');
    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId required' }, { status: 400 });
    }

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (creatorId && !UUID_REGEX.test(creatorId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, stage_name, avatar_url, bio, socials, instagram, tiktok, twitter')
      .eq('id', creatorId)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id: profile.id,
      stage_name: profile.stage_name || 'Creador',
      socials: profile.socials || '',
      avatar_url: profile.avatar_url || '',
      bio: profile.bio || '',
      instagram: profile.instagram || '',
      tiktok: profile.tiktok || '',
      twitter: profile.twitter || '',
    });
  } catch {
    console.error('Profile API error');
    return NextResponse.json({ error: 'Error al cargar perfil' }, { status: 500 });
  }
}
