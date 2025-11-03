import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const id = (req.query.id as string) || ''
  if (!id) return res.status(400).json({ ok: false, error: 'Product id is required' })

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    const { data: product, error: prodErr } = await supabaseAdmin
      .from('products')
      .select('id, outlet_id, name, description, price, old_price, category, stock_quantity, condition, status, is_featured, tags, images, created_at')
      .eq('id', id)
      .single()

    if (prodErr || !product) {
      return res.status(404).json({ ok: false, error: 'Product not found' })
    }

    // Fetch outlet basic info for display (name, locations)
    let outlet: any = null
    if (product.outlet_id) {
      const { data: out, error: outErr } = await supabaseAdmin
        .from('outlets')
        .select('id, name, locations')
        .eq('id', product.outlet_id)
        .single()
      if (!outErr) outlet = out
    }

    return res.status(200).json({ ok: true, product, outlet })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
