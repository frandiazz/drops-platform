import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`withdraw:${ip}`, 10, 60000);
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

    const body = await request.json();
    const { amount, method } = body;

    if (!amount || !method) {
      return NextResponse.json({ error: 'Faltan datos: monto y método' }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 50) {
      return NextResponse.json({ error: 'El monto mínimo es $50 USD' }, { status: 400 });
    }

    if (!['bank', 'crypto', 'mp'].includes(method)) {
      return NextResponse.json({ error: 'Método de retiro inválido' }, { status: 400 });
    }

    // Atomic withdrawal via RPC (prevents race conditions)
    const { data: rpcResult, error: rpcError } = await supabase.rpc('request_withdrawal', {
      p_creator_id: user.id,
      p_amount: parsedAmount,
      p_method: method,
    });

    if (rpcError) {
      console.error('Withdraw RPC error:', rpcError);
      return NextResponse.json({ error: 'Error al crear solicitud' }, { status: 500 });
    }

    if (rpcResult?.error) {
      return NextResponse.json({ error: rpcResult.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, available: rpcResult.available });
  } catch (err) {
    console.error('Withdraw error:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
