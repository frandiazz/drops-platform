import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const { type, data, action } = body;

    const signature = request.headers.get('x-signature');
    if (signature && process.env.MP_WEBHOOK_SECRET) {
      const tsMatch = signature.match(/ts=(\d+)/);
      const v1Match = signature.match(/v1=([a-f0-9]+)/);
      if (tsMatch && v1Match) {
        const ts = tsMatch[1];
        const receivedSig = v1Match[1];
        const dataId = data?.id || '';
        const toSign = `id:${dataId};ts:${ts};`;
        const expectedSig = crypto
          .createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
          .update(toSign)
          .digest('hex');
        if (expectedSig !== receivedSig) {
          console.warn('Webhook signature mismatch — ignoring');
          return NextResponse.json({ success: true });
        }
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey || !mpAccessToken) return NextResponse.json({ error: 'Missing config' }, { status: 500 });

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle subscription authorized payments (recurring charges)
    if (type === 'subscription_preapproval' && data?.id) {
      const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${data.id}`, {
        headers: { 'Authorization': `Bearer ${mpAccessToken}` },
      });
      const preapproval = await mpRes.json();

      if (preapproval.status === 'authorized' && preapproval.external_reference) {
        await supabase.from('subscriptions')
          .update({ status: 'active', mp_preapproval_id: preapproval.id })
          .eq('id', preapproval.external_reference);
      }
    }

    // Handle authorized_payment events (each individual charge)
    if ((type === 'authorized_payment' || action === 'payment.created') && data?.id) {
      const paymentId = data.id;

      const mpRes = await fetch(`https://api.mercadopago.com/v1/authorized_payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${mpAccessToken}` },
      });
      const payment = await mpRes.json();

      if (payment.status === 'approved' && payment.preapproval_id) {
        const { data: subs } = await supabase
          .from('subscriptions')
          .select('id, creator_id, content_id, amount')
          .eq('mp_preapproval_id', payment.preapproval_id)
          .maybeSingle();

        if (subs) {
          // Create a sale record for this renewal
          const commission = parseFloat(subs.amount) * 0.2;
          await supabase.from('sales').insert({
            content_id: subs.content_id,
            creator_id: subs.creator_id,
            buyer_email: payment.payer?.email || 'renewal@mercadopago.com',
            amount: subs.amount,
            commission,
            creator_earnings: parseFloat(subs.amount) - commission,
            payment_method: 'mercadopago',
            payment_status: 'completed',
            mp_payment_id: paymentId?.toString(),
          });

          // Extend subscription period
          await supabase.from('subscriptions')
            .update({
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
            })
            .eq('id', subs.id);
        }
      }
    }

    // Handle one-time payments
    if (type === 'payment' && data?.id) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { 'Authorization': `Bearer ${mpAccessToken}` },
      });
      const payment = await mpRes.json();

      if (payment.status === 'approved') {
        const saleId = payment.metadata?.sale_id;
        const subId = payment.metadata?.subscription_id;

        if (saleId) {
          const { data: existing } = await supabase
            .from('sales').select('payment_status').eq('id', saleId).maybeSingle();
          if (existing && existing.payment_status !== 'completed') {
            await supabase.from('sales')
              .update({ payment_status: 'completed', mp_payment_id: payment.id?.toString() })
              .eq('id', saleId);
          }
        }

        if (subId) {
          await supabase.from('subscriptions')
            .update({ status: 'active', current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() })
            .eq('id', subId);
        }

        if (!saleId) {
          const { data: sale } = await supabase.from('sales')
            .select('id').eq('mp_payment_id', payment.id?.toString()).maybeSingle();
          if (sale) {
            await supabase.from('sales').update({ payment_status: 'completed' }).eq('id', sale.id);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
