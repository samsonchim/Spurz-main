-- Products migration for Supabase/Postgres
-- Run this in the Supabase SQL editor or via psql connected to your project database

-- Note: this file assumes `public.outlets` table already exists (see `outlets.sql`).

-- Drop table/function if they exist to allow repeated runs during development
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id UUID NOT NULL REFERENCES public.outlets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  condition TEXT DEFAULT 'new',
  status TEXT DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[], -- Array of tags
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_outlet_id ON public.products(outlet_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);

-- Function to create a product and return the inserted row
-- Usage example:
-- SELECT * FROM public.create_product('<outlet-uuid>'::uuid, 'Product Name', 100.00, 'Description', NULL, 'Electronics', 10, 'new', 'active', FALSE, ARRAY['tag1', 'tag2'], ARRAY['image1.jpg', 'image2.jpg']);
DROP FUNCTION IF EXISTS public.create_product(uuid, text, decimal, text, decimal, text, integer, text, text, boolean, text[], text[]);
CREATE OR REPLACE FUNCTION public.create_product(
  p_outlet_id UUID,
  p_name TEXT,
  p_price DECIMAL(10,2),
  p_description TEXT DEFAULT NULL,
  p_old_price DECIMAL(10,2) DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_stock_quantity INTEGER DEFAULT 0,
  p_condition TEXT DEFAULT 'new',
  p_status TEXT DEFAULT 'active',
  p_is_featured BOOLEAN DEFAULT FALSE,
  p_tags TEXT[] DEFAULT NULL,
  p_images TEXT[] DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  outlet_id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL(10,2),
  old_price DECIMAL(10,2),
  category TEXT,
  stock_quantity INTEGER,
  condition TEXT,
  status TEXT,
  is_featured BOOLEAN,
  tags TEXT[],
  images TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  v_id UUID;
  v_outlet_id UUID;
  v_name TEXT;
  v_description TEXT;
  v_price DECIMAL(10,2);
  v_old_price DECIMAL(10,2);
  v_category TEXT;
  v_stock_quantity INTEGER;
  v_condition TEXT;
  v_status TEXT;
  v_is_featured BOOLEAN;
  v_tags TEXT[];
  v_images TEXT[];
  v_created_at TIMESTAMPTZ;
  v_updated_at TIMESTAMPTZ;
BEGIN
  INSERT INTO public.products(outlet_id, name, description, price, old_price, category, stock_quantity, condition, status, is_featured, tags, images)
  VALUES (p_outlet_id, p_name, p_description, p_price, p_old_price, p_category, p_stock_quantity, p_condition, p_status, p_is_featured, p_tags, p_images)
  RETURNING public.products.id, public.products.outlet_id, public.products.name, public.products.description, public.products.price, public.products.old_price, public.products.category, public.products.stock_quantity, public.products.condition, public.products.status, public.products.is_featured, public.products.tags, public.products.images, public.products.created_at, public.products.updated_at
  INTO v_id, v_outlet_id, v_name, v_description, v_price, v_old_price, v_category, v_stock_quantity, v_condition, v_status, v_is_featured, v_tags, v_images, v_created_at, v_updated_at;

  id := v_id; outlet_id := v_outlet_id; name := v_name; description := v_description; price := v_price; old_price := v_old_price; category := v_category; stock_quantity := v_stock_quantity; condition := v_condition; status := v_status; is_featured := v_is_featured; tags := v_tags; images := v_images; created_at := v_created_at; updated_at := v_updated_at;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get products by outlet
DROP FUNCTION IF EXISTS public.get_products_by_outlet(uuid);
CREATE OR REPLACE FUNCTION public.get_products_by_outlet(p_outlet_id UUID)
RETURNS TABLE(
  id UUID,
  outlet_id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL(10,2),
  old_price DECIMAL(10,2),
  category TEXT,
  stock_quantity INTEGER,
  condition TEXT,
  status TEXT,
  is_featured BOOLEAN,
  tags TEXT[],
  images TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.outlet_id, p.name, p.description, p.price, p.old_price, p.category, p.stock_quantity, p.condition, p.status, p.is_featured, p.tags, p.images, p.created_at, p.updated_at
  FROM public.products p
  WHERE p.outlet_id = p_outlet_id
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notes:
-- 1) Apply this SQL in Supabase SQL editor or via psql. The file drops existing objects first so it can be re-run during development.
-- 2) Images are stored as URLs; for production, consider using Supabase Storage.