import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)
  if (!supabaseAdmin) return res.status(500).json({ ok: false, error: 'DB not configured' })
  if (req.method !== 'POST') return res.setHeader('Allow', ['POST']).status(405).json({ ok: false, error: 'Method not allowed' })
  try {
    const { userId, expoToken } = req.body || {}
    if (!userId || !expoToken) return res.status(400).json({ ok: false, error: 'userId and expoToken required' })
    const { error } = await supabaseAdmin.rpc('upsert_device_token', { p_user_id: userId, p_expo_token: expoToken })
    if (error) return res.status(500).json({ ok: false, error: 'Failed to save device token' })
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
