import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

// Optional: set WEBHOOK_SECRET in your environment and configure Supabase DB Webhooks
// to send this value in header: x-webhook-secret

export const config = {
  api: {
    bodyParser: true, // Using parsed JSON; for HMAC with raw body, switch to false and handle buffer
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    // Basic shared-secret verification (optional but recommended)
    const secret = process.env.WEBHOOK_SECRET
    if (secret) {
      const sent = req.headers['x-webhook-secret'] as string | undefined
      if (!sent || sent !== secret) {
        return res.status(401).json({ ok: false, error: 'Unauthorized' })
      }
    }

    const evt = req.body as any
    // Expected shape from Supabase DB Webhooks:
    // {
    //   type: 'INSERT' | 'UPDATE' | 'DELETE',
    //   table: 'messages',
    //   schema: 'public',
    //   record: { id, conversation_id, sender_id, sender_role, body, created_at, ... },
    //   old_record?: ...
    // }

    const type = evt?.type
    const table = evt?.table
    if (!type || !table) return res.status(400).json({ ok: false, error: 'Invalid payload' })

    if (!supabaseAdmin) return res.status(500).json({ ok: false, error: 'DB not configured' })

    // Handle messages inserts – you can extend to send push notifications, etc.
    if (table === 'messages' && type === 'INSERT') {
      const m = evt.record
      if (m?.conversation_id) {
        // Defensive: ensure conversation timestamps are fresh (already handled by trigger)
        await supabaseAdmin
          .from('conversations')
          .update({ updated_at: new Date().toISOString(), last_message_at: new Date().toISOString() })
          .eq('id', m.conversation_id)

        // Look up conversation to find receiver (the other party)
        const { data: convs } = await supabaseAdmin
          .from('conversations')
          .select('buyer_id, vendor_id')
          .eq('id', m.conversation_id)
          .limit(1)
          .maybeSingle()

        const buyerId = convs?.buyer_id
        const vendorId = convs?.vendor_id
        if (buyerId && vendorId) {
          const receiverId = m.sender_id === buyerId ? vendorId : buyerId

          // Pull receiver device tokens
          const { data: tokens } = await supabaseAdmin
            .from('device_tokens')
            .select('expo_token')
            .eq('user_id', receiverId)
          const expoTokens = (tokens || []).map((t: any) => t.expo_token).filter(Boolean)

          if (expoTokens.length) {
            // Send Expo push notifications
            const chunks = [] as string[][]
            const copy = [...expoTokens]
            while (copy.length) chunks.push(copy.splice(0, 99))
            const title = 'New message'
            const body = typeof m.body === 'string' && m.body.trim() ? m.body.trim() : 'You received a new message'
            for (const ch of chunks) {
              await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ch.map(token => ({ to: token, sound: 'default', title, body, data: { conversationId: m.conversation_id } })))
              })
            }
          }
        }
      }
    }

    // No-op for other tables for now
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
