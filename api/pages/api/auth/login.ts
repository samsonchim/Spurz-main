import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email and password are required' })
  }

  if (!emailRx.test(String(email).trim())) {
    return res.status(400).json({ ok: false, error: 'Invalid email format' })
  }

  // Ensure supabaseAdmin client is configured
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    // Verify password using the database function
    const { data: isValid, error: verifyError } = await supabaseAdmin.rpc('verify_user_password', {
      p_email: String(email).trim(),
      p_password: String(password)
    })

    if (verifyError) {
      console.error('Password verification error:', verifyError)
      return res.status(500).json({ ok: false, error: 'Authentication failed' })
    }

    if (!isValid) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password' })
    }

    // Get user details
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, user_name, is_verified, created_at')
      .eq('email', String(email).trim().toLowerCase())
      .single()

    if (userError || !userData) {
      console.error('User fetch error:', userError)
      return res.status(500).json({ ok: false, error: 'Failed to retrieve user data' })
    }

    // Update last login
    await supabaseAdmin.rpc('bump_last_login', {
      p_user_id: userData.id
    })

    // Generate a simple token (in production, use JWT)
    const token = `token_${Buffer.from(userData.id).toString('hex')}_${Date.now()}`

    return res.status(200).json({ 
      ok: true, 
      token, 
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.user_name,
        isVerified: userData.is_verified
      }
    })
  } catch (e: any) {
    console.error('Login error:', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
