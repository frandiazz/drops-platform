import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = JSON.parse(await request.text());
    const { card_token, amount, buyer_email, creator_id, content_id, payment_method } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey || !mpAccessToken) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Create sale in DB (pending)
    const commission = amount * 0.2;
    const creatorEarnings = amount - commission;

    const { data: sale, error: saleError } = await supabase.from('sales').insert({
      content_id,
      creator_id,
      buyer_email,
      amount,
      commission,
      creator_earnings: creatorEarnings,
      payment_method: payment_method || 'mercadopago',
      payment_status: 'pending',
    }).select().single();

    if (saleError || !sale) {
      return NextResponse.json({ error: saleError?.message || 'Failed to create sale' }, { status: 500 });
    }

    // 2. If card_token provided, process payment via MP
    if (card_token) {
      const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mpAccessToken}`,
        },
        body: JSON.stringify({
          token: card_token,
          transaction_amount: amount,
          description: `Compra en Drops - ${content_id}`,
          payer: { email: buyer_email },
          installments: 1,
          payment_method_id: 'visa',
        }),
      });

      const mpData = await mpResponse.json();

      if (mpData.status === 'approved') {
        const { data: updated } = await supabase.from('sales')
          .update({
            payment_status: 'completed',
            mp_payment_id: mpData.id?.toString(),
          })
          .eq('id', sale.id)
          .select()
          .single();

        return NextResponse.json({ success: true, sale: updated || sale });
      } else {
        return NextResponse.json({
          success: false,
          error: mpData.status_detail || 'Pago rechazado',
          sale,
        }, { status: 402 });
      }
    }

    return NextResponse.json({ success: true, sale });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
