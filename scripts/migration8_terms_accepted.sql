-- Add terms_accepted column to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false;

-- Update existing applications to have terms_accepted = true
UPDATE applications SET terms_accepted = true WHERE terms_accepted IS NULL;
