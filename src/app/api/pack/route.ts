import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packId = searchParams.get('packId');

    if (!packId) {
      return NextResponse.json({ error: 'packId required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: pack, error } = await supabase
      .from('content')
      .select('id, title, price, subscription_price, type, creator_id, media_urls')
      .eq('id', packId)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !pack) {
      return NextResponse.json({ error: 'Pack no encontrado' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, stage_name, avatar_url')
      .eq('id', pack.creator_id)
      .maybeSingle();

    return NextResponse.json({
      id: pack.id,
      title: pack.title,
      price: pack.type === 'subscription' ? pack.subscription_price : pack.price,
      type: pack.type,
      subscriptionPrice: pack.subscription_price,
      creatorId: pack.creator_id,
      creatorName: profile?.stage_name || 'Creador',
      creatorAvatar: profile?.avatar_url || '',
    });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
