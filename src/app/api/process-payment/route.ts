import { NextResponse } from 'next/server';

async function fetchRate(): Promise<number> {
  let rate = 1200;
  try {
    const rateRes = await fetch('https://api.bluelytics.com.ar/v2/latest', { signal: AbortSignal.timeout(5000) });
    const rateData = await rateRes.json();
    if (rateData?.oficial?.value_avg) return Number(rateData.oficial.value_avg);
    if (rateData?.blue?.value_avg) return Number(rateData.blue.value_avg);
  } catch {
    try {
      const rateRes = await fetch('https://dolarapi.com/v1/dolares', { signal: AbortSignal.timeout(5000) });
      const rateData = await rateRes.json();
      if (Array.isArray(rateData)) {
        const oficial = rateData.find((d: any) => d.casa === 'oficial' || d.nombre === 'Oficial');
        const blue = rateData.find((d: any) => d.casa === 'blue' || d.nombre === 'Blue');
        return Number(oficial?.venta || oficial?.compra || blue?.venta || blue?.compra || 1200);
      }
      if (rateData?.venta) return Number(rateData.venta);
    } catch {}
  }
  return rate;
}

export async function POST(request: Request) {
  try {
    const body = JSON.parse(await request.text());
    const { token, payment_method_id, amount, buyer_email, creator_id, content_id, title, identification, content_type } = body;

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
      content_id, creator_id, buyer_email, amount, commission,
      creator_earnings: creatorEarnings,
      payment_method: 'mercadopago', payment_status: 'pending',
    }).select().single();

    if (saleError || !sale) {
      return NextResponse.json({ error: saleError?.message || 'Failed to create sale' }, { status: 500 });
    }

    const amountARS = Math.round(Number(amount) * await fetchRate());

    if (content_type === 'subscription') {
      // Create subscription record
      const { data: sub, error: subError } = await supabase.from('subscriptions').insert({
        creator_id, content_id, buyer_email, amount, status: 'pending',
      }).select().single();

      if (subError) {
        return NextResponse.json({ error: subError.message }, { status: 500 });
      }

      // Create MP preapproval (recurring)
      const payer: any = { email: buyer_email };
      if (identification?.number) {
        payer.identification = { type: identification.type || 'DNI', number: identification.number };
      }

      const preapprovalRes = await fetch('https://api.mercadopago.com/preapproval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mpAccessToken}`,
        },
        body: JSON.stringify({
          reason: title || 'Suscripción en Drops',
          external_reference: sub.id,
          payer_email: buyer_email,
          card_token_id: token,
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: amountARS,
            currency_id: 'ARS',
          },
          back_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://drops-ly.vercel.app'}/acceder/${sub.access_token}`,
          status: 'authorized',
        }),
      });

      const preapprovalData = await preapprovalRes.json();

      if (preapprovalData.id) {
        // Save preapproval ID
        const { error: updateError } = await supabase.from('subscriptions')
          .update({ status: 'active', mp_preapproval_id: preapprovalData.id })
          .eq('id', sub.id);

        if (!updateError) {
          // Also mark the initial sale as completed
          await supabase.from('sales')
            .update({ payment_status: 'completed', mp_payment_id: `preapproval_${preapprovalData.id}` })
            .eq('id', sale.id);

          return NextResponse.json({ success: true, access_token: sub.access_token });
        }
      }

      // Preapproval failed — fall back to one-time payment
      console.error('Preapproval failed, falling back:', preapprovalData);
    }

    // One-time payment (or subscription fallback)
    const paymentPayload: any = {
      token,
      transaction_amount: amountARS,
      description: title || 'Compra en Drops',
      installments: 1,
      payment_method_id: payment_method_id || 'master',
      payer: { email: buyer_email },
      currency_id: 'ARS',
      metadata: { sale_id: sale.id, content_type: content_type || 'one_time' },
    };

    if (identification?.number) {
      paymentPayload.payer.identification = {
        type: identification.type || 'DNI',
        number: identification.number,
      };
    }

    const idempotencyKey = crypto.randomUUID();

    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpAccessToken}`,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(paymentPayload),
    });

    const mpData = await mpRes.json();

    if (mpData.status === 'approved') {
      await supabase.from('sales')
        .update({ payment_status: 'completed', mp_payment_id: mpData.id?.toString() })
        .eq('id', sale.id);

      // If subscription fallback, activate it too
      if (content_type === 'subscription') {
        const { data: pendingSub } = await supabase.from('subscriptions')
          .select('id, access_token')
          .eq('buyer_email', buyer_email)
          .eq('content_id', content_id)
          .eq('status', 'pending')
          .maybeSingle();

        if (pendingSub) {
          await supabase.from('subscriptions')
            .update({ status: 'active' })
            .eq('id', pendingSub.id);
          return NextResponse.json({ success: true, access_token: pendingSub.access_token, payment_id: mpData.id });
        }
      }

      return NextResponse.json({ success: true, access_token: sale.access_token, payment_id: mpData.id });
    }

    const mpError = mpData.message || mpData.cause?.[0]?.description || mpData.status_detail || 'rechazado';
    return NextResponse.json({ success: false, error: `Pago ${mpData.status}: ${mpError}` }, { status: 402 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
