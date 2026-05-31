import { createClient } from '@supabase/supabase-js';

export interface AdminSession {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  user: { id: string; email?: string };
}

export async function getAdmin(token: string): Promise<AdminSession | null> {
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
  return { supabase, user: { id: user.id, email: user.email } };
}
