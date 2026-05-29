import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const creatorId = request.nextUrl.searchParams.get('creatorId');
    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: profile } = await supabase
      .from('profiles')
      .select('stage_name, socials, instagram, tiktok, twitter')
      .eq('id', creatorId)
      .maybeSingle();

    const { data: authUser } = await supabase.auth.admin.getUserById(creatorId);

    const metadata = authUser?.user?.user_metadata || {};

    return NextResponse.json({
      id: creatorId,
      stage_name: profile?.stage_name || metadata?.stage_name || 'Creador',
      socials: profile?.socials || metadata?.socials || '',
      avatar_url: metadata?.avatar_url || '',
      bio: metadata?.bio || '',
      instagram: profile?.instagram || metadata?.instagram || '',
      tiktok: profile?.tiktok || metadata?.tiktok || '',
      twitter: profile?.twitter || metadata?.twitter || '',
    });
  } catch (error: unknown) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 });
  }
}
