import { NextResponse } from 'next/server';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  const { createClient } = require('@supabase/supabase-js');
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: Request) {
  try {
    const body = JSON.parse(await request.text());
    const {
      name, email, instagram, tiktok, twitter, age, country,
      content_type, why_join, referral, experience, service, photos,
    } = body;

    const supabase = getSupabase();
    if (supabase) {
      const { error: dbError } = await supabase.from('applications').insert({
        name,
        email,
        socials: `IG: ${instagram}${tiktok ? `, TK: ${tiktok}` : ''}${twitter ? `, X: ${twitter}` : ''}`,
        instagram: instagram || null,
        tiktok: tiktok || null,
        twitter: twitter || null,
        age: age || null,
        country: country || null,
        content_type: content_type || null,
        why_join: why_join || null,
        referral: referral || null,
        experience: experience || null,
        service: service || null,
        photos: photos || [],
        status: 'pending',
      });
      if (dbError) console.error('DB error:', dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
