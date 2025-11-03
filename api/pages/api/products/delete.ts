import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.setHeader('Allow', ['POST', 'DELETE']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    const productId = (req.body?.productId || req.query.id) as string
    if (!productId) {
      return res.status(400).json({ ok: false, error: 'productId is required' })
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      return res.status(500).json({ ok: false, error: 'Failed to delete product', details: error.message })
    }

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
