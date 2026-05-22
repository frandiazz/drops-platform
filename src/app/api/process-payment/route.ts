import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = JSON.parse(await request.text());
    const { token, payment_method_id, amount, buyer_email, creator_id, content_id, title, identification } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey || !mpAccessToken) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }
    if (!token) {
      return NextResponse.json({ error: 'Token de tarjeta requerido' }, { status: 400 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const commission = amount * 0.2;
    const creatorEarnings = amount - commission;

    const { data: sale, error: saleError } = await supabase.from('sales').insert({
      content_id,
      creator_id,
      buyer_email,
      amount,
      commission,
      creator_earnings: creatorEarnings,
      payment_method: 'mercadopago',
      payment_status: 'pending',
    }).select().single();

    if (saleError || !sale) {
      return NextResponse.json({ error: saleError?.message || 'Failed to create sale' }, { status: 500 });
    }

    const paymentPayload: any = {
      token,
      transaction_amount: Number(amount),
      description: title || 'Compra en Drops',
      installments: 1,
      payment_method_id: payment_method_id || 'master',
      payer: { email: buyer_email },
    };

    if (identification?.number) {
      paymentPayload.payer.identification = {
        type: identification.type || 'DNI',
        number: identification.number,
      };
    }

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpAccessToken}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const mpData = await mpResponse.json();

    if (mpData.status === 'approved') {
      await supabase.from('sales')
        .update({ payment_status: 'completed', mp_payment_id: mpData.id?.toString() })
        .eq('id', sale.id);

      return NextResponse.json({ success: true, access_token: sale.access_token, payment_id: mpData.id });
    }

    const mpError = mpData.message || mpData.cause?.[0]?.description || mpData.status_detail || 'rechazado';
    return NextResponse.json({ success: false, error: `Pago ${mpData.status}: ${mpError}` }, { status: 402 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
