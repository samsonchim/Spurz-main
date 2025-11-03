import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (!supabaseAdmin) return res.status(500).json({ ok: false, error: 'DB not configured' })

  try {
    if (req.method === 'POST') {
      // create invoice
      const { conversationId, createdBy, productId, amount, deliveryFee, deliveryAddress, expectedDelivery } = req.body || {}
      if (!conversationId || !createdBy || !amount) return res.status(400).json({ ok: false, error: 'conversationId, createdBy, amount required' })
      const { data, error } = await supabaseAdmin.rpc('create_invoice', {
        p_conversation_id: conversationId,
        p_created_by: createdBy,
        p_product_id: productId || null,
        p_amount: Number(amount),
        p_delivery_fee: deliveryFee != null ? Number(deliveryFee) : null,
        p_delivery_address: deliveryAddress || null,
        p_expected_delivery: expectedDelivery || null,
      })
      if (error) return res.status(500).json({ ok: false, error: 'Failed to create invoice' })
      return res.status(200).json({ ok: true, invoiceId: data })
    }

    if (req.method === 'PATCH') {
      // update invoice status
      const { invoiceId, status } = req.body || {}
      if (!invoiceId || !status) return res.status(400).json({ ok: false, error: 'invoiceId and status required' })
      const { error } = await supabaseAdmin.rpc('update_invoice_status', { p_invoice_id: invoiceId, p_status: String(status) })
      if (error) return res.status(500).json({ ok: false, error: 'Failed to update invoice status' })
      return res.status(200).json({ ok: true })
    }

    return res.setHeader('Allow', ['POST', 'PATCH']).status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
