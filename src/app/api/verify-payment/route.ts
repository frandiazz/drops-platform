import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const saleId = searchParams.get('sale_id');
    const paymentId = searchParams.get('payment_id');
    const collectionStatus = searchParams.get('collection_status');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey || !mpAccessToken) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If redirected back from MP with payment_id
    if (paymentId) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${mpAccessToken}` },
      });
      const payment = await mpRes.json();

      if (payment.status === 'approved') {
        const targetSaleId = payment.metadata?.sale_id;

        if (targetSaleId) {
          await supabase.from('sales')
            .update({ payment_status: 'completed', mp_payment_id: paymentId })
            .eq('id', targetSaleId);
        } else {
          await supabase.from('sales')
            .update({ payment_status: 'completed', mp_payment_id: paymentId })
            .eq('mp_payment_id', paymentId);
        }

        if (payment.metadata?.subscription_id) {
          await supabase.from('subscriptions')
            .update({ status: 'active' })
            .eq('id', payment.metadata.subscription_id);
        }

        return NextResponse.json({ success: true, status: 'completed' });
      }

      return NextResponse.json({ success: false, status: payment.status });
    }

    // Verify by sale_id
    if (saleId) {
      const { data: sale } = await supabase.from('sales')
        .select('mp_payment_id')
        .eq('id', saleId)
        .single();

      if (sale?.mp_payment_id) {
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${sale.mp_payment_id}`, {
          headers: { 'Authorization': `Bearer ${mpAccessToken}` },
        });
        const payment = await mpRes.json();

        if (payment.status === 'approved') {
          await supabase.from('sales')
            .update({ payment_status: 'completed' })
            .eq('id', saleId);

          const { data: updatedSale } = await supabase.from('sales')
            .select('id, buyer_email, content_id, payment_status')
            .eq('id', saleId)
            .single();

          if (updatedSale) {
            const { data: subscriptions } = await supabase.from('subscriptions')
              .select('id')
              .eq('buyer_email', updatedSale.buyer_email)
              .eq('content_id', updatedSale.content_id)
              .eq('status', 'pending');

            if (subscriptions && subscriptions.length > 0) {
              await supabase.from('subscriptions')
                .update({ status: 'active' })
                .in('id', subscriptions.map((s: { id: string }) => s.id));
            }
          }

          return NextResponse.json({ success: true, status: 'completed' });
        }
      }

      // Check collection_status from redirect
      if (collectionStatus === 'approved') {
        await supabase.from('sales')
          .update({ payment_status: 'completed' })
          .eq('id', saleId);

        return NextResponse.json({ success: true, status: 'completed' });
      }
    }

    return NextResponse.json({ success: false });
  } catch (error: unknown) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 });
  }
}
