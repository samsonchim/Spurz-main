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
    const userId = (req.query.userId as string) || ''
    const limit = Math.min(parseInt((req.query.limit as string) || '50', 10) || 50, 100)
    const offset = parseInt((req.query.offset as string) || '0', 10) || 0
    if (!userId) return res.status(400).json({ ok: false, error: 'userId is required' })

    // Base conversations list
    const { data: convs, error: convErr } = await supabaseAdmin.rpc('list_conversations', {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset,
    })
    if (convErr) return res.status(500).json({ ok: false, error: 'Failed to fetch conversations' })

  const conversations = (convs || []) as any[]
    if (conversations.length === 0) return res.status(200).json({ ok: true, conversations: [] })

    const productIds = Array.from(new Set(conversations.map(c => c.product_id).filter(Boolean)))
    const outletIds = Array.from(new Set(conversations.map(c => c.outlet_id).filter(Boolean)))
    const userIds = Array.from(new Set([ ...conversations.map(c => c.buyer_id), ...conversations.map(c => c.vendor_id) ].filter(Boolean)))
  const convIds = Array.from(new Set(conversations.map(c => c.id)))

    // Fetch related entities in batches
    const ownerIds = Array.from(new Set(userIds));
    const [{ data: products }, { data: outlets }, { data: users }, lastMessages, { data: outletsByOwner }] = await Promise.all([
      productIds.length ? supabaseAdmin.from('products').select('id, name').in('id', productIds) : Promise.resolve({ data: [] as any[] } as any),
      outletIds.length ? supabaseAdmin.from('outlets').select('id, name, owner_id').in('id', outletIds) : Promise.resolve({ data: [] as any[] } as any),
      userIds.length ? supabaseAdmin.from('users').select('id, user_name, email').in('id', userIds) : Promise.resolve({ data: [] as any[] } as any),
      (async () => {
        if (!convIds.length) return new Map();
        // Fetch a batch of latest messages for these conversations
        const { data: msgs } = await supabaseAdmin
          .from('messages')
          .select('id, conversation_id, sender_id, sender_role, body, created_at')
          .in('conversation_id', convIds)
          .order('created_at', { ascending: false })
          .limit(convIds.length * 5);
        const map: Map<string, any> = new Map();
        for (const m of (msgs || []) as any[]) {
          if (!map.has(m.conversation_id)) map.set(m.conversation_id, m);
        }
        return map;
      })(),
      ownerIds.length ? supabaseAdmin.from('outlets').select('id, name, owner_id').in('owner_id', ownerIds) : Promise.resolve({ data: [] as any[] } as any),
    ])

  const productMap: Map<string, any> = new Map((products || []).map((p: any) => [p.id, p]))
  const outletMap: Map<string, any> = new Map((outlets || []).map((o: any) => [o.id, o]))
  const outletByOwner: Map<string, any> = new Map((outletsByOwner || []).map((o: any) => [o.owner_id, o]))
  const userMap: Map<string, any> = new Map((users || []).map((u: any) => [u.id, u]))

    const enriched = conversations.map((c) => {
      const otherId = c.buyer_id === userId ? c.vendor_id : c.buyer_id
  const other: any = userMap.get(otherId) || null
      let name = other?.user_name || (other?.email ? String(other.email).split('@')[0] : 'User')
      // Prefer outlet name for vendor; for buyer, use their outlet if any
      if (otherId === c.vendor_id) {
        const out = outletMap.get(c.outlet_id)
        if (out?.name) name = out.name
      } else {
        const ob = outletByOwner.get(otherId)
        if (ob?.name) name = ob.name
      }
  const product: any = productMap.get(c.product_id) || null
  const outlet: any = outletMap.get(c.outlet_id) || null
      const lm: any = (lastMessages as Map<string, any>).get(c.id) || null
      return {
        id: c.id,
        buyerId: c.buyer_id,
        vendorId: c.vendor_id,
        outletId: c.outlet_id,
        productId: c.product_id,
        lastMessageAt: c.last_message_at || null,
        status: (c as any).status || null,
        productName: product?.name || null,
        outletName: outlet?.name || null,
        otherPartyId: otherId,
        otherPartyName: name,
        lastMessage: lm
          ? {
              id: lm.id,
              body: lm.body || '',
              senderId: lm.sender_id,
              senderRole: lm.sender_role,
              createdAt: lm.created_at,
            }
          : null,
      }
    })

    return res.status(200).json({ ok: true, conversations: enriched })
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
