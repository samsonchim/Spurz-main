-- Signup migration for Supabase/Postgres
-- Run this in the Supabase SQL editor or via psql connected to your project database

-- Enable pgcrypto for password hashing and gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  user_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Signup function
-- Usage: SELECT * FROM public.signup_user('email@example.com', 'plaintext-password', 'Full Name');
-- If an older version of the function exists with a different parameter name/signature,
-- drop it first so we can recreate with the desired parameter names.
DROP FUNCTION IF EXISTS public.signup_user(text, text, text);
CREATE OR REPLACE FUNCTION public.signup_user(p_email TEXT, p_password TEXT, p_user_name TEXT DEFAULT NULL)
RETURNS TABLE(id UUID, email TEXT, created_at TIMESTAMPTZ) AS $$
DECLARE
  v_id UUID;
  v_email TEXT;
  v_created TIMESTAMPTZ;
BEGIN
  -- Normalize email to lower-case
  p_email := lower(trim(p_email));

  -- Check for existing user (qualify column to avoid ambiguity with OUT param names)
  IF EXISTS (SELECT 1 FROM public.users u WHERE lower(u.email) = p_email) THEN
    RAISE EXCEPTION 'email_exists' USING HINT = 'Email already registered';
  END IF;

  -- Hash password with bcrypt via pgcrypto
  INSERT INTO public.users(email, password_hash, user_name)
  VALUES (p_email, crypt(p_password, gen_salt('bf', 12)), p_user_name)
  RETURNING public.users.id, public.users.email, public.users.created_at INTO v_id, v_email, v_created;

  -- Return the inserted row (id, email, created_at)
  id := v_id; email := v_email; created_at := v_created;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: a helper function to verify password during login
-- Usage: SELECT public.verify_user_password('email@example.com', 'candidate-password');
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

-- Notes:
-- 1) You can run the SQL directly in Supabase's SQL editor (recommended) which applies it to your project DB.
-- 2) Supabase also offers its built-in Auth system; if you prefer to use Supabase Auth, create users via the Auth API instead of manual table/functions.