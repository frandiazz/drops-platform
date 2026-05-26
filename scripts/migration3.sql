-- Migration 3: Create withdrawals table
-- Run this in your Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "withdrawals_select_own" ON withdrawals
    FOR SELECT USING (auth.uid() = creator_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "withdrawals_insert_own" ON withdrawals
    FOR INSERT WITH CHECK (auth.uid() = creator_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
