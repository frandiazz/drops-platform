import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`delete-account:${ip}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Delete all user data
    const tables = ['sales', 'subscriptions', 'content', 'withdrawals', 'profiles'];
    for (const table of tables) {
      await supabase.from(table).delete().eq('creator_id', user.id);
    }
    // Also delete profiles entry by id
    await supabase.from('profiles').delete().eq('id', user.id);

    // Delete storage files
    const { data: files } = await supabase.storage.from('content').list(user.id);
    if (files?.length) {
      await supabase.storage.from('content').remove(files.map(f => `${user.id}/${f.name}`));
    }

    // Delete the auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error('Delete user error:', deleteError);
      return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete account error:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
