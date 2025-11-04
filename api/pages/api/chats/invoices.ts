import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (!supabaseAdmin) return res.status(500).json({ ok: false, error: 'DB not configured' })

  try {
    if (req.method === 'GET') {
      // fetch invoice details by id
      const { invoiceId } = req.query as { invoiceId?: string };
      if (!invoiceId) return res.status(400).json({ ok: false, error: 'invoiceId required' });
      const invRes = await supabaseAdmin.from('invoices').select('*').eq('id', invoiceId).single();
      if (invRes.error || !invRes.data) return res.status(404).json({ ok: false, error: 'Invoice not found' });
      const inv = invRes.data as any;
      let product: any = null;
      if (inv.product_id) {
        const p = await supabaseAdmin.from('products').select('id,name,price,images').eq('id', inv.product_id).single();
        if (!p.error && p.data) product = p.data;
      }
      const total = Number(inv.amount || 0) + Number(inv.delivery_fee || 0);
      return res.status(200).json({
        ok: true,
        invoice: {
          id: inv.id,
          product: { name: product?.name || 'Product', price: Number(product?.price || inv.amount || 0) },
          deliveryFee: Number(inv.delivery_fee || 0),
          deliveryAddress: inv.delivery_address || 'N/A',
          expectedDelivery: inv.expected_delivery || null,
          total,
          paid: inv.status === 'paid',
          escrowed: inv.status === 'paid',
        }
      })
    }
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
      const invoiceId = data as string
      // also post a message so both parties see the invoice in the chat
      await supabaseAdmin.rpc('send_message', {
        p_conversation_id: conversationId,
        p_sender_id: createdBy,
        p_sender_role: 'vendor',
        p_body: `__invoice__:${invoiceId}`,
        p_product_id: productId || null,
      })
      return res.status(200).json({ ok: true, invoiceId })
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
