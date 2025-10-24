import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { name, email, password } = req.body || {}

  if (!name || !email || !password) {
    return res.status(400).json({ ok: false, error: 'Name, email and password are required' })
  }

  if (!emailRx.test(String(email).trim())) {
    return res.status(400).json({ ok: false, error: 'Invalid email' })
  }

  if (String(password).length < 8) {
    return res.status(400).json({ ok: false, error: 'Password must be at least 8 characters' })
  }

  // Ensure supabaseAdmin client is configured
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    // Call the Postgres function signup_user(p_email, p_password, p_full_name)
    const { data, error } = await supabaseAdmin.rpc('signup_user', {
      p_email: String(email).trim(),
      p_password: String(password),
      p_full_name: String(name)
    })

    if (error) {
      // If the function raised the exception 'email_exists', surface as 409
      const msg = error.message || ''
      if (msg.toLowerCase().includes('email_exists') || msg.toLowerCase().includes('email already')) {
        return res.status(409).json({ ok: false, error: 'Email already registered' })
      }
      return res.status(500).json({ ok: false, error: msg || 'Signup failed' })
    }

    // data may be a single row or array depending on the RPC result
    const row = Array.isArray(data) ? data[0] : data
    if (!row || !row.id) {
      return res.status(500).json({ ok: false, error: 'Unexpected response from DB' })
    }

    return res.status(201).json({ ok: true, userId: row.id, email: row.email })
  } catch (e: any) {
    console.error('signup error', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Internal error' })
  }
}
