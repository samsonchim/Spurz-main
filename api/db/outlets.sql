-- Outlets migration for Supabase/Postgres
-- Run this in the Supabase SQL editor or via psql connected to your project database

-- Note: this file assumes a `public.users` table already exists (see `signup.sql`).

-- Drop table/function if they exist to allow repeated runs during development
DROP TABLE IF EXISTS public.outlets CASCADE;

CREATE TABLE IF NOT EXISTS public.outlets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  phone TEXT,
  locations TEXT,
  about TEXT,
  logo_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster owner lookups
CREATE INDEX IF NOT EXISTS idx_outlets_owner_id ON public.outlets(owner_id);

-- Function to create an outlet and return the inserted row
-- Usage example:
-- SELECT * FROM public.create_outlet('<owner-uuid>'::uuid, 'My Shop', 'Electronics', '+234...', 'Lagos, Abuja', 'Small shop', '/outlets/logos/<id>.png');
DROP FUNCTION IF EXISTS public.create_outlet(uuid, text, text, text, text, text, text);
CREATE OR REPLACE FUNCTION public.create_outlet(
  p_owner_id UUID,
  p_name TEXT,
  p_category TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_locations TEXT DEFAULT NULL,
  p_about TEXT DEFAULT NULL,
  p_logo_path TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  owner_id UUID,
  name TEXT,
  category TEXT,
  phone TEXT,
  locations TEXT,
  about TEXT,
  logo_path TEXT,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  v_id UUID;
  v_owner UUID;
  v_name TEXT;
  v_cat TEXT;
  v_phone TEXT;
  v_locations TEXT;
  v_about TEXT;
  v_logo TEXT;
  v_created TIMESTAMPTZ;
BEGIN
  INSERT INTO public.outlets(owner_id, name, category, phone, locations, about, logo_path)
  VALUES (p_owner_id, p_name, p_category, p_phone, p_locations, p_about, p_logo_path)
  RETURNING public.outlets.id, public.outlets.owner_id, public.outlets.name, public.outlets.category, public.outlets.phone, public.outlets.locations, public.outlets.about, public.outlets.logo_path, public.outlets.created_at
  INTO v_id, v_owner, v_name, v_cat, v_phone, v_locations, v_about, v_logo, v_created;

  id := v_id; owner_id := v_owner; name := v_name; category := v_cat; phone := v_phone; locations := v_locations; about := v_about; logo_path := v_logo; created_at := v_created;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional helper to update only the logo_path for an outlet (useful after uploading the file)
DROP FUNCTION IF EXISTS public.update_outlet_logo(uuid, text);
CREATE OR REPLACE FUNCTION public.update_outlet_logo(p_outlet_id UUID, p_logo_path TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.outlets SET logo_path = p_logo_path WHERE id = p_outlet_id;
END;
$$ LANGUAGE plpgsql;

-- Notes:
-- 1) Apply this SQL in Supabase SQL editor or via psql. The file drops existing objects first so it can be re-run during development.
-- 2) For production, consider storing logos in Supabase Storage (or S3) and saving the URL in `logo_path` instead of writing files to the API server filesystem.
