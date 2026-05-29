import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: userId,
      email: email || '',
      stage_name: 'Creador',
      role: 'creator',
      commission_rate: 20,
    });

    if (upsertError) {
      console.error('Profile creation error:', upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Create profile error:', err);
    return NextResponse.json({ error: 'Error al crear perfil' }, { status: 500 });
  }
}
