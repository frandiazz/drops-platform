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

    let { data: profile } = await supabase
      .from('profiles')
      .select('id, stage_name, avatar_url, bio, socials, instagram, tiktok, twitter')
      .eq('id', creatorId)
      .maybeSingle();

    if (!profile) {
      const { data: authUser } = await supabase.auth.admin.getUserById(creatorId);
      if (!authUser?.user) {
        return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
      }

      const meta = authUser.user.user_metadata || {};
      await supabase.from('profiles').upsert({
        id: creatorId,
        email: authUser.user.email || '',
        stage_name: meta.stage_name || 'Creador',
        role: 'creator',
        commission_rate: 20,
      });

      profile = {
        id: creatorId,
        stage_name: meta.stage_name || 'Creador',
        avatar_url: meta.avatar_url || '',
        bio: meta.bio || '',
        socials: meta.socials || '',
        instagram: meta.instagram || '',
        tiktok: meta.tiktok || '',
        twitter: meta.twitter || '',
      };
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
