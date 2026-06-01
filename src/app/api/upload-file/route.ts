import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = await checkRateLimit(`upload:${ip}`, 20, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Demasiadas subidas. Esperá un momento.' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const allowedBuckets = ['content', 'applications', 'avatars'];
    const bucket = (formData.get('bucket') as string) || 'content';
    if (!allowedBuckets.includes(bucket)) {
      return NextResponse.json({ error: 'Bucket no permitido' }, { status: 400 });
    }

    if (bucket !== 'applications') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Missing config' }, { status: 500 });
      }
      const supabase = createClient(supabaseUrl, supabaseKey);
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
      }
    }

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    const maxSize = file.type.startsWith('video/') ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      const label = file.type.startsWith('video/') ? '500MB' : '50MB';
      return NextResponse.json({ error: `Archivo muy grande (máx ${label})` }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido. Solo imágenes, videos y PDF.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const extMap: Record<string, string[]> = {
      jpeg: ['image/jpeg'], jpg: ['image/jpeg'],
      png: ['image/png'],
      webp: ['image/webp'],
      gif: ['image/gif'],
      mp4: ['video/mp4'],
      webm: ['video/webm'],
      ogg: ['video/ogg'],
      pdf: ['application/pdf'],
    };
    if (!extMap[ext]?.includes(file.type)) {
      return NextResponse.json({ error: 'Extensión no coincide con el tipo de archivo' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fileName = `${bucket}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}
