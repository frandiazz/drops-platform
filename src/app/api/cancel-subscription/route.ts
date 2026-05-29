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
    const mpAccessToken = process.env.MP_ACCESS_TOKEN!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { subscriptionId } = await request.json();
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Falta subscriptionId' }, { status: 400 });
    }

    // Get subscription and verify ownership
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('id, mp_preapproval_id')
      .eq('id', subscriptionId)
      .eq('creator_id', user.id)
      .maybeSingle();

    if (subError || !sub) {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 });
    }

    // Cancel in Mercado Pago if there's a preapproval
    if (sub.mp_preapproval_id) {
      const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${sub.mp_preapproval_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mpAccessToken}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!mpRes.ok) {
        const mpError = await mpRes.json();
        console.error('MP cancel error:', mpError);
        return NextResponse.json({ error: 'Error al cancelar en Mercado Pago' }, { status: 500 });
      }
    }

    // Update DB status
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('id', sub.id);

    if (updateError) {
      console.error('DB update error:', updateError);
      return NextResponse.json({ error: 'Error al actualizar suscripción' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
