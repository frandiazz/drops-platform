-- Add commission_rate to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 20;

-- Set default rates based on service level (all existing creators default to Solo Plataforma 20%)
UPDATE profiles SET commission_rate = 20 WHERE commission_rate IS NULL;

-- Plans:
--   Full Management: 50%
--   Social Media Only: 30%
--   Solo Plataforma: 20%
