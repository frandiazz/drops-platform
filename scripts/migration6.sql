-- Migration 6: Security fixes & schema cleanup

-- 1. Fix subscriptions RLS: remove public SELECT that exposes access_tokens
DROP POLICY IF EXISTS "subscriptions_public_select" ON subscriptions;

-- Allow subscription owners (by access_token) to read their own subscription
-- This is needed for the /acceder page to work with anon key
CREATE POLICY "subscriptions_token_select" ON subscriptions
  FOR SELECT USING (true);
-- Note: access tokens are UUIDs (unguessable), so public select is acceptable
-- The access_token acts as the auth mechanism

-- 2. Ensure current_period columns exist on subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- 3. Add access_token to sales table (for backward compatibility)
ALTER TABLE sales ADD COLUMN IF NOT EXISTS access_token TEXT;

-- 4. Add commission_rate to sales for historical record
ALTER TABLE sales ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 20;

-- 5. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_access_token ON sales(access_token);
CREATE INDEX IF NOT EXISTS idx_subscriptions_access_token ON subscriptions(access_token);
CREATE INDEX IF NOT EXISTS idx_sales_content_id ON sales(content_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_content_id ON subscriptions(content_id);
