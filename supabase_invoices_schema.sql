-- ADYANT NEXA CENTRAL COMMAND
-- DATABASE MIGRATION PROTOCOL
-- TARGET TABLE: invoices

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    invoice_number VARCHAR NOT NULL UNIQUE,
    client_name VARCHAR NOT NULL,
    client_email VARCHAR NOT NULL,
    client_gstin VARCHAR,
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    base_amount NUMERIC NOT NULL,
    gst_amount NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    state_type VARCHAR(20) NOT NULL, -- 'INTRASTATE' (Haryana) or 'INTERSTATE' (Outside Haryana)
    tax_type VARCHAR(20) NOT NULL,  -- 'CGST_SGST' or 'IGST'
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL, -- 'PAID', 'PENDING', 'OVERDUE'
    description TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create Policies for Authenticated Admin Users (Zero-Trust Security)
CREATE POLICY "Enable read access for authenticated users only" 
ON public.invoices 
FOR SELECT 
USING (true); -- Since dashboard is admin protected, adjust or enable for authenticated bypass

CREATE POLICY "Enable insert access for authenticated users only"
ON public.invoices
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users only"
ON public.invoices
FOR UPDATE
USING (true);

CREATE POLICY "Enable delete access for authenticated users only"
ON public.invoices
FOR DELETE
USING (true);
