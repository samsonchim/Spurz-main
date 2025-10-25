-- Dashboard / outlets/products migration for Supabase/Postgres
-- Adds columns to outlets, creates followers table, and creates products table.
-- Run this in Supabase SQL editor or via psql connected to your project database.

-- Ensure pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) ALTER outlets: add cover_photo_path, face_of_brand_path, outlet_likes
ALTER TABLE IF EXISTS public.outlets
  ADD COLUMN IF NOT EXISTS cover_photo_path TEXT,
  ADD COLUMN IF NOT EXISTS face_of_brand_path TEXT,
  ADD COLUMN IF NOT EXISTS outlet_likes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2) Create table for outlet followers (users following an outlet)
DROP TABLE IF EXISTS public.outlet_followers CASCADE;
CREATE TABLE IF NOT EXISTS public.outlet_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id UUID NOT NULL REFERENCES public.outlets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (outlet_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_outlet_followers_outlet_id ON public.outlet_followers(outlet_id);
CREATE INDEX IF NOT EXISTS idx_outlet_followers_user_id ON public.outlet_followers(user_id);

-- 3) Products table (Postgres UUID-based, compatible with other tables)
DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id UUID REFERENCES public.outlets(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_description TEXT,
  product_category TEXT,
  price NUMERIC(12,2) DEFAULT 0,
  items_in_stock INTEGER DEFAULT 0,
  product_type TEXT,
  meta_tags TEXT,
  live BOOLEAN DEFAULT FALSE,
  promote BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_outlet_id ON public.products(outlet_id);
CREATE INDEX IF NOT EXISTS idx_products_owner_id ON public.products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(product_category);

-- 4) Product likes table (track which user liked which product)
DROP TABLE IF EXISTS public.product_likes CASCADE;
CREATE TABLE IF NOT EXISTS public.product_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_product_likes_product_id ON public.product_likes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_likes_user_id ON public.product_likes(user_id);

-- 5) Optional materialized view or function to update outlet_likes count quickly
-- This is a helper function you can call after changes to sync counts into outlets.outlet_likes
CREATE OR REPLACE FUNCTION public.refresh_outlet_likes()
RETURNS VOID AS $$
BEGIN
  UPDATE public.outlets o
  SET outlet_likes = COALESCE(l.cnt, 0), updated_at = now()
  FROM (
    SELECT p.outlet_id, COUNT(pl.*) AS cnt
    FROM public.products p
    JOIN public.product_likes pl ON pl.product_id = p.id
    GROUP BY p.outlet_id
  ) l
  WHERE o.id = l.outlet_id;

  -- set zero for outlets without likes
  UPDATE public.outlets SET outlet_likes = 0 WHERE outlet_likes IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notes:
-- - The app's UI reads follower/following counts; compute those with a simple count query on outlet_followers.
--   Example: SELECT COUNT(*) FROM public.outlet_followers WHERE outlet_id = '<outlet-uuid>';
-- - The field `outlet_likes` is an aggregate of product likes across the outlet's products. You can keep it in sync via triggers
--   or periodic calls to `public.refresh_outlet_likes()`.
-- - For product images, the current code stores images on the server filesystem (php/uploads/...), so this schema doesn't store image paths per product.
--   Consider adding a `product_images` table with (id, product_id, path, position) if you want DB-managed image references.

-- End of migration
