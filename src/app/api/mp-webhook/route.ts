import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

      if (payment.status === 'approved' && payment.metadata?.sale_id) {
        await supabase.from('sales')
          .update({ payment_status: 'completed', mp_payment_id: payment.id?.toString() })
          .eq('id', payment.metadata.sale_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
