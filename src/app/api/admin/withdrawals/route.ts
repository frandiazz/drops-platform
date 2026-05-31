import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAdmin } from '@/lib/admin-auth';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`admin-withdrawals:${ip}`, 30, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await getAdmin(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = admin.supabase
      .from('withdrawals')
      .select('id, creator_id, amount, method, status, created_at, approved_at, paid_at, rejected_at')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const creatorIds = Array.from(new Set((data || []).map((w: any) => w.creator_id)));

    const { data: profiles } = await admin.supabase
      .from('profiles')
      .select('id, stage_name, email')
      .in('id', creatorIds);

    const profileMap = new Map<string, any>((profiles || []).map((p: any) => [p.id, p]));

    const enriched = (data || []).map((w: any) => ({
      ...w,
      creator_name: profileMap.get(w.creator_id)?.stage_name || '',
      creator_email: profileMap.get(w.creator_id)?.email || '',
    }));

    return NextResponse.json({ withdrawals: enriched });
  } catch (err) {
    console.error('Admin withdrawals list error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`admin-withdrawals:${ip}`, 20, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await getAdmin(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { withdrawalId, status } = body;

    if (!withdrawalId || !UUID_REGEX.test(withdrawalId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    if (!['approved', 'paid', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data: current } = await admin.supabase
      .from('withdrawals')
      .select('status')
      .eq('id', withdrawalId)
      .single();

    if (!current) return NextResponse.json({ error: 'Retiro no encontrado' }, { status: 404 });

    const validTransitions: Record<string, string[]> = {
      pending: ['approved', 'rejected'],
      approved: ['paid', 'rejected'],
      paid: [],
      rejected: [],
    };

    if (!validTransitions[current.status]?.includes(status)) {
      return NextResponse.json({
        error: `Transición inválida: ${current.status} → ${status}`
      }, { status: 400 });
    }

    const updatePayload: any = { status };
    if (status === 'approved') updatePayload.approved_at = new Date().toISOString();
    if (status === 'paid') updatePayload.paid_at = new Date().toISOString();
    if (status === 'rejected') updatePayload.rejected_at = new Date().toISOString();

    const { data, error } = await admin.supabase
      .from('withdrawals')
      .update(updatePayload)
      .eq('id', withdrawalId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ withdrawal: data });
  } catch (err) {
    console.error('Admin withdrawals update error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
