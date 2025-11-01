import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '../config/supabase'

// Server-side supabase client using the service role key. Only use this in server code.
const SUPABASE_URL = process.env.SUPABASE_URL ?? SUPABASE_CONFIG.url
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_CONFIG.serviceRoleKey

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === 'your_service_role_key_here') {
  // Avoid throwing during static analysis; routes should return a clear 500 if keys are missing.
  console.warn('Supabase service role key or URL not found in environment. Make sure api/.env.local is created with SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && SUPABASE_SERVICE_ROLE_KEY !== 'your_service_role_key_here')
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null
