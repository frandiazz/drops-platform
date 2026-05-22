import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = JSON.parse(await request.text());
    const { amount, buyer_email, creator_id, content_id, title, card } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey || !mpAccessToken) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Create sale
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

    // 2. Process payment via MP API directly
    const [expMonth, expYear] = (card.expiry || '/').split('/');
    const fullYear = expYear ? (expYear.length === 2 ? `20${expYear}` : expYear) : '2028';

    const paymentPayload: any = {
      transaction_amount: Number(amount),
      description: title || 'Compra en Drops',
      payer: {
        email: buyer_email,
        first_name: card.name?.split(' ')[0] || 'Comprador',
        last_name: card.name?.split(' ').slice(1).join(' ') || 'Drops',
      },
      installments: 1,
      payment_method_id: 'master',
    };

    // For test mode, send card data directly
    if (mpAccessToken.startsWith('TEST-')) {
      paymentPayload.card_number = card.number?.replace(/\s/g, '');
      paymentPayload.security_code = card.cvv;
      paymentPayload.expiration_month = parseInt(expMonth || '11');
      paymentPayload.expiration_year = parseInt(fullYear || '2025');
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
    console.log('MP response:', JSON.stringify(mpData));

    // 3. Update sale based on result
    if (mpData.status === 'approved') {
      await supabase.from('sales')
        .update({ payment_status: 'completed', mp_payment_id: mpData.id?.toString() })
        .eq('id', sale.id);

      return NextResponse.json({
        success: true,
        access_token: sale.access_token,
        payment_id: mpData.id,
      });
    }

    // Payment failed
    return NextResponse.json({
      success: false,
      error: mpData.status_detail || `Pago ${mpData.status}: ${mpData.status_detail || 'rechazado'}`,
    }, { status: 402 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
