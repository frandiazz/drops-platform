import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the access token exists and is valid (sale or subscription)
    let record: any = null;

    const { data: sale } = await supabase
      .from('sales')
      .select('content_id, payment_status')
      .eq('access_token', token)
      .maybeSingle();

    if (sale && sale.payment_status === 'completed') {
      record = sale;
    }

    if (!record) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('content_id, status, current_period_end')
        .eq('access_token', token)
        .maybeSingle();

      if (sub && sub.status === 'active') {
        const now = new Date();
        const expired = sub.current_period_end && new Date(sub.current_period_end) < now;
        if (!expired) {
          record = sub;
        }
      }
    }

    if (!record) {
      return NextResponse.json({ error: 'Acceso no válido' }, { status: 403 });
    }

    // Get content media URLs
    const { data: content } = await supabase
      .from('content')
      .select('media_urls')
      .eq('id', record.content_id)
      .maybeSingle();

    if (!content?.media_urls) {
      return NextResponse.json({ error: 'Contenido no encontrado' }, { status: 404 });
    }

    // Generate signed URLs that expire in 1 hour
    const signedUrls = await Promise.all(
      (content.media_urls as string[]).map(async (url: string) => {
        // Extract bucket and path from public URL
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        // Format: /storage/v1/object/public/{bucket}/{path}
        const bucketIndex = pathParts.indexOf('public');
        if (bucketIndex === -1 || bucketIndex + 1 >= pathParts.length) {
          return url; // fallback to public URL
        }
        const bucket = pathParts[bucketIndex + 1];
        const filePath = pathParts.slice(bucketIndex + 2).join('/');

        const { data: signedData, error: signedError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, 3600);

        if (signedError || !signedData) {
          return url; // fallback
        }
        return signedData.signedUrl;
      })
    );

    return NextResponse.json({ urls: signedUrls });
  } catch (err) {
    console.error('Signed URLs error:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
