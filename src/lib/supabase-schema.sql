-- =========================================================================
-- PaySure Mobile Banking - Supabase Database Migration & Accounts Table
-- =========================================================================
-- Run this in Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- 1. Create table `paysure_accounts` with phone, pin, and pin_hash
CREATE TABLE IF NOT EXISTS public.paysure_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL,
  pin_hash TEXT,
  full_name TEXT DEFAULT 'bKash গ্রাহক',
  account_number TEXT UNIQUE,
  balance NUMERIC(12, 2) DEFAULT 25000.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Ensure `pin` column exists if table was created previously
ALTER TABLE public.paysure_accounts ADD COLUMN IF NOT EXISTS pin TEXT;
ALTER TABLE public.paysure_accounts ADD COLUMN IF NOT EXISTS pin_hash TEXT;

-- 2. Create index on phone
CREATE INDEX IF NOT EXISTS idx_paysure_accounts_phone ON public.paysure_accounts(phone);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.paysure_accounts ENABLE ROW LEVEL SECURITY;

-- 4. Permissive policies for login and account creation
DROP POLICY IF EXISTS "Allow public read for login verification" ON public.paysure_accounts;
CREATE POLICY "Allow public read for login verification"
  ON public.paysure_accounts FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert for account creation" ON public.paysure_accounts;
CREATE POLICY "Allow public insert for account creation"
  ON public.paysure_accounts FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on own account" ON public.paysure_accounts;
CREATE POLICY "Allow public update on own account"
  ON public.paysure_accounts FOR UPDATE TO public USING (true) WITH CHECK (true);

-- =========================================================================
-- End of Migration
-- =========================================================================
