import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return res.setHeader('Allow', ['POST', 'PATCH']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    const { productId, ...fields } = req.body || {}
    if (!productId) {
      return res.status(400).json({ ok: false, error: 'productId is required' })
    }

    // Whitelist updatable fields to avoid accidental schema writes
    const allowed: Record<string, boolean> = {
      name: true,
      description: true,
      price: true,
      old_price: true,
      category: true,
      stock_quantity: true,
      condition: true,
      status: true,
      is_featured: true,
      tags: true,
      images: true,
    }
    const updates: Record<string, any> = {}
    Object.keys(fields || {}).forEach((k) => { if (allowed[k]) updates[k] = (fields as any)[k] })
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select('*')
      .maybeSingle()

    if (error) {
      return res.status(500).json({ ok: false, error: 'Failed to update product', details: error.message })
    }

    return res.status(200).json({ ok: true, product: data })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
