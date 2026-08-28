-- ========================================================
-- Adyant Nexa V1 Validation Database Schema (Supabase SQL)
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  industry TEXT NOT NULL DEFAULT 'fashion_retail',
  city TEXT,
  store_count INT DEFAULT 1,
  channel_type TEXT DEFAULT 'offline',
  years_in_business INT,
  annual_revenue_range TEXT,
  website TEXT,
  instagram TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  session_id TEXT,
  status TEXT DEFAULT 'completed',
  raw_inputs JSONB NOT NULL,
  engine_version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Growth Scores Table
CREATE TABLE IF NOT EXISTS public.growth_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  overall_score INT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  inventory_score INT,
  marketing_score INT,
  retention_score INT,
  margin_score INT,
  total_estimated_leakage NUMERIC(14, 2) DEFAULT 0,
  domain_scores JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  issue_summary TEXT NOT NULL,
  estimated_annual_opportunity NUMERIC(14, 2) DEFAULT 0,
  priority TEXT CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  recommended_action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Leads Table (Validation Extended)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  business_name TEXT,
  status TEXT DEFAULT 'NEW',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Speed
CREATE INDEX IF NOT EXISTS idx_assessments_created ON public.assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_scores_assessment ON public.growth_scores(assessment_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_assessment ON public.opportunities(assessment_id);
CREATE INDEX IF NOT EXISTS idx_leads_assessment ON public.leads(assessment_id);
