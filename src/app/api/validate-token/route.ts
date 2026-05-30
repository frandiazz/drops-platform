import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`validate-token:${ip}`, 30, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: application, error } = await supabase
      .from('applications')
      .select('name, email')
      .eq('invite_token', token)
      .eq('status', 'approved')
      .maybeSingle();

    if (error) {
      console.error('Validate token error:', error);
      return NextResponse.json({ error: 'Error al validar token' }, { status: 500 });
    }

    if (!application) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    return NextResponse.json({ valid: true, name: application.name, email: application.email });
  } catch (err) {
    console.error('Validate token error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
