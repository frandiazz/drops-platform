import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`admin-apps:${ip}`, 30, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await getAdmin(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '0', 10);
    const pageSize = 20;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const selectFields = 'id, name, email, age, country, instagram, tiktok, twitter, other_social, experience, photo_urls, status, created_at, reviewed_at, invite_token';
    let query = admin.supabase
      .from('applications')
      .select(selectFields, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error, count } = await query.range(from, to);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Fetch counts per status for stat cards
    const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
      admin.supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      admin.supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      admin.supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
    ]);

    return NextResponse.json({
      applications: data,
      total: count,
      page,
      hasMore: (data || []).length === pageSize,
      pageSize,
      counts: {
        pending: pendingRes.count || 0,
        approved: approvedRes.count || 0,
        rejected: rejectedRes.count || 0,
      },
    });
  } catch (err) {
    console.error('Admin applications list error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`admin-apps:${ip}`, 20, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await getAdmin(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const updatePayload: any = { status, reviewed_at: new Date().toISOString() };
    if (status === 'approved') updatePayload.invite_token = crypto.randomUUID();

    const { data, error } = await admin.supabase
      .from('applications')
      .update(updatePayload)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ application: data });
  } catch (err) {
    console.error('Admin applications review error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
