-- Migration 4: Add mp_preapproval_id to subscriptions + extra columns to withdrawals
-- Run this in your Supabase Dashboard → SQL Editor

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS mp_preapproval_id TEXT;

ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
