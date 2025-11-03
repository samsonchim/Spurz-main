import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '../config/supabase'

// Server-side supabase client using the service role key. Only use this in server code.
const SUPABASE_URL = process.env.SUPABASE_URL ?? (process.env.SUPABASE_PROJECT_ID ? `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co` : SUPABASE_CONFIG?.url)
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_CONFIG?.serviceRoleKey

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Avoid throwing during static analysis; routes should return a clear 500 if keys are missing.
  console.warn('Supabase service role key or URL not found in environment. Make sure api/.env is loaded in development.')
}

export const supabaseAdmin = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null
