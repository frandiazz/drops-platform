import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const token = clientPayload;
        if (!token) throw new Error('No autorizado');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error('Missing config');

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) throw new Error('No autorizado');

        return {
          allowedContentTypes: ['video/mp4', 'video/webm', 'video/ogg'],
          maximumSizeInBytes: 500 * 1024 * 1024,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
