import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, received: body });
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
