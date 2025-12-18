-- Migration: Add SEO fields to products table
-- Run this in your Supabase SQL Editor

-- Step 1: Add SEO columns
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS meta_title character varying(70),
ADD COLUMN IF NOT EXISTS meta_description character varying(170),
ADD COLUMN IF NOT EXISTS meta_keywords text[] DEFAULT ARRAY[]::text[];

-- Step 2: Add comments for documentation
COMMENT ON COLUMN public.products.meta_title IS 'AI-generated SEO meta title for the product page';
COMMENT ON COLUMN public.products.meta_description IS 'AI-generated SEO meta description for search results';
COMMENT ON COLUMN public.products.meta_keywords IS 'AI-generated SEO keywords array';

-- Step 3: Create index for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_products_meta_title ON public.products (meta_title) WHERE meta_title IS NOT NULL;

-- Verify the migration
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('meta_title', 'meta_description', 'meta_keywords');

