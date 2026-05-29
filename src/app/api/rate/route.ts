import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
  } catch {
    return NextResponse.json({ rate: 1200, source: 'fallback' });
  }
}
