import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
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

    const { error } = await supabase.from('withdrawals').insert({
      creator_id: user.id,
      amount: parsedAmount,
      method,
      status: 'pending',
    });

    if (error) {
      console.error('Withdraw insert error:', error);
      return NextResponse.json({ error: 'Error al crear solicitud' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Withdraw error:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
