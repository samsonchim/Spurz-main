import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10) || 20, 100)
    const offset = parseInt((req.query.offset as string) || '0', 10) || 0
  const category = (req.query.category as string) || undefined
  const q = (req.query.search as string) || (req.query.q as string) || ''

    let query = supabaseAdmin
      .from('products')
      .select('id, outlet_id, name, description, price, old_price, category, stock_quantity, condition, status, is_featured, tags, images, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    if (q && q.trim().length > 0) {
      const term = `%${q.trim()}%`
      // OR filter over name and description for simple search
      query = query.or(`name.ilike.${term},description.ilike.${term}`)
    }

    const { data, error } = await query

    if (error) {
      return res.status(500).json({ ok: false, error: 'Failed to fetch products', details: error.message })
    }

  return res.status(200).json({ ok: true, products: data || [] })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
