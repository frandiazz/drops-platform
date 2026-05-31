import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`admin-me:${ip}`, 30, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ admin: false }, { status: 401 });

    const admin = await getAdmin(authHeader.replace('Bearer ', ''));
    if (!admin) return NextResponse.json({ admin: false }, { status: 401 });

    return NextResponse.json({ admin: true, user: { id: admin.user.id, email: admin.user.email } });
  } catch (err) {
    console.error('Admin me error:', err);
    return NextResponse.json({ admin: false }, { status: 500 });
  }
}
