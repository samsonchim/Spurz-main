import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    const { buyerId, productId } = req.body || {}
    if (!buyerId || !productId) {
      return res.status(400).json({ ok: false, error: 'buyerId and productId are required' })
    }

    const { data, error } = await supabaseAdmin.rpc('start_chat', {
      p_buyer_id: buyerId,
      p_product_id: productId,
    })

    if (error) {
      console.error('start_chat error', error)
      return res.status(500).json({ ok: false, error: 'Failed to start chat' })
    }

    const row = Array.isArray(data) ? data[0] : data
    if (!row || !row.conversation_id) {
      return res.status(500).json({ ok: false, error: 'Unexpected response from DB' })
    }

    return res.status(200).json({
      ok: true,
      chatId: row.conversation_id,
      vendorId: row.vendor_id,
      outletId: row.outlet_id,
      vendorName: row.vendor_name,
      productName: row.product_name,
    })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
