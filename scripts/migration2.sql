-- Migration: Add application fields + admin role
-- Run this in your Supabase Dashboard → SQL Editor

-- 1. Add columns to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS photo_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE APPLICATIONS ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tiktok TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS other_social TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS invite_token UUID UNIQUE;

-- 2. Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'creator' NOT NULL;

-- 3. Create storage bucket for application photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('applications', 'applications', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Allow public access to application photos bucket
DO $$ BEGIN
  CREATE POLICY "applications_public_select" ON storage.objects
    FOR SELECT USING (bucket_id = 'applications' AND auth.role() = 'authenticated' OR bucket_id = 'applications' AND auth.role() = 'anon');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "applications_public_insert" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'applications' AND auth.role() = 'authenticated' OR bucket_id = 'applications' AND auth.role() = 'anon');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 5. Enable RLS on applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "applications_insert_anon" ON applications
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "applications_select_admin" ON applications
    FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "applications_update_admin" ON applications
    FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;
