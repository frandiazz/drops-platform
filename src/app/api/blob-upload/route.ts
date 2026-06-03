import { NextResponse } from 'next/server';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { fileName, fileType, accessToken } = await request.json();
    if (!accessToken || !fileName) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const ext = fileName.split('.').pop()?.toLowerCase() || 'mp4';
    const pathname = `videos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      allowedContentTypes: fileType ? [fileType] : ['video/mp4', 'video/webm', 'video/ogg'],
      maximumSizeInBytes: 500 * 1024 * 1024,
      addRandomSuffix: false,
      allowOverwrite: false,
    });

    return NextResponse.json({ token: clientToken, pathname });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Error al generar token' },
      { status: 500 },
    );
  }
}
