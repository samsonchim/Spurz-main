-- database.sql
-- Combined PostgreSQL schema and helper functions for the Spurz project
-- Run this in the Supabase SQL editor or via psql connected to your project's database.

-- 1) Enable pgcrypto for password hashing and gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  user_name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 2a) Unique index on normalized (lowercase) email to avoid case-sensitivity collisions
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON public.users (lower(email));

-- 2b) Outlets table (vendors)
CREATE TABLE IF NOT EXISTS public.outlets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  locations TEXT,
  category TEXT,
  phone TEXT,
  about TEXT,
  logo_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS outlets_owner_idx ON public.outlets(owner_id);

-- 3) Signup function
-- Usage example: SELECT * FROM public.signup_user('user@example.com', 'plaintext-password', 'Full Name');
-- Drop older function with the same arg types if present (allows parameter renames)
DROP FUNCTION IF EXISTS public.signup_user(text, text, text);
CREATE OR REPLACE FUNCTION public.signup_user(
  p_email TEXT,
  p_password TEXT,
  p_user_name TEXT DEFAULT NULL
)
RETURNS TABLE(id UUID, email TEXT, created_at TIMESTAMPTZ) AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_id UUID;
  v_created TIMESTAMPTZ;
BEGIN
  IF v_email IS NULL OR v_email = '' THEN
    RAISE EXCEPTION 'invalid_email' USING MESSAGE = 'Email must be provided';
  END IF;

  IF p_password IS NULL OR p_password = '' THEN
    RAISE EXCEPTION 'invalid_password' USING MESSAGE = 'Password must be provided';
  END IF;

  -- Prevent duplicate registrations (qualify column to avoid ambiguity with OUT param names)
  IF EXISTS (SELECT 1 FROM public.users u WHERE lower(u.email) = v_email) THEN
    RAISE EXCEPTION 'email_exists' USING MESSAGE = 'Email is already registered';
  END IF;

  -- Hash password using bcrypt via pgcrypto (cost ~12)
  INSERT INTO public.users(email, password_hash, user_name)
  VALUES (v_email, crypt(p_password, gen_salt('bf', 12)), p_user_name)
  RETURNING public.users.id, public.users.email, public.users.created_at INTO v_id, v_email, v_created;

  id := v_id; email := v_email; created_at := v_created;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4) Password verification helper
-- Usage example: SELECT public.verify_user_password('user@example.com','candidate');
CREATE OR REPLACE FUNCTION public.verify_user_password(p_email TEXT, p_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash FROM public.users u WHERE lower(u.email) = lower(trim(p_email));
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN stored_hash = crypt(p_password, stored_hash);
END;
$$ LANGUAGE plpgsql STABLE;

-- 5) Update last_login helper (call after successful authentication)
CREATE OR REPLACE FUNCTION public.bump_last_login(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users SET last_login = now() WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 6) Example read-safe view that excludes password hashes
CREATE OR REPLACE VIEW public.users_public AS
SELECT id, email, user_name, is_verified, created_at, last_login, metadata
FROM public.users;

-- 7) Example seed (commented out)
-- INSERT INTO public.users(email, password_hash, full_name, is_verified)
-- VALUES ('alice@example.com', crypt('password123', gen_salt('bf', 12)), 'Alice Example', TRUE);

-- Notes:
-- - Recommended: Use Supabase Auth for production-managed auth. The SQL above is for self-managed user table + functions.
-- - SECURITY: The functions above use SECURITY DEFINER for signup_user so they can run with a role that has insert privileges when called via admin API. Ensure the function owner and permissions are set appropriately in your environment.
-- - To run: copy/paste into Supabase SQL editor and run, or execute via psql with your project's DATABASE_URL.
