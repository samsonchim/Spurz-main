import { createClient, SupabaseClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { SUPABASE_URL as CFG_URL, SUPABASE_ANON_KEY as CFG_ANON } from '../config/supabase'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (client) return client
  const fromConstants = (Constants as any)?.expoConfig?.extra || (Constants as any)?.manifest?.extra || {}
  const url = fromConstants?.SUPABASE_URL || CFG_URL
  const anon = fromConstants?.SUPABASE_ANON_KEY || CFG_ANON
  if (!url || !anon) {
    console.warn('Supabase Realtime not configured: SUPABASE_URL / SUPABASE_ANON_KEY missing')
    return null
  }
  client = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 5 } },
  })
  return client
}
