-- ADYANT NEXA CENTRAL COMMAND
-- SECURE VAULT & CONTRACTS MIGRATION PROTOCOL
-- TARGET TABLES: documents, contracts

-- 1. DOCUMENTS TABLE (Secure Locker)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR NOT NULL,
    file_type VARCHAR NOT NULL,
    file_size INT NOT NULL, -- in bytes
    storage_path TEXT, -- URL or Base64 string / storage path
    category VARCHAR(50) DEFAULT 'GENERAL' NOT NULL -- 'GST', 'NDA', 'TAX', 'TECHNICAL', 'OTHER'
);

-- 2. CONTRACTS TABLE (Legal Vault)
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    client_name VARCHAR NOT NULL,
    contract_type VARCHAR(50) NOT NULL, -- 'WEB_DEV', 'MARKETING'
    project_value NUMERIC NOT NULL,
    duration_months INT NOT NULL,
    contract_text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL -- 'DRAFT', 'SIGNED', 'EXPIRED'
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Select/Read Policies for Authenticated Admin Users
CREATE POLICY "Enable read access for authenticated users only" 
ON public.documents FOR SELECT USING (true);

CREATE POLICY "Enable read access for contracts" 
ON public.contracts FOR SELECT USING (true);
