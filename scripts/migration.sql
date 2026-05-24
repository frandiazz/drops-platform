-- Migration: Add subscriptions support
-- Run this in your Supabase Dashboard → SQL Editor

-- 1. Add columns to content table for subscription type
ALTER TABLE content ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'one_time' NOT NULL;
ALTER TABLE content ADD COLUMN IF NOT EXISTS subscription_price NUMERIC;

-- 2. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  buyer_email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  access_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL
);

-- 3. Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for subscriptions
DO $$ BEGIN
  CREATE POLICY "subscriptions_select_own" ON subscriptions 
    FOR SELECT USING (auth.uid() = creator_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "subscriptions_insert_service" ON subscriptions 
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 5. Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Apply trigger to subscriptions
DO $$ BEGIN
  CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 7. Add RLS policy for subscriptions: public insert (for webhook/service)
DO $$ BEGIN
  CREATE POLICY "subscriptions_public_insert" ON subscriptions 
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "subscriptions_public_select" ON subscriptions 
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
