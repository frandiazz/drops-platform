import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = JSON.parse(await request.text());
    const { buyer_email, creator_id, content_id, amount, payment_method } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const commission = amount * 0.2;
    const creatorEarnings = amount - commission;

    const { data, error } = await supabase.from('sales').insert({
      content_id,
      creator_id,
      buyer_email,
      amount,
      commission,
      creator_earnings: creatorEarnings,
      payment_method,
      payment_status: 'pending',
    }).select().single();

    if (error) {
      console.error('Error creating sale:', error);
      return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
    }

    return NextResponse.json({ success: true, sale: data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}