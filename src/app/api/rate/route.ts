import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`rate:${ip}`, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const res = await fetch('https://dolarapi.com/v1/dolares');
    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response');
    }

    const oficial = data.find((d: { casa: string }) => d.casa === 'oficial');
    const blue = data.find((d: { casa: string }) => d.casa === 'blue');

    const rate = oficial?.venta || blue?.venta || 1200;

    return NextResponse.json({
      rate: Number(rate),
      source: oficial?.casa || 'blue',
      updated: oficial?.fechaActualizacion || new Date().toISOString(),
    });
  } catch (err) {
    console.error('Rate API error:', err);
    return NextResponse.json({ rate: 1200, source: 'fallback' });
  }
}
