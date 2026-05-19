import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const hasConfig = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co';

export const supabase = hasConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
