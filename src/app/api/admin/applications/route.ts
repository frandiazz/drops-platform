import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

async function getAdminUser(token: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') return null;
  return { supabase, user };
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await getAdminUser(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '0', 10);
    const pageSize = 20;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = admin.supabase.from('applications').select('id, name, email, instagram, tiktok, twitter, other_social, status, created_at, reviewed_at, invite_token, photo_urls, age', { count: 'exact' }).order('created_at', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error, count } = await query.range(from, to);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ applications: data, total: count, page, hasMore: (data || []).length === pageSize });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await getAdminUser(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
    };

    if (status === 'approved') {
      updateData.invite_token = crypto.randomUUID();
    }

    const { data, error } = await admin.supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ application: data });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
