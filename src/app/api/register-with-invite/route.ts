import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: 'Token inválido o contraseña muy corta' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('invite_token', token)
      .eq('status', 'approved')
      .maybeSingle();

    if (appError || !application) {
      return NextResponse.json({ error: 'Token inválido o ya usado' }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: application.email,
      password,
      email_confirm: true,
      user_metadata: {
        stage_name: application.name,
        instagram: application.instagram,
        tiktok: application.tiktok,
        twitter: application.twitter,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: authData.user.id,
      stage_name: application.name,
      email: application.email,
      instagram: application.instagram,
      tiktok: application.tiktok,
      twitter: application.twitter,
      socials: application.other_social || '',
      role: 'creator',
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    await supabase
      .from('applications')
      .update({ invite_token: null })
      .eq('id', application.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
  }
}
