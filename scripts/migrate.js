const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  // Add columns to content table
  const { error: e1 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE content ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'one_time' NOT NULL;`
  });
  console.log('add type column:', e1?.message || 'OK');

  const { error: e2 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE content ADD COLUMN IF NOT EXISTS subscription_price NUMERIC;`
  });
  console.log('add subscription_price column:', e2?.message || 'OK');

  // Create subscriptions table
  const { error: e3 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        creator_id UUID NOT NULL,
        content_id UUID REFERENCES content(id),
        buyer_email TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        current_period_start TIMESTAMPTZ DEFAULT NOW(),
        current_period_end TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        access_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL
      );
    `
  });
  console.log('create subscriptions table:', e3?.message || 'OK');

  // Add RLS for subscriptions
  const { error: e4 } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        CREATE POLICY "public_read_subscriptions" ON subscriptions FOR SELECT USING (true);
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `
  });
  console.log('add RLS:', e4?.message || 'OK');
}

migrate().catch(console.error);
