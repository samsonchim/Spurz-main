import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  if (req.method === 'GET') {
    try {
      const conversationId = (req.query.conversationId as string) || (req.query.chatId as string) || ''
      const limit = Math.min(parseInt((req.query.limit as string) || '100', 10) || 100, 200)
      const offset = parseInt((req.query.offset as string) || '0', 10) || 0
      if (!conversationId) return res.status(400).json({ ok: false, error: 'conversationId is required' })

      const { data, error } = await supabaseAdmin.rpc('get_messages', {
        p_conversation_id: conversationId,
        p_limit: limit,
        p_offset: offset,
      })
      if (error) return res.status(500).json({ ok: false, error: 'Failed to fetch messages' })
      return res.status(200).json({ ok: true, messages: data || [] })
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { conversationId, senderId, senderRole, body } = req.body || {}
      if (!conversationId || !senderId || !senderRole || !body) {
        return res.status(400).json({ ok: false, error: 'conversationId, senderId, senderRole, body are required' })
      }
      if (!['buyer', 'vendor', 'bot'].includes(String(senderRole))) {
        return res.status(400).json({ ok: false, error: 'Invalid senderRole' })
      }
      const { data, error } = await supabaseAdmin.rpc('send_message', {
        p_conversation_id: conversationId,
        p_sender_id: senderId,
        p_sender_role: senderRole,
        p_body: String(body),
      })
      if (error) return res.status(500).json({ ok: false, error: 'Failed to send message' })
      return res.status(200).json({ ok: true, messageId: data })
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
    }
  }

  return res.setHeader('Allow', ['GET', 'POST']).status(405).json({ ok: false, error: 'Method not allowed' })
}
