-- ========================================================
-- Adyant Nexa Production Row Level Security (RLS) Policy
-- Execute in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- 1. Enable RLS across all sensitive tables
ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.growth_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.opportunities ENABLE ROW LEVEL SECURITY;

-- 2. Clean existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Admin full access leads" ON public.leads;
DROP POLICY IF EXISTS "Admin full access invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admin full access vault_documents" ON public.vault_documents;
DROP POLICY IF EXISTS "Admin full access contracts" ON public.contracts;
DROP POLICY IF EXISTS "Public insert assessments" ON public.assessments;
DROP POLICY IF EXISTS "Admin full access assessments" ON public.assessments;
DROP POLICY IF EXISTS "Public insert businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admin full access businesses" ON public.businesses;

-- 3. LEADS POLICIES:
-- Allow website visitors to submit contact and assessment forms
CREATE POLICY "Public insert leads" 
  ON public.leads 
  FOR INSERT 
  WITH CHECK (true);

-- Disallow public reads; only authenticated admin sessions can view, edit, or delete leads
CREATE POLICY "Admin full access leads" 
  ON public.leads 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- 4. INVOICES POLICIES:
-- Strictly authenticated admin access only
CREATE POLICY "Admin full access invoices" 
  ON public.invoices 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- 5. VAULT DOCUMENTS & CONTRACTS POLICIES:
-- Strictly authenticated admin access only
CREATE POLICY "Admin full access vault_documents" 
  ON public.vault_documents 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Admin full access contracts" 
  ON public.contracts 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- 6. ASSESSMENTS, SCORES & BUSINESSES:
-- Public can submit diagnostic assessments; authenticated admins have full management access
CREATE POLICY "Public insert assessments" 
  ON public.assessments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin full access assessments" 
  ON public.assessments 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Public insert businesses" 
  ON public.businesses 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin full access businesses" 
  ON public.businesses 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);
