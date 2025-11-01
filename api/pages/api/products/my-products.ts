import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  // Get user ID from query parameter or header
  const userId = req.query.userId as string || req.headers['x-user-id'] as string

  if (!userId) {
    return res.status(400).json({ ok: false, error: 'User ID is required' })
  }

  // Ensure supabaseAdmin client is configured
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    // First get the user's outlet
    const { data: outletData, error: outletError } = await supabaseAdmin
      .from('outlets')
      .select('id')
      .eq('owner_id', userId)
      .limit(1)
      .maybeSingle()

    if (outletError) {
      console.error('Fetch outlet error:', outletError)
      return res.status(500).json({ ok: false, error: 'Failed to fetch outlet data' })
    }

    if (!outletData) {
      // User has no outlet, return empty products array
      return res.status(200).json({ ok: true, products: [] })
    }

    // Get products for this outlet
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('outlet_id', outletData.id)
      .order('created_at', { ascending: false })

    if (productsError) {
      console.error('Fetch products error:', productsError)
      return res.status(500).json({ ok: false, error: 'Failed to fetch products' })
    }

    return res.status(200).json({ ok: true, products: products || [] })
  } catch (e: any) {
    console.error('My products error:', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
