-- Migration: Add slug column to products table
-- Run this in your Supabase SQL Editor

-- Step 1: Add the slug column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS slug character varying(500);

-- Step 2: Create unique index on slug (allowing NULL for existing records initially)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug) WHERE slug IS NOT NULL;

-- Step 3: Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convert to lowercase
  slug := LOWER(input_text);
  
  -- Remove accents/diacritics (basic)
  slug := TRANSLATE(slug, 'àáâãäåèéêëìíîïòóôõöùúûüýÿñç', 'aaaaaaeeeeiiiioooooouuuuyync');
  
  -- Replace spaces and special characters with hyphens
  slug := REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g');
  
  -- Remove leading/trailing hyphens
  slug := TRIM(BOTH '-' FROM slug);
  
  -- Remove multiple consecutive hyphens
  slug := REGEXP_REPLACE(slug, '-+', '-', 'g');
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 4: Create function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_product_slug(product_name TEXT, product_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER := 0;
  slug_exists BOOLEAN;
BEGIN
  base_slug := generate_slug(product_name);
  new_slug := base_slug;
  
  LOOP
    -- Check if slug exists (excluding current product if updating)
    IF product_id IS NULL THEN
      SELECT EXISTS(SELECT 1 FROM public.products WHERE slug = new_slug) INTO slug_exists;
    ELSE
      SELECT EXISTS(SELECT 1 FROM public.products WHERE slug = new_slug AND id != product_id) INTO slug_exists;
    END IF;
    
    EXIT WHEN NOT slug_exists;
    
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Update existing products with slugs
DO $$
DECLARE
  product_record RECORD;
  new_slug TEXT;
BEGIN
  FOR product_record IN SELECT id, name FROM public.products WHERE slug IS NULL
  LOOP
    new_slug := generate_unique_product_slug(product_record.name, product_record.id);
    UPDATE public.products SET slug = new_slug WHERE id = product_record.id;
  END LOOP;
END $$;

-- Step 6: Make slug NOT NULL after populating existing records
ALTER TABLE public.products 
ALTER COLUMN slug SET NOT NULL;

-- Step 7: Create trigger to auto-generate slug on insert (if not provided)
CREATE OR REPLACE FUNCTION set_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate slug if not provided or empty
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_unique_product_slug(NEW.name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_set_product_slug ON public.products;

-- Create trigger for INSERT
CREATE TRIGGER trigger_set_product_slug
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION set_product_slug();

-- Step 8: Add comment for documentation
COMMENT ON COLUMN public.products.slug IS 'URL-friendly slug generated from product name, used for SEO-friendly URLs';

-- Verify the migration
-- SELECT id, name, slug FROM public.products;

