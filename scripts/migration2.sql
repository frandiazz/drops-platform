-- Migration 2: Extend applications table with detailed fields
-- Run this in your Supabase Dashboard → SQL Editor

ALTER TABLE applications ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tiktok TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS age TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS content_type TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS why_join TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS referral TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_by UUID;

-- Create bucket for application photos if not exists (run in Storage UI)
-- Go to Storage → Create bucket → name: applications → public
