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
    // Query outlets table for owner_id = userId
    const { data: outletData, error: outletError } = await supabaseAdmin
      .from('outlets')
      .select('*')
      .eq('owner_id', userId)
      .limit(1)
      .maybeSingle()

    if (outletError) {
      console.error('Fetch outlet error:', outletError)
      return res.status(500).json({ ok: false, error: 'Failed to fetch outlet data' })
    }

    if (!outletData) {
      // User exists but no outlet -> not a vendor
      return res.status(200).json({ ok: true, outlet: null })
    }

    // Compute follower/following counts and likes for dashboard
    try {
      const [followersRes, followingRes, productsRes] = await Promise.all([
        supabaseAdmin.from('outlet_followers').select('id').eq('outlet_id', outletData.id),
        supabaseAdmin.from('outlet_followers').select('id').eq('user_id', userId),
        supabaseAdmin.from('products').select('id').eq('outlet_id', outletData.id)
      ])

      let likesCount = 0
      if (!productsRes.error && productsRes.data && productsRes.data.length > 0) {
        const prodIds = productsRes.data.map((p: any) => p.id)
        const likesRes = await supabaseAdmin
          .from('product_likes')
          .select('id')
          .in('product_id', prodIds)
        
        if (!likesRes.error && likesRes.data) {
          likesCount = likesRes.data.length
        }
      }

      const enrichedOutlet = {
        ...outletData,
        _followersCount: Array.isArray(followersRes.data) ? followersRes.data.length : 0,
        _followingCount: Array.isArray(followingRes.data) ? followingRes.data.length : 0,
        outlet_likes: likesCount,
      }

      return res.status(200).json({ ok: true, outlet: enrichedOutlet })
    } catch (e) {
      console.warn('Compute dashboard counts failed:', e)
      return res.status(200).json({ ok: true, outlet: outletData })
    }
  } catch (e: any) {
    console.error('My outlet error:', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
