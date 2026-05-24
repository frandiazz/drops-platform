import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = JSON.parse(await request.text());
    const { type, data } = body;

    if (type === 'payment' && data?.id) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const mpAccessToken = process.env.MP_ACCESS_TOKEN;

      if (!supabaseUrl || !supabaseKey || !mpAccessToken) {
        return NextResponse.json({ error: 'Missing config' }, { status: 500 });
      }

      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { 'Authorization': `Bearer ${mpAccessToken}` },
      });
      const payment = await mpRes.json();

      if (payment.status === 'approved') {
        const saleId = payment.metadata?.sale_id;
        const subId = payment.metadata?.subscription_id;
        const content_type = payment.metadata?.content_type;

        if (saleId) {
          await supabase.from('sales')
            .update({ payment_status: 'completed', mp_payment_id: payment.id?.toString() })
            .eq('id', saleId);
        }

        if (subId) {
          await supabase.from('subscriptions')
            .update({ status: 'active' })
            .eq('id', subId);
        }

        // Fallback: find sale by mp_payment_id
        if (!saleId) {
          const { data: sale } = await supabase.from('sales')
            .select('id, content_id')
            .eq('mp_payment_id', payment.id?.toString())
            .maybeSingle();

          if (sale) {
            await supabase.from('sales')
              .update({ payment_status: 'completed' })
              .eq('id', sale.id);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
