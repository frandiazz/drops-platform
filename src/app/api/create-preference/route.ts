import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = JSON.parse(await request.text());
    const { amount, buyer_email, creator_id, content_id, title } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey || !mpAccessToken) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://drops-ly.vercel.app';

    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpAccessToken}`,
      },
      body: JSON.stringify({
        items: [{
          title: title || 'Contenido Drops',
          description: `Compra en Drops`,
          quantity: 1,
          currency_id: 'USD',
          unit_price: Number(amount),
        }],
        payer: { email: buyer_email },
        back_urls: {
          success: `${appUrl}/acceder/${sale.access_token}`,
          failure: `${appUrl}/checkout?error=payment_failed`,
          pending: `${appUrl}/checkout?error=payment_pending`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/mp-webhook`,
        metadata: { sale_id: sale.id },
      }),
    });

    const preference = await preferenceResponse.json();

    if (!preference.id) {
      return NextResponse.json({ error: preference.message || 'Failed to create MP preference' }, { status: 500 });
    }

    const isSandbox = mpAccessToken.startsWith('TEST-');

    return NextResponse.json({
      success: true,
      init_point: isSandbox ? preference.sandbox_init_point : preference.init_point,
      preference_id: preference.id,
      sale_id: sale.id,
      access_token: sale.access_token,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
