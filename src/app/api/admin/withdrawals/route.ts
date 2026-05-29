import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

async function getAdmin(token: string) {
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

    const admin = await getAdmin(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = admin.supabase
      .from('withdrawals')
      .select('id, creator_id, amount, status, created_at, approved_at, paid_at, rejected_at')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const creatorIds = Array.from(new Set((data || []).map(w => w.creator_id)));

    const { data: profiles } = await admin.supabase
      .from('profiles')
      .select('id, stage_name, email')
      .in('id', creatorIds);

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));

    const enriched = (data || []).map(w => ({
      ...w,
      creator_name: profileMap.get(w.creator_id)?.stage_name || '',
      creator_email: profileMap.get(w.creator_id)?.email || '',
    }));

    return NextResponse.json({ withdrawals: enriched });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await getAdmin(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { withdrawalId, status } = body;

    if (!withdrawalId || !['approved', 'paid', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Validate state transition
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

    const updateData: any = { status };
    if (status === 'approved') updateData.approved_at = new Date().toISOString();
    if (status === 'paid') updateData.paid_at = new Date().toISOString();
    if (status === 'rejected') updateData.rejected_at = new Date().toISOString();

    const { data, error } = await admin.supabase
      .from('withdrawals')
      .update(updateData)
      .eq('id', withdrawalId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ withdrawal: data });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
